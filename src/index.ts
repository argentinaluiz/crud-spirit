import express from 'express';

const app = express();

app.use(express.json());

app.post('projects', (req, res) => {
    res.end();
})