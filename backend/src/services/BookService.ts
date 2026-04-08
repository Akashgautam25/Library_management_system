import { RepositoryFactory } from '../factories';
import { IBook } from '../interfaces';
import { NotFoundError, ConflictError, ValidationError } from '../utils/AppError';

export class BookService {
    private bookRepo = RepositoryFactory.getBookRepository();

    async createBook(data: Partial<IBook>) {
        const existing = await this.bookRepo.findByIsbn(data.isbn!);
        if (existing) {
            throw new ConflictError('Book with this ISBN already exists');
        }

        // set available same as total when first adding
        data.availableQuantity = data.quantity;
        return this.bookRepo.create(data);
    }

    async getAllBooks() {
        return this.bookRepo.findAll();
    }

    async getBookById(id: string) {
        const book = await this.bookRepo.findById(id);
        if (!book) throw new NotFoundError('Book not found');
        return book;
    }

    async updateBook(id: string, data: Partial<IBook>) {
        const book = await this.bookRepo.findById(id);
        if (!book) throw new NotFoundError('Book not found');

        if (data.quantity !== undefined) {
            const diff = data.quantity - book.quantity;
            data.availableQuantity = book.availableQuantity + diff;

            // can't go negative — means some copies are still out
            if (data.availableQuantity < 0) {
                throw new ValidationError('Some copies are still issued, cannot reduce quantity that much');
            }
        }

        const updated = await this.bookRepo.update(id, data);
        if (!updated) throw new NotFoundError('Book not found');
        return updated;
    }

    async deleteBook(id: string) {
        const book = await this.bookRepo.findById(id);
        if (!book) throw new NotFoundError('Book not found');

        // don't allow delete if any copy is currently issued
        if (book.quantity !== book.availableQuantity) {
            throw new ValidationError('Cannot delete book while copies are still issued');
        }

        const deleted = await this.bookRepo.delete(id);
        if (!deleted) throw new NotFoundError('Book not found');
        return deleted;
    }

    async searchBooks(query: string) {
        return this.bookRepo.search(query);
    }

    async getBooksByCategory(category: string) {
        return this.bookRepo.findByCategory(category);
    }

    async getTotalBooks() {
        return this.bookRepo.count();
    }
}
