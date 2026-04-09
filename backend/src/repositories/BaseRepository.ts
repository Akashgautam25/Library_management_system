import { Model, Document } from 'mongoose';
import { IRepository } from '../interfaces';

export abstract class BaseRepository<T extends Document> implements IRepository<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async findById(id: string) {
        return this.model.findById(id).exec();
    }

    async findAll(filter: any = {}) {
        return this.model.find(filter).exec();
    }

    async findOne(filter: any) {
        return this.model.findOne(filter).exec();
    }

    async create(data: Partial<T>) {
        const doc = new this.model(data);
        return doc.save();
    }

    async update(id: string, data: Partial<T>) {
        return this.model.findByIdAndUpdate(id, data as any, { new: true, runValidators: true }).exec();
    }

    async delete(id: string) {
        return this.model.findByIdAndDelete(id).exec();
    }

    async count(filter: any = {}) {
        return this.model.countDocuments(filter).exec();
    }
}
