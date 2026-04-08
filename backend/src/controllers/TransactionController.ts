import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/TransactionService';
import { BookService } from '../services/BookService';
import { UserService } from '../services/UserService';

/**
 * TransactionController - Handles HTTP requests for transactions
 * SOLID: Single Responsibility - delegates to TransactionService
 */
export class TransactionController {
    private transactionService: TransactionService;
    private bookService: BookService;
    private userService: UserService;

    constructor() {
        this.transactionService = new TransactionService();
        this.bookService = new BookService();
        this.userService = new UserService();
    }

    /**
     * POST /api/transactions/issue
     */
    issueBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.userId;
            const { bookId } = req.body;
            const transaction = await this.transactionService.issueBook(userId, bookId);
            res.status(201).json({
                success: true,
                message: 'Book issued successfully',
                data: transaction,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * POST /api/transactions/return
     */
    returnBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.userId;
            const { bookId } = req.body;
            const transaction = await this.transactionService.returnBook(userId, bookId);
            res.status(200).json({
                success: true,
                message: transaction.fine > 0
                    ? `Book returned with fine: ₹${transaction.fine}`
                    : 'Book returned successfully',
                data: transaction,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/transactions/history
     */
    getMyHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.userId;
            const history = await this.transactionService.getUserHistory(userId);
            res.status(200).json({
                success: true,
                message: 'Borrowing history fetched',
                data: history,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/transactions/active (admin)
     */
    getActiveTransactions = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const transactions = await this.transactionService.getActiveTransactions();
            res.status(200).json({
                success: true,
                message: 'Active transactions fetched',
                data: transactions,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/transactions/overdue (admin)
     */
    getOverdueTransactions = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const transactions = await this.transactionService.getOverdueTransactions();
            res.status(200).json({
                success: true,
                message: 'Overdue transactions fetched',
                data: transactions,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/transactions/dashboard (admin)
     */
    getDashboardStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const [totalBooks, totalUsers, activeIssues, overdueCount, recentTransactions] =
                await Promise.all([
                    this.bookService.getTotalBooks(),
                    this.userService.getStudentCount(),
                    this.transactionService.getActiveIssueCount(),
                    this.transactionService.getOverdueCount(),
                    this.transactionService.getRecentTransactions(10),
                ]);

            res.status(200).json({
                success: true,
                message: 'Dashboard stats fetched',
                data: {
                    totalBooks,
                    totalUsers,
                    activeIssues,
                    overdueCount,
                    recentTransactions,
                },
            });
        } catch (error) {
            next(error);
        }
    };
}
