import { RepositoryFactory } from '../factories';
import { IBook } from '../interfaces';
import { NotFoundError, ConflictError, ValidationError } from '../utils/AppError';
import { cache, CacheKeys } from '../config/cache';
import { parsePaginationQuery, parseSortString, buildPaginationMeta, PaginatedResult } from '../utils/pagination';

export class BookService {
    private bookRepo = RepositoryFactory.getBookRepository();

    async createBook(data: Partial<IBook>): Promise<IBook> {
        const existingBook = await this.bookRepo.findByIsbn(data.isbn!);
        if (existingBook) throw new ConflictError('Book with this ISBN already exists');
        data.availableQuantity = data.quantity;
        const book = await this.bookRepo.create(data);
        await cache.flush('books:');
        return book;
    }

    async getAllBooks(query: Record<string, any> = {}): Promise<PaginatedResult<IBook>> {
        const { page, limit, sort, search, category } = parsePaginationQuery(query);
        const cacheKey = CacheKeys.books(page, limit, sort, category, search);

        const cached = await cache.get<PaginatedResult<IBook>>(cacheKey);
        if (cached) return cached;

        const filter: Record<string, any> = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { isbn: { $regex: search, $options: 'i' } },
            ];
        }
        if (category) filter.category = category;

        const sortObj = parseSortString(sort);

        const [data, total] = await Promise.all([
            (this.bookRepo as any).model.find(filter).sort(sortObj).skip((page - 1) * limit).limit(limit).lean(),
            (this.bookRepo as any).model.countDocuments(filter),
        ]);

        const result: PaginatedResult<IBook> = { data, pagination: buildPaginationMeta(page, limit, total) };
        await cache.set(cacheKey, result, 60);
        return result;
    }

    async getBookById(id: string): Promise<IBook> {
        const cacheKey = CacheKeys.book(id);
        const cached = await cache.get<IBook>(cacheKey);
        if (cached) return cached;

        const book = await this.bookRepo.findById(id);
        if (!book) throw new NotFoundError('Book not found');

        await cache.set(cacheKey, book, 300);
        return book;
    }

    async updateBook(id: string, data: Partial<IBook>): Promise<IBook> {
        const book = await this.bookRepo.findById(id);
        if (!book) throw new NotFoundError('Book not found');

        if (data.quantity !== undefined) {
            const diff = data.quantity - book.quantity;
            data.availableQuantity = book.availableQuantity + diff;
            if (data.availableQuantity < 0) throw new ValidationError('Cannot reduce quantity below currently issued books');
        }

        const updatedBook = await this.bookRepo.update(id, data);
        if (!updatedBook) throw new NotFoundError('Book not found');

        await cache.del(CacheKeys.book(id));
        await cache.flush('books:');
        return updatedBook;
    }

    async deleteBook(id: string): Promise<IBook> {
        const book = await this.bookRepo.findById(id);
        if (!book) throw new NotFoundError('Book not found');
        if (book.quantity !== book.availableQuantity) throw new ValidationError('Cannot delete a book that has copies currently issued');

        const deletedBook = await this.bookRepo.delete(id);
        if (!deletedBook) throw new NotFoundError('Book not found');

        await cache.del(CacheKeys.book(id));
        await cache.flush('books:');
        return deletedBook;
    }

    async searchBooks(query: string): Promise<IBook[]> {
        return this.bookRepo.search(query);
    }

    async getBooksByCategory(category: string): Promise<IBook[]> {
        return this.bookRepo.findByCategory(category);
    }

    async getTotalBooks(): Promise<number> {
        return this.bookRepo.count();
    }
}
