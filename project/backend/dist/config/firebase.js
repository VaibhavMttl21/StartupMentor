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
exports.verifyToken = exports.initializeFirebase = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const serviceAccount = require('../../service-account-file.json');
const initializeFirebase = () => {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });
};
exports.initializeFirebase = initializeFirebase;
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('Verifying token:', token); // Log the token
        const decodedToken = yield firebase_admin_1.default.auth().verifyIdToken(token);
        // console.log('Decoded token:', decodedToken); // Log the decoded token
        return decodedToken;
    }
    catch (error) {
        console.error('Error verifying token:', error); // Log the error
        throw new Error('Invalid token');
    }
});
exports.verifyToken = verifyToken;
