import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ROLES, ERROR_CODES } from '../constants';
import { User } from '../types';
import { getDatabase } from '../mock-db';
import { delay } from '../utils';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const delayMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await delay();
  next();
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || ERROR_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message
    }
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Access token required'
      }
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    const db = getDatabase();
    const user = db.users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Invalid token'
        }
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: {
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Invalid or expired token'
      }
    });
  }
};

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Unauthorized'
        }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: 'Insufficient permissions'
        }
      });
    }

    next();
  };
};
