import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/BookService';
import { ExternalBookService } from '../services/ExternalBookService';
import { activityLogService } from '../services/ActivityLogService';
import { parsePaginationQuery } from '../utils/pagination';

export class BookController {
    private bookService = new BookService();
    private externalBookService = new ExternalBookService();

    createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const book = await this.bookService.createBook(req.body);
            if (req.user) {
                activityLogService.log(req.user.userId, req.user.email, 'BOOK_ADDED', book._id.toString(), 'Book', { title: book.title }, req);
            }
            res.status(201).json({ success: true, message: 'Book created successfully', data: book });
        } catch (error) { next(error); }
    };

    getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.bookService.getAllBooks(req.query);
            res.status(200).json({ success: true, message: 'Books fetched successfully', data: result });
        } catch (error) { next(error); }
    };

    searchBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const query = req.query.q as string;
            const books = await this.bookService.searchBooks(query);
            res.status(200).json({ success: true, message: 'Search results', data: books });
        } catch (error) { next(error); }
    };

    getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const book = await this.bookService.getBookById(req.params.id);
            res.status(200).json({ success: true, message: 'Book fetched successfully', data: book });
        } catch (error) { next(error); }
    };

    updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const book = await this.bookService.updateBook(req.params.id, req.body);
            if (req.user) {
                activityLogService.log(req.user.userId, req.user.email, 'BOOK_UPDATED', req.params.id, 'Book', { title: book.title }, req);
            }
            res.status(200).json({ success: true, message: 'Book updated successfully', data: book });
        } catch (error) { next(error); }
    };

    deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const book = await this.bookService.deleteBook(req.params.id);
            if (req.user) {
                activityLogService.log(req.user.userId, req.user.email, 'BOOK_DELETED', req.params.id, 'Book', { title: book.title }, req);
            }
            res.status(200).json({ success: true, message: 'Book deleted successfully' });
        } catch (error) { next(error); }
    };

    getBooksByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const books = await this.bookService.getBooksByCategory(req.params.category);
            res.status(200).json({ success: true, message: 'Books fetched by category', data: books });
        } catch (error) { next(error); }
    };

    searchExternalBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const query = req.query.q as string;
            if (!query) { res.status(400).json({ success: false, message: 'Query parameter q is required' }); return; }
            const books = await this.externalBookService.searchBooks(query);
            res.status(200).json({ success: true, message: 'External search results', data: books });
        } catch (error) { next(error); }
    };
}
