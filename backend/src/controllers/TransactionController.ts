import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/TransactionService';
import { BookService } from '../services/BookService';
import { UserService } from '../services/UserService';
import { cache, CacheKeys } from '../config/cache';

export class TransactionController {
    private transactionService = new TransactionService();
    private bookService = new BookService();
    private userService = new UserService();

    issueBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.userId;
            const { bookId } = req.body;
            const transaction = await this.transactionService.issueBook(userId, bookId, req);
            await cache.del(CacheKeys.dashboardStats());
            res.status(201).json({ success: true, message: 'Book issued successfully', data: transaction });
        } catch (error) { next(error); }
    };

    returnBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.userId;
            const { bookId } = req.body;
            const transaction = await this.transactionService.returnBook(userId, bookId, req);
            await cache.del(CacheKeys.dashboardStats());
            res.status(200).json({
                success: true,
                message: transaction.fine > 0 ? `Book returned with fine: ₹${transaction.fine}` : 'Book returned successfully',
                data: transaction,
            });
        } catch (error) { next(error); }
    };

    getMyHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.userId;
            const result = await this.transactionService.getUserHistory(userId, req.query);
            res.status(200).json({ success: true, message: 'Borrowing history fetched', data: result });
        } catch (error) { next(error); }
    };

    getActiveTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.transactionService.getActiveTransactions(req.query);
            res.status(200).json({ success: true, message: 'Active transactions fetched', data: result });
        } catch (error) { next(error); }
    };

    getAllHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.transactionService.getAllHistory(req.query);
            res.status(200).json({ success: true, message: 'All history fetched', data: result });
        } catch (error) { next(error); }
    };

    getAllSystemTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.transactionService.getAllSystemTransactions(req.query);
            res.status(200).json({ success: true, message: 'All system transactions fetched', data: result });
        } catch (error) { next(error); }
    };

    getOverdueTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.transactionService.getOverdueTransactions(req.query);
            res.status(200).json({ success: true, message: 'Overdue transactions fetched', data: result });
        } catch (error) { next(error); }
    };

    getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const isAdmin = req.user?.role === 'admin';
            const userId = req.user?.userId;

            if (isAdmin) {
                const cacheKey = CacheKeys.dashboardStats();
                const cached = await cache.get(cacheKey);
                if (cached) { res.status(200).json({ success: true, message: 'Admin stats fetched', data: cached }); return; }

                const [totalBooks, totalUsers, activeIssues, overdueCount, recentTransactions] = await Promise.all([
                    this.bookService.getTotalBooks(),
                    this.userService.getStudentCount(),
                    this.transactionService.getActiveIssueCount(),
                    this.transactionService.getOverdueCount(),
                    this.transactionService.getRecentTransactions(10),
                ]);

                const data = { totalBooks, totalUsers, activeIssues, overdueCount, recentTransactions };
                await cache.set(cacheKey, data, 30);
                res.status(200).json({ success: true, message: 'Admin stats fetched', data });
            } else {
                // For students, fetch personal stats
                const [myBooks, myOverdue, myHistory] = await Promise.all([
                    this.transactionService.getUserActiveCount(userId!),
                    this.transactionService.getUserOverdueCount(userId!),
                    this.transactionService.getUserHistory(userId!, { limit: 5 })
                ]);

                // We also show system total books to students
                const totalBooks = await this.bookService.getTotalBooks();

                const data = {
                    totalBooks, // Show library size
                    activeIssues: myBooks, // Show personal borrowed count
                    overdueCount: myOverdue, // Show personal overdue count
                    totalUsers: 0, // Not needed for student
                    recentTransactions: myHistory.data || []
                };
                res.status(200).json({ success: true, message: 'Student stats fetched', data });
            }
        } catch (error) { next(error); }
    };
}
