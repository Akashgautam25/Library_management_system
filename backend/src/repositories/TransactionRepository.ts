import { BaseRepository } from './BaseRepository';
import TransactionModel from '../models/Transaction';
import { ITransaction } from '../interfaces';

/**
 * TransactionRepository - Concrete repository for Transaction entity
 * OOP: Inheritance - extends BaseRepository
 */
export class TransactionRepository extends BaseRepository<ITransaction> {
    constructor() {
        super(TransactionModel);
    }

    /**
     * Find all transactions for a specific user with populated book details
     */
    async findByUserId(userId: string): Promise<ITransaction[]> {
        return this.model
            .find({ userId })
            .populate('bookId', 'title author isbn')
            .sort({ createdAt: -1 })
            .exec();
    }

    /**
     * Find active (issued) transaction for a user and book
     */
    async findActiveTransaction(userId: string, bookId: string): Promise<ITransaction | null> {
        return this.model
            .findOne({ userId, bookId, status: 'issued' })
            .exec();
    }

    /**
     * Find all overdue transactions
     */
    async findOverdueTransactions(): Promise<ITransaction[]> {
        return this.model
            .find({
                status: 'issued',
                dueDate: { $lt: new Date() },
            })
            .populate('userId', 'name email')
            .populate('bookId', 'title author')
            .exec();
    }

    /**
     * Find all active transactions with populated details
     */
    async findAllActive(): Promise<ITransaction[]> {
        return this.model
            .find({ status: 'issued' })
            .populate('userId', 'name email')
            .populate('bookId', 'title author isbn')
            .sort({ dueDate: 1 })
            .exec();
    }

    /**
     * Get recent transactions with populated details
     */
    async findRecent(limit: number = 10): Promise<ITransaction[]> {
        return this.model
            .find()
            .populate('userId', 'name email')
            .populate('bookId', 'title author')
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
}
