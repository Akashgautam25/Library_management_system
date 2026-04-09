import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import Database from './config/database';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB is connected on every serverless invocation
app.use(async (_req, _res, next) => {
    try {
        await Database.getInstance().connect();
        next();
    } catch (err) {
        next(err);
    }
});

app.get('/api/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorMiddleware);

export default app;
