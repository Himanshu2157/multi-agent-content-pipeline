import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'ContentForge API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
