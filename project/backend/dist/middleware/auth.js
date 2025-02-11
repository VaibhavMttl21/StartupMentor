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
exports.authenticateUser = void 0;
const firebase_1 = require("../config/firebase");
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization.split('Bearer ')[1];
        console.log('Received token:', token); // Log the token
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decodedToken = yield (0, firebase_1.verifyToken)(token);
        req.user = decodedToken;
        console.log("Going to /ai request");
        next();
    }
    catch (error) {
        console.error('Token verification error:', error); // Log the error
        res.status(401).json({ error: 'Invalid token' });
    }
});
exports.authenticateUser = authenticateUser;
