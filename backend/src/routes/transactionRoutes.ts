import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { transactionValidation } from '../middlewares/validationMiddleware';

const router = Router();
const transactionController = new TransactionController();

// All transaction routes require authentication
router.use(authMiddleware);

// Student & Admin routes
router.post('/issue', transactionValidation, transactionController.issueBook);
router.post('/return', transactionValidation, transactionController.returnBook);
router.get('/history', transactionController.getMyHistory);

// Admin-only routes
router.get('/active', roleMiddleware('admin'), transactionController.getActiveTransactions);
router.get('/overdue', roleMiddleware('admin'), transactionController.getOverdueTransactions);
router.get('/dashboard', roleMiddleware('admin'), transactionController.getDashboardStats);

export default router;
