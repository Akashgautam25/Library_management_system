import { Model, Document } from 'mongoose';
import { IRepository } from '../interfaces';

// ============================================================
// Design Pattern: Repository Pattern
// SOLID Principle: Single Responsibility (SRP)
//
// The BaseRepository provides a generic, reusable data access
// layer that abstracts away Mongoose-specific logic. Each
// concrete repository has the single responsibility of managing
// data access for one entity type.
//
// OOP Concept: Abstraction & Inheritance
// This abstract base class defines common CRUD operations.
// Concrete repositories inherit from it and can override or
// extend behavior (Polymorphism).
//
// SOLID Principle: Open/Closed Principle (OCP)
// The base class is open for extension (via inheritance) but
// closed for modification.
//
// SOLID Principle: Liskov Substitution Principle (LSP)
// Any concrete repository can be used wherever IRepository<T>
// is expected, without breaking behavior.
// ============================================================

export abstract class BaseRepository<T extends Document> implements IRepository<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async findAll(filter: Partial<Record<string, unknown>> = {}): Promise<T[]> {
        return this.model.find(filter as any).exec();
    }

    async findOne(filter: Partial<Record<string, unknown>>): Promise<T | null> {
        return this.model.findOne(filter as any).exec();
    }

    async create(data: Partial<T>): Promise<T> {
        const document = new this.model(data);
        return document.save();
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, data as any, { new: true, runValidators: true }).exec();
    }

    async delete(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    }

    async count(filter: Partial<Record<string, unknown>> = {}): Promise<number> {
        return this.model.countDocuments(filter as any).exec();
    }
}
