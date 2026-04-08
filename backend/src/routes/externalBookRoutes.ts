import { Router } from 'express';
import { searchExternalBooks } from '../controllers/ExternalBookController';

const router = Router();

// GET /api/external-books?q=python&subject=programming&page=1&limit=20
router.get('/', searchExternalBooks);

export default router;
