import { Router } from 'express';
import { SearchController } from '../controllers/searchController';
import { authenticateUser } from '../middleware/auth';
import { checkForRechargeEmails } from '../services/gmailService';

const router = Router();

router.post('/search', authenticateUser, SearchController.search);
router.post('/ai-response', authenticateUser, SearchController.getAIResponse);

// New route to check for recharge emails
router.get('/check-recharge-emails', async (req, res) => {
  console.log('Checking for recharge emails');
  try {
    await checkForRechargeEmails();
    res.status(200).json({ message: 'Checked for recharge emails successfully' });
  } catch (error) {
    console.error('Error checking for recharge emails:', error);
    res.status(500).json({ error: 'Failed to check for recharge emails' });
  }
});

export default router;