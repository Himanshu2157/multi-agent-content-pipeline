import { CriticReview, CriticReviewSchema, PostReview } from '@contentforge/shared';
import { LLMProvider, createLLMProvider } from '../../providers/llm/llm.provider.js';
import { CRITIC_SYSTEM_PROMPT, buildCriticPrompt, CriticPromptInput } from './critic.prompt.js';

const BANNED_FILLER_PATTERNS: Array<{ pattern: RegExp; description: string }> = [
  {
    pattern: /understanding the underlying rules allows practitioners to anticipate outcomes/i,
    description: 'Contains generic filler: "Understanding the underlying rules allows practitioners to anticipate outcomes."',
  },
  {
    pattern: /balance competing trade-offs between speed, simplicity, and long-term maintainability/i,
    description: 'Contains generic filler: "Balance competing trade-offs between speed, simplicity, and long-term maintainability."',
  },
  {
    pattern: /focus on verifiable fundamentals rather than short-lived trends/i,
    description: 'Contains generic filler: "Focus on verifiable fundamentals rather than short-lived trends."',
  },
  {
    pattern: /simplicity and consistency outperform complicated setups every time/i,
    description: 'Contains generic filler: "Simplicity and consistency outperform complicated setups every time."',
  },
  {
    pattern: /mastering the fundamentals is what separates amateurs from experienced practitioners/i,
    description: 'Contains generic filler: "Mastering the fundamentals is what separates amateurs from experienced practitioners."',
  },
  {
    pattern: /experience is what you get right after you needed it most/i,
    description: 'Contains generic cliché: "Experience is what you get right after you needed it most."',
  },
  {
    pattern: /connecting core constraints directly to practical outcomes/i,
    description: 'Contains generic template phrase: "connecting core constraints directly to practical outcomes."',
  },
  {
    pattern: /early in my journey with/i,
    description: 'Contains fabricated personal anecdote template: "Early in my journey with..."',
  },
  {
    pattern: /unexpected challenge taught me a lesson i will never forget/i,
    description: 'Contains fabricated personal story template: "unexpected challenge taught me a lesson I will never forget."',
  },
  {
    pattern: /how\s+how\s+does/i,
    description: 'Grammatically malformed topic insertion: duplicate "how How does..." detected.',
  },
  {
    pattern: /breakdown of how How does/i,
    description: 'Grammatically malformed template: "breakdown of how How does..." detected.',
  },
  {
    pattern: /(?:in technical implementations of|bottleneck involving|breakdown of how)\s+(?:how|why|what)\s+/i,
    description: 'Robotic insertion of raw user question prompt into template sentence.',
  },
  {
    pattern: /(?:understanding|perspective on)\s+(?:why (?:the|does|do|is|are|should)|how (?:does|do|to|a)|what (?:is|are|does))\s+/i,
    description: 'Robotic insertion of raw user question prompt into hook or sentence.',
  },
  {
    pattern: /what has been your biggest technical challenge with (?:how|why|what)\s+/i,
    description: 'Robotic insertion of raw user question prompt into CTA template.',
  },
  {
    pattern: /identify the primary governing constraints/i,
    description: 'Contains generic consultant meta-speak: "identify the primary governing constraints"',
  },
  {
    pattern: /trace the flow of dependencies/i,
    description: 'Contains generic consultant meta-speak: "trace the flow of dependencies"',
  },
  {
    pattern: /verify behavior through observable metrics/i,
    description: 'Contains generic consultant meta-speak: "verify behavior through observable metrics"',
  },
  {
    pattern: /establish core invariants and baseline constraints/i,
    description: 'Contains generic consultant meta-speak: "establish core invariants and baseline constraints"',
  },
  {
    pattern: /minimize friction and redundant complexity/i,
    description: 'Contains generic consultant meta-speak: "minimize friction and redundant complexity"',
  },
  {
    pattern: /stress-test operational boundaries/i,
    description: 'Contains generic consultant meta-speak: "stress-test operational boundaries"',
  },
  {
    pattern: /throughput & velocity:\s*how rapidly/i,
    description: 'Contains generic consultant meta-speak: "Throughput & Velocity: how rapidly..."',
  },
  {
    pattern: /under sustained,?\s*real-world operational stress,?\s*unexpected edge-case interactions emerged/i,
    description: 'Contains generic canned case study template.',
  },
  {
    pattern: /standard advice frequently promotes one-size-fits-all rules for/i,
    description: 'Contains generic canned contrarian template.',
  },
  {
    pattern: /examine the three distinct operational stages/i,
    description: 'Contains generic systems meta-speak: "examine the three distinct operational stages"',
  },
  {
    pattern: /input & activation state/i,
    description: 'Contains generic systems meta-speak: "Input & Activation State"',
  },
  {
    pattern: /core transformation mechanism/i,
    description: 'Contains generic systems meta-speak: "Core Transformation Mechanism"',
  },
  {
    pattern: /output stabilization & resolution/i,
    description: 'Contains generic systems meta-speak: "Output Stabilization & Resolution"',
  },
  {
    pattern: /confusing superficial symptoms with the actual governing mechanism/i,
    description: 'Contains generic canned template: "confusing superficial symptoms with the actual governing mechanism"',
  },
  {
    pattern: /diagnosing a breakdown revealed an unexpected variable in the core mechanism/i,
    description: 'Contains generic canned case study template.',
  },
  {
    pattern: /in a complex operational setting,?\s*baseline performance/i,
    description: 'Contains generic canned case study setting template.',
  },
  {
    pattern: /suddenly degraded by over 70%/i,
    description: 'Contains generic canned 70% degradation metric.',
  },
  {
    pattern: /4-step diagnostic and execution protocol for mastering/i,
    description: 'Contains generic canned protocol template.',
  },
  {
    pattern: /the underlying trade-off curves that govern/i,
    description: 'Contains generic canned trade-off template.',
  },
  {
    pattern: /throughput vs latency:\s*pushing for maximum volume/i,
    description: 'Contains generic canned systems trade-off.',
  },
  {
    pattern: /resource consumption vs structural resilience/i,
    description: 'Contains generic canned systems trade-off.',
  },
  {
    pattern: /adaptability vs specialization/i,
    description: 'Contains generic canned systems trade-off.',
  },
  {
    pattern: /avoid superficial oversimplifications/i,
    description: 'Prompt instruction leakage: "Avoid superficial oversimplifications" found in text.',
  },
  {
    pattern: /save this implementation checklist for your next project involving/i,
    description: 'Generic mad-lib template phrase: "Save this implementation checklist for your next project involving..."',
  },
  {
    pattern: /which of these trade-offs is most critical in your applications of/i,
    description: 'Generic mad-lib template CTA: "Which of these trade-offs is most critical in your applications of..."',
  },
  {
    pattern: /by systematically addressing .* reliable operation was established/i,
    description: 'Generic mad-lib case study resolution template.',
  },
];

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
  'aren', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both',
  'but', 'by', 'can', 'cannot', 'could', 'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her',
  'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is',
  'it', 'its', 'itself', 'just', 'let', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor',
  'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves',
  'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the',
  'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when',
  'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours',
  'between', 'within', 'across', 'without', 'along', 'among', 'during', 'toward', 'towards',
  'via', 'per', 'vs', 'versus', 'instead', 'regardless', 'despite', 'furthermore', 'moreover',
]);

export function matchesKeyword(token: string, keyword: string): boolean {
  if (token === keyword) return true;
  if (keyword.endsWith('s') && token === keyword.slice(0, -1)) return true;
  if (token.endsWith('s') && keyword === token.slice(0, -1)) return true;
  if (keyword.endsWith('ing') && token.startsWith(keyword.slice(0, -3))) return true;
  if (token.endsWith('ing') && keyword.startsWith(token.slice(0, -3))) return true;
  if (keyword.endsWith('ed') && token.startsWith(keyword.slice(0, -2))) return true;
  if (token.endsWith('ed') && keyword.startsWith(token.slice(0, -2))) return true;
  if (keyword.length >= 6 && token.startsWith(keyword.slice(0, -2))) return true;
  if (token.length >= 6 && keyword.startsWith(token.slice(0, -2))) return true;
  return false;
}

export const FORCED_SOFTWARE_TERMS = [
  'microservice',
  'kubernetes',
  'docker container',
  'big-o',
  'b-tree',
  'sql query',
  'postgres',
  'database index',
  'tuple header',
  'mvcc',
  'autovacuum',
  'pointer traversal',
  'cache line prefetching',
  'heap table',
  'git commit',
  'git bisect',
  'pull request',
  'stack overflow exception',
  'tail-call optimization',
];

export function extractKeywords(text?: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
}

function getCoreTopicKeywords(input: CriticPromptInput): string[] {
  const words = new Set<string>();
  const addFromText = (txt?: string) => {
    if (!txt) return;
    for (const kw of extractKeywords(txt)) {
      words.add(kw);
    }
  };

  addFromText(input.topic);
  if (input.topicAnalysis) {
    addFromText(input.topicAnalysis.normalizedTopic);
    addFromText(input.topicAnalysis.coreSubject);
    (input.topicAnalysis.allowedSubtopics || []).forEach(addFromText);
    (input.topicAnalysis.domainContext || []).forEach(addFromText);
  }
  if (input.research) {
    addFromText(input.research.centralSubject);
    (input.research.subtopics || []).forEach(addFromText);
    (input.research.keyPoints || []).forEach(addFromText);
  }

  return Array.from(words);
}

function isNonSoftwareDomain(input: CriticPromptInput): boolean {
  const combined = [
    input.topic,
    input.topicAnalysis?.domain || '',
    input.topicAnalysis?.coreSubject || '',
  ].join(' ').toLowerCase();

  const softwareIndicators = [
    'software', 'code', 'coding', 'programming', 'developer', 'database', 'algorithm',
    'data structure', 'git', 'cpu', 'computer', 'binary', 'recursion', 'api', 'server',
    'linux', 'hardware', 'cache', 'distributed', 'consensus', 'raft', 'paxos', 'postgres',
    'compiler', 'runtime', 'micro-operation', 'instruction', 'antigravity', 'engineering with google'
  ];

  return !softwareIndicators.some((ind) => combined.includes(ind));
}

export class CriticAgent {
  private llmProvider: LLMProvider;

  constructor(llmProvider?: LLMProvider) {
    this.llmProvider = llmProvider || createLLMProvider();
  }

  async execute(input: CriticPromptInput): Promise<CriticReview> {
    const prompt = buildCriticPrompt(input);

    const rawReview = await this.llmProvider.generateStructured<CriticReview>(
      prompt,
      CriticReviewSchema,
      {
        systemPrompt: CRITIC_SYSTEM_PROMPT,
        temperature: 0.1, // Strict, deterministic grading
        maxRetries: 2,
      }
    );

    // Apply strict quality, tone, and platform guardrails
    const isLinkedIn = input.platform === 'LINKEDIN';
    const issues = [...rawReview.issues];
    let finalApproved = rawReview.approved;

    // 1. Programmatic Check for Banned Generic Filler & Malformed Patterns
    const draftText = JSON.stringify(input.draft);
    for (const check of BANNED_FILLER_PATTERNS) {
      if (check.pattern.test(draftText)) {
        finalApproved = false;
        issues.push({
          type: 'topic_replacement_failure',
          severity: 'high',
          description: `Topic Replacement Test failed: ${check.description}. Replace generic filler with specific technical domain mechanics.`,
        });
      }
    }

    // 2. Programmatic Semantic Relevance & Cross-Domain Audit for LinkedIn
    let postReviews: PostReview[] = rawReview.postReviews ? [...rawReview.postReviews] : [];
    if (isLinkedIn && 'posts' in input.draft) {
      const posts = (input.draft as any).posts as Array<{
        id: string;
        category?: string;
        angle: string;
        hook: string;
        body: string;
        cta?: string;
      }>;

      const isNonSoftware = isNonSoftwareDomain(input);
      const coreKeywords = getCoreTopicKeywords(input);

      // Ensure every post has an individual review
      postReviews = posts.map((post) => {
        const existing = rawReview.postReviews?.find(
          (pr) => pr.postId === post.id || pr.category === post.category
        );

        const postFullText = `${post.hook} ${post.body} ${post.cta || ''}`;
        const postLower = postFullText.toLowerCase();
        const postIssues = existing?.issues ? [...existing.issues] : [];
        let postApproved = existing?.approved ?? true;

        // Check banned patterns on this specific post
        for (const check of BANNED_FILLER_PATTERNS) {
          if (check.pattern.test(postFullText)) {
            postApproved = false;
            postIssues.push({
              problem: 'Failed Topic Replacement Test (Generic Filler)',
              offendingPassage: check.description,
              whyItFails: 'This sentence is generic filler that does not explain the topic mechanics.',
              missingTopicInfo: `Requires concrete technical details specific to "${input.topic}".`,
              requiredChange: 'Rewrite passage to describe actual hardware/software/system mechanics.',
            });
          }
        }

        // Semantic Overlap Validation
        const postTokens = extractKeywords(postFullText);
        const matchingKeywords = coreKeywords.filter((kw) =>
          postTokens.some((tok) => matchesKeyword(tok, kw))
        );
        if (coreKeywords.length > 0 && matchingKeywords.length === 0) {
          postApproved = false;
          postIssues.push({
            problem: 'Semantic Misalignment (Zero Topic Overlap)',
            offendingPassage: post.hook.substring(0, 100),
            whyItFails: `The post text shares no semantic or conceptual overlap with "${input.topic}".`,
            missingTopicInfo: `Requires concrete concepts and explanations specific to "${input.topic}".`,
            requiredChange: `Rewrite post completely to teach and explain the subject matter of "${input.topic}".`,
          });
        }

        // Cross-Domain Contamination Validation
        const foundContamination = isNonSoftware
          ? FORCED_SOFTWARE_TERMS.find((term) => postLower.includes(term))
          : undefined;
        if (foundContamination) {
          postApproved = false;
          postIssues.push({
            problem: 'Cross-Domain Contamination (Forced Software/IT Jargon)',
            offendingPassage: foundContamination,
            whyItFails: `The post forces software engineering jargon ("${foundContamination}") into a non-software topic.`,
            missingTopicInfo: `Requires authentic domain concepts native to "${input.topic}".`,
            requiredChange: `Rewrite using authentic vocabulary and concepts of ${input.topicAnalysis?.domain || 'this field'}.`,
          });
        }

        // Check for empty or too short body
        if (post.body.trim().length < 80) {
          postApproved = false;
          postIssues.push({
            problem: 'Insufficient Depth',
            whyItFails: 'Post body lacks meaningful technical depth.',
            missingTopicInfo: 'Missing concrete steps, mechanics, or examples.',
            requiredChange: 'Expand with practical details and explanations.',
          });
        }

        const scores = existing?.scores || {
          relevance: postApproved ? 95 : 35,
          depth: postApproved ? 92 : 45,
          accuracy: postApproved ? 95 : 50,
          readability: postApproved ? 90 : 75,
          categoryMatch: postApproved ? 95 : 60,
          originality: postApproved ? 90 : 50,
          total: postApproved ? 93 : 48,
        };

        if (!postApproved && (matchingKeywords.length === 0 || foundContamination)) {
          scores.relevance = Math.min(scores.relevance, 35);
          scores.accuracy = Math.min(scores.accuracy, 50);
          scores.total = Math.min(scores.total, 48);
        }

        return {
          postId: post.id,
          category: post.category || post.angle,
          approved: postApproved && (scores.total >= 85) && postIssues.length === 0,
          scores,
          issues: postIssues,
          requiredChanges: existing?.requiredChanges || (postApproved ? [] : ['Add concrete domain details and remove generic filler.']),
        };
      });

      const anyPostRejected = postReviews.some((pr) => !pr.approved);
      if (anyPostRejected) {
        finalApproved = false;
      }

      const hasSemanticFailure = postReviews.some((pr) =>
        pr.issues.some((iss) => iss.problem.includes('Semantic Misalignment'))
      );
      const hasContaminationFailure = postReviews.some((pr) =>
        pr.issues.some((iss) => iss.problem.includes('Cross-Domain Contamination'))
      );

      if (hasSemanticFailure && !issues.some((i) => i.type === 'semantic_misalignment')) {
        issues.push({
          type: 'semantic_misalignment',
          severity: 'high',
          description: `Content fails semantic relevance validation: draft content has zero overlap with "${input.topic}".`,
        });
        finalApproved = false;
      }

      if (hasContaminationFailure && !issues.some((i) => i.type === 'cross_domain_contamination')) {
        issues.push({
          type: 'cross_domain_contamination',
          severity: 'high',
          description: `Content suffers from template overfitting: forced software engineering jargon detected in non-software topic "${input.topic}".`,
        });
        finalApproved = false;
      }
    }

    // Programmatic Semantic Relevance & Cross-Domain Audit for Instagram Reel
    if (!isLinkedIn && 'sections' in input.draft) {
      const reel = input.draft as any;
      const fullText = `${reel.title || ''} ${reel.hook || ''} ${(reel.sections || []).map((s: any) => s.voiceover || '').join(' ')}`.toLowerCase();
      const isNonSoftware = isNonSoftwareDomain(input);
      const coreKeywords = getCoreTopicKeywords(input);
      const reelTokens = extractKeywords(fullText);
      const matchingKeywords = coreKeywords.filter((kw) =>
        reelTokens.some((tok) => matchesKeyword(tok, kw))
      );
      const foundContamination = isNonSoftware
        ? FORCED_SOFTWARE_TERMS.find((term) => fullText.includes(term))
        : undefined;

      if (coreKeywords.length > 0 && matchingKeywords.length === 0) {
        finalApproved = false;
        issues.push({
          type: 'semantic_misalignment',
          severity: 'high',
          description: `Reel script has zero semantic overlap with the requested topic "${input.topic}".`,
        });
      }

      if (foundContamination) {
        finalApproved = false;
        issues.push({
          type: 'cross_domain_contamination',
          severity: 'high',
          description: `Reel script forces software jargon ("${foundContamination}") into a non-software topic.`,
        });
      }
    }

    // 3. Global Score & Guardrail Checks
    const isTopicFidelityInsufficient = (rawReview.topicFidelity ?? 95) < 90;
    const isToneMatchInsufficient = (rawReview.toneMatch ?? 95) < 85;
    const isFactualAccuracyInsufficient = (rawReview.factualAccuracy ?? 95) < 90;
    const hasFabricatedStats = rawReview.noFabricatedStatistics === false;
    const hasFabricatedExp = rawReview.noFabricatedExperience === false;

    const isPlatformFitInsufficient = isLinkedIn
      ? (rawReview.platformFit ?? 95) < 85
      : (rawReview.platformFit ?? 95) < 90;

    const isUsefulnessInsufficient = isLinkedIn && (rawReview.usefulness ?? 90) < 85;
    const isScriptQualityInsufficient = !isLinkedIn && (rawReview.scriptQuality ?? 85) < 85;
    const isNarrativeQualityInsufficient = !isLinkedIn && (rawReview.narrativeQuality ?? 85) < 85;

    if (isTopicFidelityInsufficient) {
      finalApproved = false;
      if (!issues.some((i) => i.type === 'topic_drift')) {
        issues.push({
          type: 'topic_drift',
          severity: 'high',
          description: `Topic fidelity score is ${rawReview.topicFidelity}/100 (< 90). The content drifts from "${input.topic}". All content must remain strictly focused on the user topic.`,
        });
      }
    }

    if (isToneMatchInsufficient) {
      finalApproved = false;
      if (!issues.some((i) => i.type === 'tone_mismatch')) {
        issues.push({
          type: 'tone_mismatch',
          severity: 'high',
          description: `Tone match score is ${rawReview.toneMatch}/100 (< 85). The content does not genuinely embody the requested "${input.tone || 'Professional'}" tone.`,
        });
      }
    }

    if (hasFabricatedStats) {
      finalApproved = false;
      if (!issues.some((i) => i.type === 'fabricated_statistics')) {
        issues.push({
          type: 'fabricated_statistics',
          severity: 'high',
          description: 'Content contains unverified statistics or fabricated percentages. Remove invented numbers.',
        });
      }
    }

    if (hasFabricatedExp) {
      finalApproved = false;
      if (!issues.some((i) => i.type === 'fabricated_experience')) {
        issues.push({
          type: 'fabricated_experience',
          severity: 'high',
          description: 'Content contains fabricated first-person anecdotes. Replace with objective domain explanations.',
        });
      }
    }

    if (isFactualAccuracyInsufficient) {
      finalApproved = false;
      if (!issues.some((i) => i.type === 'factual_accuracy')) {
        issues.push({
          type: 'factual_accuracy',
          severity: 'high',
          description: `Factual accuracy score is ${rawReview.factualAccuracy}/100 (< 90). Claims must be grounded in verified research.`,
        });
      }
    }

    if (isPlatformFitInsufficient) {
      finalApproved = false;
      if (!issues.some((i) => i.type === 'platform_fit')) {
        issues.push({
          type: 'platform_fit',
          severity: 'medium',
          description: isLinkedIn
            ? `Platform fit score is ${rawReview.platformFit}/100 (< 85). Ensure 5 distinct posts with clear hooks, bodies, and CTAs.`
            : `Platform fit score is ${rawReview.platformFit}/100 (< 90). Ensure 8-12 timed scene breakdowns with recordable voiceover.`,
        });
      }
    }

    if (isUsefulnessInsufficient) {
      finalApproved = false;
      if (!issues.some((i) => i.type === 'usefulness')) {
        issues.push({
          type: 'usefulness',
          severity: 'medium',
          description: `Usefulness score is ${rawReview.usefulness}/100 (< 85). Provide practical, actionable takeaways for the reader.`,
        });
      }
    }

    if (isScriptQualityInsufficient || isNarrativeQualityInsufficient) {
      finalApproved = false;
      if (!issues.some((i) => i.type === 'script_quality')) {
        issues.push({
          type: 'script_quality',
          severity: 'high',
          description: `Script or narrative quality (< 85). Reel script must have full spoken voiceover (150-220 words) with clear narrative progression from hook to concrete example and CTA.`,
        });
      }
    }

    const hasHighSeverityIssue = issues.some((i) => i.severity === 'high');
    if (hasHighSeverityIssue) {
      finalApproved = false;
    }

    // Dynamic, realistic score calculation (weighted per Section 7)
    const hasSemanticOrContaminationIssue = issues.some(
      (i) => i.type === 'semantic_misalignment' || i.type === 'cross_domain_contamination'
    );

    let topicFidelity = rawReview.topicFidelity ?? 90;
    let relevance = rawReview.relevance ?? 90;
    if (hasSemanticOrContaminationIssue) {
      topicFidelity = Math.min(topicFidelity, 35);
      relevance = Math.min(relevance, 35);
    }

    const toneMatch = rawReview.toneMatch ?? 85;
    const factualAccuracy = rawReview.factualAccuracy ?? 90;
    const platformFit = rawReview.platformFit ?? 85;
    const clarity = rawReview.clarity ?? 85;
    const usefulness = rawReview.usefulness ?? 85;

    let calculatedScore = isLinkedIn
      ? Math.round(
          0.25 * topicFidelity +
            0.20 * toneMatch +
            0.20 * factualAccuracy +
            0.15 * platformFit +
            0.10 * usefulness +
            0.10 * clarity
        )
      : Math.round(
          0.20 * topicFidelity +
            0.20 * toneMatch +
            0.15 * factualAccuracy +
            0.15 * platformFit +
            0.15 * (rawReview.scriptQuality ?? 85) +
            0.15 * (rawReview.narrativeQuality ?? 85)
        );

    // If semantic misalignment or contamination present, cap score hard
    if (hasSemanticOrContaminationIssue) {
      calculatedScore = Math.min(calculatedScore, 45);
    } else if (!finalApproved && calculatedScore >= 85) {
      calculatedScore = Math.min(calculatedScore, 80);
    }

    let requiredChanges = [...(rawReview.requiredChanges || [])];
    if (!finalApproved && requiredChanges.length === 0) {
      if (issues.length > 0) {
        requiredChanges = issues.map(
          (iss) => `Address [${iss.severity.toUpperCase()}] ${iss.type}: ${iss.description}`
        );
      } else {
        requiredChanges = [
          'Maintain 100% topic fidelity, eliminate generic filler, match requested tone, and ground assertions in domain facts.',
        ];
      }
    } else if (finalApproved) {
      requiredChanges = [];
    }

    const finalized: CriticReview = {
      ...rawReview,
      topicFidelity,
      toneMatch,
      factualAccuracy,
      relevance,
      platformFit,
      clarity,
      originality: rawReview.originality ?? 85,
      naturalness: rawReview.naturalness ?? 85,
      usefulness,
      noFabricatedExperience: rawReview.noFabricatedExperience ?? true,
      noFabricatedStatistics: rawReview.noFabricatedStatistics ?? true,
      approved: finalApproved,
      score: calculatedScore,
      issues,
      requiredChanges,
      postReviews: postReviews.length > 0 ? postReviews : undefined,
    };

    return CriticReviewSchema.parse(finalized);
  }
}
