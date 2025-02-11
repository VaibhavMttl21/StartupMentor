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
exports.sendEmail = void 0;
const https_1 = require("firebase-functions/v2/https");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(process.env.GMAIL_EMAIL);
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
    },
});
const cors_1 = __importDefault(require("cors"));
// Configure CORS (Allow all origins or specify allowed origins)
const corsHandler = (0, cors_1.default)({ origin: true });
exports.sendEmail = (0, https_1.onRequest)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Handle CORS
    return corsHandler(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Handle OPTIONS (Preflight) request
            if (req.method === "OPTIONS") {
                return res.status(204).send(""); // Respond with no content
            }
            // Allow only POST requests
            if (req.method !== "POST") {
                return res.status(405).send({ error: "Method Not Allowed" });
            }
            // Parse request body
            const { to, subject, text } = req.body;
            // Validate input fields
            if (!to || !subject || !text) {
                return res.status(400).send({ error: "Missing required fields" });
            }
            const mailOptions = {
                from: process.env.GMAIL_EMAIL,
                to,
                subject,
                text,
            };
            try {
                yield transporter.sendMail(mailOptions);
                res.status(200).send("Email sent successfully.");
            }
            catch (error) {
                res.status(500).send(`Error sending email: ${error}`);
            }
            //   console.log(Sending email to: ${to}, Subject: ${subject}, Text: ${text});
        }
        catch (error) {
            console.error("Error:", error);
            return res.status(500).send({ error: "Internal Server Error" });
        }
        return res.status(500).send({ error: "Internal Server Error" });
    }));
}));
