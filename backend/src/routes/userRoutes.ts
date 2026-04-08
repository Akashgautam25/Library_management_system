import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { idParamValidation } from '../middlewares/validationMiddleware';

const router = Router();
const userController = new UserController();

// All user routes require admin access
router.use(authMiddleware, roleMiddleware('admin'));

router.get('/', userController.getAllUsers);
router.get('/students', userController.getAllStudents);
router.get('/:id', idParamValidation, userController.getUserById);
router.delete('/:id', idParamValidation, userController.deleteUser);

export default router;
