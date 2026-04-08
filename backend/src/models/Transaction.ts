import mongoose, { Schema } from 'mongoose';
import { ITransaction } from '../interfaces';

const TransactionSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        bookId: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: [true, 'Book ID is required'],
        },
        issueDate: {
            type: Date,
            default: Date.now,
        },
        dueDate: {
            type: Date,
            required: [true, 'Due date is required'],
        },
        returnDate: {
            type: Date,
            default: null,
        },
        fine: {
            type: Number,
            default: 0,
            min: [0, 'Fine cannot be negative'],
        },
        status: {
            type: String,
            enum: ['issued', 'returned', 'overdue'],
            default: 'issued',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient queries
TransactionSchema.index({ userId: 1, status: 1 });
TransactionSchema.index({ bookId: 1, status: 1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
