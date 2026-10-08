import { ResearchResult, ResearchResultSchema, TopicAnalysis } from '@contentforge/shared';
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

  async execute(topic: string, topicAnalysis?: TopicAnalysis): Promise<ResearchResult> {
    if (!topic || topic.trim().length === 0) {
      throw new Error('Research Agent requires a valid non-empty topic.');
    }

    const searchQuery = (topicAnalysis?.normalizedTopic || topic).trim();

    // 1. Gather web search results via provider abstraction
    let searchResults: SearchResult[] = [];
    try {
      searchResults = await this.researchProvider.search(searchQuery);
    } catch (err: any) {
      console.warn(
        `[ResearchAgent] Search provider '${this.researchProvider.name}' error: ${err.message}. Proceeding with canonical topic knowledge.`
      );
      searchResults = [];
    }

    // 2. Build structured research prompt
    const prompt = buildResearchPrompt(topic.trim(), searchResults, topicAnalysis);

    // 3. Request structured synthesis from LLM provider
    const structuredResearch = await this.llmProvider.generateStructured<ResearchResult>(
      prompt,
      ResearchResultSchema as any,
      {
        systemPrompt: RESEARCH_SYSTEM_PROMPT,
        temperature: 0.1, // High factual consistency
        maxRetries: 2,
      }
    );

    return ResearchResultSchema.parse(structuredResearch);
  }
}
