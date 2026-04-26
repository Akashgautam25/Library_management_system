import { RepositoryFactory, FineStrategyFactory } from '../factories';
import { ITransaction } from '../interfaces';
import { NotFoundError, ValidationError } from '../utils/AppError';
import { calculateDueDate } from '../utils/helpers';
import { MAX_BORROW_DAYS, TRANSACTION_STATUS } from '../utils/constants';
import { activityLogService } from './ActivityLogService';
import { parsePaginationQuery, parseSortString, buildPaginationMeta, PaginatedResult } from '../utils/pagination';
import { Request } from 'express';

export class TransactionService {
    private transactionRepo = RepositoryFactory.getTransactionRepository();
    private bookRepo = RepositoryFactory.getBookRepository();

    async issueBook(userId: string, bookId: string, req?: Request): Promise<ITransaction> {
        const book = await this.bookRepo.findById(bookId);
        if (!book) throw new NotFoundError('Book not found');
        if (book.availableQuantity <= 0) throw new ValidationError('Book is not available for issue');

        const existingTransaction = await this.transactionRepo.findActiveTransaction(userId, bookId);
        if (existingTransaction) throw new ValidationError('You already have this book issued');

        const issueDate = new Date();
        const dueDate = calculateDueDate(issueDate, MAX_BORROW_DAYS);

        const transaction = await this.transactionRepo.create({
            userId, bookId, issueDate, dueDate,
            status: TRANSACTION_STATUS.BORROWED, fine: 0,
        } as Partial<ITransaction>);

        await this.bookRepo.decrementAvailable(bookId);

        // Fire & forget activity log
        if (req?.user) {
            activityLogService.log(userId, req.user.email, 'BOOK_ISSUED', bookId, 'Book',
                { bookTitle: book.title }, req);
        }

        return transaction;
    }

    async returnBook(userId: string, bookId: string, req?: Request): Promise<ITransaction> {
        const transaction = await this.transactionRepo.findActiveTransaction(userId, bookId);
        if (!transaction) throw new NotFoundError('No active transaction found for this book');

        const returnDate = new Date();
        const fineCalculator = FineStrategyFactory.createFineCalculator('standard');
        const fine = fineCalculator.calculate(transaction.dueDate, returnDate);

        const updatedTransaction = await this.transactionRepo.update(transaction._id.toString(), {
            returnDate, fine, status: TRANSACTION_STATUS.RETURNED,
        } as Partial<ITransaction>);

        if (!updatedTransaction) throw new NotFoundError('Transaction not found');
        await this.bookRepo.incrementAvailable(bookId);

        // Fire & forget activity log
        if (req?.user) {
            const book = await this.bookRepo.findById(bookId);
            activityLogService.log(userId, req.user.email, 'BOOK_RETURNED', bookId, 'Book',
                { bookTitle: book?.title, fine }, req);
        }

        return updatedTransaction;
    }

    async getUserHistory(userId: string, query: Record<string, any> = {}): Promise<PaginatedResult<ITransaction>> {
        const { page, limit, sort } = parsePaginationQuery(query);
        const filter = { userId, ...(query.status ? { status: query.status } : {}) };
        const sortObj = parseSortString(sort);

        const [data, total] = await Promise.all([
            (this.transactionRepo as any).model
                .find(filter).sort(sortObj).skip((page - 1) * limit).limit(limit)
                .populate('bookId', 'title author isbn category').lean(),
            (this.transactionRepo as any).model.countDocuments(filter),
        ]);

        return { data, pagination: buildPaginationMeta(page, limit, total) };
    }

    async getActiveTransactions(query: Record<string, any> = {}): Promise<PaginatedResult<ITransaction>> {
        const { page, limit } = parsePaginationQuery(query);
        const filter = { status: TRANSACTION_STATUS.BORROWED };

        const [data, total] = await Promise.all([
            (this.transactionRepo as any).model
                .find(filter).sort({ dueDate: 1 }).skip((page - 1) * limit).limit(limit)
                .populate('bookId', 'title author isbn').populate('userId', 'name email').lean(),
            (this.transactionRepo as any).model.countDocuments(filter),
        ]);

        return { data, pagination: buildPaginationMeta(page, limit, total) };
    }

    async getAllHistory(query: Record<string, any> = {}): Promise<PaginatedResult<ITransaction>> {
        const { page, limit } = parsePaginationQuery(query);
        const filter = { status: TRANSACTION_STATUS.RETURNED };

        const [data, total] = await Promise.all([
            (this.transactionRepo as any).model
                .find(filter).sort({ returnDate: -1 }).skip((page - 1) * limit).limit(limit)
                .populate('bookId', 'title author isbn').populate('userId', 'name email').lean(),
            (this.transactionRepo as any).model.countDocuments(filter),
        ]);

        return { data, pagination: buildPaginationMeta(page, limit, total) };
    }

    async getAllSystemTransactions(query: Record<string, any> = {}): Promise<PaginatedResult<ITransaction>> {
        const { page, limit } = parsePaginationQuery(query);
        const filter = {}; // No status filter, get all

        const [data, total] = await Promise.all([
            (this.transactionRepo as any).model
                .find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
                .populate('bookId', 'title author isbn').populate('userId', 'name email').lean(),
            (this.transactionRepo as any).model.countDocuments(filter),
        ]);

        return { data, pagination: buildPaginationMeta(page, limit, total) };
    }

    async getOverdueTransactions(query: Record<string, any> = {}): Promise<PaginatedResult<ITransaction>> {
        const { page, limit } = parsePaginationQuery(query);
        const filter = { status: TRANSACTION_STATUS.BORROWED, dueDate: { $lt: new Date() } };

        const [data, total] = await Promise.all([
            (this.transactionRepo as any).model
                .find(filter).sort({ dueDate: 1 }).skip((page - 1) * limit).limit(limit)
                .populate('bookId', 'title author isbn').populate('userId', 'name email').lean(),
            (this.transactionRepo as any).model.countDocuments(filter),
        ]);

        return { data, pagination: buildPaginationMeta(page, limit, total) };
    }

    async getRecentTransactions(limit = 10): Promise<ITransaction[]> {
        return (this.transactionRepo as any).model
            .find({}).sort({ createdAt: -1 }).limit(limit)
            .populate('bookId', 'title author').populate('userId', 'name email').lean();
    }

    async getActiveIssueCount(): Promise<number> {
        return this.transactionRepo.count({ status: TRANSACTION_STATUS.BORROWED });
    }

    async getOverdueCount(): Promise<number> {
        return this.transactionRepo.count({ status: TRANSACTION_STATUS.BORROWED, dueDate: { $lt: new Date() } });
    }

    async getUserActiveCount(userId: string): Promise<number> {
        return this.transactionRepo.count({ userId, status: TRANSACTION_STATUS.BORROWED });
    }

    async getUserOverdueCount(userId: string): Promise<number> {
        return this.transactionRepo.count({ userId, status: TRANSACTION_STATUS.BORROWED, dueDate: { $lt: new Date() } });
    }

    // Legacy methods for backward compat
    async getUserHistoryLegacy(userId: string): Promise<ITransaction[]> {
        return this.transactionRepo.findByUserId(userId);
    }
}
