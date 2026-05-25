import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  minDelayMs: parseInt(process.env.MIN_DELAY_MS || '200', 10),
  maxDelayMs: parseInt(process.env.MAX_DELAY_MS || '700', 10),
  apiPrefix: '/api/v1'
};
