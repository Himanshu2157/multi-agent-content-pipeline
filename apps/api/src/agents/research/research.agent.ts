import { ResearchResult, ResearchResultSchema } from '@contentforge/shared';
import { LLMProvider, createLLMProvider } from '../../providers/llm/llm.provider.js';
import { ResearchProvider, createResearchProvider, SearchResult } from '../../providers/research/research.provider.js';
import { RESEARCH_SYSTEM_PROMPT, buildResearchPrompt } from './research.prompt.js';

export class ResearchAgent {
  private llmProvider: LLMProvider;
  private researchProvider: ResearchProvider;

  constructor(llmProvider?: LLMProvider, researchProvider?: ResearchProvider) {
    this.llmProvider = llmProvider || createLLMProvider();
    this.researchProvider = researchProvider || createResearchProvider();
  }

  async execute(topic: string): Promise<ResearchResult> {
    if (!topic || topic.trim().length === 0) {
      throw new Error('Research Agent requires a valid non-empty topic.');
    }

    const cleanedTopic = topic.trim();

    // 1. Gather web search results via the provider abstraction
    let searchResults: SearchResult[] = [];
    try {
      searchResults = await this.researchProvider.search(cleanedTopic);
    } catch (err: any) {
      console.warn(`[ResearchAgent] Search provider '${this.researchProvider.name}' encountered error: ${err.message}. Retrying or proceeding with topic context.`);
      searchResults = [];
    }

    // 2. Build structured research prompt
    const prompt = buildResearchPrompt(cleanedTopic, searchResults);

    // 3. Request structured synthesis from the LLM provider
    const structuredResearch = await this.llmProvider.generateStructured<ResearchResult>(
      prompt,
      ResearchResultSchema as any,
      {
        systemPrompt: RESEARCH_SYSTEM_PROMPT,
        temperature: 0.1, // Low temperature for high factual consistency
        maxRetries: 2,
      }
    );

    // 4. Validate output with Zod
    return ResearchResultSchema.parse(structuredResearch);
  }
}
