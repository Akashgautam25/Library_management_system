import { body, param, query } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Process validation results and return errors if any
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array(),
        });
        return;
    }
    next();
};

/**
 * Validation rules for user registration
 */
export const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['admin', 'student'])
        .withMessage('Role must be admin or student'),
    validate,
];

/**
 * Validation rules for login
 */
export const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    validate,
];

/**
 * Validation rules for creating/updating a book
 */
export const bookValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 200 })
        .withMessage('Title cannot exceed 200 characters'),
    body('author')
        .trim()
        .notEmpty()
        .withMessage('Author is required')
        .isLength({ max: 100 })
        .withMessage('Author cannot exceed 100 characters'),
    body('isbn')
        .trim()
        .notEmpty()
        .withMessage('ISBN is required'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),
    body('quantity')
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),
    validate,
];

/**
 * Validation for book update (all fields optional)
 */
export const bookUpdateValidation = [
    body('title')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Title cannot exceed 200 characters'),
    body('author')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Author cannot exceed 100 characters'),
    body('quantity')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),
    validate,
];

/**
 * Validation for transaction (issue/return book)
 */
export const transactionValidation = [
    body('bookId')
        .notEmpty()
        .withMessage('Book ID is required')
        .isMongoId()
        .withMessage('Invalid Book ID format'),
    validate,
];

/**
 * Validation for MongoDB ObjectId parameter
 */
export const idParamValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID format'),
    validate,
];

/**
 * Validation for search query
 */
export const searchValidation = [
    query('q')
        .trim()
        .notEmpty()
        .withMessage('Search query is required'),
    validate,
];
