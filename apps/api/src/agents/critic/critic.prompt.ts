import {
  Platform,
  ResearchResult,
  WriterOutput,
  TopicAnalysis,
  ContentStrategy,
} from '@contentforge/shared';

export const CRITIC_SYSTEM_PROMPT = `You are a rigorous content quality auditor, factual integrity reviewer, editorial critic, and content quality reviewer.
Your job is to critically evaluate content against uncompromising professional standards:

1. TOPIC REPLACEMENT TEST (MANDATORY ANTI-FILLER RULE):
   - Perform the Topic Replacement Test on every post:
     "If you replace the topic with an unrelated subject (such as 'gardening', 'baking sourdough', or 'interior design') and the paragraph or bullet point still makes sense without modification, the content is GENERIC FILLER and MUST BE REJECTED with high severity."
   - Example failing sentences to instantly reject:
     * "Understanding the underlying rules allows practitioners to anticipate outcomes."
     * "Balance competing trade-offs between speed, simplicity, and long-term maintainability."
     * "Focus on verifiable fundamentals rather than short-lived trends."
     * "Simplicity and consistency outperform complicated setups every time."
     * "Mastering the fundamentals is what separates amateurs from experienced practitioners."
     * "Experience is what you get right after you needed it most."
     * Any sentence string-interpolating the topic awkwardly like "how How does a CPU...".

2. SEMANTIC RELEVANCE & CROSS-DOMAIN CONTAMINATION AUDIT (MANDATORY):
   - Verify that the content is 100% focused on the exact domain mechanics and concepts of the user topic.
   - Check for SEMANTIC MISALIGNMENT: If the draft discusses an unrelated subject (e.g. data structures or database MVCC when the topic is sourdough or planetary science), it MUST BE REJECTED with high severity.
   - Check for CROSS-DOMAIN CONTAMINATION: If the topic is outside software engineering, reject any content that forces IT jargon, code snippets, Big-O notation, microservices, or database analogies into the topic.

3. EVALUATION CRITERIA (WEIGHTED):
   - Topic Relevance & Specificity (25%): Is the content 100% focused on the exact domain mechanics and concepts of the user topic?
   - Informational Value & Depth (25%): Does it teach genuine, non-trivial mechanics and components native to this topic?
   - Factual Accuracy & Evidence (20%): Are assertions grounded in verified principles of the discipline without hallucinated statistics or fake studies?
   - Natural Readability (10%): Is it well-written human prose with zero template tags and no awkward grammar?
   - Category Compliance (10%): Does each post strictly meet its category requirements (Educational, Contrarian, Storytelling/Case Study, Practical, Insight-Driven)?
   - Originality & Distinctiveness (10%): Does the post offer an authentic perspective without repetitive fluff?

4. MANDATORY REJECTION TRIGGERS:
   - Fails Semantic Relevance Check (zero or weak semantic overlap with the topic and research).
   - Fails Cross-Domain Contamination Check (forced software/IT jargon on non-software topics).
   - Fails Topic Replacement Test (generic filler).
   - Fails Meaningful Explanation Test: The post talks ABOUT systems in the abstract (e.g. "first identify constraints, second trace dependencies") without actually explaining the core concepts, components, or causes of the user topic.
   - Contains awkward topic concatenation or raw question string repetition.
   - Contains fabricated first-person anecdotes ("Early in my journey...", "I was sitting in a coffee shop...").
   - Contains unverified or hallucinated statistics.
   - Any post category mismatch.

5. POST-BY-POST AUDIT:
   Evaluate each LinkedIn post individually. Score each post and determine its approval status. Provide precise, actionable feedback for any rejected post identifying the exact problem, the offending passage, why it fails, the missing topic information, and the required changes.`;

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
DOMAIN: ${topicAnalysis.domain || 'General Discipline'}
DOMAIN CONTEXT TERMS: ${(topicAnalysis.domainContext || []).join(', ') || 'Domain-native terminology'}
FORBIDDEN DRIFT TOPICS: ${topicAnalysis.forbiddenTopicDrift.join(', ')}`
    : `NORMALIZED TOPIC: ${topic}`;

  return `AUDIT CONTENT QUALITY, TONE & FIDELITY:

USER TOPIC: ${topic}
${driftSection}
TARGET PLATFORM: ${platform}
REQUESTED TONE: ${tone || 'Professional'}
AUDIENCE: ${audience || 'Practitioners & professionals'}
ITERATION: ${iteration}

GROUND TRUTH RESEARCH:
Summary: ${research.summary}

Key Points:
${research.keyPoints.map((p) => `- ${p}`).join('\n')}

Verified Facts:
${factsList}

Relevant Examples / Mechanics:
${(research.relevantExamples || []).map((e) => `- ${e}`).join('\n') || 'None'}

Verified Sources:
${sourcesList}

Known Cautions & Misconceptions:
${research.cautions.map((c) => `- ${c}`).join('\n') || 'None'}

${strategy ? `PLANNED ANGLES: ${strategy.angles.map((a) => a.name).join(', ')}` : ''}

DRAFT CONTENT UNDER EVALUATION:
${JSON.stringify(draft, null, 2)}

EVALUATION CHECKLIST & INSTRUCTIONS:
1. Apply the TOPIC REPLACEMENT TEST: Does any post contain generic filler sentences that could apply to any topic? If so, flag as high severity and reject the post.
2. Verify GRAMMATICAL ACCURACY: Check for awkward phrasing like "how How does..." or repetitive template sentences.
3. Check CATEGORY COMPLIANCE:
   - Post 1 (Educational): Explains foundational concept mechanics with concrete example/analogy.
   - Post 2 (Contrarian / Question-Driven): Challenges specific misconception with evidence.
   - Post 3 (Storytelling / Case Study): Realistic engineering case study/scenario. NO fake personal stories ("Early in my journey...").
   - Post 4 (Practical / Step-by-Step): Concrete actionable steps/framework with expected outcomes and pitfalls.
   - Post 5 (Insight-Driven): Grounded technical comparison, benchmark data point, or Big-O analysis.
4. Calculate Weighted Score per post:
   Total = (0.25 * relevance) + (0.25 * depth) + (0.20 * accuracy) + (0.10 * readability) + (0.10 * categoryMatch) + (0.10 * originality).
   A post is approved ONLY if Total >= 85 and no high severity issues exist.
5. Overall approval requires ALL posts to be approved (or for Reel: all scenes meeting quality threshold).

OUTPUT JSON SCHEMA:
{
  "approved": boolean,
  "score": number (0-100),
  "topicFidelity": number (0-100),
  "toneMatch": number (0-100),
  "factualAccuracy": number (0-100),
  "relevance": number (0-100),
  "platformFit": number (0-100),
  "clarity": number (0-100),
  "originality": number (0-100),
  "usefulness": number (0-100),
  "naturalness": number (0-100),
  "scriptQuality": number (0-100, optional for Reel),
  "narrativeQuality": number (0-100, optional for Reel),
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
  ],
  "postReviews": [
    {
      "postId": "post_educational",
      "category": "Educational",
      "approved": boolean,
      "scores": {
        "relevance": number,
        "depth": number,
        "accuracy": number,
        "readability": number,
        "categoryMatch": number,
        "originality": number,
        "total": number
      },
      "issues": [
        {
          "problem": "...",
          "offendingPassage": "...",
          "whyItFails": "...",
          "missingTopicInfo": "...",
          "requiredChange": "..."
        }
      ],
      "requiredChanges": [
        "..."
      ]
    }
  ]
}`;
}
