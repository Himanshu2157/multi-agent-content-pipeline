import { ZodType } from 'zod';
import { env } from '../../config/env.js';

export interface LLMGenerateOptions {
  systemPrompt?: string;
  temperature?: number;
  maxRetries?: number;
}

export interface LLMProvider {
  name: string;
  generateStructured<T>(
    prompt: string,
    schema: ZodType<T, any, any>,
    options?: LLMGenerateOptions
  ): Promise<T>;
}

// Helper to strip markdown JSON formatting if LLM wraps in ```json ... ```
export function extractJsonFromText(text: string): string {
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  return trimmed;
}

// Mock LLM Provider for robust automated testing and zero-cost local execution
export class MockLLMProvider implements LLMProvider {
  name = 'mock';

  async generateStructured<T>(
    prompt: string,
    schema: ZodType<T, any, any>,
    options?: LLMGenerateOptions
  ): Promise<T> {
    const system = (options?.systemPrompt || '').toLowerCase();
    const lowerPrompt = prompt.toLowerCase();

    // 1. Critic Agent
    if (system.includes('quality reviewer') || lowerPrompt.includes('quality reviewer') || lowerPrompt.includes('evaluation criteria')) {
      const iterationMatch = prompt.match(/ITERATION:\s*(\d+)/i);
      const iteration = iterationMatch ? parseInt(iterationMatch[1], 10) : 1;

      // In iteration 1, we can either approve or offer constructive critique to demonstrate iteration cycle
      // If prompt asks to approve or if iteration >= 2, approve.
      const shouldApprove = iteration >= 2 || lowerPrompt.includes('high quality draft') || lowerPrompt.includes('approve: true');

      if (shouldApprove) {
        const approvedReview = {
          approved: true,
          score: 94,
          factualAccuracy: 96,
          relevance: 95,
          platformFit: 94,
          clarity: 93,
          originality: 92,
          issues: [],
          requiredChanges: [],
        };
        return schema.parse(approvedReview);
      } else {
        const revisionReview = {
          approved: false,
          score: 78,
          factualAccuracy: 84,
          relevance: 90,
          platformFit: 85,
          clarity: 82,
          originality: 80,
          issues: [
            {
              type: 'factual_attribution',
              severity: 'medium',
              description: 'The claim regarding 62% reduction in iteration cycles is stated without mentioning the Gartner source cited in the research.',
            },
            {
              type: 'hook_strength',
              severity: 'low',
              description: 'The opening hook could be sharper and more provocative to stop scrollers in the first 2 seconds.',
            },
          ],
          requiredChanges: [
            'Explicitly attribute the 62% cycle reduction statistic to Gartner Research to preserve credibility.',
            'Strengthen the hook with a more punchy, contrarian opening statement.',
          ],
        };
        return schema.parse(revisionReview);
      }
    }

    // 2. Writer Agent - Instagram Reel
    if (
      lowerPrompt.includes('platform: instagram_reel') ||
      lowerPrompt.includes('requirements for instagram reel') ||
      lowerPrompt.includes('short-form video script')
    ) {
      const topicMatch = prompt.match(/TOPIC:\s*([^\n\r]+)/i);
      const topic = topicMatch ? topicMatch[1].trim() : 'Autonomous AI';

      const mockReel = {
        title: `Why Prompting is Dead: The Autonomous Revolution in ${topic}`,
        estimatedDuration: '45 seconds',
        hook: `Stop writing 500-word prompts for AI. Here is what senior engineers are doing instead.`,
        sections: [
          {
            timestamp: '0–5 sec',
            visual: `Fast-paced zoom on a user deleting a long, messy ChatGPT prompt on a laptop screen with red error overlay.`,
            voiceover: `If you are still tweaking prompts ten times just to get one usable post on ${topic}, you are doing it backwards.`,
            onScreenText: `STOP PROMPT BABYSITTING 🛑`,
          },
          {
            timestamp: '5–15 sec',
            visual: `Split-screen diagram showing 3 connected autonomous agents: Research Specialist, Writer, and Critic with live data flowing.`,
            voiceover: `Modern workflows use multi-agent pipelines. Agent 1 crawls verified sources. Agent 2 writes the draft. And Agent 3 attacks it for factual errors before you ever see it.`,
            onScreenText: `The 3-Agent Architecture ⚙️`,
          },
          {
            timestamp: '15–30 sec',
            visual: `Dynamic graphics highlighting the Gartner stat: '62% Faster Iterations' with clean data visualizer and source citation.`,
            voiceover: `Gartner found this reduces iteration time by 62%. Instead of you acting as the unpaid editor, the AI critiques and refines itself until it's verified.`,
            onScreenText: `62% Faster Iterations (Gartner) 📊`,
          },
          {
            timestamp: '30–40 sec',
            visual: `Clean UI walkthrough of ContentForge showing one-click generation and verified citations appearing in real-time.`,
            voiceover: `You provide the thesis. The multi-agent pipeline handles research, drafting, and rigorous quality control.`,
            onScreenText: `Thesis In → Verified Content Out 🚀`,
          },
          {
            timestamp: '40–45 sec',
            visual: `Presenter smiling to camera with sleek text badge and follow prompt.`,
            voiceover: `Follow for more insights on autonomous agent architecture, and check the caption for the full breakdown!`,
            onScreenText: `Drop a 💡 in the comments!`,
          },
        ],
        cta: `Save this Reel and drop a comment with your favorite agent tool!`,
      };

      return schema.parse(mockReel);
    }

    // 3. Writer Agent - LinkedIn
    if (
      lowerPrompt.includes('platform: linkedin') ||
      lowerPrompt.includes('requirements for linkedin') ||
      lowerPrompt.includes('distinct linkedin posts')
    ) {
      const topicMatch = prompt.match(/TOPIC:\s*([^\n\r]+)/i);
      const topic = topicMatch ? topicMatch[1].trim() : 'Autonomous AI';

      const mockLinkedIn = {
        posts: [
          {
            id: 'post_angle_educational',
            angle: 'Educational',
            hook: `Most people are using AI backwards: they prompt, get frustrated, and rewrite the prompt 10 times.`,
            body: `Here is the architectural reality of modern content creation:\n\nSingle-turn prompting forces the human to act as the critic, researcher, and editor.\n\nAccording to Gartner's 2025 analysis, organizations switching to autonomous agent pipelines reduced iteration cycles by 62%.\n\nInstead of one model doing everything:\n1. Agent A researches verified empirical sources\n2. Agent B drafts platform-specific content\n3. Agent C challenges every claim and demands revisions\n\nThe result? Zero prompt fatigue and verifiable factual accuracy.`,
            cta: `Have you moved from prompt-engineering to autonomous pipelines yet? Let's discuss in the comments.`,
          },
          {
            id: 'post_angle_contrarian',
            angle: 'Contrarian/question-driven',
            hook: `Unpopular opinion: "Prompt Engineering" is a symptom of broken AI UX, not a long-term skill.`,
            body: `If your software requires 15 prompt iterations to produce a usable breakdown of ${topic}, the software failed—not you.\n\nMIT Technology Review found that 73% of digital professionals suffer from prompt-refinement fatigue.\n\nWhy should humans do what a closed-loop Critic Agent does in 4 seconds?\n\nStop tweaking adverbs in your prompt. Give the system a thesis and let autonomous agents critique and refine themselves until it meets the quality bar.`,
            cta: `Are you still hand-crafting 200-word prompts? Share your take below.`,
          },
          {
            id: 'post_angle_storytelling',
            angle: 'Storytelling',
            hook: `Last year, our team spent 14 hours every week tweaking AI prompts for content. It felt like babysitting a calculator.`,
            body: `Every session looked identical:\n- Ask AI for an insightful post on ${topic}\n- Get generic corporate fluff\n- Tweak prompt with "Be direct, use stats"\n- Get fabricated numbers and broken URLs\n\nEverything changed when we decoupled research from writing and added an independent Critic Agent.\n\nWhen the Critic Agent began rejecting unverified claims before we ever saw them, our team got 8 hours back every week.\n\nQuality doesn't come from clever prompts. It comes from automated quality control loops.`,
            cta: `Save this post if you're ready to automate your content QA workflow.`,
          },
          {
            id: 'post_angle_practical',
            angle: 'Practical/step-by-step',
            hook: `How to build a self-refining content engine for ${topic} (in 4 steps):`,
            body: `Stop writing prompts from scratch. Here is the exact pipeline modern teams use:\n\nStep 1: Deep Research Extraction\nGather real citations, benchmark metrics, and counter-arguments before writing a single word.\n\nStep 2: Platform-Constrained Drafting\nConstrain the writer agent to strict structure, hooks, and verified facts.\n\nStep 3: Adversarial Quality Review\nRun an automated Critic Agent that scores factual grounding, clarity, and platform fit.\n\nStep 4: Autonomous Feedback Loop\nIf the Critic flags an issue, route feedback directly back to the Writer until approved.\n\nStanford AI Index metrics show multi-agent verification cuts hallucination rates by up to 88%.`,
            cta: `Which step is currently the biggest bottleneck in your team's workflow?`,
          },
          {
            id: 'post_angle_data',
            angle: 'Data/insight driven',
            hook: `3 empirical numbers that prove the future of ${topic} belongs to agentic systems:`,
            body: `Data from recent 2025–2026 studies reveals a massive structural shift:\n\n1. 73% of creators report prompt fatigue as their top productivity drain (MIT Tech Review).\n2. 62% cycle time reduction achieved when shifting to autonomous review loops (Gartner).\n3. 88% reduction in ungrounded assertions through automated critic agents (Stanford AI Index).\n\nThe takeaway is crystal clear: human creators should set the vision and thesis, while autonomous multi-agent pipelines handle the verification and refinement.`,
            cta: `How is your organization measuring GenAI productivity gains this quarter?`,
          },
        ],
      };

      return schema.parse(mockLinkedIn);
    }

    // 4. Research Agent
    if (
      lowerPrompt.includes('research specialist') ||
      lowerPrompt.includes('verified search results') ||
      lowerPrompt.includes('extract 3 to 5 key points')
    ) {
      const topicMatch = prompt.match(/TOPIC:\s*([^\n\r]+)/i);
      const topic = topicMatch ? topicMatch[1].trim() : 'Advanced AI and Technology';

      const mockData = {
        topic,
        summary: `Comprehensive research synthesis examining current developments, empirical metrics, and industry shifts surrounding ${topic}. Leading analysis indicates accelerated adoption driven by quantifiable efficiency gains and organizational restructuring.`,
        keyPoints: [
          `Rapid enterprise and creator adoption of ${topic} has surged by 47% year-over-year according to 2025-2026 industry benchmarks.`,
          `Primary drivers include dramatic reductions in cognitive fatigue and workflow friction when repetitive prompt-engineering is replaced by autonomous pipelines.`,
          `Critical bottlenecks remain around factual hallucination rates, requiring multi-layered critique and automated citation verification.`,
          `Early adopters report a 3.4x throughput multiplier in verified content outputs compared to manual single-turn prompting.`,
        ],
        facts: [
          {
            claim: `Organizations deploying autonomous agent workflows saw a 62% reduction in content iteration cycles in 2025.`,
            source: `Gartner Emerging Tech & GenAI Practice (2025 Report)`,
            confidence: 'high',
          },
          {
            claim: `Over 73% of digital creators cite prompt-refinement fatigue as their primary productivity hurdle when using generative AI.`,
            source: `MIT Technology Review Insights Survey`,
            confidence: 'high',
          },
          {
            claim: `Autonomous multi-agent verification reduces factual hallucination rates by up to 88% compared to single-agent zero-shot prompting.`,
            source: `Stanford AI Index & Agentic Systems Benchmarks (2025)`,
            confidence: 'medium',
          },
        ],
        sources: [
          {
            title: `The State of Agentic AI & Cognitive Workflows in 2026`,
            url: `https://www.gartner.com/en/articles/agentic-ai-workforce-trends`,
            publisher: `Gartner Research`,
            date: `January 2026`,
          },
          {
            title: `Empirical Benchmarks for Multi-Agent Self-Correction Architectures`,
            url: `https://arxiv.org/abs/2411.08901`,
            publisher: `arXiv AI Systems`,
            date: `November 2025`,
          },
          {
            title: `Overcoming Prompt Fatigue: The Shift to Self-Refining Content Engines`,
            url: `https://www.technologyreview.com/2026/01/prompt-fatigue-agents`,
            publisher: `MIT Technology Review`,
            date: `January 2026`,
          },
        ],
        cautions: [
          `Avoid claiming 100% hallucination elimination; all current LLM architectures require ongoing human-in-the-loop oversight for high-stakes assertions.`,
          `Metrics should be contextualized within enterprise pilot programs rather than broad consumer adoption.`,
        ],
      };

      return schema.parse(mockData);
    }



    // Fallback default
    throw new Error(`MockLLMProvider could not identify prompt schema structure: ${prompt.substring(0, 100)}`);
  }
}

// OpenAI LLM Provider
export class OpenAILLMProvider implements LLMProvider {
  name = 'openai';
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || env.LLM_API_KEY || '';
    this.model = model || env.LLM_MODEL || 'gpt-4o-mini';
  }

  async generateStructured<T>(
    prompt: string,
    schema: ZodType<T, any, any>,
    options?: LLMGenerateOptions
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error('OpenAI API Key is missing. Set LLM_API_KEY in environment variables.');
    }

    const systemPrompt =
      (options?.systemPrompt || '') +
      '\n\nIMPORTANT: You MUST respond ONLY with a single valid JSON object strictly matching the requested schema. Do not output markdown fences or commentary.';

    const maxRetries = options?.maxRetries ?? 2;
    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            temperature: options?.temperature ?? 0.2,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
          }),
        });

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`OpenAI API error (${response.status}): ${errBody}`);
        }

        const data = (await response.json()) as any;
        const content = data.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error('Empty response from OpenAI');
        }

        const cleanedJson = extractJsonFromText(content);
        const parsed = JSON.parse(cleanedJson);
        const validated = schema.safeParse(parsed);

        if (validated.success) {
          return validated.data;
        } else {
          lastError = new Error(`JSON schema validation error: ${JSON.stringify(validated.error.format())}`);
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    throw new Error(`Failed to generate valid structured LLM output after ${maxRetries + 1} attempts: ${lastError?.message}`);
  }
}

// Factory Function
export function createLLMProvider(): LLMProvider {
  const provider = env.LLM_PROVIDER.toLowerCase();

  if (provider === 'openai') {
    if (!env.LLM_API_KEY) {
      console.warn('[LLM Provider] LLM_PROVIDER is "openai" but LLM_API_KEY is not set. Falling back to MockLLMProvider.');
      return new MockLLMProvider();
    }
    return new OpenAILLMProvider();
  }

  // Default to robust Mock provider
  return new MockLLMProvider();
}
