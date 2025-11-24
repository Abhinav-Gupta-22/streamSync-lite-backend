import { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  res.json({
    status: 'ok',
    message: 'Serverless function is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
}

