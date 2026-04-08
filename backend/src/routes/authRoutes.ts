import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { registerValidation, loginValidation } from '../middlewares/validationMiddleware';

const router = Router();
const authController = new AuthController();


router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);


router.get('/profile', authMiddleware, authController.getProfile);

export default router;
