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

  const domainText = topicAnalysis.domain || 'General Discipline';
  const domainContextText = (topicAnalysis.domainContext || []).join(', ') || 'Domain-native terms and mechanisms';

  return `FORMULATE CONTENT STRATEGY:

USER TOPIC: "${topic}"
NORMALIZED TOPIC: "${topicAnalysis.normalizedTopic}"
CORE SUBJECT: "${topicAnalysis.coreSubject}"
DOMAIN: "${domainText}"
DOMAIN CONTEXT TERMS: ${domainContextText}
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
1. DOMAIN ADAPTATION & TOPIC GROUNDING (MANDATORY):
   - The authentic domain of this content is "${domainText}".
   - You MUST adapt all framing, vocabulary, angles, and examples directly to this domain.
   - STRICT BAN ON FORCED SOFTWARE ANALOGIES: Unless the topic is explicitly about software development or computer science, NEVER force IT or coding analogies (e.g. do NOT use "Big-O", "code snippets", "database indexing", "microservices", or "server outages" for topics about cooking, aerospace, biology, physics, or finance).

2. TONE-DRIVEN ANGLE SHAPING (MANDATORY):
   The selected tone is "${tone || 'Professional'}". Tone must drive the angle framing, pain points, hooks, and analogies:
   - Professional: Clear, credible, structured, and focused on real-world practical importance, industry standards, reliability, and practitioner trade-offs in ${domainText}.
   - Engaging & punchy: Focus on common misconceptions, strong contrast, high-energy hooks, and snappy direct phrasing native to this topic.
   - Thought-provoking: Challenge the way practitioners think, question standard assumptions, probe counter-intuitive mental models within ${domainText}.
   - Conversational: Frame through relatable everyday scenarios, friendly peer-to-peer discussions, intuitive human analogies.
   - Authoritative & technical: Focus on deep domain mechanics, exact physical/biological/mathematical/computational laws, specific components, and quantitative trade-offs.

3. Identify the real reader pain point tailored to this tone, domain, and audience.
4. Formulate the core insight that anchors high-quality discussions on this topic.
5. Create 5 distinct content angles corresponding to the 5 mandatory post categories:
   1. Educational: Focus on foundational concept mechanics within ${domainText}, a concrete real-world domain example or analogy, and a clear conceptual takeaway.
   2. Contrarian / Question-Driven: Target a specific domain misconception or provocative question, supply counter-evidence or counter-arguments, and present an alternative perspective.
   3. Storytelling / Case Study: Concrete scenario, historical discovery, real-world experiment, or domain case study. Clearly describe Context/Problem -> Complication -> Resolution -> Domain Lesson. Objective framing only; NEVER invent fake personal anecdotes ("Early in my journey...").
   4. Practical / Step-by-Step: Concrete, actionable sequential framework, protocol, or checklist with logical steps, domain-native parameters, expected outcomes, and common pitfalls.
   5. Insight-Driven: Grounded comparison, metric, threshold, or trade-off curve native to ${domainText} (e.g. latency/memory for software; temperature/expansion for aerospace; hydration/fermentation pH for baking; yield/risk for finance), explaining why the distinction matters in practice.

   For each angle, specify:
   - id: "angle_educational", "angle_contrarian", "angle_storytelling", "angle_practical", "angle_insight"
   - name: Category name ("Educational", "Contrarian / Question-Driven", "Storytelling / Case Study", "Practical / Step-by-Step", "Insight-Driven")
   - description: Editorial direction for this post aligned with "${tone || 'Professional'}"
   - targetTakeaway: What the reader will learn or reflect on
   - hookIdea: A punchy opening idea shaped by "${tone || 'Professional'}" (no generic AI clichés, no generic template phrases)
   - suggestedExampleOrAnalogy: A relatable real-world comparison or concrete scenario matching the tone
5. Define topics/clichés to strictly avoid (including forbidden drifts and AI buzzwords).
6. Highlight 3-5 key points to emphasize.

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
