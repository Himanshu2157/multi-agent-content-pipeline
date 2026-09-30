import { Router } from 'express';
import { GenerationController } from '../controllers/generation.controller.js';

export const generationRouter = Router();

generationRouter.post('/projects/:projectId/generate', GenerationController.startGeneration);
generationRouter.get('/generations/:generationId', GenerationController.getGenerationById);
generationRouter.get('/generations/:generationId/events', GenerationController.streamEvents);
