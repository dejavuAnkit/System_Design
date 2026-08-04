
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const {
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require('dotenv').config()
const s3Client = require('./s3');

const app = express();
app.use(cors());
app.use(express.json());

// Mongoose connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dropbox', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connection successful');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

const uploadSchemea = require('./models/uploadSchemea');   


const BUCKET_NAME = 'dropbox-v1-amzns'; // Replace with your S3 bucket name

// Start a multipart upload
app.post('/start-upload', async (req, res) => {
    const { fileName, filesize, totalParts, chunkSize } = req.body;
    console.log('Received request to start upload for file:', fileName);
    const command = new CreateMultipartUploadCommand({
        Bucket: BUCKET_NAME,
        Key: fileName
    });
    
    try{
        const response = await s3Client.send(command);
        const sessionId = crypto.randomUUID(); // Generate a unique session ID for this upload
        await uploadSchemea.create({
            fileName: fileName,
            uploadId: response.UploadId,
            sessionId: sessionId,
            key: `${crypto.randomUUID()}-${fileName}`,
            chunkSize: chunkSize,
            totalParts: totalParts,
            filesize: filesize,
        });

        res.json({ uploadId: response.UploadId, key: fileName, sessionId: sessionId });
    } catch (error) {
        console.error('Error starting multipart upload:', error);
        res.status(500).json({ error: 'Failed to start multipart upload' });    
    }
});


// Generate a pre-signed URL for uploading a chunk

app.post("/upload/urls", async (req, res) => {
    const { uploadId, key , totalParts } = req.body;

    try {
        const urls = [];
        for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
            const command = new UploadPartCommand({
                Bucket: BUCKET_NAME,
                Key: key,
                PartNumber: partNumber,
                UploadId: uploadId
            });

            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            urls.push({ partNumber, url });
        }

        res.json({ urls }); 
    } catch (error) {
        console.error('Error generating pre-signed URLs:', error);
        res.status(500).json({ error: 'Failed to generate pre-signed URLs' });
    }
});

// Upload a chunk using the pre-signed URL
app.post("/upload/complete", async (req, res) => {
    const { parts, key, uploadId } = req.body;
    console.log("parts:", parts);
    console.log("isArray:", Array.isArray(parts));
    try {

        const command  = new CompleteMultipartUploadCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: {
                Parts: parts 
            }
        });

        const response = await s3Client.send(command);
        res.json({ message: 'Chunk uploaded successfully' });
    } catch (error) {
        console.error('Error uploading chunk:', error);
        res.status(500).json({ error: 'Failed to upload chunk' });
    }
});




app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
