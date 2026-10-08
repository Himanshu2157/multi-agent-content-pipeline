import { ContentStrategy, ContentStrategySchema } from '@contentforge/shared';
import { LLMProvider, createLLMProvider } from '../../providers/llm/llm.provider.js';
import {
  CONTENT_STRATEGIST_SYSTEM_PROMPT,
  buildContentStrategistPrompt,
  ContentStrategistInput,
} from './strategy.prompt.js';

export class ContentStrategistAgent {
  private llmProvider: LLMProvider;

  constructor(llmProvider?: LLMProvider) {
    this.llmProvider = llmProvider || createLLMProvider();
  }

  async execute(input: ContentStrategistInput): Promise<ContentStrategy> {
    if (!input.topic || input.topic.trim().length === 0) {
      throw new Error('Content Strategist requires a valid non-empty topic.');
    }

    const prompt = buildContentStrategistPrompt(input);

    const structuredStrategy = await this.llmProvider.generateStructured<ContentStrategy>(
      prompt,
      ContentStrategySchema,
      {
        systemPrompt: CONTENT_STRATEGIST_SYSTEM_PROMPT,
        temperature: 0.3, // Mild creativity for angles while retaining precision
        maxRetries: 2,
      }
    );

    return ContentStrategySchema.parse(structuredStrategy);
  }
}
