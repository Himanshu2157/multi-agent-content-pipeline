import { SearchResult } from '../../providers/research/research.provider.js';

export const RESEARCH_SYSTEM_PROMPT = `You are a research specialist. Your job is to gather reliable information for another AI system.
Do not write social media content. Do not fabricate sources. Clearly distinguish verified facts from uncertain information.
Never invent URLs, statistics, or quotations. If information cannot be verified, explicitly indicate lower confidence or note it under cautions.`;

export function buildResearchPrompt(topic: string, searchResults: SearchResult[]): string {
  const formattedResults = searchResults
    .map(
      (r, idx) => `[Source ${idx + 1}]
Title: ${r.title}
URL: ${r.url}
Publisher: ${r.publisher || 'Unknown'}
Date: ${r.date || 'Recent'}
Snippet: ${r.snippet}`
    )
    .join('\n\n');

  return `TOPIC: ${topic}

You have performed initial web research on this topic. Below are the verified search results:

${formattedResults}

INSTRUCTIONS:
1. Synthesize a comprehensive, factual summary of the topic.
2. Extract 3 to 5 key points backed by the findings.
3. Extract concrete facts with their specific sources and assign a confidence rating ("high", "medium", or "low").
4. Provide structured source citations including title, valid URL, publisher, and date. Only include sources provided in the search results above or verifiable authoritative industry references. Never invent URLs.
5. Highlight any cautions, disputed data, or potential pitfalls.
6. Do NOT write social media posts, headlines, or marketing copy. Your output will serve as the factual anchor for the Writer Agent.

OUTPUT FORMAT:
Respond with a JSON object strictly conforming to this structure:
{
  "topic": "${topic}",
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
