import { Router } from 'express';
import { QRController } from '../controllers/QRController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const controller = new QRController();

router.use(authMiddleware);

// GET /api/qr/book/:bookId?action=issue|return
router.get('/book/:bookId', controller.generateQR);

// POST /api/qr/scan
router.post('/scan', controller.scanQR);

export default router;
