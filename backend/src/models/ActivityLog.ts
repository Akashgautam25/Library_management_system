import mongoose, { Schema } from 'mongoose';

export type ActivityAction =
    | 'BOOK_ISSUED'
    | 'BOOK_RETURNED'
    | 'BOOK_ADDED'
    | 'BOOK_UPDATED'
    | 'BOOK_DELETED'
    | 'USER_LOGIN'
    | 'USER_REGISTERED'
    | 'USER_LOGOUT';

export interface IActivityLog extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    userEmail: string;
    action: ActivityAction;
    resourceId?: mongoose.Types.ObjectId;
    resourceType?: 'Book' | 'User' | 'Transaction';
    metadata?: Record<string, unknown>;
    ip?: string;
    userAgent?: string;
    createdAt: Date;
}

const ActivityLogSchema = new Schema(
    {
        tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: false },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        userEmail: { type: String, required: true },
        action: {
            type: String,
            enum: ['BOOK_ISSUED', 'BOOK_RETURNED', 'BOOK_ADDED', 'BOOK_UPDATED', 'BOOK_DELETED', 'USER_LOGIN', 'USER_REGISTERED', 'USER_LOGOUT'],
            required: true,
        },
        resourceId: { type: Schema.Types.ObjectId },
        resourceType: { type: String, enum: ['Book', 'User', 'Transaction'] },
        metadata: { type: Schema.Types.Mixed },
        ip: { type: String },
        userAgent: { type: String },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false,
    }
);

// Auto-delete logs older than 90 days
ActivityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
ActivityLogSchema.index({ tenantId: 1, userId: 1, createdAt: -1 });
ActivityLogSchema.index({ tenantId: 1, action: 1, createdAt: -1 });

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
