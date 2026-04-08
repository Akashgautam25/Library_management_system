import { BaseRepository } from './BaseRepository';
import BookModel from '../models/Book';
import { IBook } from '../interfaces';

/**
 * BookRepository - Concrete repository for Book entity
 * OOP: Inheritance - extends BaseRepository for common CRUD
 */
export class BookRepository extends BaseRepository<IBook> {
    constructor() {
        super(BookModel);
    }

    /**
     * Search books by text query (title, author, category)
     */
    async search(query: string): Promise<IBook[]> {
        return this.model
            .find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { author: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } },
                ],
            })
            .exec();
    }

    /**
     * Find books by category
     */
    async findByCategory(category: string): Promise<IBook[]> {
        return this.model.find({ category }).exec();
    }

    /**
     * Find book by ISBN
     */
    async findByIsbn(isbn: string): Promise<IBook | null> {
        return this.model.findOne({ isbn }).exec();
    }

    /**
     * Decrement available quantity when a book is issued
     */
    async decrementAvailable(bookId: string): Promise<IBook | null> {
        return this.model
            .findByIdAndUpdate(bookId, { $inc: { availableQuantity: -1 } }, { new: true })
            .exec();
    }

    /**
     * Increment available quantity when a book is returned
     */
    async incrementAvailable(bookId: string): Promise<IBook | null> {
        return this.model
            .findByIdAndUpdate(bookId, { $inc: { availableQuantity: 1 } }, { new: true })
            .exec();
    }
}
