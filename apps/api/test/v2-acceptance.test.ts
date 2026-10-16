import { describe, it, expect, beforeEach } from 'vitest';
import { ContentGenerationGraph } from '../src/agents/graph/content.graph.js';
import { MockLLMProvider } from '../src/providers/llm/llm.provider.js';
import { MockResearchProvider } from '../src/providers/research/research.provider.js';
import { db } from '../src/services/database.service.js';
import { InstagramReelOutput, LinkedInOutput } from '@contentforge/shared';

describe('ContentForge V2 Acceptance Tests', () => {
  let llm: MockLLMProvider;
  let research: MockResearchProvider;

  beforeEach(() => {
    llm = new MockLLMProvider();
    research = new MockResearchProvider();
  });

  // =========================================================================
  // Part 22 — Instagram Reel Complete Recordable Script Acceptance Test
  // =========================================================================
  it('Part 22: Generates a complete 60–90 second Instagram Reel script with 8–12 scenes and ~200 spoken words', async () => {
    const project = await db.createProject({
      name: 'DSA Reel Project',
      topic: 'Why are data structures important?',
      platform: 'INSTAGRAM_REEL',
      tone: 'Conversational',
      audience: 'Computer science students',
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

    const reel = finalState.draft as InstagramReelOutput;
    
    // 1. Duration check (60-90s)
    expect(reel.targetDuration).toBe('60–90 seconds');
    expect(reel.estimatedDuration).toContain('60–90');

    // 2. Scene count check (8-12 scenes)
    expect(reel.sections.length).toBeGreaterThanOrEqual(8);
    expect(reel.sections.length).toBeLessThanOrEqual(12);

    // 3. Spoken word count check (150-220+ words)
    const totalVoiceoverWords = reel.sections
      .map((s) => s.voiceover.split(/\s+/).filter(Boolean).length)
      .reduce((sum, count) => sum + count, 0);

    expect(totalVoiceoverWords).toBeGreaterThanOrEqual(150);
    expect(reel.wordCount).toBeGreaterThanOrEqual(150);

    // 4. Recordable script details: visual, onScreenText, bRoll, transition
    for (const section of reel.sections) {
      expect(section.timestamp).toBeDefined();
      expect(section.visual.length).toBeGreaterThan(10);
      expect(section.voiceover.length).toBeGreaterThan(15);
      expect(section.onScreenText).toBeDefined();
      // Should not contain placeholder tags like [VOICEOVER] or [SCENE]
      expect(section.voiceover).not.toMatch(/\[.*\]/);
      expect(section.visual).not.toMatch(/\[.*\]/);
    }

    // 5. Narrative progression checks
    expect(reel.hook.length).toBeGreaterThan(20);
    expect(reel.cta.length).toBeGreaterThan(10);
  });

  // =========================================================================
  // Part 23 — Tone Differentiation Acceptance Test
  // =========================================================================
  it('Part 23: Generating content across all 5 tones produces distinct hooks, vocabulary, and angles', async () => {
    const tones = [
      'Professional',
      'Engaging & punchy',
      'Thought-provoking',
      'Conversational',
      'Authoritative & technical',
    ];

    const results: Record<string, LinkedInOutput> = {};

    for (const tone of tones) {
      const project = await db.createProject({
        name: `Tone Test: ${tone}`,
        topic: 'Why is data structure important?',
        platform: 'LINKEDIN',
        tone,
        audience: 'Software Engineers',
      });

      const generation = await db.createGeneration(project.id);
      const graph = new ContentGenerationGraph(llm, research, db);

      const state = await graph.run({
        projectId: project.id,
        generationId: generation.id,
        topic: project.topic,
        platform: project.platform,
        tone: project.tone,
        audience: project.audience,
        maxIterations: 2,
      });

      expect(state.status).toBe('COMPLETED');
      expect(state.draft).toBeDefined();
      results[tone] = state.draft as LinkedInOutput;
    }

    // Compare hooks across all 5 tones for Educational post
    const educationalHooks = tones.map((tone) => {
      const post = results[tone].posts.find((p) => p.id === 'post_educational' || p.angle === 'Educational');
      return post?.hook || '';
    });

    // Every hook must be non-empty
    educationalHooks.forEach((hook) => expect(hook.length).toBeGreaterThan(10));

    // Every pair of hooks must be distinct (not identical)
    for (let i = 0; i < educationalHooks.length; i++) {
      for (let j = i + 1; j < educationalHooks.length; j++) {
        expect(educationalHooks[i]).not.toBe(educationalHooks[j]);
      }
    }

    // Tone specific markers:
    // Punchy should have short sentences
    const punchyHook = results['Engaging & punchy'].posts[0].hook;
    expect(punchyHook).toContain('backwards');

    // Thought provoking should start with a question or reflection
    const thoughtHook = results['Thought-provoking'].posts[0].hook;
    expect(thoughtHook).toContain('exam topic');

    // Conversational should use friendly language or contractions
    const conversationalHook = results['Conversational'].posts[0].hook;
    expect(conversationalHook).toContain("wish I understood");

    // Authoritative & technical should mention memory layout or silicon
    const technicalHook = results['Authoritative & technical'].posts[0].hook;
    expect(technicalHook).toContain('silicon');
  });

  // =========================================================================
  // Part 24 — Real Verified Agent Iteration & Diff Tracking
  // =========================================================================
  it('Part 24: Verifies iteration rejection, revision feedback, and draft hash mutation across iterations', async () => {
    const project = await db.createProject({
      name: 'Iteration Diff Test',
      topic: 'Why is data structure important?',
      platform: 'LINKEDIN',
      tone: 'Professional',
      audience: 'Backend Engineers',
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
    expect(finalState.approved).toBe(true);

    // Retrieve saved generation from database
    const savedGen = await db.getGenerationById(generation.id);
    expect(savedGen).toBeDefined();

    // Verify 2 drafts were produced
    expect(savedGen?.drafts?.length).toBe(2);
    const draft1 = savedGen!.drafts[0];
    const draft2 = savedGen!.drafts[1];

    expect(draft1.iteration).toBe(1);
    expect(draft2.iteration).toBe(2);

    // Verify SHA-256 hash mutation between iterations
    expect(draft1.contentHash).toBeDefined();
    expect(draft2.contentHash).toBeDefined();
    expect(draft1.contentHash).not.toBe(draft2.contentHash);

    // Verify Revision Notes were tracked on iteration 2
    expect(draft2.revisionNotes).toBeDefined();
    expect(draft2.revisionNotes!.length).toBeGreaterThan(0);

    // Verify Critic Reviews
    expect(savedGen?.criticReviews?.length).toBe(2);
    const review1 = savedGen!.criticReviews[0];
    const review2 = savedGen!.criticReviews[1];

    // Iteration 1 rejected with issues
    expect(review1.approved).toBe(false);
    expect(review1.issues.length).toBeGreaterThan(0);
    expect(review1.requiredChanges.length).toBeGreaterThan(0);

    // Iteration 2 approved with all V2 metrics >= thresholds
    expect(review2.approved).toBe(true);
    expect(review2.score).toBeGreaterThanOrEqual(85);
    expect(review2.topicFidelity).toBeGreaterThanOrEqual(90);
    expect(review2.toneMatch).toBeGreaterThanOrEqual(85);
    expect(review2.factualAccuracy).toBeGreaterThanOrEqual(90);
    expect(review2.platformFit).toBeGreaterThanOrEqual(85);
    expect(review2.usefulness).toBeGreaterThanOrEqual(85);
  });
});
