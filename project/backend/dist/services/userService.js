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
exports.UserService = void 0;
const user_1 = require("../models/user");
const email_1 = require("../config/email");
class UserService {
    static getOrCreateUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield user_1.User.findOne({ email });
            if (!user) {
                user = yield user_1.User.create({
                    email,
                    credits: 50
                });
            }
            return user;
        });
    }
    static checkAndHandleCredits(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.credits <= 0) {
                console.log("User credits exhausted, sending email");
                yield (0, email_1.sendCreditExhaustedEmail)(user.email, 'Your credits are exhausted. Please check your email to recharge.');
                return false;
            }
            return true;
        });
    }
    static deductCredit(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_1.User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
        });
    }
}
exports.UserService = UserService;
