import ActivityLogModel, { ActivityAction, IActivityLog } from '../models/ActivityLog';
import { Request } from 'express';
import logger from '../config/logger';

export class ActivityLogService {
    /**
     * Log an activity — fire & forget, never throws
     */
    async log(
        userId: string,
        userEmail: string,
        action: ActivityAction,
        resourceId?: string,
        resourceType?: 'Book' | 'User' | 'Transaction',
        metadata?: Record<string, unknown>,
        req?: Request
    ): Promise<void> {
        try {
            await ActivityLogModel.create({
                userId,
                userEmail,
                action,
                resourceId: resourceId || undefined,
                resourceType: resourceType || undefined,
                metadata: metadata || {},
                ip: req?.ip || req?.socket?.remoteAddress,
                userAgent: req?.headers?.['user-agent'],
            });
        } catch (err) {
            // Non-blocking — log error but never crash the main request
            logger.error('ActivityLog write failed', { err, userId, action });
        }
    }

    /**
     * Get paginated activity logs for admin
     */
    async getAdminLogs(
        page = 1,
        limit = 20,
        action?: string,
        userId?: string
    ): Promise<{ logs: IActivityLog[]; total: number }> {
        const filter: Record<string, unknown> = {};
        if (action) filter.action = action;
        if (userId) filter.userId = userId;

        const [logs, total] = await Promise.all([
            ActivityLogModel.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('userId', 'name email')
                .lean(),
            ActivityLogModel.countDocuments(filter),
        ]);

        return { logs: logs as unknown as IActivityLog[], total };
    }
}

export const activityLogService = new ActivityLogService();
