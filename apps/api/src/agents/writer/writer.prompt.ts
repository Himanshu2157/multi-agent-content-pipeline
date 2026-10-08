import {
  Platform,
  ResearchResult,
  WriterOutput,
  CriticReview,
  TopicAnalysis,
  ContentStrategy,
  LINKEDIN_ANGLES,
} from '@contentforge/shared';

export const WRITER_SYSTEM_PROMPT = `You are a world-class content writer and subject-matter communicator.
You write with precision, clarity, depth, and a natural human voice.

MANDATORY RULES:
1. TOPIC FIDELITY IS ABSOLUTE:
   - Every sentence must be about the user's specific topic.
   - NEVER mention AI agents, prompt engineering, multi-agent systems, or ContentForge unless the user's topic is literally about those things.
   - Never inject meta-commentary about the writing process itself.

2. WRITE LIKE A HUMAN — BAN ALL AI CLICHÉS:
   - Strictly forbidden phrases:
     * "In today's fast-paced digital world..."
     * "The future of..."
     * "Game changer" / "Game-changing"
     * "Let's dive in" / "Dive deep"
     * "The takeaway is crystal clear..."
     * "Buckle up"
     * "Supercharge" / "Revolutionize"
     * "In this post, we explore..."
     * "In the realm of..."
     * "Look no further"
   - Use direct, substantive, natural prose that an experienced human practitioner would write.

3. ZERO FABRICATED EXPERIENCE OR STATISTICS:
   - NEVER invent fictional first-person stories (e.g. "Last year my team spent 14 hours...", "I was sitting in a coffee shop..."). Use general observations, real industry patterns, historical cases, or direct explanations.
   - NEVER fabricate percentages, survey statistics, or fake studies. If research has no percentage, do NOT make one up. Explain the mechanics or concepts instead.

4. 100% READY-TO-POST CONTENT:
   - Do NOT include internal template labels anywhere in the text (NO "[SCROLL-STOPPING HOOK]", NO "[MAIN IDEA]", NO "[CTA]", NO "Post 1: Educational").
   - The hook must be pure copy. The body must be pure copy. The CTA must be pure copy.`;

export interface WriterPromptInput {
  topic: string;
  platform: Platform;
  tone?: string;
  audience?: string;
  topicAnalysis?: TopicAnalysis;
  strategy?: ContentStrategy;
  research: ResearchResult;
  previousDraft?: WriterOutput | null;
  criticFeedback?: CriticReview | null;
  iteration: number;
}

export function buildWriterPrompt(input: WriterPromptInput): string {
  const {
    topic,
    platform,
    tone,
    audience,
    topicAnalysis,
    strategy,
    research,
    previousDraft,
    criticFeedback,
    iteration,
  } = input;

  const factsText = research.facts
    .map((f, i) => `Fact ${i + 1}: "${f.claim}" (Source: ${f.source})`)
    .join('\n');

  let strategyText = '';
  if (strategy) {
    strategyText = `
EDITORIAL STRATEGY & ANGLES:
Target Pain Point: ${strategy.targetAudiencePainPoint}
Core Insight: ${strategy.coreInsight}
Planned Angles:
${strategy.angles
  .map(
    (a, i) =>
      `${i + 1}. [${a.name}] - ${a.description}
   Target Takeaway: ${a.targetTakeaway}
   Hook Direction: ${a.hookIdea}
   Suggested Analogy/Example: ${a.suggestedExampleOrAnalogy || 'N/A'}`
  )
  .join('\n')}
Strictly Avoid: ${strategy.avoidTopics.join(', ')}
`;
  }

  let revisionContext = '';
  if (iteration > 1 && criticFeedback) {
    const issuesText = criticFeedback.issues
      .map((iss) => `[${iss.severity.toUpperCase()}] ${iss.type}: ${iss.description}`)
      .join('\n');

    const changesText = criticFeedback.requiredChanges
      .map((c, i) => `${i + 1}. ${c}`)
      .join('\n');

    revisionContext = `
========================================
CRITICAL REVISION INSTRUCTIONS (ITERATION ${iteration}):
========================================
Your previous draft was REJECTED with quality score ${criticFeedback.score}/100 and topic fidelity ${criticFeedback.topicFidelity}/100.
Fix EVERY issue flagged below:

Identified Issues:
${issuesText || 'None specified'}

Required Changes:
${changesText || 'Refine according to platform standards'}

Previous Draft:
${JSON.stringify(previousDraft, null, 2)}
========================================
`;
  }

  const topicHeader = topicAnalysis
    ? `USER TOPIC: ${topic}
CORE SUBJECT: ${topicAnalysis.coreSubject}
GOAL: ${topicAnalysis.contentGoal}
FORBIDDEN DRIFT: ${topicAnalysis.forbiddenTopicDrift.join(', ')}`
    : `USER TOPIC: ${topic}`;

  if (platform === 'LINKEDIN') {
    return `${topicHeader}
PLATFORM: LINKEDIN
TONE: ${tone || 'Professional & natural'}
AUDIENCE: ${audience || 'Practitioners & professionals'}
ITERATION: ${iteration}

FACTUAL RESEARCH FOUNDATION:
Summary: ${research.summary}

Key Points:
${research.keyPoints.map((p) => `- ${p}`).join('\n')}

Verified Facts & References:
${factsText}

Cautions / Misconceptions:
${research.cautions.map((c) => `- ${c}`).join('\n')}
${strategyText}
${revisionContext}
REQUIREMENTS FOR LINKEDIN:
Generate exactly 4 to 5 DISTINCT LinkedIn posts around the topic "${topic}".
Each post MUST approach the topic from a completely different angle:
${(strategy?.angles.map((a) => a.name) || LINKEDIN_ANGLES).map((a, i) => `${i + 1}. "${a}"`).join('\n')}

For each post:
1. id: unique identifier (e.g. "post_educational", "post_contrarian", "post_story", "post_practical", "post_data")
2. angle: the specific angle used
3. hook: a compelling 1-2 sentence opening that immediately hooks the reader without generic clichés.
4. body: the main content, fully written with natural paragraph spacing. Grounded in technical truth. No fake personal stories, no fake percentages. Ready to publish immediately.
5. cta: a thoughtful discussion question or closing takeaway.

CRITICAL FORMATTING INSTRUCTION:
DO NOT put internal labels like "[HOOK]", "[BODY]", or "[CTA]" anywhere in the hook, body, or cta fields. Output pure, clean, ready-to-post text only.

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
  return `${topicHeader}
PLATFORM: INSTAGRAM_REEL
TONE: ${tone || 'Engaging & punchy'}
AUDIENCE: ${audience || 'Enthusiasts & practitioners'}
ITERATION: ${iteration}

FACTUAL RESEARCH FOUNDATION:
Summary: ${research.summary}

Key Points:
${research.keyPoints.map((p) => `- ${p}`).join('\n')}

Verified Facts & References:
${factsText}
${strategyText}
${revisionContext}
REQUIREMENTS FOR INSTAGRAM REEL:
Generate a complete short-form video script (30-60 seconds) strictly on "${topic}".
Do NOT write a generic text post and label it a Reel.
Structure:
- Hook (0-3 sec): High-impact opening visual and line
- 3 to 5 progression sections (timestamps, visual direction, voiceover, on-screen text)
- CTA (ending call to action)

For EVERY section:
1. timestamp: e.g. "0-3 sec", "3-10 sec", "10-25 sec", "25-40 sec", "40-50 sec"
2. visual: concrete visual, camera movement, or B-roll description
3. voiceover: exact natural spoken words for narrator (no robotic jargon)
4. onScreenText: bold, readable screen text overlay

OUTPUT JSON SCHEMA:
{
  "title": "...",
  "estimatedDuration": "...",
  "hook": "...",
  "sections": [
    {
      "timestamp": "0-3 sec",
      "visual": "...",
      "voiceover": "...",
      "onScreenText": "..."
    }
  ],
  "cta": "..."
}`;
}
