import mongoose, { Schema } from 'mongoose';
import { ITransaction } from '../interfaces';

const TransactionSchema: Schema = new Schema(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant',
            required: false,
        },
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
            enum: ['borrowed', 'returned', 'overdue'],
            default: 'borrowed',
        },
    },
    {
        timestamps: true,
    }
);

// Compound indexes for efficient queries
TransactionSchema.index({ tenantId: 1, userId: 1, status: 1 });
TransactionSchema.index({ tenantId: 1, bookId: 1, status: 1 });
TransactionSchema.index({ tenantId: 1, userId: 1, bookId: 1, status: 1 }); // prevent duplicate issue check
TransactionSchema.index({ tenantId: 1, dueDate: 1, status: 1 });           // overdue queries
TransactionSchema.index({ tenantId: 1, createdAt: -1 });                   // recent transactions sort

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
