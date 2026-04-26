import rateLimit from 'express-rate-limit';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 min
const max = parseInt(process.env.RATE_LIMIT_MAX || '100');

// Global rate limiter for all API routes
export const globalRateLimit = rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
    skip: (req) => process.env.NODE_ENV === 'test',
});

// Strict limiter for auth routes (brute-force protection)
export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again in 15 minutes.',
    },
    skip: (req) => process.env.NODE_ENV === 'test',
});
