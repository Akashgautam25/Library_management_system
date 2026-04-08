import { RepositoryFactory } from '../factories';
import { IBook } from '../interfaces';
import { NotFoundError, ConflictError, ValidationError } from '../utils/AppError';

export class BookService {
    private bookRepo = RepositoryFactory.getBookRepository();

    async createBook(data: Partial<IBook>) {
        if (await this.bookRepo.findByIsbn(data.isbn!)) {
            throw new ConflictError('Book with this ISBN already exists');
        }
        data.availableQuantity = data.quantity; // available = total on creation
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

        // If quantity changes, adjust available copies accordingly
        if (data.quantity !== undefined) {
            data.availableQuantity = book.availableQuantity + (data.quantity - book.quantity);
            if (data.availableQuantity < 0) {
                throw new ValidationError('Cannot reduce quantity below currently issued books');
            }
        }

        const updated = await this.bookRepo.update(id, data);
        if (!updated) throw new NotFoundError('Book not found');
        return updated;
    }

    async deleteBook(id: string) {
        const book = await this.bookRepo.findById(id);
        if (!book) throw new NotFoundError('Book not found');

        if (book.quantity !== book.availableQuantity) {
            throw new ValidationError('Cannot delete a book that has copies currently issued');
        }

        const deleted = await this.bookRepo.delete(id);
        if (!deleted) throw new NotFoundError('Book not found');
        return deleted;
    }

    async searchBooks(query: string)          { return this.bookRepo.search(query); }
    async getBooksByCategory(category: string) { return this.bookRepo.findByCategory(category); }
    async getTotalBooks()                      { return this.bookRepo.count(); }
}
