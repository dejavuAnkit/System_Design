
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


function simulateDatabaseFetch(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id, data: `Data for ID ${id}` });
        }, 1000); // Simulate a 1 second delay
    });
}

const getUserData = async (id) => {
    const inflightRequests = new Map();

    if (inflightRequests.has(id)) {
        return inflightRequests.get(id);
    }

    const fetchPromise = await simulateDatabaseFetch(id);

    inflightRequests.set(id, fetchPromise); 
    return simulateDatabaseFetch(id);
};

app.get('/data/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await getUserData(id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});