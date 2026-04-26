import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import routes from './routes';
import Database from './config/database';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { globalRateLimit } from './middlewares/rateLimitMiddleware';
import logger from './config/logger';

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173'
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.some(allowed => origin.startsWith(allowed)) || 
                         origin.endsWith('.vercel.app'); // Allow Vercel previews
        
        if (isAllowed) {
            callback(null, true);
        } else {
            logger.error('CORS blocked origin:', { origin });
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Database connection middleware for Serverless (Vercel)
app.use(async (req, res, next) => {
    try {
        const db = Database.getInstance();
        if (!db.getConnectionStatus()) {
            await db.connect();
        }
        next();
    } catch (error) {
        next(error);
    }
});

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
