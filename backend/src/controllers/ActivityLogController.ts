import { Request, Response, NextFunction } from 'express';
import { activityLogService } from '../services/ActivityLogService';
import { parsePaginationQuery, buildPaginationMeta } from '../utils/pagination';

export class ActivityLogController {
    getActivityLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { page, limit } = parsePaginationQuery(req.query);
            const action = req.query.action as string | undefined;
            const userId = req.query.userId as string | undefined;

            const { logs, total } = await activityLogService.getAdminLogs(page, limit, action, userId);

            res.status(200).json({
                success: true,
                message: 'Activity logs fetched',
                data: {
                    logs,
                    pagination: buildPaginationMeta(page, limit, total),
                },
            });
        } catch (error) {
            next(error);
        }
    };
}
