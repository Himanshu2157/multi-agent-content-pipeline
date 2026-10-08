import {
  Platform,
  TopicAnalysis,
  ResearchResult,
  LINKEDIN_ANGLES,
} from '@contentforge/shared';

export const CONTENT_STRATEGIST_SYSTEM_PROMPT = `You are a Senior Content Strategist.
Your mission is to formulate an editorial strategy for content on a specific topic and platform.

CORE EDITORIAL PRINCIPLES:
1. TOPIC INTEGRITY: Strategy must be 100% focused on the user's specific topic. Do NOT drift into generic AI hype, prompt engineering, or meta tools.
2. AUDIENCE EMPATHY: Identify real pain points, mental models, and intuitive analogies that explain technical or complex topics clearly.
3. ANGLE DIVERSITY: For LinkedIn, formulate 4 to 5 distinct narrative angles so the posts do NOT read like the same text repeated 5 times.
4. NO FABRICATION: Do not propose fake surveys or unverifiable statistics. Anchor insights in genuine domain principles and real research findings.
5. NO INTERNAL LEAKS: Never suggest meta-commentary about "our AI pipeline" or "prompts". Content must sound like an experienced human practitioner.`;

export interface ContentStrategistInput {
  topic: string;
  platform: Platform;
  tone?: string;
  audience?: string;
  topicAnalysis: TopicAnalysis;
  research: ResearchResult;
}

export function buildContentStrategistPrompt(input: ContentStrategistInput): string {
  const { topic, platform, tone, audience, topicAnalysis, research } = input;

  const keyPointsText = research.keyPoints.map((kp) => `- ${kp}`).join('\n');
  const factsText = research.facts.map((f) => `- ${f.claim} [${f.source}]`).join('\n');
  const allowedSubtopics = topicAnalysis.allowedSubtopics.join(', ');
  const forbiddenDrift = topicAnalysis.forbiddenTopicDrift.join(', ');

  return `FORMULATE CONTENT STRATEGY:

USER TOPIC: "${topic}"
NORMALIZED TOPIC: "${topicAnalysis.normalizedTopic}"
CORE SUBJECT: "${topicAnalysis.coreSubject}"
EDITORIAL GOAL: "${topicAnalysis.contentGoal}"
ALLOWED SUBTOPICS: ${allowedSubtopics}
FORBIDDEN DRIFT: ${forbiddenDrift}

PLATFORM: ${platform}
TONE: ${tone || 'Professional & natural'}
AUDIENCE: ${audience || 'Practitioners & professionals'}

RESEARCH SUMMARY:
${research.summary}

KEY RESEARCH POINTS:
${keyPointsText}

VERIFIED FACTS:
${factsText}

STRATEGY REQUIREMENTS:
1. Identify the real reader pain point (what makes this topic tricky, overlooked, or crucial).
2. Formulate the core insight that unifies high-quality discussions on this topic.
3. Create 4 to 5 distinct content angles:
   For LinkedIn, use angles such as: ${LINKEDIN_ANGLES.join(', ')}.
   For each angle, specify:
   - id: e.g. "angle_educational", "angle_contrarian", "angle_story", "angle_practical", "angle_data"
   - name: Angle label
   - description: Editorial direction for this post
   - targetTakeaway: What the reader will learn or reflect on
   - hookIdea: A punchy, natural opening idea (no generic AI clichés)
   - suggestedExampleOrAnalogy: A relatable real-world comparison or concrete scenario
4. Define topics/clichés to strictly avoid (including forbidden drifts and AI buzzwords).
5. Highlight 3-5 key points to emphasize.

OUTPUT JSON SCHEMA:
{
  "topic": string,
  "targetAudiencePainPoint": string,
  "coreInsight": string,
  "angles": [
    {
      "id": string,
      "name": string,
      "description": string,
      "targetTakeaway": string,
      "hookIdea": string,
      "suggestedExampleOrAnalogy": string
    }
  ],
  "avoidTopics": string[],
  "keyPointsToEmphasize": string[]
}`;
}
