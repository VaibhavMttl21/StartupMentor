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
exports.checkForRechargeEmails = void 0;
const googleapis_1 = require("googleapis");
const gmail_1 = require("../config/gmail");
const user_1 = require("../models/user");
const email_1 = require("../config/email");
const checkForRechargeEmails = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const auth = yield (0, gmail_1.authenticateGmail)();
    const gmail = googleapis_1.google.gmail({ version: 'v1', auth });
    const res = yield gmail.users.messages.list({
        userId: 'me',
        q: 'subject:"recharge 5 credits"',
    });
    const messages = res.data.messages || [];
    for (const message of messages) {
        const msg = yield gmail.users.messages.get({
            userId: 'me',
            id: message.id,
        });
        const email = (_c = (_b = (_a = msg.data.payload) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.find((header) => header.name === 'From')) === null || _c === void 0 ? void 0 : _c.value;
        const userEmail = (_d = email === null || email === void 0 ? void 0 : email.match(/<(.*)>/)) === null || _d === void 0 ? void 0 : _d[1];
        if (userEmail) {
            const user = yield user_1.User.findOne({ email: userEmail });
            if (user) {
                if (user.lastRecharge && new Date().getTime() - new Date(user.lastRecharge).getTime() < 24 * 60 * 60 * 1000) {
                    yield (0, email_1.sendCreditExhaustedEmail)(userEmail, 'Sorry, we are not offering additional credits at this time.');
                }
                else {
                    user.credits += 5;
                    user.lastRecharge = new Date();
                    yield user.save();
                    yield (0, email_1.sendCreditExhaustedEmail)(userEmail, 'Your credits have been recharged by 5.');
                }
            }
        }
        // Mark the message as read
        yield gmail.users.messages.modify({
            userId: 'me',
            id: message.id,
            requestBody: {
                removeLabelIds: ['UNREAD'],
            },
        });
    }
});
exports.checkForRechargeEmails = checkForRechargeEmails;
