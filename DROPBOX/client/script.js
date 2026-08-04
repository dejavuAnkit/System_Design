
const BACKEND_URL = 'http://localhost:3000';
const CHUNK_SIZE = 5 * 1024 * 1024;

const state = {
    paused: false,
    isUploading: false,
    sessionId: null,
    nextChunkIndex: 0,
    chunks: [],
    urlsData: null,
    uploadId: null,
    filename: null,
    totalParts: 0,
    uploadedParts: []
};

function createChunks(file, chunkSize = CHUNK_SIZE) {
    const chunks = [];
    let offset = 0;

    while (offset < file.size) {
        chunks.push(file.slice(offset, offset + chunkSize));
        offset += chunkSize;
    }

    return chunks;
}

async function uploadFile(file) {
    if (state.isUploading) {
        return;
    }

    state.isUploading = true;
    state.paused = false;
    state.nextChunkIndex = 0;
    state.uploadedParts = [];
    state.chunks = createChunks(file);
    state.totalParts = state.chunks.length;

    const startResponse = await fetch(`${BACKEND_URL}/start-upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fileName: file.name,
            filesize: file.size,
            totalParts: state.totalParts,
            chunkSize: CHUNK_SIZE
        })
    });

    const startData = await startResponse.json();
    state.uploadId = startData.uploadId;
    state.filename = startData.key;
    state.sessionId = startData.sessionId;

    const urlsResponse = await fetch(`${BACKEND_URL}/upload/urls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            uploadId: startData.uploadId,
            key: startData.key,
            totalParts: state.totalParts
        })
    });

    state.urlsData = await urlsResponse.json();
    await uploadChunk();
}

async function uploadChunk() {
    if (!state.urlsData?.urls?.length) {
        return;
    }

    for (let i = state.nextChunkIndex; i < state.totalParts; i++) {
        if (state.paused) {
            console.log('Upload paused. Waiting to resume...');
            return;
        }

        const chunk = state.chunks[i];
        const url = state.urlsData.urls[i].url;
        const response = await fetch(url, {
            method: 'PUT',
            body: chunk
        });

        if (!response.ok) {
            throw new Error(`Failed to upload part ${i + 1}`);
        }

        state.uploadedParts.push({
            PartNumber: i + 1,
            ETag: response.headers.get('ETag')
        });
        state.nextChunkIndex = i + 1;
        console.log(`Uploaded part ${i + 1} of ${state.totalParts}`);
    }

    const completeResponse = await fetch(`${BACKEND_URL}/upload/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            uploadId: state.uploadId,
            key: state.filename,
            parts: state.uploadedParts
        })
    });

    const completeData = await completeResponse.json();
    state.nextChunkIndex = 0;
    state.isUploading = false;
    console.log('Upload completed:', completeData);
}

const fileInput = document.getElementById('fileInput');
const pauseButton = document.getElementById('pauseButton');

pauseButton.addEventListener('click', async () => {
    if (!state.isUploading) {
        return;
    }

    state.paused = !state.paused;
    pauseButton.textContent = state.paused ? 'Resume Upload' : 'Pause Upload';

    if (!state.paused) {
        console.log('Resuming upload...');
        await uploadChunk();
    }
});

fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    try {
        await uploadFile(file);
    } catch (error) {
        console.error('Upload failed:', error);
        state.isUploading = false;
    }
});