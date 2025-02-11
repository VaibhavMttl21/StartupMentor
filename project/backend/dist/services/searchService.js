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
exports.SearchService = void 0;
const mentor_1 = require("../models/mentor");
class SearchService {
    static findMatches(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const mentors = yield mentor_1.Mentor.find();
            const keywords = query.toLowerCase().split(' ');
            return mentors.filter(mentor => keywords.some(keyword => mentor.category.toLowerCase().includes(keyword) ||
                mentor.type.toLowerCase().includes(keyword)));
        });
    }
}
exports.SearchService = SearchService;
