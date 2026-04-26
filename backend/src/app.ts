import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import routes from './routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { globalRateLimit } from './middlewares/rateLimitMiddleware';
import logger from './config/logger';

const app = express();

// Security headers
app.use(helmet());

// CORS — lock to frontend origin
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Cookie parser (for httpOnly refresh tokens)
app.use(cookieParser());

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// NoSQL injection sanitization
app.use(mongoSanitize());

// HTTP request logging → Winston
app.use(
    morgan('combined', {
        stream: { write: (message: string) => logger.http(message.trim()) },
        skip: () => process.env.NODE_ENV === 'test',
    })
);

// Global rate limiter
app.use('/api', globalRateLimit);

// Health check
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'LibraryOS API is running',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api', routes);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use(errorMiddleware);

export default app;
