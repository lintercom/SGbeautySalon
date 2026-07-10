import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-admin-key-for-salon';

export interface AdminAuthRequest extends Request {
  isAdmin?: boolean;
}

export const requireAdminAuth = (req: AdminAuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing token' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role === 'admin') {
      req.isAdmin = true;
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
