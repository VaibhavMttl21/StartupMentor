import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { json } from 'stream/consumers';

dotenv.config();

const serviceAccount = JSON.parse(process.env.SERVICE || "")
console.log()

export const initializeFirebase = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
};

export const verifyToken = async (token: string) => {
  try {
    // console.log('Verifying token:', token); // Log the token
    const decodedToken = await admin.auth().verifyIdToken(token);
    // console.log('Decoded token:', decodedToken); // Log the decoded token
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error); // Log the error
    throw new Error('Invalid token');
  }
};