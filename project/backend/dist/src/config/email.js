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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCreditExhaustedEmail = void 0;
const functions_1 = require("firebase/functions");
const app_1 = require("firebase/app");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};
const app = (0, app_1.initializeApp)(firebaseConfig);
const functions = (0, functions_1.getFunctions)(app);
const sendEmail = (0, functions_1.httpsCallable)(functions, 'sendEmail');
const sendCreditExhaustedEmail = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    yield sendEmail({
        to: userEmail,
        subject: 'Credits Exhausted - Startup Finder',
        text: `Your credits are exhausted. Please send an email to ${process.env.GMAIL_USER} with subject "recharge 5 credits" to recharge.`,
    });
});
exports.sendCreditExhaustedEmail = sendCreditExhaustedEmail;
