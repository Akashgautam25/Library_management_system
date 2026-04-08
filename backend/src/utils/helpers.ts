import jwt from 'jsonwebtoken';
import { IAuthPayload } from '../interfaces';

const SECRET = process.env.JWT_SECRET || 'default_secret';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate a JWT token for a user
export const generateToken = (payload: IAuthPayload): string =>
    jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions);

// Verify and decode a JWT token
export const verifyToken = (token: string): IAuthPayload =>
    jwt.verify(token, SECRET) as IAuthPayload;

// Calculate due date by adding days to issue date
export const calculateDueDate = (issueDate: Date, days = 14): Date => {
    const due = new Date(issueDate);
    due.setDate(due.getDate() + days);
    return due;
};

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string =>
    date.toISOString().split('T')[0];
