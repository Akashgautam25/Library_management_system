import { body, param, query } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
        return;
    }
    next();
};

export const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Min 6 characters'),
    body('role').optional().isIn(['admin', 'student']).withMessage('Role must be admin or student'),
    validate,
];

export const loginValidation = [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
];

export const bookValidation = [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Max 200 characters'),
    body('author').trim().notEmpty().withMessage('Author is required').isLength({ max: 100 }).withMessage('Max 100 characters'),
    body('isbn').trim().notEmpty().withMessage('ISBN is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    validate,
];

export const bookUpdateValidation = [
    body('title').optional().trim().isLength({ max: 200 }).withMessage('Max 200 characters'),
    body('author').optional().trim().isLength({ max: 100 }).withMessage('Max 100 characters'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    validate,
];

export const transactionValidation = [
    body('bookId').notEmpty().withMessage('Book ID is required').isMongoId().withMessage('Invalid Book ID'),
    validate,
];

export const idParamValidation = [
    param('id').isMongoId().withMessage('Invalid ID format'),
    validate,
];

export const searchValidation = [
    query('q').trim().notEmpty().withMessage('Search query is required'),
    validate,
];
