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
exports.getAIResponseFromGemini = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getAIResponseFromGemini = (query, matches) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing in environment variables.");
    }
    // Corrected API URL and model name
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
    const requestData = {
        contents: [
            {
                parts: [
                    { text: `User query: ${query}\n\nDatabase matches: ${JSON.stringify(matches, null, 2)}\n\nProvide a suitable response based on the user query and database matches, using plain text formatting without asterisks (*).` }
                ]
            }
        ]
    };
    try {
        console.log('Sending request to Gemini API with:', JSON.stringify(requestData, null, 2));
        const response = yield axios_1.default.post(apiUrl, requestData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Received response from Gemini API:', JSON.stringify(response.data, null, 2));
        // Extract the response text correctly
        let textResponse = ((_e = (_d = (_c = (_b = (_a = response.data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) || "No response generated.";
        // Remove asterisks (*) from the response
        textResponse = textResponse.replace(/\*/g, '').trim();
        return textResponse;
    }
    catch (error) {
        console.error('Error getting AI response:', ((_f = error.response) === null || _f === void 0 ? void 0 : _f.data) || error.message);
        throw new Error(((_j = (_h = (_g = error.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.error) === null || _j === void 0 ? void 0 : _j.message) || "An error occurred while fetching AI response.");
    }
});
exports.getAIResponseFromGemini = getAIResponseFromGemini;
