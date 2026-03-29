import { RepositoryFactory } from '../factories';
import { IBook } from '../interfaces';
import { NotFoundError, ConflictError, ValidationError } from '../utils/AppError';

/**
 * BookService - Handles book-related business logic
 * SOLID: Single Responsibility - only handles book operations
 */
export class BookService {
    private bookRepo = RepositoryFactory.getBookRepository();

    /**
     * Create a new book
     */
    async createBook(data: Partial<IBook>): Promise<IBook> {
        const existingBook = await this.bookRepo.findByIsbn(data.isbn!);
        if (existingBook) {
            throw new ConflictError('Book with this ISBN already exists');
        }

        // Set availableQuantity equal to quantity on creation
        data.availableQuantity = data.quantity;
        return this.bookRepo.create(data);
    }

    /**
     * Get all books
     */
    async getAllBooks(): Promise<IBook[]> {
        return this.bookRepo.findAll();
    }

    /**
     * Get book by ID
     */
    async getBookById(id: string): Promise<IBook> {
        const book = await this.bookRepo.findById(id);
        if (!book) {
            throw new NotFoundError('Book not found');
        }
        return book;
    }

    /**
     * Update a book
     */
    async updateBook(id: string, data: Partial<IBook>): Promise<IBook> {
        const book = await this.bookRepo.findById(id);
        if (!book) {
            throw new NotFoundError('Book not found');
        }

        // If quantity is being updated, adjust available quantity accordingly
        if (data.quantity !== undefined) {
            const diff = data.quantity - book.quantity;
            data.availableQuantity = book.availableQuantity + diff;
            if (data.availableQuantity < 0) {
                throw new ValidationError('Cannot reduce quantity below currently issued books');
            }
        }

        const updatedBook = await this.bookRepo.update(id, data);
        if (!updatedBook) {
            throw new NotFoundError('Book not found');
        }
        return updatedBook;
    }

    /**
     * Delete a book
     */
    async deleteBook(id: string): Promise<IBook> {
        const book = await this.bookRepo.findById(id);
        if (!book) {
            throw new NotFoundError('Book not found');
        }

        if (book.quantity !== book.availableQuantity) {
            throw new ValidationError('Cannot delete a book that has copies currently issued');
        }

        const deletedBook = await this.bookRepo.delete(id);
        if (!deletedBook) {
            throw new NotFoundError('Book not found');
        }
        return deletedBook;
    }

    /**
     * Search books by query
     */
    async searchBooks(query: string): Promise<IBook[]> {
        return this.bookRepo.search(query);
    }

    /**
     * Get books by category
     */
    async getBooksByCategory(category: string): Promise<IBook[]> {
        return this.bookRepo.findByCategory(category);
    }

    /**
     * Get total book count
     */
    async getTotalBooks(): Promise<number> {
        return this.bookRepo.count();
    }
}
