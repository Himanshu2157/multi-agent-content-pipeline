import { describe, it, expect } from 'vitest';
import { ResearchAgent } from '../src/agents/research/research.agent.js';
import { MockLLMProvider } from '../src/providers/llm/llm.provider.js';
import { MockResearchProvider } from '../src/providers/research/research.provider.js';
import { ResearchResultSchema } from '@contentforge/shared';

describe('ResearchAgent', () => {
  it('should successfully execute research and return schema-valid structured research', async () => {
    const mockLlm = new MockLLMProvider();
    const mockSearch = new MockResearchProvider();
    const agent = new ResearchAgent(mockLlm, mockSearch);

    const topic = 'Autonomous AI agent workflows in 2026';
    const result = await agent.execute(topic);

    // Validate result against Zod schema
    const validated = ResearchResultSchema.safeParse(result);
    expect(validated.success).toBe(true);

    if (validated.success) {
      expect(validated.data.topic).toBe(topic);
      expect(validated.data.summary.length).toBeGreaterThan(20);
      expect(validated.data.keyPoints.length).toBeGreaterThanOrEqual(2);
      expect(validated.data.facts.length).toBeGreaterThanOrEqual(1);
      expect(validated.data.sources.length).toBeGreaterThanOrEqual(1);

      // Verify that facts have confidence and sources
      for (const fact of validated.data.facts) {
        expect(fact.claim).toBeDefined();
        expect(fact.source).toBeDefined();
        expect(['high', 'medium', 'low']).toContain(fact.confidence);
      }

      // Verify source URLs are valid
      for (const src of validated.data.sources) {
        expect(src.url.startsWith('http')).toBe(true);
        expect(src.title.length).toBeGreaterThan(0);
      }
    }
  });

  it('should reject empty or whitespace topic', async () => {
    const agent = new ResearchAgent(new MockLLMProvider(), new MockResearchProvider());
    await expect(agent.execute('   ')).rejects.toThrow('Research Agent requires a valid non-empty topic.');
  });
});
