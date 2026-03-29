import { RepositoryFactory, FineStrategyFactory } from '../factories';
import { ITransaction } from '../interfaces';
import { NotFoundError, ValidationError } from '../utils/AppError';
import { calculateDueDate } from '../utils/helpers';
import { MAX_BORROW_DAYS, TRANSACTION_STATUS } from '../utils/constants';

/**
 * TransactionService - Handles book issue/return business logic
 * SOLID: Single Responsibility - only handles transaction operations
 * Uses Strategy Pattern for fine calculation via FineStrategyFactory
 */
export class TransactionService {
    private transactionRepo = RepositoryFactory.getTransactionRepository();
    private bookRepo = RepositoryFactory.getBookRepository();

    /**
     * Issue a book to a user
     */
    async issueBook(userId: string, bookId: string): Promise<ITransaction> {
        // Check if book exists and is available
        const book = await this.bookRepo.findById(bookId);
        if (!book) {
            throw new NotFoundError('Book not found');
        }

        if (book.availableQuantity <= 0) {
            throw new ValidationError('Book is not available for issue');
        }

        // Check if user already has this book issued
        const existingTransaction = await this.transactionRepo.findActiveTransaction(userId, bookId);
        if (existingTransaction) {
            throw new ValidationError('You already have this book issued');
        }

        // Create transaction
        const issueDate = new Date();
        const dueDate = calculateDueDate(issueDate, MAX_BORROW_DAYS);

        const transaction = await this.transactionRepo.create({
            userId,
            bookId,
            issueDate,
            dueDate,
            status: TRANSACTION_STATUS.ISSUED,
            fine: 0,
        } as Partial<ITransaction>);

        // Decrement book availability
        await this.bookRepo.decrementAvailable(bookId);

        return transaction;
    }

    /**
     * Return a book
     * Uses Strategy Pattern for fine calculation
     */
    async returnBook(userId: string, bookId: string): Promise<ITransaction> {
        const transaction = await this.transactionRepo.findActiveTransaction(userId, bookId);
        if (!transaction) {
            throw new NotFoundError('No active transaction found for this book');
        }

        const returnDate = new Date();

        // Strategy Pattern: Use FineCalculator to compute fine
        const fineCalculator = FineStrategyFactory.createFineCalculator('standard');
        const fine = fineCalculator.calculate(transaction.dueDate, returnDate);

        // Update transaction
        const updatedTransaction = await this.transactionRepo.update(transaction._id.toString(), {
            returnDate,
            fine,
            status: TRANSACTION_STATUS.RETURNED,
        } as Partial<ITransaction>);

        if (!updatedTransaction) {
            throw new NotFoundError('Transaction not found');
        }

        // Increment book availability
        await this.bookRepo.incrementAvailable(bookId);

        return updatedTransaction;
    }

    /**
     * Get borrowing history for a user
     */
    async getUserHistory(userId: string): Promise<ITransaction[]> {
        return this.transactionRepo.findByUserId(userId);
    }

    /**
     * Get all active transactions (admin)
     */
    async getActiveTransactions(): Promise<ITransaction[]> {
        return this.transactionRepo.findAllActive();
    }

    /**
     * Get overdue transactions (admin)
     */
    async getOverdueTransactions(): Promise<ITransaction[]> {
        return this.transactionRepo.findOverdueTransactions();
    }

    /**
     * Get recent transactions (admin dashboard)
     */
    async getRecentTransactions(limit: number = 10): Promise<ITransaction[]> {
        return this.transactionRepo.findRecent(limit);
    }

    /**
     * Get total active issue count
     */
    async getActiveIssueCount(): Promise<number> {
        return this.transactionRepo.count({ status: TRANSACTION_STATUS.ISSUED });
    }

    /**
     * Get overdue count
     */
    async getOverdueCount(): Promise<number> {
        return this.transactionRepo.count({
            status: TRANSACTION_STATUS.ISSUED,
            dueDate: { $lt: new Date() },
        });
    }
}
