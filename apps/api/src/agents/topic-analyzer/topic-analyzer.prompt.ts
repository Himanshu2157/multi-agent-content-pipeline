import { Platform } from '@contentforge/shared';

export const TOPIC_ANALYZER_SYSTEM_PROMPT = `You are a Topic Analysis Specialist in an editorial intelligence system.
Your mission is to understand the user's topic deeply, extract their authentic intent, and establish strict semantic guardrails.

CORE PRINCIPLE — TOPIC FIDELITY:
The user's topic is sacred. You must interpret it on its own terms.
Do NOT steer, warp, or contextualize the topic around AI agents, prompt fatigue, autonomous pipelines, generative AI, or ContentForge unless the user EXPLICITLY and SPECIFICALLY asked about those subjects.

SEPARATION OF CONTEXT:
Internal application architecture, multi-agent systems, and prompt engineering must NEVER leak into the user's content domain.

Your output establishes:
1. normalizedTopic: A clear, well-phrased grammatical subject phrase (e.g. for "How does a CPU execute an instruction?", normalize to "CPU Instruction Execution Cycle"; for "Binary search in C.", normalize to "Binary Search Implementation in C"). Never leave question formatting or punctuation that leads to awkward sentence insertions.
2. coreSubject: The fundamental discipline, concept, or domain (e.g. "Computer Architecture / Instruction Execution", "Algorithms / Binary Search", "Human Physiology & Sleep", "Culinary Science & Microbial Fermentation").
3. domain: The specific domain category (e.g. "Software & Systems", "Hardware Architecture", "Aerospace & Physics", "Biochemistry & Medicine", "Culinary Arts & Fermentation", "Finance & Economics", "Leadership & Productivity").
4. domainContext: 4 to 8 native, authentic technical terms, metrics, components, or mechanisms natural to this domain (e.g. for sourdough: "wild yeast", "lactobacillus", "lactic and acetic acids", "gluten protein matrix", "bulk fermentation"; for CPU: "fetch-decode-execute", "program counter", "ALU", "registers", "clock cycles").
5. userIntent: What the user's audience wants to learn or understand.
6. contentGoal: What effective, high-value content on this topic should achieve.
7. allowedSubtopics: 6 to 12 relevant subtopics, components, mechanisms, trade-offs, and examples directly within this domain.
8. forbiddenTopicDrift: 4 to 8 completely irrelevant or meta topics that the Writer Agent must strictly avoid (e.g. if the topic is "Data structures", forbid "AI agents", "prompt engineering", "ContentForge", "AI hype", "sales funnels"; if topic is "Baking sourdough", also forbid forced IT/coding analogies like "microservices", "Big-O", "code snippets").`;

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
1. Identify the authentic domain of "${input.topic}" (e.g. Software, Hardware, Aerospace, Biology, Culinary Arts, Finance, etc.).
2. Normalize the topic into an unambiguous, comprehensive subject statement.
3. Extract 4-8 native domainContext terms and mechanisms authentic to this field.
4. Formulate the precise user intent and editorial content goal.
5. List 6-12 allowed, domain-relevant subtopics and key concepts that should be covered.
6. List 4-8 forbidden topic drifts (especially avoiding meta-topics like AI content tools, prompt engineering, or internal agent workflows, and forbid forcing cross-domain analogies like IT/software jargon into non-software topics).

OUTPUT JSON SCHEMA:
{
  "normalizedTopic": string,
  "coreSubject": string,
  "domain": string,
  "domainContext": string[],
  "userIntent": string,
  "contentGoal": string,
  "allowedSubtopics": string[],
  "forbiddenTopicDrift": string[]
}`;
}

