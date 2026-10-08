import { describe, it, expect } from 'vitest';
import { ContentStrategistAgent } from '../src/agents/strategy/strategy.agent.js';
import { MockLLMProvider } from '../src/providers/llm/llm.provider.js';
import { ContentStrategySchema, ResearchResult, TopicAnalysis } from '@contentforge/shared';

const mockTopicAnalysis: TopicAnalysis = {
  normalizedTopic: 'Why Data Structures Are Essential in Software Engineering',
  coreSubject: 'Data Structures and Algorithm Performance',
  userIntent: 'Explain why data structures matter for software engineers',
  contentGoal: 'Create compelling technical LinkedIn content',
  allowedSubtopics: ['arrays', 'hash tables', 'trees', 'time complexity'],
  forbiddenTopicDrift: ['AI agents', 'ContentForge'],
};

const mockResearch: ResearchResult = {
  topic: 'Why Data Structures Are Essential in Software Engineering',
  summary: 'Data structures define how data is organized in computer memory to optimize access time and compute efficiency.',
  keyPoints: [
    'Choosing the right structure determines algorithmic time and space complexity.',
    'Hash tables provide O(1) average lookup times.',
  ],
  facts: [
    {
      claim: 'Hash table lookups average O(1) time complexity compared to O(n) for linear search.',
      source: 'Introduction to Algorithms (CLRS)',
      confidence: 'high',
    },
  ],
  sources: [
    {
      title: 'MIT 6.006 Algorithms & Data Structures',
      url: 'https://ocw.mit.edu/courses/6-006',
    },
  ],
  cautions: ['Avoid premature optimization on tiny datasets.'],
};

describe('ContentStrategistAgent', () => {
  it('should formulate structured editorial strategy with diverse angles', async () => {
    const mockLlm = new MockLLMProvider();
    const agent = new ContentStrategistAgent(mockLlm);

    const result = await agent.execute({
      topic: 'Why is data structure important?',
      platform: 'LINKEDIN',
      tone: 'Professional',
      audience: 'Engineers',
      topicAnalysis: mockTopicAnalysis,
      research: mockResearch,
    });

    const validated = ContentStrategySchema.safeParse(result);
    expect(validated.success).toBe(true);

    if (validated.success) {
      expect(validated.data.angles.length).toBeGreaterThanOrEqual(3);
      expect(validated.data.angles.length).toBeLessThanOrEqual(5);

      const angleNames = validated.data.angles.map((a) => a.name);
      expect(new Set(angleNames).size).toBe(angleNames.length);

      for (const angle of validated.data.angles) {
        expect(angle.hookIdea.length).toBeGreaterThan(5);
        expect(angle.targetTakeaway.length).toBeGreaterThan(5);
      }
    }
  });
});
