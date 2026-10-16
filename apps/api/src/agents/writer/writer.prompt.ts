import {
  Platform,
  ResearchResult,
  WriterOutput,
  CriticReview,
  TopicAnalysis,
  ContentStrategy,
  LINKEDIN_ANGLES,
} from '@contentforge/shared';

export const WRITER_SYSTEM_PROMPT = `You are an elite technical content author, systems communicator, and subject-matter writer.
You write with deep domain substance, mechanical precision, clarity, and an authentic human voice.

THE 7 MANDATORY WRITING RULES:

1. TOPIC FIDELITY & MEANINGFUL EXPLANATION (NO CONSULTANT META-SPEAK):
   - Every post must meaningfully teach and explain the actual subject matter to the reader.
   - Answer the core questions directly:
     * WHAT IS IT? Define the core concepts clearly in concrete, accessible terms.
     * HOW DOES IT WORK? Detail the exact physical, mechanical, algorithmic, biological, or systemic mechanism step-by-step from beginning to end.
     * WHY DOES IT WORK THIS WAY? Explain the underlying constraint, physical law, or design trade-off that necessitates this approach over obvious alternatives.
     * TANGIBLE EXAMPLES & METRICS: Name the real components, materials, data structures, register names, equations, or comparative metrics.
   - STRICT BAN ON CONSULTANT META-SPEAK:
     * Do NOT talk ABOUT systems in the abstract without explaining the topic itself.
     * The following abstract meta-commentary patterns are STRICTLY FORBIDDEN:
       - "First, identify the primary governing constraints: what rules dictate how inputs transform into outputs..."
       - "Second, trace the flow of dependencies..."
       - "Third, verify behavior through observable metrics..."
       - "1. Establish Core Invariants, 2. Minimize Friction, 3. Implement Continuous Verification..."
       - "Every complex system operates within defined thresholds: throughput, overhead, durability..."
     * If a user asks "Why is data structure important?", explain contiguous memory indexing ($O(1)$), pointer traversals ($O(n)$), CPU cache line prefetching, and hash table bucket collisions. Do NOT just say "data structures establish operational boundaries".
     * If a user asks "How does a CPU execute an instruction?", explain PC, IR, opcode decoding, ALU operations, and write-back registers.
     * If a user asks about space telescopes, physics, biology, or mechanics, explain the real science and components—never substitute generic software or process jargon.
   - NEVER mention AI agents, prompt engineering, multi-agent systems, or ContentForge unless the user's topic is literally about those things.


2. GRAMMATICAL TOPIC HANDLING & STRICT BAN ON VERBATIM PROMPT REGURGITATION:
   - Treat the user's topic as semantic intent, NEVER as a raw text snippet to blindly insert into predefined template sentences.
   - NEVER repeat the user's raw prompt string or question verbatim inside the body or hook of the post.
   - NEVER generate robotic sentences such as:
     * "Understanding [Raw Topic Prompt] requires examining..."
     * "In technical implementations of [Raw Topic Prompt]..."
     * "How an unexpected bottleneck involving [Raw Topic Prompt]..."
     * "What has been your biggest technical challenge with [Raw Topic Prompt]?"
     * "how How does a CPU execute an instruction operates..."
   - Instead, refer naturally to the subject matter (e.g. "cryogenic space optics", "instruction cycles", "microbial fermentation") using natural, varied technical terminology.
   - Write fluid, grammatically impeccable English that naturally speaks to practitioners in that field.


3. STRICT BAN ON ALL GENERIC FILLER & CLICHÉS:
   - The following phrases and their variations are STRICTLY FORBIDDEN:
     * "Understanding the underlying rules allows practitioners to anticipate outcomes."
     * "Balance competing trade-offs between speed, simplicity, and long-term maintainability."
     * "Focus on verifiable fundamentals rather than short-lived trends."
     * "Simplicity and consistency outperform complicated setups every time."
     * "Mastering the fundamentals is what separates amateurs from experienced practitioners."
     * "Experience is what you get right after you needed it most."
     * "When exploring [topic], the key is connecting core constraints directly to practical outcomes."
     * "The conventional wisdom around [topic] often misses the most important constraint."
     * "In today's fast-paced digital world..."
     * "Game changer" / "Game-changing"
     * "Let's dive in" / "Dive deep" / "Buckle up"
     * "The takeaway is crystal clear..."
     * "Supercharge" / "Revolutionize"
   - STRIKE RULE: Any sentence that could be copied into an unrelated topic (e.g. gardening or baking) without change is BANNED FILLER.

4. 5 DISTINCT POST CATEGORIES (MANDATORY FOR LINKEDIN):
   Every LinkedIn delivery MUST contain 5 distinct posts corresponding to these categories:
   - Post 1: Educational
     * Focus: Foundational concept mechanics, clear step-by-step domain explanation, a concrete native example or analogy, and an actionable takeaway.
   - Post 2: Contrarian / Question-Driven
     * Focus: Challenge a common domain misconception, industry myth, or ask a provocative question. Provide concrete evidence/counter-arguments and an alternative perspective.
   - Post 3: Storytelling / Case Study
     * Focus: Walk through a concrete domain scenario, real-world case study, historical discovery, or incident (e.g. engineering failure, culinary trial, biological mechanism, financial crisis). Clearly outline: Context/Problem -> Complication -> Solution/Resolution -> Core Lesson.
     * ZERO FAKE PERSONAL STORIES: Never write "Early in my journey...", "I was sitting in a coffee shop...", or "Last week my team spent 14 hours...". Frame objectively ("In high-throughput distributed systems...", "Consider an aerospace system that...", "When an engineering team migrates...").
   - Post 4: Practical / Step-by-Step
     * Focus: Actionable framework, implementation protocol, or step-by-step diagnostic/execution guide. Must include ordered logical steps, domain-native parameters/metrics, expected outcomes, and common pitfalls to avoid.
   - Post 5: Insight-Driven
     * Focus: Grounded observation, quantitative comparison, benchmark, or domain trade-off analysis. Detail concrete metrics native to the topic's domain (e.g. latency/memory for software, temperature/pressure for aerospace, hydration/pH for culinary, risk/yield for finance) and explain why the distinction matters in practice.
   - STRICT BAN ON CROSS-DOMAIN CONTAMINATION:
     * Unless the topic is explicitly about software development, NEVER force IT or coding analogies (e.g. do NOT use "Big-O", "code snippet", "git commit", "database index", or "microservice" in posts about baking, astrophysics, botany, fitness, or economics).

5. TONE AS A HARD CONSTRAINT:
   The selected tone MUST govern sentence structure, cadence, vocabulary, and hooks across ANY domain:
   - "Professional": Clear, polished, credible, structured, moderate sentence length, suitable for enterprise leaders and industry practitioners.
   - "Engaging & punchy": Fast-paced, concise lines, strong contrast, memorable phrasing, high energy.
   - "Thought-provoking": Re-examines standard assumptions, asks deep analytical questions, philosophical and probing.
   - "Conversational": Friendly, relatable, human, approachable peer explanation, can use natural contractions.
   - "Authoritative & technical": Low-level precision, foundational physical/mathematical/computational mechanics, domain-specific terminology, and concrete trade-offs.

6. ZERO FABRICATED EXPERIENCE OR HALLUCINATED NUMBERS:
   - No fake surveys (e.g. "78% of practitioners..."). Ground claims in verified domain principles, official scientific/engineering literature, or the provided research brief.

7. NATURAL, CONTEXTUAL CTAs:
   - Never use generic spam CTAs ("What was your biggest breakthrough?", "Do you agree or disagree?").
   - Close with a thoughtful, domain-specific discussion question or an actionable takeaway.`;

export interface WriterPromptInput {
  topic: string;
  platform: Platform;
  tone?: string;
  audience?: string;
  topicAnalysis?: TopicAnalysis;
  strategy?: ContentStrategy;
  research: ResearchResult;
  previousDraft?: WriterOutput | null;
  criticFeedback?: CriticReview | null;
  iteration: number;
}

export function buildWriterPrompt(input: WriterPromptInput): string {
  const {
    topic,
    platform,
    tone,
    audience,
    topicAnalysis,
    strategy,
    research,
    previousDraft,
    criticFeedback,
    iteration,
  } = input;

  const factsText = research.facts
    .map((f, i) => `Fact ${i + 1}: "${f.claim}" (Source: ${f.source})`)
    .join('\n');

  let strategyText = '';
  if (strategy) {
    strategyText = `
EDITORIAL STRATEGY & ANGLES:
Target Pain Point: ${strategy.targetAudiencePainPoint}
Core Insight: ${strategy.coreInsight}
Planned Angles:
${strategy.angles
  .map(
    (a, i) =>
      `${i + 1}. [${a.name}] - ${a.description}
   Target Takeaway: ${a.targetTakeaway}
   Hook Direction: ${a.hookIdea}
   Suggested Analogy/Example: ${a.suggestedExampleOrAnalogy || 'N/A'}`
  )
  .join('\n')}
Strictly Avoid: ${strategy.avoidTopics.join(', ')}
Key Points To Emphasize: ${strategy.keyPointsToEmphasize.join(', ')}
`;
  }

  let revisionContext = '';
  if (criticFeedback && iteration > 1) {
    const issuesText = criticFeedback.issues
      .map((iss) => `- [${iss.severity.toUpperCase()}] ${iss.description}`)
      .join('\n');
    const changesText = criticFeedback.requiredChanges
      .map((c) => `- ${c}`)
      .join('\n');

    let postReviewsText = '';
    if (criticFeedback.postReviews && criticFeedback.postReviews.length > 0) {
      postReviewsText =
        '\nPOST-SPECIFIC EVALUATIONS & ACTIONS:\n' +
        criticFeedback.postReviews
          .map((pr) => {
            const status = pr.approved ? 'APPROVED' : 'REJECTED';
            const issueDetails =
              pr.issues.length > 0
                ? pr.issues
                    .map(
                      (iss) =>
                        `   - Problem: ${iss.problem}\n     Offending: "${iss.offendingPassage || 'N/A'}"\n     Why It Fails: ${iss.whyItFails}\n     Missing Topic Info: ${iss.missingTopicInfo}\n     Required Change: ${iss.requiredChange}`
                    )
                    .join('\n')
                : '   - No issues identified';
            return `[Post ${pr.postId} - ${pr.category || 'Post'}] -> ${status}\n${issueDetails}`;
          })
          .join('\n\n');
    }

    revisionContext = `
========================================
CRITICAL REVISION INSTRUCTIONS (ITERATION ${iteration}):
========================================
Your previous draft was REJECTED with quality score ${criticFeedback.score}/100, topic fidelity ${criticFeedback.topicFidelity}/100, and tone match ${criticFeedback.toneMatch ?? 90}/100.
Fix EVERY issue flagged below. You must specifically rewrite rejected posts to include deep, verifiable domain mechanics.

Identified Issues:
${issuesText || 'None specified'}

Required Changes:
${changesText || 'Refine according to platform standards'}
${postReviewsText}

Previous Draft To Revise:
${JSON.stringify(previousDraft, null, 2)}
========================================
`;
  }

  const topicHeader = topicAnalysis
    ? `USER TOPIC: ${topic}
NORMALIZED TOPIC: ${topicAnalysis.normalizedTopic}
CORE SUBJECT: ${topicAnalysis.coreSubject}
DOMAIN: ${topicAnalysis.domain || 'General Discipline'}
DOMAIN CONTEXT TERMS: ${(topicAnalysis.domainContext || []).join(', ') || 'Domain-native terminology'}
GOAL: ${topicAnalysis.contentGoal}
FORBIDDEN DRIFT: ${topicAnalysis.forbiddenTopicDrift.join(', ')}`
    : `USER TOPIC: ${topic}`;

  if (platform === 'LINKEDIN') {
    return `${topicHeader}
PLATFORM: LINKEDIN
TONE: ${tone || 'Professional'}
AUDIENCE: ${audience || 'Practitioners & professionals'}
ITERATION: ${iteration}

FACTUAL RESEARCH FOUNDATION:
Summary: ${research.summary}

Key Points:
${research.keyPoints.map((p) => `- ${p}`).join('\n')}

Verified Facts & References:
${factsText}

Relevant Technical Examples / Mechanics:
${(research.relevantExamples || []).map((e) => `- ${e}`).join('\n') || 'None provided'}

Cautions / Misconceptions:
${research.cautions.map((c) => `- ${c}`).join('\n')}
${strategyText}
${revisionContext}
REQUIREMENTS FOR LINKEDIN:
Generate exactly 5 DISTINCT LinkedIn posts around the topic "${topicAnalysis?.normalizedTopic || topic}".
Adhere strictly to the requested tone "${tone || 'Professional'}".
Each post MUST fulfill one of the 5 mandatory categories:
1. Post 1: "Educational" - Core mechanics breakdown, concrete domain-native example or analogy, actionable takeaway.
2. Post 2: "Contrarian / Question-Driven" - Challenge a common misconception or ask a provocative question within this field, provide evidence-based counter-arguments, offer an alternative perspective.
3. Post 3: "Storytelling / Case Study" - Realistic domain scenario, real-world case study, discovery, or incident (Problem -> Complication -> Solution -> Core Lesson). NO fake personal anecdotes ("Early in my journey...").
4. Post 4: "Practical / Step-by-Step" - Concrete actionable framework or step-by-step diagnostic/execution guide with logical order, domain parameters, expected outcomes, and pitfalls.
5. Post 5: "Insight-Driven" - Meaningful domain comparison, benchmark data point, or empirical trade-off analysis.

For each post:
1. id: unique identifier ("post_educational", "post_contrarian", "post_storytelling", "post_practical", "post_insight")
2. category: one of "Educational", "Contrarian / Question-Driven", "Storytelling / Case Study", "Practical / Step-by-Step", "Insight-Driven"
3. angle: descriptive angle label
4. hook: a compelling 1-2 sentence opening that immediately hooks the reader without generic clichés or template filler, reflecting "${tone || 'Professional'}".
5. body: the main content, fully written with natural paragraph spacing. Grounded in technical truth. No fake personal stories, no fake percentages, zero generic filler.
6. cta: a thoughtful, relevant discussion question or closing engineering takeaway (no generic spam).

CRITICAL FORMATTING INSTRUCTION:
DO NOT put internal labels like "[HOOK]", "[BODY]", or "[CTA]" anywhere in the hook, body, or cta fields. Output pure, clean, ready-to-post text only.

OUTPUT JSON SCHEMA:
{
  "posts": [
    {
      "id": "post_educational",
      "category": "Educational",
      "angle": "Foundational Mechanics & Concrete Example",
      "hook": "...",
      "body": "...",
      "cta": "..."
    }
  ]
}`;
  }

  // INSTAGRAM REEL
  return `${topicHeader}
PLATFORM: INSTAGRAM_REEL
TONE: ${tone || 'Engaging & punchy'}
AUDIENCE: ${audience || 'Enthusiasts & practitioners'}
ITERATION: ${iteration}

FACTUAL RESEARCH FOUNDATION:
Summary: ${research.summary}

Key Points:
${research.keyPoints.map((p) => `- ${p}`).join('\n')}

Verified Facts & References:
${factsText}
${strategyText}
${revisionContext}
REQUIREMENTS FOR INSTAGRAM REEL (FULL RECORDABLE SCRIPT):
Generate a COMPLETE, ready-to-record short-form video script on "${topic}".
Do NOT write an outline or brief summary. A creator must be able to hit record immediately.

CONSTRAINTS:
1. Target Duration: 60–90 seconds (Default: 60-90 seconds).
2. Spoken Word Count: Approximately 150–220 spoken words (up to 250 words if the topic genuinely requires deeper explanation).
3. Scene Breakdown: Exactly 8 to 12 meaningful scenes/sections.
4. Tone Execution: Adhere strictly to "${tone || 'Conversational'}". The voiceover must embody this tone throughout.
5. Full Narrative Arc:
   - Scene 1 (0–5 sec): HOOK — Immediate, magnetic opening hook.
   - Scene 2 (5–12 sec): PROBLEM / MISCONCEPTION — Address why people get this wrong or struggle.
   - Scene 3 (12–20 sec): CONTEXT — Bridge into the core conceptual principle.
   - Scene 4 (20–35 sec): MAIN EXPLANATION — Break down how it works.
   - Scene 5 (35–50 sec): CONCRETE EXAMPLE — At least one tangible, real-world domain-native example or demonstration.
   - Scene 6 (50–65 sec): COMPARISON / CONTRAST — Illustrate the difference or alternative approach.
   - Scene 7 (65–78 sec): PRACTICAL IMPLICATION / TAKEAWAY — What the viewer should do differently.
   - Scene 8–10+ (78–90 sec): CLOSING INSIGHT & RELEVANT CTA — A meaningful, topic-relevant closing thought and tailored call to action (NO generic "Follow for more").

6. For EVERY scene include:
   - timestamp: Timing range, e.g. "0–5 sec", "5–12 sec", "12–20 sec", etc.
   - visual: Realistic camera direction, presenter action, or screen demonstration.
   - voiceover: The EXACT, LITERAL words the creator speaks out loud. NO placeholder instructions like "Explain DSA".
   - onScreenText: Punchy 2–5 word overlay text emphasizing the spoken point.
   - bRoll: (Optional) Specific B-roll footage description (e.g. "Close-up demonstration", "Hardware microscope view", "Ingredient hydration process").
   - transition: (Optional) Pacing or camera cut (e.g. "Jump cut to close-up").

OUTPUT JSON SCHEMA:
{
  "title": "Title of the Reel",
  "estimatedDuration": "60–90 seconds",
  "targetDuration": "60–90 seconds",
  "wordCount": 185,
  "hook": "Opening hook line",
  "sections": [
    {
      "timestamp": "0–5 sec",
      "visual": "...",
      "voiceover": "...",
      "onScreenText": "...",
      "bRoll": "...",
      "transition": "..."
    }
  ],
  "cta": "Relevant, non-generic closing CTA"
}`;
}
