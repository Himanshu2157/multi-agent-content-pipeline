import { describe, it, expect } from 'vitest';
import { ContentGenerationGraph } from '../src/agents/graph/content.graph.js';
import { CriticAgent } from '../src/agents/critic/critic.agent.js';
import { MockLLMProvider } from '../src/providers/llm/llm.provider.js';
import { MockResearchProvider } from '../src/providers/research/research.provider.js';
import { db } from '../src/services/database.service.js';
import { LinkedInOutput } from '@contentforge/shared';

describe('Critical Topic Fidelity & Quality Tests', () => {
  const testTopics = [
    {
      name: 'TEST 1: Data Structures',
      topic: 'Why is data structure important?',
      keywords: ['data structure', 'memory', 'array', 'hash', 'complexity', 'o(1)'],
      forbidden: ['ai agent', 'prompt fatigue', 'contentforge', 'critic agent', '73% of creators', '62% cycle time'],
    },
    {
      name: 'TEST 2: Recursion',
      topic: 'What is recursion and why is it difficult for beginners?',
      keywords: ['recursion', 'call stack', 'base case', 'stack frame', 'function'],
      forbidden: ['ai agent', 'prompt fatigue', 'contentforge', 'critic agent', '73% of creators', '62% cycle time'],
    },
    {
      name: 'TEST 3: Git',
      topic: 'Why should developers learn Git?',
      keywords: ['git', 'version control', 'commit', 'branch', 'repository'],
      forbidden: ['ai agent', 'prompt fatigue', 'contentforge', 'critic agent', '73% of creators', '62% cycle time'],
    },
    {
      name: 'TEST 4: CPU Instruction Execution',
      topic: 'How does a CPU execute an instruction?',
      keywords: ['cpu', 'instruction', 'fetch', 'decode', 'execute', 'register'],
      forbidden: ['ai agent', 'prompt fatigue', 'contentforge', 'critic agent', '73% of creators', '62% cycle time'],
    },
    {
      name: 'TEST 5: Sleep and Productivity',
      topic: 'Why is sleep important for productivity?',
      keywords: ['sleep', 'cognitive', 'glymphatic', 'memory', 'adenosine', 'brain'],
      forbidden: ['ai agent', 'prompt fatigue', 'contentforge', 'critic agent', '73% of creators', '62% cycle time'],
    },
  ];

  for (const t of testTopics) {
    it(`should generate 100% topic-faithful content for: "${t.topic}"`, async () => {
      const project = await db.createProject({
        topic: t.topic,
        platform: 'LINKEDIN',
        tone: 'Professional & natural',
        audience: 'Software engineers & professionals',
        maxIterations: 2,
        userId: 'dev-user-default',
      });

      const generation = await db.createGeneration(project.id);
      const graph = new ContentGenerationGraph(new MockLLMProvider(), new MockResearchProvider());

      const finalState = await graph.run({
        projectId: project.id,
        generationId: generation.id,
        topic: t.topic,
        platform: 'LINKEDIN',
        maxIterations: 2,
      });

      expect(finalState.status).toBe('COMPLETED');
      expect(finalState.approved).toBe(true);

      // Verify Topic Analyzer output
      expect(finalState.topicAnalysis).toBeDefined();
      expect(finalState.topicAnalysis?.forbiddenTopicDrift).toContain('AI agents');
      expect(finalState.topicAnalysis?.forbiddenTopicDrift).toContain('ContentForge');

      // Verify Content Strategy output
      expect(finalState.strategy).toBeDefined();
      expect(finalState.strategy?.angles.length).toBeGreaterThanOrEqual(4);

      // Verify Research output
      expect(finalState.research).toBeDefined();
      expect(finalState.research?.facts.length).toBeGreaterThanOrEqual(1);

      // Verify Writer output (LinkedIn posts)
      const draft = finalState.draft as LinkedInOutput;
      expect(draft.posts.length).toBeGreaterThanOrEqual(4);
      expect(draft.posts.length).toBeLessThanOrEqual(5);

      const allText = draft.posts.map((p) => `${p.hook} ${p.body} ${p.cta || ''}`).join('\n').toLowerCase();

      // Verify that all posts discuss the user's actual topic
      const foundTopicKeyword = t.keywords.some((kw) => allText.includes(kw));
      expect(foundTopicKeyword).toBe(true);

      // CRITICAL CHECK: Absolutely 0 forbidden drift keywords
      for (const forbiddenWord of t.forbidden) {
        expect(allText).not.toContain(forbiddenWord);
      }

      // CRITICAL CHECK: No internal template tags in posts
      expect(allText).not.toContain('[scroll-stopping hook]');
      expect(allText).not.toContain('[main idea]');
      expect(allText).not.toContain('[cta]');

      // Verify Critic evaluation
      expect(finalState.criticReview).toBeDefined();
      expect(finalState.criticReview?.topicFidelity).toBeGreaterThanOrEqual(90);
      expect(finalState.criticReview?.noFabricatedStatistics).toBe(true);
      expect(finalState.criticReview?.noFabricatedExperience).toBe(true);
    });
  }

  it('Critic Agent MUST REJECT drafts that drift into AI agents or ContentForge', async () => {
    const critic = new CriticAgent(new MockLLMProvider());

    // Draft that drifts into AI agents when topic is Data Structures
    const driftedDraft: LinkedInOutput = {
      posts: [
        {
          id: 'post_1',
          angle: 'Educational',
          hook: 'AI agents are changing software development.',
          body: 'ContentForge uses multi-agent pipelines to solve prompt fatigue and automate workflows.',
          cta: 'Check out autonomous agents today!',
        },
        {
          id: 'post_2',
          angle: 'Contrarian',
          hook: 'Prompt fatigue is real.',
          body: '73% of creators suffer from prompt fatigue according to our survey on ContentForge.',
          cta: 'Try agents now.',
        },
        {
          id: 'post_3',
          angle: 'Practical',
          hook: 'How to build AI agents.',
          body: 'Step 1: Set up a Critic Agent to evaluate prompts.',
          cta: 'Read more.',
        },
        {
          id: 'post_4',
          angle: 'Data',
          hook: '62% cycle time reduction.',
          body: 'Autonomous pipelines cut iteration time in half.',
          cta: 'Discuss.',
        },
      ],
    };

    const review = await critic.execute({
      topic: 'Why is data structure important?',
      platform: 'LINKEDIN',
      topicAnalysis: {
        normalizedTopic: 'Why Data Structures Are Essential in Software Engineering',
        coreSubject: 'Data Structures and Algorithm Performance',
        userIntent: 'Explain why data structures matter',
        contentGoal: 'Deliver clear data structures content',
        allowedSubtopics: ['arrays', 'hash tables'],
        forbiddenTopicDrift: ['AI agents', 'ContentForge', 'prompt fatigue'],
      },
      research: {
        topic: 'Why is data structure important?',
        summary: 'Data structures organize memory for efficient computation.',
        keyPoints: ['Big-O complexity', 'Hash tables'],
        facts: [{ claim: 'Hash tables average O(1) lookups', source: 'CLRS', confidence: 'high' }],
        sources: [{ title: 'Algorithms', url: 'https://ocw.mit.edu' }],
        cautions: [],
      },
      draft: driftedDraft,
      iteration: 1,
    });

    // The Critic MUST REJECT the drifted draft!
    expect(review.approved).toBe(false);
    expect(review.topicFidelity).toBeLessThan(90);
    expect(review.issues.some((i) => i.type === 'topic_drift')).toBe(true);
  });
});
