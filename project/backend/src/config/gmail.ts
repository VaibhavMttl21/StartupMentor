import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = JSON.parse(process.env.TOKEN_PATH || "");

export const authenticateGmail = async () => {
  try {
    const credentials = JSON.parse(process.env.CREDENTIALS || "");
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    if (fs.existsSync(TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
      oAuth2Client.setCredentials(token);

      // Refresh the token if it's expired
      const newToken = await oAuth2Client.getAccessToken();
      if (newToken.token) {
        oAuth2Client.setCredentials({ access_token: newToken.token });
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(oAuth2Client.credentials));
      }
    } else {
      console.error('Token not found. Please authenticate the application locally and include the token.json file in your deployment.');
      return null; // Return null or handle the missing token case appropriately
    }

    return oAuth2Client;
  } catch (error) {
    console.error('Error loading credentials:', error);
    throw error;
  }
};