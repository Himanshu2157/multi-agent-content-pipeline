import { describe, it, expect } from 'vitest';
import { TopicAnalyzerAgent } from '../src/agents/topic-analyzer/topic-analyzer.agent.js';
import { MockLLMProvider } from '../src/providers/llm/llm.provider.js';
import { TopicAnalysisSchema } from '@contentforge/shared';

describe('TopicAnalyzerAgent', () => {
  it('should analyze topic and return schema-valid normalized analysis with drift guardrails', async () => {
    const mockLlm = new MockLLMProvider();
    const agent = new TopicAnalyzerAgent(mockLlm);

    const result = await agent.execute({
      topic: 'Why is data structure important?',
      platform: 'LINKEDIN',
      tone: 'Professional',
      audience: 'Software engineers',
    });

    const validated = TopicAnalysisSchema.safeParse(result);
    expect(validated.success).toBe(true);

    if (validated.success) {
      expect(validated.data.coreSubject.toLowerCase()).toContain('data structure');
      expect(validated.data.allowedSubtopics.length).toBeGreaterThanOrEqual(3);
      expect(validated.data.forbiddenTopicDrift.length).toBeGreaterThanOrEqual(2);
      expect(validated.data.forbiddenTopicDrift).toContain('AI agents');
      expect(validated.data.forbiddenTopicDrift).toContain('ContentForge');
    }
  });

  it('should reject empty or whitespace topic', async () => {
    const agent = new TopicAnalyzerAgent(new MockLLMProvider());
    await expect(
      agent.execute({ topic: '   ', platform: 'LINKEDIN' })
    ).rejects.toThrow('Topic Analyzer requires a valid non-empty topic.');
  });
});
