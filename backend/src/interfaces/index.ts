import { Document } from 'mongoose';

export interface IBaseDocument extends Document {
    createdAt: Date;
    updatedAt: Date;
}

export interface IUser extends IBaseDocument {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'student';
    comparePassword(candidatePassword: string): Promise<boolean>;
}

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

export interface ITransaction extends IBaseDocument {
    userId: string;
    bookId: string;
    issueDate: Date;
    dueDate: Date;
    returnDate?: Date;
    fine: number;
    status: 'issued' | 'returned' | 'overdue';
}

export interface IReadRepository<T> {
    findById(id: string): Promise<T | null>;
    findAll(filter?: Partial<Record<string, unknown>>): Promise<T[]>;
    findOne(filter: Partial<Record<string, unknown>>): Promise<T | null>;
}

export interface IWriteRepository<T> {
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<T | null>;
}

export interface IRepository<T> extends IReadRepository<T>, IWriteRepository<T> {
    count(filter?: Partial<Record<string, unknown>>): Promise<number>;
}

export interface IFineStrategy {
    calculateFine(dueDate: Date, returnDate: Date): number;
    getStrategyName(): string;
}

export interface IAuthPayload {
    userId: string;
    email: string;
    role: string;
}

export interface IApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}
