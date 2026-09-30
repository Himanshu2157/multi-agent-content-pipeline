import {
  Platform,
  ResearchResult,
  WriterOutput,
} from '@contentforge/shared';

export const CRITIC_SYSTEM_PROMPT = `You are a rigorous content quality reviewer.
Evaluate factual support, clarity, platform fit, originality, structure, and unsupported claims.
Do not approve content merely because it sounds convincing. Identify concrete problems and provide actionable revision instructions.
Differentiate carefully between claims supported by research, claims unsupported by research, opinions, and predictions.
Flag any unsupported statistics, fabricated URLs, or hallucinated claims with HIGH severity.`;

export interface CriticPromptInput {
  topic: string;
  platform: Platform;
  tone?: string;
  audience?: string;
  research: ResearchResult;
  draft: WriterOutput;
  iteration: number;
}

export function buildCriticPrompt(input: CriticPromptInput): string {
  const { topic, platform, tone, audience, research, draft, iteration } = input;

  const factsList = research.facts
    .map(
      (f, i) =>
        `Fact ${i + 1}: "${f.claim}" (Source: ${f.source}, Confidence: ${f.confidence})`
    )
    .join('\n');

  const sourcesList = research.sources
    .map((s, i) => `Source ${i + 1}: ${s.title} (${s.url})`)
    .join('\n');

  return `TOPIC: ${topic}
TARGET PLATFORM: ${platform}
TONE: ${tone || 'Professional'}
AUDIENCE: ${audience || 'General Professional'}
ITERATION: ${iteration}

GROUND TRUTH RESEARCH:
Summary: ${research.summary}

Verified Facts:
${factsList}

Verified Sources:
${sourcesList}

Known Cautions & Disputed Points:
${research.cautions.map((c) => `- ${c}`).join('\n') || 'None'}

DRAFT CONTENT TO REVIEW:
${JSON.stringify(draft, null, 2)}

EVALUATION CRITERIA:
1. Factual Accuracy & Research Support:
   - Are claims and statistics in the draft grounded in the research above?
   - Are any numbers, metrics, or citations fabricated or hallucinated?
   - Are opinions or predictions properly framed rather than stated as empirical facts?
2. Platform Suitability & Fit:
   - For LinkedIn: Are there 4-5 posts? Does each post adopt a distinct angle (Educational, Contrarian, Storytelling, Practical, Data-driven)? Are hooks strong?
   - For Instagram Reel: Is there a clear 0-3s hook? Timed scene sections? Concrete visual and camera directions? Actionable on-screen text?
3. Clarity, Tone & Originality:
   - Is the writing free of generic AI fluff?
   - Is it compelling, specific, and valuable to the target audience?

APPROVAL RULES:
- "approved" must be true ONLY IF the content meets high publication standards, has no unsupported factual claims, and has 0 high-severity issues.
- If rejected ("approved": false), provide specific, numbered "requiredChanges" that instruct the Writer Agent exactly how to fix the problems in the next iteration.

OUTPUT JSON SCHEMA:
{
  "approved": boolean,
  "score": number (0-100),
  "factualAccuracy": number (0-100),
  "relevance": number (0-100),
  "platformFit": number (0-100),
  "clarity": number (0-100),
  "originality": number (0-100),
  "issues": [
    {
      "type": string (e.g. "factual_unsupported", "hook_weakness", "platform_format", "tone_mismatch"),
      "severity": "low" | "medium" | "high",
      "description": string
    }
  ],
  "requiredChanges": [
    "string"
  ]
}`;
}
