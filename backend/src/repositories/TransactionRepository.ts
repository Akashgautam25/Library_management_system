import { BaseRepository } from './BaseRepository';
import TransactionModel from '../models/Transaction';
import { ITransaction } from '../interfaces';

export class TransactionRepository extends BaseRepository<ITransaction> {
    constructor() {
        super(TransactionModel);
    }

    async findByUserId(userId: string): Promise<ITransaction[]> {
        return this.model
            .find({ userId })
            .populate('bookId', 'title author isbn')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findActiveTransaction(userId: string, bookId: string): Promise<ITransaction | null> {
        return this.model.findOne({ userId, bookId, status: 'issued' }).exec();
    }

    async findOverdueTransactions(): Promise<ITransaction[]> {
        const now = new Date();
        return this.model
            .find({ status: 'issued', dueDate: { $lt: now } })
            .populate('userId', 'name email')
            .populate('bookId', 'title author')
            .exec();
    }

    async findAllActive(): Promise<ITransaction[]> {
        return this.model
            .find({ status: 'issued' })
            .populate('userId', 'name email')
            .populate('bookId', 'title author isbn')
            .sort({ dueDate: 1 })
            .exec();
    }

    async findRecent(limit = 10): Promise<ITransaction[]> {
        return this.model
            .find()
            .populate('userId', 'name email')
            .populate('bookId', 'title author')
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
}
