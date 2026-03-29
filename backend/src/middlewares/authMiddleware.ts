import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/helpers';
import { UnauthorizedError } from '../utils/AppError';
import { IAuthPayload } from '../interfaces';

// Extend Express Request type to include user info
declare global {
    namespace Express {
        interface Request {
            user?: IAuthPayload;
        }
    }
}

/**
 * Authentication middleware - verifies JWT token
 * SOLID: Single Responsibility - only handles authentication
 */
export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('No token provided');
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            next(error);
        } else {
            next(new UnauthorizedError('Invalid or expired token'));
        }
    }
};
