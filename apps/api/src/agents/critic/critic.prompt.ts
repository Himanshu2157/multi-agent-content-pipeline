import {
  Platform,
  ResearchResult,
  WriterOutput,
  TopicAnalysis,
  ContentStrategy,
} from '@contentforge/shared';

export const CRITIC_SYSTEM_PROMPT = `You are a rigorous content quality reviewer and factual integrity auditor.
Your job is to critically evaluate content for:
1. TOPIC FIDELITY (Primary Directive): Does the draft stick 100% to the user's topic?
   - Reject with severe penalty if the content drifts into AI agents, prompt engineering, ContentForge, or unrelated meta-topics.
   - Minimum topicFidelity score required to pass is 90/100.
2. NO FABRICATION:
   - Are there fabricated statistics, surveys, percentages, or fake organizations? If yes, flag as HIGH severity and set noFabricatedStatistics=false.
   - Are there fake personal anecdotes (e.g. "Last year my team spent 14 hours...")? If yes, flag as HIGH severity and set noFabricatedExperience=false.
3. NATURAL HUMAN VOICE:
   - Is the writing free of cheap AI clichés ("In today's fast-paced world", "game changer", "the takeaway is crystal clear", "let's dive in", "supercharge")?
4. PLATFORM READINESS:
   - For LinkedIn: Are there 4-5 posts with diverse angles? Are hooks compelling? Are there any unwanted internal template tags like "[HOOK]" or "[BODY]"?
   - For Instagram Reel: Is there a timed hook, clear visual cues, natural voiceover, and concise on-screen text?
5. HONEST SCORING:
   - Do not approve content merely because it looks well-formatted. Apply strict quality control.`;

export interface CriticPromptInput {
  topic: string;
  platform: Platform;
  tone?: string;
  audience?: string;
  topicAnalysis?: TopicAnalysis;
  strategy?: ContentStrategy;
  research: ResearchResult;
  draft: WriterOutput;
  iteration: number;
}

export function buildCriticPrompt(input: CriticPromptInput): string {
  const { topic, platform, tone, audience, topicAnalysis, strategy, research, draft, iteration } =
    input;

  const factsList = research.facts
    .map((f, i) => `Fact ${i + 1}: "${f.claim}" (Source: ${f.source})`)
    .join('\n');

  const sourcesList = research.sources
    .map((s, i) => `Source ${i + 1}: ${s.title} (${s.url})`)
    .join('\n');

  const driftSection = topicAnalysis
    ? `NORMALIZED TOPIC: ${topicAnalysis.normalizedTopic}
CORE SUBJECT: ${topicAnalysis.coreSubject}
FORBIDDEN DRIFT TOPICS: ${topicAnalysis.forbiddenTopicDrift.join(', ')}`
    : `NORMALIZED TOPIC: ${topic}`;

  return `AUDIT CONTENT QUALITY & FIDELITY:

USER TOPIC: ${topic}
${driftSection}
TARGET PLATFORM: ${platform}
TONE: ${tone || 'Professional & natural'}
AUDIENCE: ${audience || 'Practitioners & professionals'}
ITERATION: ${iteration}

GROUND TRUTH RESEARCH:
Summary: ${research.summary}

Verified Facts:
${factsList}

Verified Sources:
${sourcesList}

Known Cautions & Misconceptions:
${research.cautions.map((c) => `- ${c}`).join('\n') || 'None'}

${strategy ? `PLANNED ANGLES: ${strategy.angles.map((a) => a.name).join(', ')}` : ''}

DRAFT CONTENT UNDER EVALUATION:
${JSON.stringify(draft, null, 2)}

EVALUATION CHECKLIST:
1. Topic Fidelity (0-100):
   - Is every single post/section about "${topic}"?
   - Does it mention AI agents, prompt engineering, or ContentForge when not asked? If so, topicFidelity must be < 50!
2. No Fabricated Statistics:
   - Are there percentages or study claims not in the verified research? If so, set noFabricatedStatistics to false.
3. No Fabricated Personal Experience:
   - Are there fictional first-person stories? If so, set noFabricatedExperience to false.
4. Naturalness (0-100):
   - Are there AI clichés like "game changer", "the takeaway is crystal clear", "dive in"?
5. Platform Fit (0-100):
   - Are there 4-5 distinct posts (LinkedIn) or scene breakdown (Reel)?
   - Are internal prompt tags like "[HOOK]" present in the text? If yes, flag as format issue.

APPROVAL RULES:
- "approved" must be true ONLY IF:
  * topicFidelity >= 90
  * noFabricatedStatistics === true
  * noFabricatedExperience === true
  * factualAccuracy >= 80
  * platformFit >= 75
  * 0 high-severity issues
- If ANY condition fails, "approved" MUST be false.

OUTPUT JSON SCHEMA:
{
  "approved": boolean,
  "score": number (0-100),
  "topicFidelity": number (0-100),
  "factualAccuracy": number (0-100),
  "relevance": number (0-100),
  "platformFit": number (0-100),
  "clarity": number (0-100),
  "originality": number (0-100),
  "naturalness": number (0-100),
  "noFabricatedExperience": boolean,
  "noFabricatedStatistics": boolean,
  "issues": [
    {
      "type": string,
      "severity": "low" | "medium" | "high",
      "description": string
    }
  ],
  "requiredChanges": [
    "string"
  ]
}`;
}
