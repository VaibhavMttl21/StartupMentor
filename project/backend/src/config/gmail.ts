import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify'];

export const authenticateGmail = async () => {
  try {
    console.log(process.env.TOKEN);
    console.log('Authenticating Gmail...');
    const credentials = JSON.parse(process.env.CREDENTIALS || "");
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have a token in the environment variable.
    const token = JSON.parse(process.env.TOKEN || "");
    if (token) {
      console.log('Token found in environment variable');
      oAuth2Client.setCredentials(token);

      // Refresh the token if it's expired
      const newToken = await oAuth2Client.getAccessToken();
      if (newToken.token) {
        oAuth2Client.setCredentials({ access_token: newToken.token });
        // Optionally, you can update the environment variable with the new token
        process.env.TOKEN = JSON.stringify(oAuth2Client.credentials);
      }
    } else {
      console.error('Token not found in environment variable. Please authenticate the application locally and set the TOKEN environment variable.');
      return null; // Return null or handle the missing token case appropriately
    }

    return oAuth2Client;
  } catch (error) {
    console.error('Error loading credentials:', error);
    throw error;
  }
};