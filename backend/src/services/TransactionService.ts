import { RepositoryFactory, FineStrategyFactory } from '../factories';
import { ITransaction } from '../interfaces';
import { NotFoundError, ValidationError } from '../utils/AppError';
import { calculateDueDate } from '../utils/helpers';
import { MAX_BORROW_DAYS, TRANSACTION_STATUS } from '../utils/constants';

export class TransactionService {
    private txnRepo = RepositoryFactory.getTransactionRepository();
    private bookRepo = RepositoryFactory.getBookRepository();

    async issueBook(userId: string, bookId: string) {
        const book = await this.bookRepo.findById(bookId);
        if (!book) throw new NotFoundError('Book not found');

        if (book.availableQuantity <= 0) {
            throw new ValidationError('No copies available right now');
        }

        // check if user already has this book
        const alreadyIssued = await this.txnRepo.findActiveTransaction(userId, bookId);
        if (alreadyIssued) {
            throw new ValidationError('You already have this book');
        }

        const issueDate = new Date();
        const dueDate = calculateDueDate(issueDate, MAX_BORROW_DAYS);

        const transaction = await this.txnRepo.create({
            userId,
            bookId,
            issueDate,
            dueDate,
            status: TRANSACTION_STATUS.ISSUED,
            fine: 0,
        } as Partial<ITransaction>);

        await this.bookRepo.decrementAvailable(bookId);
        return transaction;
    }

    async returnBook(userId: string, bookId: string) {
        const transaction = await this.txnRepo.findActiveTransaction(userId, bookId);
        if (!transaction) {
            throw new NotFoundError('No active borrow found for this book');
        }

        const returnDate = new Date();

        // calculate fine if returned late
        const fineCalc = FineStrategyFactory.createFineCalculator('standard');
        const fine = fineCalc.calculate(transaction.dueDate, returnDate);

        const updated = await this.txnRepo.update(transaction._id.toString(), {
            returnDate,
            fine,
            status: TRANSACTION_STATUS.RETURNED,
        } as Partial<ITransaction>);

        if (!updated) throw new NotFoundError('Transaction not found');

        await this.bookRepo.incrementAvailable(bookId);
        return updated;
    }

    async getUserHistory(userId: string) {
        return this.txnRepo.findByUserId(userId);
    }

    async getActiveTransactions() {
        return this.txnRepo.findAllActive();
    }

    async getOverdueTransactions() {
        return this.txnRepo.findOverdueTransactions();
    }

    async getRecentTransactions(limit = 10) {
        return this.txnRepo.findRecent(limit);
    }

    async getActiveIssueCount() {
        return this.txnRepo.count({ status: TRANSACTION_STATUS.ISSUED });
    }

    async getOverdueCount() {
        // TODO: maybe send email notifications for overdue ones later
        return this.txnRepo.count({
            status: TRANSACTION_STATUS.ISSUED,
            dueDate: { $lt: new Date() },
        });
    }
}
