import { describe, it, expect, beforeEach } from 'vitest';
import { ContentGenerationGraph } from '../src/agents/graph/content.graph.js';
import { MockLLMProvider } from '../src/providers/llm/llm.provider.js';
import { MockResearchProvider } from '../src/providers/research/research.provider.js';
import { db } from '../src/services/database.service.js';

describe('ContentGenerationGraph (End-to-End Pipeline)', () => {
  let project: any;

  beforeEach(async () => {
    project = await db.createProject({
      topic: 'Autonomous Multi-Agent AI Content Systems',
      platform: 'LINKEDIN',
      tone: 'Thought-provoking',
      audience: 'Engineers & Tech Leaders',
      maxIterations: 3,
      userId: 'dev-user-default',
    });
  });

  it('Case 2: Critic rejects iteration 1 then approves iteration 2', async () => {
    const generation = await db.createGeneration(project.id);
    const graph = new ContentGenerationGraph(new MockLLMProvider(), new MockResearchProvider());

    const finalState = await graph.run({
      projectId: project.id,
      generationId: generation.id,
      topic: project.topic,
      platform: project.platform,
      tone: project.tone,
      audience: project.audience,
      maxIterations: 3,
    });

    expect(finalState.status).toBe('COMPLETED');
    expect(finalState.approved).toBe(true);
    expect(finalState.iteration).toBe(2);
    expect(finalState.research).toBeDefined();
    expect(finalState.draft).toBeDefined();
    expect(finalState.criticReview?.approved).toBe(true);

    // Verify database persistence
    const savedGen = await db.getGenerationById(generation.id);
    expect(savedGen?.status).toBe('COMPLETED');
    expect(savedGen?.approved).toBe(true);
    expect(savedGen?.currentIteration).toBe(2);
    expect(savedGen?.drafts?.length).toBe(2);
    expect(savedGen?.criticReviews?.length).toBe(2);
    expect(savedGen?.agentExecutions?.length).toBe(7); // 1 topic analyzer + 1 research + 1 strategist + 2 writer + 2 critic
    expect(savedGen?.topicAnalysis).toBeDefined();
    expect(savedGen?.strategy).toBeDefined();
  });

  it('Case 1: Critic approves on first iteration when content meets bar', async () => {
    const alwaysApproveLlm = {
      name: 'always-approve-mock',
      generateStructured: async (_prompt: string, _schema: any, options: any) => {
        const sys = (options?.systemPrompt || '').toLowerCase();
        if (sys.includes('quality reviewer')) {
          return {
            approved: true,
            score: 95,
            factualAccuracy: 95,
            relevance: 95,
            platformFit: 95,
            clarity: 95,
            originality: 95,
            issues: [],
            requiredChanges: [],
          };
        }
        // Fall back to standard mock for research & writer
        const fallback = new MockLLMProvider();
        return fallback.generateStructured(_prompt, _schema, options);
      },
    };

    const generation = await db.createGeneration(project.id);
    const graph = new ContentGenerationGraph(alwaysApproveLlm as any, new MockResearchProvider());

    const finalState = await graph.run({
      projectId: project.id,
      generationId: generation.id,
      topic: project.topic,
      platform: project.platform,
      maxIterations: 3,
    });

    expect(finalState.status).toBe('COMPLETED');
    expect(finalState.approved).toBe(true);
    expect(finalState.iteration).toBe(1);

    const savedGen = await db.getGenerationById(generation.id);
    expect(savedGen?.drafts?.length).toBe(1);
    expect(savedGen?.criticReviews?.length).toBe(1);
  });

  it('Case 3: Critic rejects until maximum iteration, returns best available draft with approved=false', async () => {
    const alwaysRejectLlm = {
      name: 'always-reject-mock',
      generateStructured: async (_prompt: string, _schema: any, options: any) => {
        const sys = (options?.systemPrompt || '').toLowerCase();
        if (sys.includes('quality reviewer')) {
          return {
            approved: false,
            score: 65,
            factualAccuracy: 70,
            relevance: 80,
            platformFit: 70,
            clarity: 70,
            originality: 65,
            issues: [
              {
                type: 'unverified_claim',
                severity: 'medium',
                description: 'Need better source citation.',
              },
            ],
            requiredChanges: ['Provide clearer citations.'],
          };
        }
        const fallback = new MockLLMProvider();
        return fallback.generateStructured(_prompt, _schema, options);
      },
    };

    const generation = await db.createGeneration(project.id);
    const graph = new ContentGenerationGraph(alwaysRejectLlm as any, new MockResearchProvider());

    const finalState = await graph.run({
      projectId: project.id,
      generationId: generation.id,
      topic: project.topic,
      platform: project.platform,
      maxIterations: 2, // Max 2 iterations
    });

    expect(finalState.status).toBe('COMPLETED');
    expect(finalState.approved).toBe(false); // Clearly marked unapproved!
    expect(finalState.iteration).toBe(2);
    expect(finalState.draft).toBeDefined();

    const savedGen = await db.getGenerationById(generation.id);
    expect(savedGen?.approved).toBe(false);
    expect(savedGen?.currentIteration).toBe(2);
    expect(savedGen?.drafts?.length).toBe(2);
  });

  it('Case 10: Maximum iteration = 1', async () => {
    const generation = await db.createGeneration(project.id);
    const graph = new ContentGenerationGraph(new MockLLMProvider(), new MockResearchProvider());

    const finalState = await graph.run({
      projectId: project.id,
      generationId: generation.id,
      topic: project.topic,
      platform: project.platform,
      maxIterations: 1,
    });

    expect(finalState.status).toBe('COMPLETED');
    expect(finalState.iteration).toBe(1);
    expect(finalState.draft).toBeDefined();
  });

  it('Case 8: Fails gracefully on unsupported platform', async () => {
    const generation = await db.createGeneration(project.id);
    const graph = new ContentGenerationGraph(new MockLLMProvider(), new MockResearchProvider());

    await expect(
      graph.run({
        projectId: project.id,
        generationId: generation.id,
        topic: project.topic,
        platform: 'UNSUPPORTED_XYZ' as any,
        maxIterations: 1,
      })
    ).rejects.toThrow();

    const savedGen = await db.getGenerationById(generation.id);
    expect(savedGen?.status).toBe('FAILED');
  });

  it('Case 6: Fails gracefully if Research provider fails completely', async () => {
    const failingSearchProvider = {
      name: 'failing-search',
      search: async () => {
        throw new Error('Search network failure 503');
      },
    };

    const generation = await db.createGeneration(project.id);
    // When search provider encounters error, research agent catches and attempts topic-based synthesis or bubbles up
    const graph = new ContentGenerationGraph(new MockLLMProvider(), failingSearchProvider as any);

    // It should proceed using fallback or handle it gracefully
    const finalState = await graph.run({
      projectId: project.id,
      generationId: generation.id,
      topic: project.topic,
      platform: 'LINKEDIN',
      maxIterations: 2,
    });

    expect(finalState.status).toBe('COMPLETED');
  });
});
