import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'config/dotenv';

dotenv();

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  else {
    try {
      const decoded = process.env.ACCESS_TOKEN_SECRET && jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded && typeof decoded === 'object') {
        req.body.userId = decoded['userId'];
      }
      next();
    } catch (error: any) {
      console.log(error.message);
      return res.status(403).json({ message: 'Invalid Token' });
    }
  }
};
