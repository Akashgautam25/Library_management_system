import { Model, Document } from 'mongoose';
import { IRepository } from '../interfaces';

// Base class with generic CRUD — all repositories extend this
export abstract class BaseRepository<T extends Document> implements IRepository<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    findById(id: string)                                        { return this.model.findById(id).exec(); }
    findAll(filter: any = {})                                   { return this.model.find(filter).exec(); }
    findOne(filter: any)                                        { return this.model.findOne(filter).exec(); }
    create(data: Partial<T>)                                    { return new this.model(data).save(); }
    update(id: string, data: Partial<T>)                        { return this.model.findByIdAndUpdate(id, data as any, { new: true, runValidators: true }).exec(); }
    delete(id: string)                                          { return this.model.findByIdAndDelete(id).exec(); }
    count(filter: any = {})                                     { return this.model.countDocuments(filter).exec(); }
}
