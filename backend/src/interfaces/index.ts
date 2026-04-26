import { Document } from 'mongoose';

// ============================================================
// OOP Concept: Abstraction
// These interfaces define contracts that concrete classes must
// implement, hiding internal details from consumers.
// ============================================================

/**
 * Base document interface extending Mongoose Document
 */
export interface IBaseDocument extends Document {
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * User interface
 */
export interface IUser extends IBaseDocument {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'student';
    comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Book interface
 */
export interface IBook extends IBaseDocument {
    title: string;
    author: string;
    isbn: string;
    category: string;
    description: string;
    quantity: number;
    availableQuantity: number;
    publishedYear: number;
    publisher: string;
}

/**
 * Transaction interface
 */
export interface ITransaction extends IBaseDocument {
    userId: string;
    bookId: string;
    issueDate: Date;
    dueDate: Date;
    returnDate?: Date;
    fine: number;
    status: 'issued' | 'returned' | 'overdue';
}

// ============================================================
// SOLID Principle: Interface Segregation (ISP)
// Clients should not be forced to depend on interfaces they
// don't use. We separate read-only operations from write
// operations so consumers only depend on what they need.
// ============================================================

/**
 * Read-only repository interface (ISP)
 */
export interface IReadRepository<T> {
    findById(id: string): Promise<T | null>;
    findAll(filter?: Partial<Record<string, unknown>>): Promise<T[]>;
    findOne(filter: Partial<Record<string, unknown>>): Promise<T | null>;
}

/**
 * Write repository interface (ISP)
 */
export interface IWriteRepository<T> {
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<T | null>;
}

/**
 * Full repository interface combining read and write (ISP)
 * SOLID Principle: Interface Segregation - composed from smaller interfaces
 */
export interface IRepository<T> extends IReadRepository<T>, IWriteRepository<T> {
    count(filter?: Partial<Record<string, unknown>>): Promise<number>;
}

/**
 * Fine calculation strategy interface
 * Design Pattern: Strategy Pattern
 * Allows different fine calculation algorithms to be used interchangeably
 */
export interface IFineStrategy {
    calculateFine(dueDate: Date, returnDate: Date): number;
    getStrategyName(): string;
}

/**
 * Auth payload for JWT
 */
export interface IAuthPayload {
    userId: string;
    email: string;
    role: string;
}

/**
 * API Response interface
 */
export interface IApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}
