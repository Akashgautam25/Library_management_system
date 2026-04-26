import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IAuthPayload } from '../interfaces';

/** Generate short-lived access token (15 min) */
export const generateToken = (payload: IAuthPayload): string => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '15m';
    if (!secret) throw new Error('JWT_SECRET is missing');
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

/** Verify access token */
export const verifyToken = (token: string): IAuthPayload => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is missing');
    return jwt.verify(token, secret) as IAuthPayload;
};

/** Generate long-lived refresh token (7 days) */
export const generateRefreshToken = (payload: IAuthPayload): string => {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_REFRESH_SECRET is missing');
    return jwt.sign(payload, secret, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as jwt.SignOptions);
};

/** Verify refresh token */
export const verifyRefreshToken = (token: string): IAuthPayload => {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_REFRESH_SECRET is missing');
    return jwt.verify(token, secret) as IAuthPayload;
};

/** Hash a refresh token for safe DB storage */
export const hashToken = (token: string): string =>
    crypto.createHash('sha256').update(token).digest('hex');

/** Calculate due date from issue date */
export const calculateDueDate = (issueDate: Date, maxDays: number = 14): Date => {
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + maxDays);
    return dueDate;
};

/** Format date to readable string */
export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

/** Cookie options for refresh token */
export const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
};
