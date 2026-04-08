import { BaseRepository } from './BaseRepository';
import BookModel from '../models/Book';
import { IBook } from '../interfaces';

export class BookRepository extends BaseRepository<IBook> {
    constructor() { super(BookModel); }

    async search(query: string): Promise<IBook[]> {
        return this.model.find({
            $or: [
                { title:    { $regex: query, $options: 'i' } },
                { author:   { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
            ],
        }).exec();
    }

    async findByCategory(category: string): Promise<IBook[]> {
        return this.model.find({ category }).exec();
    }

    async findByIsbn(isbn: string): Promise<IBook | null> {
        return this.model.findOne({ isbn }).exec();
    }

    async decrementAvailable(bookId: string): Promise<IBook | null> {
        return this.model.findByIdAndUpdate(bookId, { $inc: { availableQuantity: -1 } }, { new: true }).exec();
    }

    async incrementAvailable(bookId: string): Promise<IBook | null> {
        return this.model.findByIdAndUpdate(bookId, { $inc: { availableQuantity: 1 } }, { new: true }).exec();
    }
}
