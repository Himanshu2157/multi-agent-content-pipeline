import { SearchResult } from '../../providers/research/research.provider.js';
import { TopicAnalysis } from '@contentforge/shared';

export const RESEARCH_SYSTEM_PROMPT = `You are an objective research specialist. Your role is to gather verifiable facts, technical mechanics, historical context, and authoritative explanations on the specific topic provided.

CRITICAL RULES:
1. TOPIC INTEGRITY: Research ONLY the user's topic. Never inject AI agents, prompt engineering, multi-agent pipelines, or ContentForge unless explicitly in the topic itself.
2. ABSOLUTE TRUTH — NO INVENTED STATISTICS:
   - Never fabricate percentages (e.g. "73% of creators", "62% reduction").
   - Never invent studies, surveys, reports, institutions, or quotes.
   - If reliable quantitative metrics are not found in the search results or authoritative reference texts, do NOT generate any statistics. High-quality conceptual explanation and clear technical facts are vastly superior to fabricated numbers.
3. VERIFIABLE SOURCES: Use real, established references (standard computer science literature, official documentation, peer-reviewed physiology, historical computing, etc.). Never invent fake URLs.
4. CAUTIONS: Explicitly identify edge cases, common misconceptions, or oversimplifications.`;

export function buildResearchPrompt(
  topic: string,
  searchResults: SearchResult[],
  topicAnalysis?: TopicAnalysis
): string {
  const formattedResults =
    searchResults.length > 0
      ? searchResults
          .map(
            (r, idx) => `[Source ${idx + 1}]
Title: ${r.title}
URL: ${r.url}
Publisher: ${r.publisher || 'Domain Reference'}
Date: ${r.date || 'Authoritative'}
Snippet: ${r.snippet}`
          )
          .join('\n\n')
      : 'No live external search results available. Synthesize using verified canonical domain knowledge only. Do not hallucinate statistics or surveys.';

  const subjectHeader = topicAnalysis
    ? `TOPIC: ${topic}
NORMALIZED TOPIC: ${topicAnalysis.normalizedTopic}
CORE SUBJECT: ${topicAnalysis.coreSubject}
ALLOWED SUBTOPICS: ${topicAnalysis.allowedSubtopics.join(', ')}
FORBIDDEN DRIFT: ${topicAnalysis.forbiddenTopicDrift.join(', ')}`
    : `TOPIC: ${topic}`;

  return `${subjectHeader}

VERIFIED SEARCH FINDINGS & DOMAIN SOURCES:
${formattedResults}

INSTRUCTIONS:
1. Synthesize a comprehensive, factual overview strictly focused on this topic.
2. Extract 3 to 5 key technical or domain concepts.
3. Extract concrete facts with their source/discipline and assign confidence ("high", "medium", or "low").
4. Provide structured source citations with valid URLs (e.g. documentation, classic textbook references, authoritative articles). Never fabricate URLs.
5. Highlight genuine cautions, common trade-offs, or beginner misconceptions.
6. STRIKE RULE: Do NOT fabricate survey numbers, percentages, or research institutes. If no exact percentage exists, explain the qualitative mechanism or trade-off instead.
7. Do NOT write social media copy.

OUTPUT JSON SCHEMA:
{
  "topic": "${topicAnalysis?.normalizedTopic || topic}",
  "summary": "...",
  "keyPoints": ["...", "..."],
  "facts": [
    {
      "claim": "...",
      "source": "...",
      "confidence": "high" | "medium" | "low"
    }
  ],
  "sources": [
    {
      "title": "...",
      "url": "https://...",
      "publisher": "...",
      "date": "..."
    }
  ],
  "cautions": ["..."]
}`;
}
