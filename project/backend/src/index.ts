import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { initializeFirebase } from './config/firebase';
import searchRoutes from './routes/searchRoutes';
import { initializeDatabase } from './utils/dbInit';
import { checkForRechargeEmails } from './services/gmailService';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin:["https://mentorfinder.talkweb.site","http://localhost:5173"

  ], // Replace with your frontend URL
  credentials: true
}));
app.use(express.json());
// Initialize Firebase
initializeFirebase();

// Routes
app.use('/api', searchRoutes);

// Start server
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await connectDatabase();
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Schedule email check every 5 minutes
    checkForRechargeEmails(); 
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();