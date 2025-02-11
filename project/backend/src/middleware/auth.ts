import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/firebase';

export const authenticateUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1]
    console.log('Received token:',token); // Log the token
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await verifyToken(token);
    req.user = decodedToken;
    console.log("Going to /ai request")
    next();
  } catch (error) {
    console.error('Token verification error:', error); // Log the error
    res.status(401).json({ error: 'Invalid token' });
  }
};