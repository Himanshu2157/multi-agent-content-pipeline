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
      category: 'Educational',
      angle: 'Educational',
      hook: 'Prompt engineering is shifting toward closed-loop autonomous execution.',
      body: 'Autonomous multi-agent architectures decouple research, synthesis, and verification across specialized worker nodes to ensure domain fidelity.',
      cta: 'How does your engineering team approach multi-agent workflows?',
    },
    {
      id: 'post_2',
      category: 'Contrarian / Question-Driven',
      angle: 'Contrarian',
      hook: 'Single-prompt generation will not solve complex domain tasks.',
      body: 'Iterative feedback loops with deterministic validation outperform single-shot generation by systematically catching logic flaws.',
      cta: 'Do you rely on single prompts or agentic feedback loops?',
    },
    {
      id: 'post_3',
      category: 'Insight-Driven',
      angle: 'Data/insight driven',
      hook: 'Multi-agent orchestration significantly reduces context pollution.',
      body: 'By isolating state across specialized subagents, memory footprints remain compact while reasoning depth stays high across long horizons.',
      cta: 'Share your perspective in the comments below.',
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

  it('should reject unrelated draft due to semantic misalignment (even on iteration 2)', async () => {
    const mockLlm = new MockLLMProvider();
    const critic = new CriticAgent(mockLlm);

    const sourdoughResearch: ResearchResult = {
      topic: 'Microbial Ecology of Sourdough Fermentation',
      centralSubject: 'Food Microbiology and Biochemistry of Fermentation',
      subtopics: [
        'symbiotic balance between Candida humilis and Lactobacillus sanfranciscensis',
        'maltose co-metabolism and glucose competition',
        'lactic vs acetic acid production ratios',
      ],
      summary: 'Sourdough fermentation relies on a stable microbial mutualism between wild yeast and lactic acid bacteria.',
      keyPoints: [
        'Candida humilis wild yeast cannot metabolize maltose.',
        'Lactobacillus sanfranciscensis consumes maltose and excretes glucose.',
      ],
      facts: [],
      sources: [],
      cautions: [],
    };

    // Submitting a draft about AI prompt engineering / multi-agent systems for sourdough fermentation!
    const review = await critic.execute({
      topic: 'Microbial Ecology of Sourdough Fermentation',
      platform: 'LINKEDIN',
      research: sourdoughResearch,
      draft: mockDraft,
      iteration: 2,
    });

    expect(review.approved).toBe(false);
    expect(review.score).toBeLessThanOrEqual(50);
    expect(review.topicFidelity).toBeLessThanOrEqual(35);
    expect(review.issues.some((i) => i.type === 'semantic_misalignment')).toBe(true);
    expect(review.requiredChanges.length).toBeGreaterThan(0);

    // Verify post reviews caught the semantic misalignment
    expect(review.postReviews).toBeDefined();
    for (const pr of review.postReviews!) {
      expect(pr.approved).toBe(false);
      expect(pr.issues.some((i) => i.problem.includes('Semantic Misalignment'))).toBe(true);
    }
  });

  it('should reject non-software draft containing forced software jargon due to cross-domain contamination', async () => {
    const mockLlm = new MockLLMProvider();
    const critic = new CriticAgent(mockLlm);

    const sourdoughResearch: ResearchResult = {
      topic: 'Microbial Ecology of Sourdough Fermentation',
      centralSubject: 'Food Microbiology and Biochemistry of Fermentation',
      subtopics: [
        'symbiotic balance between Candida humilis and Lactobacillus sanfranciscensis',
        'maltose co-metabolism and glucose competition',
      ],
      summary: 'Sourdough fermentation dynamics and microbiology.',
      keyPoints: ['Candida humilis', 'Lactobacillus sanfranciscensis'],
      facts: [],
      sources: [],
      cautions: [],
    };

    const contaminatedDraft: WriterOutput = {
      posts: [
        {
          id: 'post_1',
          category: 'Educational',
          angle: 'Educational',
          hook: 'Sourdough fermentation balances Candida humilis and Lactobacillus sanfranciscensis.',
          body: 'To prevent fermentation outages in your bakery, isolate each yeast colony in an independent microservice managed by a kubernetes pod with automated database index lookups.',
          cta: 'How does your bakery handle microservice clustering for sourdough?',
        },
      ],
    };

    const review = await critic.execute({
      topic: 'Microbial Ecology of Sourdough Fermentation',
      platform: 'LINKEDIN',
      research: sourdoughResearch,
      draft: contaminatedDraft,
      iteration: 2,
    });

    expect(review.approved).toBe(false);
    expect(review.score).toBeLessThanOrEqual(50);
    expect(review.issues.some((i) => i.type === 'cross_domain_contamination')).toBe(true);
    expect(review.postReviews).toBeDefined();
    expect(review.postReviews![0].approved).toBe(false);
    expect(review.postReviews![0].issues.some((i) => i.problem.includes('Cross-Domain Contamination'))).toBe(true);
  });

  it('programmatic guardrail should override rogue LLM that approved unrelated content', async () => {
    // Rogue LLM returns 100% approval and high scores despite draft having zero topic overlap
    const mockRogueLlm = {
      name: 'rogue-mock-approver',
      generateStructured: async () => ({
        approved: true,
        score: 98,
        topicFidelity: 98,
        toneMatch: 95,
        factualAccuracy: 98,
        relevance: 95,
        platformFit: 95,
        clarity: 95,
        originality: 95,
        usefulness: 95,
        noFabricatedExperience: true,
        noFabricatedStatistics: true,
        issues: [],
        requiredChanges: [],
        postReviews: [
          {
            postId: 'post_1',
            category: 'Educational',
            approved: true,
            scores: { relevance: 98, depth: 95, accuracy: 98, readability: 95, categoryMatch: 95, originality: 95, total: 96 },
            issues: [],
            requiredChanges: [],
          },
        ],
      }),
    };

    const critic = new CriticAgent(mockRogueLlm as any);
    const review = await critic.execute({
      topic: 'Microbial Ecology of Sourdough Fermentation',
      platform: 'LINKEDIN',
      research: {
        topic: 'Microbial Ecology of Sourdough Fermentation',
        centralSubject: 'Fermentation Microbiology',
        subtopics: ['maltose', 'lactobacillus', 'candida'],
        summary: 'Microbiology summary',
        keyPoints: ['Lactobacillus sanfranciscensis', 'Candida humilis'],
        facts: [],
        sources: [],
        cautions: [],
      },
      draft: mockDraft, // Contains AI multi-agent content
      iteration: 2,
    });

    // CriticAgent must programmatically catch the zero overlap and reject it
    expect(review.approved).toBe(false);
    expect(review.score).toBeLessThanOrEqual(45);
    expect(review.topicFidelity).toBeLessThanOrEqual(35);
    expect(review.issues.some((i) => i.type === 'semantic_misalignment')).toBe(true);
    expect(review.postReviews![0].approved).toBe(false);
  });
});
