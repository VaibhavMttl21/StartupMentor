"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const userService_1 = require("../services/userService");
const searchService_1 = require("../services/searchService");
const aiService_1 = require("../services/aiService");
class SearchController {
    static search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = req.body;
            const userEmail = req.user.email;
            try {
                // console.log('Received search request:', { query, userEmail });
                const user = yield userService_1.UserService.getOrCreateUser(userEmail);
                // console.log('User retrieved or created:', user);
                const hasCredits = yield userService_1.UserService.checkAndHandleCredits(user);
                // console.log('User has credits:', hasCredits);
                if (!hasCredits) {
                    return res.status(403).json({
                        error: 'Your credits are exhausted. Please check your email to recharge.'
                    });
                }
                const matches = yield searchService_1.SearchService.findMatches(query);
                // console.log('Matches found:', matches);
                yield userService_1.UserService.deductCredit(user._id.toString());
                // console.log('Credit deducted for user:', user._id);
                return res.json({ matches });
            }
            catch (error) {
                console.error('Search error:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static getAIResponse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = req.body;
            const userEmail = req.user.email;
            try {
                console.log('Received AI response request:', { query, userEmail });
                const user = yield userService_1.UserService.getOrCreateUser(userEmail);
                console.log('User retrieved or created:', user);
                const hasCredits = yield userService_1.UserService.checkAndHandleCredits(user);
                console.log('User has credits:', hasCredits);
                if (!hasCredits) {
                    return res.status(403).json({
                        error: 'Your credits are exhausted. Please check your email to recharge.'
                    });
                }
                const aiResponse = yield (0, aiService_1.getAIResponseFromGemini)(query);
                console.log('AI response:', aiResponse);
                yield userService_1.UserService.deductCredit(user._id.toString());
                console.log('Credit deducted for user:', user._id);
                return res.json({ response: aiResponse });
            }
            catch (error) {
                console.error('AI response error:');
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.SearchController = SearchController;
