import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import logger from '../config/logger';

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let isOperational = false;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        isOperational = err.isOperational;
    }

    if (err.name === 'ValidationError') { statusCode = 400; message = err.message; isOperational = true; }
    if ((err as any).code === 11000) { statusCode = 409; message = 'Duplicate entry found'; isOperational = true; }
    if (err.name === 'CastError') { statusCode = 400; message = 'Invalid ID format'; isOperational = true; }
    if (err.name === 'JsonWebTokenError') { statusCode = 401; message = 'Invalid token'; isOperational = true; }
    if (err.name === 'TokenExpiredError') { statusCode = 401; message = 'Token expired'; isOperational = true; }

    // Log with structured context
    const logPayload = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        statusCode,
        message: err.message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    };

    if (!isOperational || statusCode >= 500) {
        logger.error('Unhandled error', logPayload);
    } else {
        logger.warn('Operational error', { ...logPayload, stack: undefined });
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
