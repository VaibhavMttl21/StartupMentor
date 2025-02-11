import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { SearchService } from '../services/searchService';
import { getAIResponseFromGemini } from '../services/aiService';

export class SearchController {
  static async search(req: any, res: Response) {
    const { query } = req.body;
    const userEmail = req.user.email;

    try {
      // console.log('Received search request:', { query, userEmail });

      const user = await UserService.getOrCreateUser(userEmail);
      // console.log('User retrieved or created:', user);

      const hasCredits = await UserService.checkAndHandleCredits(user);
      // console.log('User has credits:', hasCredits);

      if (!hasCredits) {
        return res.status(403).json({ 
          error: 'Your credits are exhausted. Please check your email to recharge.' 
        });
      }

      const matches = await SearchService.findMatches(query);
      // console.log('Matches found:', matches);

      await UserService.deductCredit(user._id.toString());
      // console.log('Credit deducted for user:', user._id);

      return res.json({ matches });
    } catch (error) {
      console.error('Search error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAIResponse(req: any, res: Response) {
    const { query } = req.body;
    const userEmail = req.user.email;

    try {
      console.log('Received AI response request:', { query, userEmail });

      const user = await UserService.getOrCreateUser(userEmail);
      console.log('User retrieved or created:', user);

      const hasCredits = await UserService.checkAndHandleCredits(user);
      console.log('User has credits:', hasCredits);

      if (!hasCredits) {
        return res.status(403).json({ 
          error: 'Your credits are exhausted. Please check your email to recharge.' 
        });
      }

      const aiResponse = await getAIResponseFromGemini(query);
      console.log('AI response:', aiResponse);

      await UserService.deductCredit(user._id.toString());
      console.log('Credit deducted for user:', user._id);

      return res.json({ response: aiResponse });
    } catch (error) {
      console.error('AI response error:');
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}