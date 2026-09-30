import { env } from '../../config/env.js';

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publisher?: string;
  date?: string;
}

export interface ResearchProvider {
  name: string;
  search(query: string): Promise<SearchResult[]>;
}

// Mock Search Provider for repeatable, offline, and unit-tested research
export class MockResearchProvider implements ResearchProvider {
  name = 'mock';

  async search(query: string): Promise<SearchResult[]> {
    // Generate contextually relevant search results based on the search query
    return [
      {
        title: `Comprehensive Industry Analysis: ${query}`,
        url: `https://techcrunch.com/analysis/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}`,
        snippet: `Recent benchmark studies indicate significant technological momentum in ${query}. Organizations report an average of 47% efficiency improvement when deploying automated, verifiable pipelines. Key challenges include maintaining grounded factual output and reducing human prompt fatigue.`,
        publisher: `TechCrunch AI Insights`,
        date: `January 2026`,
      },
      {
        title: `Empirical Research on Automation & Productivity in ${query}`,
        url: `https://www.gartner.com/en/articles/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}-report`,
        snippet: `Gartner's 2025-2026 report reveals that 62% of teams adopting multi-stage autonomous workflows decreased review cycle latency by more than half. Cross-functional verification loops were found to eliminate up to 88% of unverified hallucinated assertions.`,
        publisher: `Gartner Research`,
        date: `December 2025`,
      },
      {
        title: `The Ergonomics of Modern AI: Mitigating Prompt Fatigue`,
        url: `https://www.technologyreview.com/2026/01/prompt-fatigue-survey`,
        snippet: `A survey conducted by MIT Technology Review found that 73% of knowledge workers and content creators spend excessive hours re-prompting LLMs. The shift towards autonomous agents with closed-loop critique represents the next major paradigm in human-computer collaboration.`,
        publisher: `MIT Technology Review`,
        date: `January 2026`,
      },
    ];
  }
}

// Tavily Web Search Provider
export class TavilyResearchProvider implements ResearchProvider {
  name = 'tavily';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || env.SEARCH_API_KEY || '';
  }

  async search(query: string): Promise<SearchResult[]> {
    if (!this.apiKey) {
      throw new Error('Tavily API Key is missing. Set SEARCH_API_KEY in environment variables.');
    }

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: this.apiKey,
        query,
        search_depth: 'advanced',
        include_answer: false,
        max_results: 5,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Tavily search API error (${response.status}): ${err}`);
    }

    const data = (await response.json()) as any;
    return (data.results || []).map((r: any) => ({
      title: r.title,
      url: r.url,
      snippet: r.content,
      publisher: new URL(r.url).hostname.replace('www.', ''),
      date: r.published_date || undefined,
    }));
  }
}

// Factory Function
export function createResearchProvider(): ResearchProvider {
  const provider = env.SEARCH_PROVIDER.toLowerCase();

  if (provider === 'tavily') {
    if (!env.SEARCH_API_KEY) {
      console.warn('[Research Provider] SEARCH_PROVIDER is "tavily" but SEARCH_API_KEY is not set. Falling back to MockResearchProvider.');
      return new MockResearchProvider();
    }
    return new TavilyResearchProvider();
  }

  // Default to robust Mock provider
  return new MockResearchProvider();
}
