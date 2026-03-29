import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorMiddleware } from './middlewares/errorMiddleware';

/**
 * Express Application Setup
 * Layered Architecture: Express app is separate from server startup
 * for better testability and separation of concerns.
 */
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Library Management System API is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api', routes);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Global Error Handler (must be last)
app.use(errorMiddleware);

export default app;
