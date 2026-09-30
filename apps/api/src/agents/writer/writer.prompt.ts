import {
  Platform,
  ResearchResult,
  WriterOutput,
  CriticReview,
  LINKEDIN_ANGLES,
} from '@contentforge/shared';

export const WRITER_SYSTEM_PROMPT = `You are a professional content writer. Use the supplied research as your factual foundation.
Do not invent statistics or sources. Adapt the content to the specified platform, audience, and tone.
When revising, directly address the critic's feedback. Maintain strict platform formatting constraints at all times.`;

export interface WriterPromptInput {
  topic: string;
  platform: Platform;
  tone?: string;
  audience?: string;
  research: ResearchResult;
  previousDraft?: WriterOutput | null;
  criticFeedback?: CriticReview | null;
  iteration: number;
}

export function buildWriterPrompt(input: WriterPromptInput): string {
  const { topic, platform, tone, audience, research, previousDraft, criticFeedback, iteration } =
    input;

  const factsText = research.facts
    .map((f, i) => `Fact ${i + 1}: "${f.claim}" (Source: ${f.source}, Confidence: ${f.confidence})`)
    .join('\n');

  const sourcesText = research.sources
    .map((s, i) => `Source ${i + 1}: ${s.title} (${s.url})`)
    .join('\n');

  let revisionContext = '';
  if (iteration > 1 && criticFeedback) {
    const issuesText = criticFeedback.issues
      .map((iss) => `[Severity: ${iss.severity.toUpperCase()}] ${iss.type}: ${iss.description}`)
      .join('\n');

    const changesText = criticFeedback.requiredChanges
      .map((c, i) => `${i + 1}. ${c}`)
      .join('\n');

    revisionContext = `
========================================
CRITICAL REVISION INSTRUCTIONS (ITERATION ${iteration}):
========================================
Your previous draft was reviewed by the Critic Agent and REJECTED with a quality score of ${criticFeedback.score}/100.
You must DIRECTLY fix every single issue flagged below:

Identified Issues:
${issuesText || 'None specified'}

Required Changes:
${changesText || 'Refine according to platform standards'}

Previous Draft for Reference:
${JSON.stringify(previousDraft, null, 2)}

Do NOT simply generate random new content. Refine and correct the previous draft according to the Critic's instructions!
========================================
`;
  }

  if (platform === 'LINKEDIN') {
    return `TOPIC: ${topic}
PLATFORM: LINKEDIN
TONE: ${tone || 'Professional'}
TARGET AUDIENCE: ${audience || 'General Professional'}
ITERATION: ${iteration}

FACTUAL RESEARCH FOUNDATION:
Summary: ${research.summary}

Key Points:
${research.keyPoints.map((p) => `- ${p}`).join('\n')}

Verified Facts & Sources:
${factsText}

Sources:
${sourcesText}

Cautions:
${research.cautions.map((c) => `- ${c}`).join('\n')}
${revisionContext}
REQUIREMENTS FOR LINKEDIN:
Generate exactly 4 to 5 DISTINCT LinkedIn posts around the topic.
Each post MUST approach the topic from a completely different angle:
${LINKEDIN_ANGLES.map((a, i) => `${i + 1}. "${a}"`).join('\n')}

Each post must contain:
1. id: unique string identifier (e.g. "post_angle_educational")
2. angle: the specific angle used
3. hook: a compelling 1-2 sentence opening that stops the scroll
4. body: the main idea with supporting information, grounded strictly in the factual research above
5. cta: an engaging call-to-action or thoughtful closing question

OUTPUT JSON SCHEMA:
{
  "posts": [
    {
      "id": "post_1",
      "angle": "Educational",
      "hook": "...",
      "body": "...",
      "cta": "..."
    }
  ]
}`;
  }

  // INSTAGRAM REEL
  return `TOPIC: ${topic}
PLATFORM: INSTAGRAM_REEL
TONE: ${tone || 'Engaging & energetic'}
TARGET AUDIENCE: ${audience || 'Creators & tech enthusiasts'}
ITERATION: ${iteration}

FACTUAL RESEARCH FOUNDATION:
Summary: ${research.summary}

Key Points:
${research.keyPoints.map((p) => `- ${p}`).join('\n')}

Verified Facts & Sources:
${factsText}

Sources:
${sourcesText}

Cautions:
${research.cautions.map((c) => `- ${c}`).join('\n')}
${revisionContext}
REQUIREMENTS FOR INSTAGRAM REEL:
Generate a complete, high-impact short-form video script (30-60 seconds total).
Do NOT write a plain social media text post.
Structure the script into clear, timed scene sections:
- Hook (0-3 sec or 0-5 sec)
- 3 to 5 content progression sections
- Climax/Key Takeaway
- Ending & Call-to-Action (CTA)

For EVERY scene section, provide:
1. timestamp: e.g. "0–5 sec", "5–15 sec", "15–30 sec", "30–45 sec"
2. visual: clear visual/camera direction or B-roll suggestion
3. voiceover: exact spoken words to be spoken by narrator/creator
4. onScreenText: bold, punchy text overlays

OUTPUT JSON SCHEMA:
{
  "title": "...",
  "estimatedDuration": "...",
  "hook": "...",
  "sections": [
    {
      "timestamp": "0–5 sec",
      "visual": "...",
      "voiceover": "...",
      "onScreenText": "..."
    }
  ],
  "cta": "..."
}`;
}
