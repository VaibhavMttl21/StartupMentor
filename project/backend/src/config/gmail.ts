import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(__dirname, '../../token.json');
const CREDENTIALS_PATH = path.join(__dirname, '../../credentials.json');

export const authenticateGmail = async () => {
  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const token = {
      access_token: process.env.ACCESS_TOKEN,
      refresh_token: process.env.REFRESH_TOKEN,
      scope: SCOPES.join(' '),
      token_type: 'Bearer',
      expiry_date: Date.now() + 3600 * 1000, // 1 hour from now
    };

    oAuth2Client.setCredentials(token);

    return oAuth2Client;
  } catch (error) {
    console.error('Error loading credentials:', error);
    throw error;
  }
};