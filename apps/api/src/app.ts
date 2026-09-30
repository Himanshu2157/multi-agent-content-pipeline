import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { requestLogger } from './middleware/logger.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { healthRouter } from './routes/health.routes.js';
import { projectRouter } from './routes/project.routes.js';
import { generationRouter } from './routes/generation.routes.js';

export function createApp() {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(requestLogger);

  // Mount API Routes
  app.use('/api', healthRouter);
  app.use('/api', projectRouter);
  app.use('/api', generationRouter);

  // Error handling middleware
  app.use(errorHandler);

  return app;
}
