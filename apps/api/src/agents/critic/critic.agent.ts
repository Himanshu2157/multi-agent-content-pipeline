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
        temperature: 0.1, // Strict, deterministic grading
        maxRetries: 2,
      }
    );

    // Apply strict quality and fidelity guardrails
    const hasHighSeverityIssue = rawReview.issues.some((i) => i.severity === 'high');
    const isTopicFidelityInsufficient = rawReview.topicFidelity < 90;
    const isFactualAccuracyInsufficient = rawReview.factualAccuracy < 80;
    const isPlatformFitInsufficient = rawReview.platformFit < 75;
    const hasFabricatedStats = rawReview.noFabricatedStatistics === false;
    const hasFabricatedExp = rawReview.noFabricatedExperience === false;

    let finalApproved = rawReview.approved;
    const issues = [...rawReview.issues];

    if (isTopicFidelityInsufficient) {
      finalApproved = false;
      if (!issues.some((i) => i.type === 'topic_drift')) {
        issues.push({
          type: 'topic_drift',
          severity: 'high',
          description: `Topic fidelity score is ${rawReview.topicFidelity}/100 (< 90). The content drifts from "${input.topic}". All posts must remain strictly focused on the user topic.`,
        });
      }
    }

    if (hasFabricatedStats) {
      finalApproved = false;
      if (!issues.some((i) => i.type === 'fabricated_statistics')) {
        issues.push({
          type: 'fabricated_statistics',
          severity: 'high',
          description: 'Content contains unverified statistics or fabricated percentages. Remove invented numbers.',
        });
      }
    }

    if (hasFabricatedExp) {
      finalApproved = false;
      if (!issues.some((i) => i.type === 'fabricated_experience')) {
        issues.push({
          type: 'fabricated_experience',
          severity: 'high',
          description: 'Content contains fabricated first-person anecdotes. Replace with objective domain explanations.',
        });
      }
    }

    if (hasHighSeverityIssue || isFactualAccuracyInsufficient || isPlatformFitInsufficient) {
      finalApproved = false;
    }

    let requiredChanges = [...rawReview.requiredChanges];
    if (!finalApproved && requiredChanges.length === 0) {
      if (issues.length > 0) {
        requiredChanges = issues.map(
          (iss) => `Address [${iss.severity.toUpperCase()}] ${iss.type}: ${iss.description}`
        );
      } else {
        requiredChanges = [
          'Maintain 100% topic fidelity, remove any ungrounded assertions or clichés, and strengthen hooks.',
        ];
      }
    } else if (finalApproved) {
      requiredChanges = [];
    }

    const finalized: CriticReview = {
      ...rawReview,
      approved: finalApproved,
      issues,
      requiredChanges,
    };

    return CriticReviewSchema.parse(finalized);
  }
}
