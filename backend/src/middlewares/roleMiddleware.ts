import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/AppError';

export const roleMiddleware = (...allowedRoles: string[]) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new ForbiddenError('You do not have permission'));
        }
        next();
    };
