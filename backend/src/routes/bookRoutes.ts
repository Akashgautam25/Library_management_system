import { Router } from 'express';
import { BookController } from '../controllers/BookController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { bookValidation, bookUpdateValidation, idParamValidation, searchValidation } from '../middlewares/validationMiddleware';

const router = Router();
const bookController = new BookController();

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/search', searchValidation, bookController.searchBooks);
router.get('/category/:category', bookController.getBooksByCategory);
router.get('/:id', idParamValidation, bookController.getBookById);

// Admin-only routes
router.post('/', authMiddleware, roleMiddleware('admin'), bookValidation, bookController.createBook);
router.put('/:id', authMiddleware, roleMiddleware('admin'), idParamValidation, bookUpdateValidation, bookController.updateBook);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), idParamValidation, bookController.deleteBook);

export default router;
