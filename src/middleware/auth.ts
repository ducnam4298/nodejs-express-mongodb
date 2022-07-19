import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  else {
    try {
      const decoded = jwt.verify(token, 'abcabcabc123123123abcabc');
      if (decoded && typeof decoded === 'object') {
        req.body.user = decoded['userId'];
      }
      next();
    } catch (error: any) {
      console.log(error.message);
      return res.status(403).json({ message: 'Invalid Token' });
    }
  }
};
