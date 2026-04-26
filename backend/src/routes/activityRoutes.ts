import { Router } from 'express';
import { ActivityLogController } from '../controllers/ActivityLogController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();
const controller = new ActivityLogController();

router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router.get('/', controller.getActivityLogs);

export default router;
