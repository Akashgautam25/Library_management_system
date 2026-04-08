import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/helpers';
import { UnauthorizedError } from '../utils/AppError';
import { IAuthPayload } from '../interfaces';

// Extend Express Request to carry user info after auth
declare global {
    namespace Express {
        interface Request { user?: IAuthPayload; }
    }
}

// Checks the Bearer token in Authorization header
export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith('Bearer ')) throw new UnauthorizedError('No token provided');

        req.user = verifyToken(header.split(' ')[1]);
        next();
    } catch {
        next(new UnauthorizedError('Invalid or expired token'));
    }
};
