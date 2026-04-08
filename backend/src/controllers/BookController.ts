import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/BookService';
import { ExternalBookService } from '../services/ExternalBookService';

/**
 * BookController - Handles HTTP requests for book operations
 * SOLID: Single Responsibility - delegates business logic to BookService
 */
export class BookController {
    private externalBookService: ExternalBookService;
    private bookService: BookService;

    constructor() {
        this.bookService = new BookService();
        this.externalBookService = new ExternalBookService();
    }

    /**
     * POST /api/books
     */
    createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const book = await this.bookService.createBook(req.body);
            res.status(201).json({
                success: true,
                message: 'Book created successfully',
                data: book,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/books
     */
    getAllBooks = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const books = await this.bookService.getAllBooks();
            res.status(200).json({
                success: true,
                message: 'Books fetched successfully',
                data: books,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/books/search?q=query
     */
    searchBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const query = req.query.q as string;
            const books = await this.bookService.searchBooks(query);
            res.status(200).json({
                success: true,
                message: 'Search results',
                data: books,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/books/:id
     */
    getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const book = await this.bookService.getBookById(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Book fetched successfully',
                data: book,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * PUT /api/books/:id
     */
    updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const book = await this.bookService.updateBook(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Book updated successfully',
                data: book,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * DELETE /api/books/:id
     */
    deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.bookService.deleteBook(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Book deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/books/category/:category
     */
    getBooksByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const books = await this.bookService.getBooksByCategory(req.params.category);
            res.status(200).json({
                success: true,
                message: 'Books fetched by category',
                data: books,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/books/external-search?q=query
     */
    searchExternalBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const query = req.query.q as string;
            if (!query) {
                res.status(400).json({
                    success: false,
                    message: 'Query parameter q is required',
                });
                return;
            }
            const books = await this.externalBookService.searchOpenLibrary(query);
            res.status(200).json({
                success: true,
                message: 'External search results',
                data: books,
            });
        } catch (error) {
            next(error);
        }
    };
}
