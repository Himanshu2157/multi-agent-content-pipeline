import { CriticReview, CriticReviewSchema } from '@contentforge/shared';
import { LLMProvider, createLLMProvider } from '../../providers/llm/llm.provider.js';
import { CRITIC_SYSTEM_PROMPT, buildCriticPrompt, CriticPromptInput } from './critic.prompt.js';

export class CriticAgent {
  private llmProvider: LLMProvider;

  constructor(llmProvider?: LLMProvider) {
    this.llmProvider = llmProvider || createLLMProvider();
  }

  async execute(input: CriticPromptInput): Promise<CriticReview> {
    const prompt = buildCriticPrompt(input);

    const rawReview = await this.llmProvider.generateStructured<CriticReview>(
      prompt,
      CriticReviewSchema,
      {
        systemPrompt: CRITIC_SYSTEM_PROMPT,
        temperature: 0.1, // Low temperature for consistent, strict evaluation
        maxRetries: 2,
      }
    );

    // Apply explicit quality and safety guardrails
    const hasHighSeverityIssue = rawReview.issues.some((i) => i.severity === 'high');
    const isFactualAccuracyInsufficient = rawReview.factualAccuracy < 80;
    const isPlatformFitInsufficient = rawReview.platformFit < 75;

    let finalApproved = rawReview.approved;
    if (hasHighSeverityIssue || isFactualAccuracyInsufficient || isPlatformFitInsufficient) {
      finalApproved = false;
    }

    let requiredChanges = [...rawReview.requiredChanges];
    if (!finalApproved && requiredChanges.length === 0) {
      if (rawReview.issues.length > 0) {
        requiredChanges = rawReview.issues.map(
          (iss) => `Address [${iss.severity}] ${iss.type}: ${iss.description}`
        );
      } else {
        requiredChanges = [
          'Improve factual grounding with direct source attributions and strengthen opening hooks.',
        ];
      }
    } else if (finalApproved) {
      // Approved content has completed refinement
      requiredChanges = [];
    }

    const finalized: CriticReview = {
      ...rawReview,
      approved: finalApproved,
      requiredChanges,
    };

    return CriticReviewSchema.parse(finalized);
  }
}
