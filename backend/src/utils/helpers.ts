import jwt from 'jsonwebtoken';
import { IAuthPayload } from '../interfaces';

/**
 * Generate JWT token
 */
export const generateToken = (payload: IAuthPayload): string => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;

    if (!secret || !expiresIn) {
        throw new Error('JWT configuration is missing in environment variables');
    }

    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): IAuthPayload => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is missing in environment variables');
    }
    return jwt.verify(token, secret) as IAuthPayload;
};

/**
 * Calculate due date from issue date
 */
export const calculateDueDate = (issueDate: Date, maxDays: number = 14): Date => {
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + maxDays);
    return dueDate;
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};
