import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { SearchService } from '../services/searchService';
import { getAIResponseFromGemini } from '../services/aiService';

export class SearchController {
  static async search(req: any, res: Response) {
    const { query } = req.body;
    const userEmail = req.user.email;

    try {
      const user = await UserService.getOrCreateUser(userEmail);
      const hasCredits = await UserService.checkAndHandleCredits(user);

      if (!hasCredits) {
        return res.status(403).json({ 
          error: 'Your credits are exhausted. Please check your email to recharge.' 
        });
      }

      const matches = await SearchService.findMatches(query);

      if (matches.length === 0) {
        return res.json({ matches: [], message: 'No results found' });
      }

      const aiResponse = await getAIResponseFromGemini(query, matches);
      await UserService.deductCredit(user._id.toString());

      return res.json({ matches, response: aiResponse });
    } catch (error) {
      console.error('Search error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAIResponse(req: any, res: Response) {
    const { query } = req.body;
    const userEmail = req.user.email;

    try {
      const user = await UserService.getOrCreateUser(userEmail);
      const hasCredits = await UserService.checkAndHandleCredits(user);

      if (!hasCredits) {
        return res.status(403).json({ 
          error: 'Your credits are exhausted. Please check your email to recharge.' 
        });
      }

      const matches = await SearchService.findMatches(query);

      if (matches.length === 0) {
        return res.json({ response: 'No results found' });
      }

      const aiResponse = await getAIResponseFromGemini(query, matches);
      await UserService.deductCredit(user._id.toString());

      return res.json({ response: aiResponse });
    } catch (error) {
      console.error('AI response error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}