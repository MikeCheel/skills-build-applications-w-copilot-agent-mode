import express from 'express';
import { connectDatabase } from './config/database.js';
import apiRouter from './routes/api.js';
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
const app = express();
const port = 8000;
app.use(express.json());
app.use('/api', apiRouter);
app.use((error, _req, res, _next) => {
    console.error('Unhandled API error:', error);
    res.status(500).json({ error: 'Internal server error' });
});
app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok', apiBaseUrl });
});
async function startServer() {
    try {
        await connectDatabase();
        app.listen(port, () => {
            console.log(`OctoFit backend listening on port ${port}`);
            console.log(`API base URL: ${apiBaseUrl}`);
        });
    }
    catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}
startServer();
