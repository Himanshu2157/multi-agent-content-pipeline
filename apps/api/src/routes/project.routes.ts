import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';

export const projectRouter = Router();

projectRouter.post('/projects', ProjectController.createProject);
projectRouter.get('/projects', ProjectController.listProjects);
projectRouter.get('/projects/:projectId', ProjectController.getProjectById);
