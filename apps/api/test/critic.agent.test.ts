import { describe, it, expect } from 'vitest';
import { CriticAgent } from '../src/agents/critic/critic.agent.js';
import { MockLLMProvider } from '../src/providers/llm/llm.provider.js';
import {
  CriticReviewSchema,
  ResearchResult,
  WriterOutput,
} from '@contentforge/shared';

const mockResearch: ResearchResult = {
  topic: 'Autonomous Multi-Agent AI Systems',
  summary: 'Analysis of autonomous agent architectures for reliable content generation.',
  keyPoints: [
    'Autonomous agents reduce prompt fatigue by 73%.',
    'Iteration cycles drop 62% (Gartner 2025).',
  ],
  facts: [
    {
      claim: 'Organizations deploying autonomous workflows reduced cycle time by 62%.',
      source: 'Gartner Research (2025)',
      confidence: 'high',
    },
  ],
  sources: [
    {
      title: 'State of Agentic AI 2026',
      url: 'https://gartner.com/agentic-ai-2026',
    },
  ],
  cautions: [],
};

const mockDraft: WriterOutput = {
  posts: [
    {
      id: 'post_1',
      angle: 'Educational',
      hook: 'Prompt engineering is dying.',
      body: 'Autonomous agents can now research, write, and critique themselves with zero human intervention.',
      cta: 'What do you think?',
    },
    {
      id: 'post_2',
      angle: 'Contrarian',
      hook: 'Stop prompt-engineering.',
      body: 'Multi-agent loops achieve 62% faster cycle times.',
      cta: 'Follow for more.',
    },
    {
      id: 'post_3',
      angle: 'Data/insight driven',
      hook: '73% of creators have prompt fatigue.',
      body: 'MIT research shows prompt fatigue is real.',
      cta: 'Discuss below.',
    },
  ],
};

describe('CriticAgent', () => {
  it('should evaluate draft on iteration 1 and return constructive rejection review', async () => {
    const mockLlm = new MockLLMProvider();
    const critic = new CriticAgent(mockLlm);

    const review = await critic.execute({
      topic: 'Autonomous Multi-Agent AI Systems',
      platform: 'LINKEDIN',
      research: mockResearch,
      draft: mockDraft,
      iteration: 1,
    });

    const parsed = CriticReviewSchema.safeParse(review);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data.approved).toBe(false);
      expect(parsed.data.score).toBeGreaterThan(0);
      expect(parsed.data.score).toBeLessThan(90);
      expect(parsed.data.issues.length).toBeGreaterThan(0);
      expect(parsed.data.requiredChanges.length).toBeGreaterThan(0);
      expect(parsed.data.factualAccuracy).toBeGreaterThan(0);
      expect(parsed.data.platformFit).toBeGreaterThan(0);
    }
  });

  it('should approve content on iteration 2', async () => {
    const mockLlm = new MockLLMProvider();
    const critic = new CriticAgent(mockLlm);

    const review = await critic.execute({
      topic: 'Autonomous Multi-Agent AI Systems',
      platform: 'LINKEDIN',
      research: mockResearch,
      draft: mockDraft,
      iteration: 2,
    });

    const parsed = CriticReviewSchema.safeParse(review);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data.approved).toBe(true);
      expect(parsed.data.score).toBeGreaterThanOrEqual(90);
      expect(parsed.data.requiredChanges.length).toBe(0);
    }
  });

  it('should enforce that high severity issues disqualify approval', async () => {
    // Custom LLM mock that returns approved: true but contains a high severity issue
    const mockRogueLlm = {
      name: 'rogue-mock',
      generateStructured: async () => ({
        approved: true,
        score: 85,
        factualAccuracy: 60, // Low accuracy
        relevance: 90,
        platformFit: 85,
        clarity: 80,
        originality: 80,
        issues: [
          {
            type: 'hallucinated_statistic',
            severity: 'high',
            description: 'Post claims 99% accuracy which is completely unverified in research.',
          },
        ],
        requiredChanges: [],
      }),
    };

    const critic = new CriticAgent(mockRogueLlm as any);
    const review = await critic.execute({
      topic: 'Autonomous Multi-Agent AI Systems',
      platform: 'LINKEDIN',
      research: mockResearch,
      draft: mockDraft,
      iteration: 2,
    });

    expect(review.approved).toBe(false);
    expect(review.requiredChanges.length).toBeGreaterThan(0);
  });
});
