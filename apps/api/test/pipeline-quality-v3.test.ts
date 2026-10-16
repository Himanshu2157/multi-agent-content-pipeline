import { describe, it, expect } from 'vitest';
import { ContentGenerationGraph } from '../src/agents/graph/content.graph.js';
import { MockLLMProvider } from '../src/providers/llm/llm.provider.js';
import { MockResearchProvider } from '../src/providers/research/research.provider.js';
import { db } from '../src/services/database.service.js';
import { MANDATORY_POST_CATEGORIES, LinkedInOutput } from '@contentforge/shared';

const BANNED_PHRASES = [
  'understanding the underlying rules allows practitioners to anticipate outcomes',
  'balance competing trade-offs between speed, simplicity, and long-term maintainability',
  'focus on verifiable fundamentals rather than short-lived trends',
  'simplicity and consistency outperform complicated setups every time',
  'mastering the fundamentals is what separates amateurs from experienced practitioners',
  'experience is what you get right after you needed it most',
  'connecting core constraints directly to practical outcomes',
  'early in my journey with',
  'how how does',
  'breakdown of how how does',
  'identify the primary governing constraints',
  'trace the flow of dependencies',
  'verify behavior through observable metrics',
  'establish core invariants and baseline constraints',
  'minimize friction and redundant complexity',
  'stress-test operational boundaries',
  'throughput & velocity',
  'under sustained, real-world operational stress',
  'standard advice frequently promotes one-size-fits-all rules for',
  'examine the three distinct operational stages',
  'input & activation state',
  'core transformation mechanism',
  'output stabilization & resolution',
  'confusing superficial symptoms with the actual governing mechanism',
  'diagnosing a breakdown revealed an unexpected variable in the core mechanism',
  'suddenly degraded by over 70%',
  '4-step diagnostic and execution protocol for mastering',
  'the underlying trade-off curves that govern',
  'throughput vs latency: pushing for maximum volume',
  'resource consumption vs structural resilience',
  'adaptability vs specialization',
  'avoid superficial oversimplifications',
  'save this implementation checklist for your next project involving',
  'which of these trade-offs is most critical in your applications of',
];

describe('Section 10 Quality & Content Fidelity Verification Suite', () => {
  const llm = new MockLLMProvider();
  const research = new MockResearchProvider();

  const section10Topics = [
    {
      topic: 'How does a CPU execute an instruction?',
      domainKeywords: ['fetch', 'decode', 'execute', 'program counter', 'alu', 'registers', 'opcode'],
    },
    {
      topic: 'Binary search in C.',
      domainKeywords: ['midpoint', 'overflow', 'int_max', 'logarithmic', 'o(log n)', 'boundary'],
    },
    {
      topic: 'How Google Antigravity assists with software development.',
      domainKeywords: ['agentic', 'closed-loop', 'ast', 'verification', 'test', 'self-correction'],
    },
    {
      topic: 'Time complexity of merge sort.',
      domainKeywords: ['master theorem', 'o(n log n)', 'recurrence', 'divide-and-conquer', 'auxiliary memory'],
    },
    {
      topic: 'How to build a personal expense tracker.',
      domainKeywords: ['cents', 'floating-point', 'sqlite', 'ledger', 'schema', 'aggregation'],
    },
  ];

  for (const { topic, domainKeywords } of section10Topics) {
    it(`Topic Fidelity & Anti-Filler Audit: "${topic}"`, async () => {
      const project = await db.createProject({
        name: `Section10: ${topic.slice(0, 30)}`,
        topic,
        platform: 'LINKEDIN',
        tone: 'Professional',
        audience: 'Software Engineers & Architects',
        maxIterations: 3,
      });

      const generation = await db.createGeneration(project.id);
      const graph = new ContentGenerationGraph(llm, research, db);

      const finalState = await graph.run({
        projectId: project.id,
        generationId: generation.id,
        topic: project.topic,
        platform: project.platform,
        tone: project.tone,
        audience: project.audience,
        maxIterations: 3,
      });

      expect(finalState.status).toBe('COMPLETED');
      expect(finalState.approved).toBe(true);
      expect(finalState.draft).toBeDefined();

      const output = finalState.draft as LinkedInOutput;
      expect(output.posts).toHaveLength(5);

      // 1. Verify all 5 mandatory post categories are satisfied
      const categoriesInOutput = output.posts.map((p) => p.category);
      for (const requiredCategory of MANDATORY_POST_CATEGORIES) {
        expect(categoriesInOutput).toContain(requiredCategory);
      }

      // 2. String Concatenation & Anti-Filler Audit across all posts
      const fullText = output.posts
        .map((p) => `${p.hook}\n${p.body}\n${p.cta || ''}`)
        .join('\n\n')
        .toLowerCase();

      for (const banned of BANNED_PHRASES) {
        expect(fullText).not.toContain(banned);
      }

      // 3. Topic Replacement Test: ensure deep domain keywords exist in output
      let matchedKeywords = 0;
      for (const kw of domainKeywords) {
        if (fullText.includes(kw.toLowerCase())) {
          matchedKeywords++;
        }
      }
      expect(matchedKeywords).toBeGreaterThanOrEqual(3);

      // 4. Verify post-by-post audit was recorded in critic reviews
      const savedGen = await db.getGenerationById(generation.id);
      expect(savedGen?.criticReviews?.length).toBeGreaterThanOrEqual(1);

      const latestReview = savedGen!.criticReviews[savedGen!.criticReviews.length - 1];
      expect(latestReview.approved).toBe(true);
      expect(latestReview.postReviews).toBeDefined();
      expect(latestReview.postReviews!.length).toBe(5);

      for (const pr of latestReview.postReviews!) {
        expect(pr.approved).toBe(true);
        expect(pr.scores.relevance).toBeGreaterThanOrEqual(85);
        expect(pr.scores.depth).toBeGreaterThanOrEqual(80);
        expect(pr.scores.total).toBeGreaterThanOrEqual(85);
      }
    });
  }

  it('Arbitrary Topic Grounding Test: Zero generic filler for unseen topics', async () => {
    const arbitraryTopic = 'Distributed Consensus with Paxos and Raft';
    const project = await db.createProject({
      name: 'Arbitrary Consensus Topic',
      topic: arbitraryTopic,
      platform: 'LINKEDIN',
      tone: 'Authoritative & technical',
      audience: 'Distributed Systems Engineers',
      maxIterations: 2,
    });

    const generation = await db.createGeneration(project.id);
    const graph = new ContentGenerationGraph(llm, research, db);

    const finalState = await graph.run({
      projectId: project.id,
      generationId: generation.id,
      topic: project.topic,
      platform: project.platform,
      tone: project.tone,
      audience: project.audience,
      maxIterations: 2,
    });

    expect(finalState.status).toBe('COMPLETED');
    expect(finalState.draft).toBeDefined();

    const output = finalState.draft as LinkedInOutput;
    expect(output.posts).toHaveLength(5);

    const fullText = output.posts
      .map((p) => `${p.hook}\n${p.body}\n${p.cta || ''}`)
      .join('\n\n')
      .toLowerCase();

    // Verify zero generic banned filler phrases
    for (const banned of BANNED_PHRASES) {
      expect(fullText).not.toContain(banned);
    }

    // Verify no malformed duplicate question insertions
    expect(fullText).not.toMatch(/how\s+how\s+does/i);
    expect(fullText).not.toMatch(/breakdown of how How does/i);

    // Verify normalized topic grounding is embedded throughout
    expect(fullText).toContain('consensus');
    expect(fullText).toContain('paxos');
    expect(fullText).toContain('raft');
    expect(fullText).toContain('quorum');
  });

  it('Unpredictable Arbitrary Topic Dynamic Fallback: Explains operational stages with zero consultant meta-speak', async () => {
    const rawTopic = 'How does a mechanical espresso machine extract coffee?';
    const project = await db.createProject({
      name: 'Espresso Machine Extraction',
      topic: rawTopic,
      platform: 'LINKEDIN',
      tone: 'Professional',
      audience: 'Coffee Enthusiasts & Engineers',
      maxIterations: 2,
    });

    const generation = await db.createGeneration(project.id);
    const graph = new ContentGenerationGraph(llm, research, db);

    const finalState = await graph.run({
      projectId: project.id,
      generationId: generation.id,
      topic: project.topic,
      platform: project.platform,
      tone: project.tone,
      audience: project.audience,
      maxIterations: 2,
    });

    expect(finalState.status).toBe('COMPLETED');
    expect(finalState.approved).toBe(true);
    expect(finalState.draft).toBeDefined();

    const output = finalState.draft as LinkedInOutput;
    expect(output.posts).toHaveLength(5);

    const fullText = output.posts
      .map((p) => `${p.hook}\n${p.body}\n${p.cta || ''}`)
      .join('\n\n')
      .toLowerCase();

    // Verify zero generic banned filler / consultant meta-speak phrases
    for (const banned of BANNED_PHRASES) {
      expect(fullText).not.toContain(banned);
    }

    // Verify topic grounding
    expect(fullText).toContain('espresso');

    // Verify meaningful domain explanation
    expect(fullText).toContain('pressure');
    expect(fullText).toContain('puck');
    expect(fullText).toContain('extraction');
    expect(fullText).toContain('crema');
  });

  it('Post-Level Selective Revision Verification: Iteration 1 preserves passing posts and revises only failing posts', async () => {
    const project = await db.createProject({
      name: 'Selective Revision Test',
      topic: 'How does a CPU execute an instruction?',
      platform: 'LINKEDIN',
      tone: 'Professional',
      audience: 'Systems Programmers',
      maxIterations: 3,
    });

    const generation = await db.createGeneration(project.id);
    const graph = new ContentGenerationGraph(llm, research, db);

    const finalState = await graph.run({
      projectId: project.id,
      generationId: generation.id,
      topic: project.topic,
      platform: project.platform,
      tone: project.tone,
      audience: project.audience,
      maxIterations: 3,
    });

    expect(finalState.status).toBe('COMPLETED');
    expect(finalState.iteration).toBe(2);

    const savedGen = await db.getGenerationById(generation.id);
    expect(savedGen?.drafts?.length).toBe(2);

    const draft1 = savedGen!.drafts[0];
    const draft2 = savedGen!.drafts[1];

    expect(draft1.contentHash).not.toBe(draft2.contentHash);

    const review1 = savedGen!.criticReviews[0];
    const review2 = savedGen!.criticReviews[1];

    expect(review1.approved).toBe(false);
    expect(review2.approved).toBe(true);

    // Review 1 had selective post reviews
    expect(review1.postReviews).toBeDefined();
    const approvedInR1 = review1.postReviews!.filter((pr) => pr.approved).map((pr) => pr.postId);
    const rejectedInR1 = review1.postReviews!.filter((pr) => !pr.approved).map((pr) => pr.postId);

    expect(approvedInR1.length).toBeGreaterThan(0);
    expect(rejectedInR1.length).toBeGreaterThan(0);

    // Review 2 has all posts approved
    expect(review2.postReviews!.every((pr) => pr.approved)).toBe(true);
  });

  it('Unpredictable Testing Topic: JWST Beryllium & Gold mirrors has authentic domain content with zero verbatim prompt regurgitation and zero software filler', async () => {
    const rawTopic = 'Why the James Webb Space Telescope uses beryllium mirrors coated in vapor-deposited gold';
    const project = await db.createProject({
      name: 'JWST Beryllium Gold Optics',
      topic: rawTopic,
      platform: 'LINKEDIN',
      tone: 'Authoritative & technical',
      audience: 'Astrophysicists & Optical Systems Engineers',
      maxIterations: 2,
    });

    const generation = await db.createGeneration(project.id);
    const graph = new ContentGenerationGraph(llm, research, db);

    const finalState = await graph.run({
      projectId: project.id,
      generationId: generation.id,
      topic: project.topic,
      platform: project.platform,
      tone: project.tone,
      audience: project.audience,
      maxIterations: 2,
    });

    expect(finalState.status).toBe('COMPLETED');
    expect(finalState.approved).toBe(true);
    expect(finalState.draft).toBeDefined();

    const output = finalState.draft as LinkedInOutput;
    expect(output.posts).toHaveLength(5);

    const fullText = output.posts
      .map((p) => `${p.hook}\n${p.body}\n${p.cta || ''}`)
      .join('\n\n')
      .toLowerCase();

    // Verify 100% authentic physics & aerospace content
    expect(fullText).toContain('beryllium');
    expect(fullText).toContain('gold');
    expect(fullText).toContain('infrared');
    expect(fullText).toMatch(/35 kelvin|-238/);

    // Verify ZERO verbatim prompt insertion / mad-lib filler
    expect(fullText).not.toContain('in technical implementations of why the');
    expect(fullText).not.toContain('understanding why the james webb');
    expect(fullText).not.toMatch(/bottleneck involving why the/i);

    // Verify ZERO generic software jargon on space optics
    expect(fullText).not.toContain('unindexed');
    expect(fullText).not.toContain('thread contention');
    expect(fullText).not.toContain('ops/sec');
    expect(fullText).not.toContain('kubernetes');

    // Verify zero generic banned filler phrases
    for (const banned of BANNED_PHRASES) {
      expect(fullText).not.toContain(banned);
    }
  });

  it('Non-Software Domain Pipeline: Microbial Ecology of Sourdough Fermentation generated with 100% authentic biochemistry & zero software contamination', async () => {
    const rawTopic = 'Microbial Ecology of Sourdough Fermentation';
    const project = await db.createProject({
      name: 'Sourdough Fermentation Microbiology',
      topic: rawTopic,
      platform: 'LINKEDIN',
      tone: 'Authoritative & technical',
      audience: 'Food Scientists & Artisan Bakers',
      maxIterations: 2,
    });

    const generation = await db.createGeneration(project.id);
    const graph = new ContentGenerationGraph(llm, research, db);

    const finalState = await graph.run({
      projectId: project.id,
      generationId: generation.id,
      topic: project.topic,
      platform: project.platform,
      tone: project.tone,
      audience: project.audience,
      maxIterations: 2,
    });

    expect(finalState.status).toBe('COMPLETED');
    expect(finalState.approved).toBe(true);
    expect(finalState.draft).toBeDefined();

    const output = finalState.draft as LinkedInOutput;
    expect(output.posts).toHaveLength(5);

    const fullText = output.posts
      .map((p) => `${p.hook}\n${p.body}\n${p.cta || ''}`)
      .join('\n\n')
      .toLowerCase();

    // Verify 100% authentic food microbiology & fermentation science
    expect(fullText).toContain('lactobacillus');
    expect(fullText).toContain('candida');
    expect(fullText).toContain('maltose');
    expect(fullText).toContain('gluten');
    expect(fullText).toMatch(/ph\s*(?:3|4|<)/);
    expect(fullText).toContain('protease');

    // Verify ZERO cross-domain contamination / forced software IT terms
    expect(fullText).not.toContain('microservice');
    expect(fullText).not.toContain('kubernetes');
    expect(fullText).not.toContain('database index');
    expect(fullText).not.toContain('b-tree');
    expect(fullText).not.toContain('big-o');
    expect(fullText).not.toContain('ops/sec');
    expect(fullText).not.toContain('unindexed');

    // Verify zero generic banned filler phrases
    for (const banned of BANNED_PHRASES) {
      expect(fullText).not.toContain(banned);
    }

    // Verify critic review recorded high topic fidelity and relevance
    const savedGen = await db.getGenerationById(generation.id);
    const latestReview = savedGen!.criticReviews[savedGen!.criticReviews.length - 1];
    expect(latestReview.approved).toBe(true);
    expect(latestReview.topicFidelity).toBeGreaterThanOrEqual(90);
    expect(latestReview.relevance).toBeGreaterThanOrEqual(85);
  });

  it('Non-Software Domain Pipeline: Biochemistry of Photosynthesis and the Calvin Cycle generated with 100% biophysical mechanics & zero template overfitting', async () => {
    const rawTopic = 'Biochemistry of Photosynthesis and the Calvin Cycle';
    const project = await db.createProject({
      name: 'Photosynthesis Calvin Cycle',
      topic: rawTopic,
      platform: 'LINKEDIN',
      tone: 'Authoritative & technical',
      audience: 'Biochemists & Plant Physiologists',
      maxIterations: 2,
    });

    const generation = await db.createGeneration(project.id);
    const graph = new ContentGenerationGraph(llm, research, db);

    const finalState = await graph.run({
      projectId: project.id,
      generationId: generation.id,
      topic: project.topic,
      platform: project.platform,
      tone: project.tone,
      audience: project.audience,
      maxIterations: 2,
    });

    expect(finalState.status).toBe('COMPLETED');
    expect(finalState.approved).toBe(true);
    expect(finalState.draft).toBeDefined();

    const output = finalState.draft as LinkedInOutput;
    expect(output.posts).toHaveLength(5);

    const fullText = output.posts
      .map((p) => `${p.hook}\n${p.body}\n${p.cta || ''}`)
      .join('\n\n')
      .toLowerCase();

    // Verify 100% authentic biochemistry & plant physiology
    expect(fullText).toContain('photosystem');
    expect(fullText).toContain('chlorophyll');
    expect(fullText).toContain('rubisco');
    expect(fullText).toContain('calvin');
    expect(fullText).toContain('photolysis');
    expect(fullText).toContain('atp synthase');

    // Verify ZERO software engineering template overfitting
    expect(fullText).not.toContain('microservice');
    expect(fullText).not.toContain('kubernetes');
    expect(fullText).not.toContain('database index');
    expect(fullText).not.toContain('b-tree');
    expect(fullText).not.toContain('big-o');
    expect(fullText).not.toContain('git bisect');
    expect(fullText).not.toContain('pull request');

    // Verify zero generic banned filler phrases
    for (const banned of BANNED_PHRASES) {
      expect(fullText).not.toContain(banned);
    }
  });

  it('Non-Software Domain Pipeline: Commercial Jet Engine Reverse Thrust generated with 100% authentic aerospace mechanics & zero mad-lib filler', async () => {
    const graph = new ContentGenerationGraph(llm, research, db);

    const project = await db.createProject({
      topic: 'How do commercial jet engines generate reverse thrust upon landing?',
      platform: 'LINKEDIN',
      tone: 'Authoritative & technical',
      audience: 'Aerospace enthusiasts & engineering students',
      maxIterations: 2,
    });

    const generation = await db.createGeneration({
      projectId: project.id,
      iteration: 1,
    });

    const finalState = await graph.run({
      projectId: project.id,
      generationId: generation.id,
      topic: project.topic,
      platform: project.platform,
      tone: project.tone,
      audience: project.audience,
      maxIterations: 2,
    });

    expect(finalState.status).toBe('COMPLETED');
    expect(finalState.approved).toBe(true);
    expect(finalState.draft).toBeDefined();

    const output = finalState.draft as LinkedInOutput;
    expect(output.posts).toHaveLength(5);

    const fullText = output.posts
      .map((p) => `${p.hook}\n${p.body}\n${p.cta || ''}`)
      .join('\n\n')
      .toLowerCase();

    // Verify authentic aerospace mechanics
    expect(fullText).toContain('bypass');
    expect(fullText).toContain('blocker doors');
    expect(fullText).toContain('cascade vanes');
    expect(fullText).toContain('wheel brakes');
    expect(fullText).toContain('60 knots');

    // Verify zero software template contamination
    expect(fullText).not.toContain('microservice');
    expect(fullText).not.toContain('kubernetes');
    expect(fullText).not.toContain('database index');
    expect(fullText).not.toContain('git bisect');

    // Verify zero generic banned filler or mad-lib phrases
    for (const banned of BANNED_PHRASES) {
      expect(fullText).not.toContain(banned);
    }
  });
});
