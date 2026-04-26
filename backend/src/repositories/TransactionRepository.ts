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
        return this.model
            .findOne({ userId, bookId, status: 'borrowed' })
            .exec();
    }


    async findOverdueTransactions(): Promise<ITransaction[]> {
        return this.model
            .find({
                status: 'borrowed',
                dueDate: { $lt: new Date() },
            })
            .populate('userId', 'name email')
            .populate('bookId', 'title author')
            .exec();
    }


    async findAllActive(): Promise<ITransaction[]> {
        return this.model
            .find({ status: 'borrowed' })
            .populate('userId', 'name email')
            .populate('bookId', 'title author isbn')
            .sort({ dueDate: 1 })
            .exec();
    }


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
