import { createApp } from './app.js';
import { env } from './config/env.js';
import { initDatabase } from './services/database.service.js';

const app = createApp();

await initDatabase();

const server = app.listen(env.PORT, () => {
  console.log(`[ContentForge API] Server listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
  console.log(`[ContentForge API] Health check endpoint: http://localhost:${env.PORT}/api/health`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
