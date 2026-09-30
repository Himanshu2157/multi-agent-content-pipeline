import { describe, it, expect } from 'vitest';
import { WriterAgent } from '../src/agents/writer/writer.agent.js';
import { MockLLMProvider } from '../src/providers/llm/llm.provider.js';
import {
  LinkedInOutputSchema,
  InstagramReelOutputSchema,
  ResearchResult,
} from '@contentforge/shared';

const mockResearch: ResearchResult = {
  topic: 'Autonomous Multi-Agent AI Systems',
  summary: 'Research demonstrating how multi-agent self-correcting pipelines reduce prompt friction and hallucinations.',
  keyPoints: [
    'Autonomous agents reduce prompt fatigue by 73% (MIT Tech Review).',
    'Iteration cycles are reduced by 62% in enterprise deployments (Gartner 2025).',
    'Hallucination rates fall by up to 88% with adversarial quality critique (Stanford AI Index).',
  ],
  facts: [
    {
      claim: 'Organizations deploying autonomous workflows reduced cycle time by 62%.',
      source: 'Gartner Research (2025)',
      confidence: 'high',
    },
    {
      claim: '73% of creators report prompt fatigue as their primary productivity hurdle.',
      source: 'MIT Technology Review',
      confidence: 'high',
    },
  ],
  sources: [
    {
      title: 'State of Agentic Workflows 2026',
      url: 'https://gartner.com/agentic-ai-2026',
      publisher: 'Gartner',
    },
  ],
  cautions: ['Requires quality review guardrails to prevent ungrounded claims.'],
};

describe('WriterAgent', () => {
  it('should generate 4-5 multi-angle posts for LinkedIn', async () => {
    const mockLlm = new MockLLMProvider();
    const writer = new WriterAgent(mockLlm);

    const result = await writer.execute({
      topic: 'Autonomous Multi-Agent AI Systems',
      platform: 'LINKEDIN',
      tone: 'Thought-provoking',
      audience: 'Engineers & Leaders',
      research: mockResearch,
      previousDraft: null,
      criticFeedback: null,
      iteration: 1,
    });

    const parsed = LinkedInOutputSchema.safeParse(result);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data.posts.length).toBeGreaterThanOrEqual(4);
      expect(parsed.data.posts.length).toBeLessThanOrEqual(5);

      const angles = parsed.data.posts.map((p) => p.angle);
      // Verify posts have distinct angles
      const uniqueAngles = new Set(angles);
      expect(uniqueAngles.size).toBe(angles.length);

      for (const post of parsed.data.posts) {
        expect(post.hook.length).toBeGreaterThan(10);
        expect(post.body.length).toBeGreaterThan(20);
        expect(post.cta).toBeDefined();
      }
    }
  });

  it('should generate a complete structured short-form video script for Instagram Reel', async () => {
    const mockLlm = new MockLLMProvider();
    const writer = new WriterAgent(mockLlm);

    const result = await writer.execute({
      topic: 'Autonomous Multi-Agent AI Systems',
      platform: 'INSTAGRAM_REEL',
      tone: 'Energetic',
      audience: 'Tech creators',
      research: mockResearch,
      previousDraft: null,
      criticFeedback: null,
      iteration: 1,
    });

    const parsed = InstagramReelOutputSchema.safeParse(result);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data.title.length).toBeGreaterThan(5);
      expect(parsed.data.estimatedDuration).toBeDefined();
      expect(parsed.data.hook.length).toBeGreaterThan(10);
      expect(parsed.data.sections.length).toBeGreaterThanOrEqual(3);

      for (const section of parsed.data.sections) {
        expect(section.timestamp).toBeDefined();
        expect(section.visual.length).toBeGreaterThan(3);
        expect(section.voiceover.length).toBeGreaterThan(3);
        expect(section.onScreenText.length).toBeGreaterThan(1);
      }
    }
  });

  it('should accept critic feedback during revision iterations without crashing', async () => {
    const mockLlm = new MockLLMProvider();
    const writer = new WriterAgent(mockLlm);

    const previousDraft = await writer.execute({
      topic: 'Autonomous Multi-Agent AI Systems',
      platform: 'LINKEDIN',
      research: mockResearch,
      iteration: 1,
    });

    const revisedDraft = await writer.execute({
      topic: 'Autonomous Multi-Agent AI Systems',
      platform: 'LINKEDIN',
      research: mockResearch,
      previousDraft,
      criticFeedback: {
        approved: false,
        score: 72,
        factualAccuracy: 80,
        relevance: 90,
        platformFit: 85,
        clarity: 80,
        originality: 75,
        issues: [
          {
            type: 'missing_attribution',
            severity: 'medium',
            description: 'Post 2 needs direct attribution to Gartner Research.',
          },
        ],
        requiredChanges: ['Attribute the 62% metric to Gartner.'],
      },
      iteration: 2,
    });

    const parsed = LinkedInOutputSchema.safeParse(revisedDraft);
    expect(parsed.success).toBe(true);
  });
});
