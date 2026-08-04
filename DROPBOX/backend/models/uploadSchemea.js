const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    uploadId: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    chunkSize: Number,
    filesize: Number,
    totalParts: Number,
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'failed'],
        default: 'in-progress'
    }
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;