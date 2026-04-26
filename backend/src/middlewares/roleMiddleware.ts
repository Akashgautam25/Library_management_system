import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/AppError';

/**
 * Role-based access control middleware
 * SOLID: Single Responsibility - only handles authorization
 *
 * Usage: roleMiddleware('admin') or roleMiddleware('admin', 'student')
 */
export const roleMiddleware = (...allowedRoles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(new ForbiddenError('Access denied'));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new ForbiddenError('You do not have permission to perform this action'));
        }

        next();
    };
};
