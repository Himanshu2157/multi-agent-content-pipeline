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
1. Identify the central subject and 3 to 6 specific subtopics.
2. Synthesize a comprehensive, factual overview that directly and meaningfully explains the core mechanics of this topic:
   - If the topic asks or implies "How does it work?" or "Why does it happen?", explain the exact sequence of events, components, and forces from start to finish.
   - Do NOT produce abstract meta-talk (e.g. "X establishes operational frameworks"). Always explain the actual subject matter itself.
3. Extract 3 to 5 key technical or domain concepts with high explanatory depth.
4. Extract concrete facts with their source/discipline and assign confidence ("high", "medium", or "low").
5. Provide 2 to 4 concrete, tangible examples, operational mechanics, calculations, or code snippets (e.g. for algorithms provide concrete array steps or complexity formulas; for hardware provide register names and execution cycle steps; for science provide chemical, physical, or biological agents).
6. Provide structured source citations with valid URLs (e.g. documentation, classic textbook references, authoritative articles). Never fabricate URLs.
7. Highlight genuine cautions, common trade-offs, or beginner misconceptions.
8. STRIKE RULE: Do NOT fabricate survey numbers, percentages, or research institutes. If no exact percentage exists, explain the qualitative mechanism or trade-off instead.
9. Do NOT write social media copy.

OUTPUT JSON SCHEMA:
{
  "topic": "${topicAnalysis?.normalizedTopic || topic}",
  "centralSubject": "${topicAnalysis?.coreSubject || topic}",
  "subtopics": ["...", "..."],
  "summary": "...",
  "keyPoints": ["...", "..."],
  "facts": [
    {
      "claim": "...",
      "source": "...",
      "confidence": "high" | "medium" | "low"
    }
  ],
  "relevantExamples": ["...", "..."],
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
