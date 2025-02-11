import { Router } from 'express';
import { SearchController } from '../controllers/searchController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

router.post('/search', authenticateUser, SearchController.search);
router.post('/ai-response', authenticateUser, SearchController.getAIResponse);

export default router;