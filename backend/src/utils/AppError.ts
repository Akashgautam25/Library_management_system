// ============================================================
// OOP Concept: Inheritance
// AppError extends the built-in Error class, inheriting its
// properties (message, stack trace) while adding HTTP-specific
// fields (statusCode, isOperational).
//
// This hierarchy allows different error types (NotFoundError,
// ValidationError, etc.) to be handled uniformly by the error
// middleware while preserving specific error information.
// ============================================================

/**
 * Base custom error class for the application
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
        (Error as any).captureStackTrace(this, this.constructor);
    }
}

/**
 * 404 Not Found Error
 * OOP: Inheritance from AppError
 */
export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}

/**
 * 400 Bad Request / Validation Error
 */
export class ValidationError extends AppError {
    constructor(message: string = 'Validation failed') {
        super(message, 400);
    }
}

/**
 * 401 Unauthorized Error
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * 403 Forbidden Error
 */
export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

/**
 * 409 Conflict Error
 */
export class ConflictError extends AppError {
    constructor(message: string = 'Conflict') {
        super(message, 409);
    }
}
