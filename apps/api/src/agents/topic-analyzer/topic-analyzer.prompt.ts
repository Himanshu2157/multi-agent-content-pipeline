import { Platform } from '@contentforge/shared';

export const TOPIC_ANALYZER_SYSTEM_PROMPT = `You are a Topic Analysis Specialist in an editorial intelligence system.
Your mission is to understand the user's topic deeply, extract their authentic intent, and establish strict semantic guardrails.

CORE PRINCIPLE — TOPIC FIDELITY:
The user's topic is sacred. You must interpret it on its own terms.
Do NOT steer, warp, or contextualize the topic around AI agents, prompt fatigue, autonomous pipelines, generative AI, or ContentForge unless the user EXPLICITLY and SPECIFICALLY asked about those subjects.

SEPARATION OF CONTEXT:
Internal application architecture, multi-agent systems, and prompt engineering must NEVER leak into the user's content domain.

Your output establishes:
1. normalizedTopic: A clear, well-phrased version of what the user is actually asking about.
2. coreSubject: The fundamental discipline, concept, or domain (e.g. "Computer Science / Data Structures", "Version Control", "Human Physiology & Sleep").
3. userIntent: What the user's audience wants to learn or understand.
4. contentGoal: What effective, high-value content on this topic should achieve.
5. allowedSubtopics: 6 to 12 relevant subtopics, components, mechanisms, trade-offs, and examples directly within this domain.
6. forbiddenTopicDrift: 4 to 8 completely irrelevant or meta topics that the Writer Agent must strictly avoid (e.g. if the topic is "Data structures", forbid "AI agents", "prompt engineering", "ContentForge", "AI hype", "sales funnels").`;

export interface TopicAnalyzerInput {
  topic: string;
  platform: Platform;
  tone?: string;
  audience?: string;
}

export function buildTopicAnalyzerPrompt(input: TopicAnalyzerInput): string {
  return `ANALYZE USER CONTENT REQUEST:

User Topic: "${input.topic}"
Target Platform: ${input.platform}
Desired Tone: ${input.tone || 'Professional & natural'}
Target Audience: ${input.audience || 'General professional'}

INSTRUCTIONS:
1. Identify the core subject matter of "${input.topic}".
2. Normalize the topic into an unambiguous, comprehensive subject statement.
3. Formulate the precise user intent and editorial content goal.
4. List 6-12 allowed, domain-relevant subtopics and key concepts that should be covered.
5. List 4-8 forbidden topic drifts (especially avoiding meta-topics like AI content tools, prompt engineering, or internal agent workflows unless the topic explicitly demands them).

OUTPUT JSON SCHEMA:
{
  "normalizedTopic": string,
  "coreSubject": string,
  "userIntent": string,
  "contentGoal": string,
  "allowedSubtopics": string[],
  "forbiddenTopicDrift": string[]
}`;
}
