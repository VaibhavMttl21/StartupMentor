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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const firebase_1 = require("./config/firebase");
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const dbInit_1 = require("./utils/dbInit");
const gmailService_1 = require("./services/gmailService");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: [process.env.FRONTEND_URL || ""], // Replace with your frontend URL
    credentials: true
}));
app.use(express_1.default.json());
// Initialize Firebase
(0, firebase_1.initializeFirebase)();
// Routes
app.use('/api', searchRoutes_1.default);
// Start server
const PORT = process.env.PORT || 3000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connectDatabase)();
        yield (0, dbInit_1.initializeDatabase)();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        // Schedule email check every 5 minutes
        setInterval(gmailService_1.checkForRechargeEmails, 5 * 60 * 1000);
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});
startServer();
