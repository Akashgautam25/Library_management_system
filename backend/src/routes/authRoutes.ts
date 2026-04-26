import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { registerValidation, loginValidation } from '../middlewares/validationMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authRateLimit } from '../middlewares/rateLimitMiddleware';

const router = Router();
const authController = new AuthController();

router.post('/register', authRateLimit, registerValidation, authController.register);
router.post('/login', authRateLimit, loginValidation, authController.login);
router.post('/refresh', authRateLimit, authController.refresh);
router.post('/logout', authMiddleware, authController.logout);
router.get('/profile', authMiddleware, authController.getProfile);

export default router;
