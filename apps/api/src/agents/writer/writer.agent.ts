import {
  Platform,
  WriterOutput,
  LinkedInOutputSchema,
  InstagramReelOutputSchema,
  LinkedInOutput,
  InstagramReelOutput,
} from '@contentforge/shared';
import { LLMProvider, createLLMProvider } from '../../providers/llm/llm.provider.js';
import { WRITER_SYSTEM_PROMPT, buildWriterPrompt, WriterPromptInput } from './writer.prompt.js';

export class WriterAgent {
  private llmProvider: LLMProvider;

  constructor(llmProvider?: LLMProvider) {
    this.llmProvider = llmProvider || createLLMProvider();
  }

  async execute(input: WriterPromptInput): Promise<WriterOutput> {
    const prompt = buildWriterPrompt(input);

    if (input.platform === 'LINKEDIN') {
      const output = await this.llmProvider.generateStructured<LinkedInOutput>(
        prompt,
        LinkedInOutputSchema,
        {
          systemPrompt: WRITER_SYSTEM_PROMPT,
          temperature: 0.6,
          maxRetries: 2,
        }
      );

      return LinkedInOutputSchema.parse(output);
    } else if (input.platform === 'INSTAGRAM_REEL') {
      const output = await this.llmProvider.generateStructured<InstagramReelOutput>(
        prompt,
        InstagramReelOutputSchema,
        {
          systemPrompt: WRITER_SYSTEM_PROMPT,
          temperature: 0.6,
          maxRetries: 2,
        }
      );

      return InstagramReelOutputSchema.parse(output);
    } else {
      throw new Error(`Unsupported platform for WriterAgent: ${(input as any).platform}`);
    }
  }
}
