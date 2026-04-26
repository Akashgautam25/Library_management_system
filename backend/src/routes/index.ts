import { Router } from 'express';
import authRoutes from './authRoutes';
import bookRoutes from './bookRoutes';
import userRoutes from './userRoutes';
import transactionRoutes from './transactionRoutes';
import externalBookRoutes from './externalBookRoutes';
import activityRoutes from './activityRoutes';
import qrRoutes from './qrRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/external-books', externalBookRoutes);
router.use('/admin/activity', activityRoutes);
router.use('/qr', qrRoutes);

export default router;
