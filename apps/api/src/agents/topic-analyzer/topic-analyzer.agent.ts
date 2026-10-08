import { TopicAnalysis, TopicAnalysisSchema } from '@contentforge/shared';
import { LLMProvider, createLLMProvider } from '../../providers/llm/llm.provider.js';
import {
  TOPIC_ANALYZER_SYSTEM_PROMPT,
  buildTopicAnalyzerPrompt,
  TopicAnalyzerInput,
} from './topic-analyzer.prompt.js';

export class TopicAnalyzerAgent {
  private llmProvider: LLMProvider;

  constructor(llmProvider?: LLMProvider) {
    this.llmProvider = llmProvider || createLLMProvider();
  }

  async execute(input: TopicAnalyzerInput): Promise<TopicAnalysis> {
    if (!input.topic || input.topic.trim().length === 0) {
      throw new Error('Topic Analyzer requires a valid non-empty topic.');
    }

    const prompt = buildTopicAnalyzerPrompt(input);

    const structuredAnalysis = await this.llmProvider.generateStructured<TopicAnalysis>(
      prompt,
      TopicAnalysisSchema,
      {
        systemPrompt: TOPIC_ANALYZER_SYSTEM_PROMPT,
        temperature: 0.1, // Deterministic for consistent semantic analysis
        maxRetries: 2,
      }
    );

    return TopicAnalysisSchema.parse(structuredAnalysis);
  }
}
