import mongoose, { Schema } from 'mongoose';

export interface ITenant extends mongoose.Document {
    name: string;
    slug: string;
    plan: 'free' | 'pro' | 'enterprise';
    adminEmail: string;
    settings: {
    finePerDayRs: number;
    maxBorrowDays: number;
    };
    isActive: boolean;
    createdAt: Date;
}

const TenantSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
        adminEmail: { type: String, required: true, lowercase: true },
        settings: {
            finePerDayRs: { type: Number, default: 2 },
            maxBorrowDays: { type: Number, default: 14 },
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<ITenant>('Tenant', TenantSchema);
