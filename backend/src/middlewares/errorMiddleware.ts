import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorMiddleware = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err instanceof AppError) { statusCode = err.statusCode; message = err.message; }
    else if (err.name === 'ValidationError') { statusCode = 400; message = err.message; }
    else if ((err as any).code === 11000) { statusCode = 409; message = 'Duplicate entry found'; }
    else if (err.name === 'CastError') { statusCode = 400; message = 'Invalid ID format'; }
    else if (err.name === 'JsonWebTokenError') { statusCode = 401; message = 'Invalid token'; }
    else if (err.name === 'TokenExpiredError') { statusCode = 401; message = 'Token expired'; }
    else console.error('Unexpected Error:', err);

    res.status(statusCode).json({ success: false, message });
};
