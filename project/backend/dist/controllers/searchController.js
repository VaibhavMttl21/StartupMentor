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
                const user = yield userService_1.UserService.getOrCreateUser(userEmail);
                const hasCredits = yield userService_1.UserService.checkAndHandleCredits(user);
                if (!hasCredits) {
                    return res.status(403).json({
                        error: 'Your credits are exhausted. Please check your email to recharge.'
                    });
                }
                const matches = yield searchService_1.SearchService.findMatches(query);
                if (matches.length === 0) {
                    return res.json({ matches: [], message: 'No results found' });
                }
                const aiResponse = yield (0, aiService_1.getAIResponseFromGemini)(query, matches);
                yield userService_1.UserService.deductCredit(user._id.toString());
                return res.json({ matches, response: aiResponse });
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
                const user = yield userService_1.UserService.getOrCreateUser(userEmail);
                const hasCredits = yield userService_1.UserService.checkAndHandleCredits(user);
                if (!hasCredits) {
                    return res.status(403).json({
                        error: 'Your credits are exhausted. Please check your email to recharge.'
                    });
                }
                const matches = yield searchService_1.SearchService.findMatches(query);
                if (matches.length === 0) {
                    return res.json({ response: 'No results found' });
                }
                const aiResponse = yield (0, aiService_1.getAIResponseFromGemini)(query, matches);
                yield userService_1.UserService.deductCredit(user._id.toString());
                return res.json({ response: aiResponse });
            }
            catch (error) {
                console.error('AI response error:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.SearchController = SearchController;
