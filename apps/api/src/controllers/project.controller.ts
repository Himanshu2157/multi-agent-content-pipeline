import { Request, Response, NextFunction } from 'express';
import { CreateProjectSchema } from '@contentforge/shared';
import { db } from '../services/database.service.js';

export class ProjectController {
  static async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const input = CreateProjectSchema.parse(req.body);
      const project = await db.createProject({
        ...input,
        userId: 'dev-user-default',
      });

      res.status(201).json({ project });
    } catch (err) {
      next(err);
    }
  }

  static async getProjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const project = await db.getProjectById(projectId);

      if (!project) {
        res.status(404).json({ error: `Project '${projectId}' not found` });
        return;
      }

      const latestGeneration =
        project.generations && project.generations.length > 0
          ? project.generations[0]
          : undefined;

      res.json({
        project,
        latestGeneration,
      });
    } catch (err) {
      next(err);
    }
  }

  static async listProjects(_req: Request, res: Response, next: NextFunction) {
    try {
      const projects = await db.listProjects();
      res.json({ projects });
    } catch (err) {
      next(err);
    }
  }
}
