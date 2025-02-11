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
exports.authenticateGmail = void 0;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path_1.default.join(__dirname, '../../token.json');
const CREDENTIALS_PATH = path_1.default.join(__dirname, '../../credentials.json');
const authenticateGmail = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const credentials = JSON.parse(fs_1.default.readFileSync(CREDENTIALS_PATH, 'utf8'));
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        // Check if we have previously stored a token.
        if (fs_1.default.existsSync(TOKEN_PATH)) {
            const token = JSON.parse(fs_1.default.readFileSync(TOKEN_PATH, 'utf8'));
            oAuth2Client.setCredentials(token);
            // Refresh the token if it's expired
            const newToken = yield oAuth2Client.getAccessToken();
            if (newToken.token) {
                oAuth2Client.setCredentials({ access_token: newToken.token });
                fs_1.default.writeFileSync(TOKEN_PATH, JSON.stringify(oAuth2Client.credentials));
            }
        }
        else {
            throw new Error('Token not found. Please authenticate the application.');
        }
        return oAuth2Client;
    }
    catch (error) {
        console.error('Error loading credentials:', error);
        throw error;
    }
});
exports.authenticateGmail = authenticateGmail;
