import { Request, Response, NextFunction } from 'express';
import { db } from '../services/database.service.js';
import { ContentGenerationGraph } from '../agents/graph/content.graph.js';
import { generationEvents } from '../services/sse.service.js';

export class GenerationController {
  static async startGeneration(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const project = await db.getProjectById(projectId);

      if (!project) {
        res.status(404).json({ error: `Project '${projectId}' not found` });
        return;
      }

      // Create new generation record in DB
      const generation = await db.createGeneration(projectId);

      // Return immediately to client so UI can show the live pipeline
      res.status(202).json({
        generationId: generation.id,
        status: 'RESEARCHING',
      });

      // Execute multi-agent graph asynchronously
      const graph = new ContentGenerationGraph();

      graph
        .run(
          {
            projectId: project.id,
            generationId: generation.id,
            topic: project.topic,
            platform: project.platform,
            tone: project.tone,
            audience: project.audience,
            maxIterations: project.maxIterations,
          },
          {
            onStepChange: (step) => {
              // Emit live SSE update
              generationEvents.emit(`generation:${generation.id}`, {
                type: 'STEP_CHANGE',
                agentType: step.agentType,
                status: step.status,
                iteration: step.iteration,
                timestamp: new Date().toISOString(),
              });
            },
          }
        )
        .then((finalState) => {
          generationEvents.emit(`generation:${generation.id}`, {
            type: 'PIPELINE_COMPLETE',
            status: finalState.status,
            approved: finalState.approved,
            iteration: finalState.iteration,
            timestamp: new Date().toISOString(),
          });
        })
        .catch((err) => {
          generationEvents.emit(`generation:${generation.id}`, {
            type: 'PIPELINE_ERROR',
            error: err.message,
            timestamp: new Date().toISOString(),
          });
        });
    } catch (err) {
      next(err);
    }
  }

  static async getGenerationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { generationId } = req.params;
      const generation = await db.getGenerationById(generationId);

      if (!generation) {
        res.status(404).json({ error: `Generation '${generationId}' not found` });
        return;
      }

      res.json({ generation });
    } catch (err) {
      next(err);
    }
  }

  static async streamEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { generationId } = req.params;
      const generation = await db.getGenerationById(generationId);

      if (!generation) {
        res.status(404).json({ error: `Generation '${generationId}' not found` });
        return;
      }

      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      // Send initial connection event
      res.write(`data: ${JSON.stringify({ type: 'CONNECTED', generation })}\n\n`);

      const eventChannel = `generation:${generationId}`;
      const listener = (eventData: any) => {
        res.write(`data: ${JSON.stringify(eventData)}\n\n`);
      };

      generationEvents.on(eventChannel, listener);

      // Heartbeat every 15s to keep connection alive
      const heartbeat = setInterval(() => {
        res.write(': heartbeat\n\n');
      }, 15000);

      req.on('close', () => {
        clearInterval(heartbeat);
        generationEvents.off(eventChannel, listener);
        res.end();
      });
    } catch (err) {
      next(err);
    }
  }
}
