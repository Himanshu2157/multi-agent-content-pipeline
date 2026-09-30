import {
  ContentAgentState,
  Platform,
  ProjectStatus,
  ResearchResult,
  WriterOutput,
  CriticReview,
} from '@contentforge/shared';
import { db } from '../../services/database.service.js';
import { ResearchAgent } from '../research/research.agent.js';
import { WriterAgent } from '../writer/writer.agent.js';
import { CriticAgent } from '../critic/critic.agent.js';
import { LLMProvider } from '../../providers/llm/llm.provider.js';
import { ResearchProvider } from '../../providers/research/research.provider.js';

export interface GraphExecutionOptions {
  onStepChange?: (step: {
    agentType: 'RESEARCH' | 'WRITER' | 'CRITIC';
    status: 'RUNNING' | 'COMPLETED' | 'FAILED';
    iteration: number;
    state: ContentAgentState;
  }) => void;
}

export class ContentGenerationGraph {
  private researchAgent: ResearchAgent;
  private writerAgent: WriterAgent;
  private criticAgent: CriticAgent;

  constructor(llmProvider?: LLMProvider, researchProvider?: ResearchProvider) {
    this.researchAgent = new ResearchAgent(llmProvider, researchProvider);
    this.writerAgent = new WriterAgent(llmProvider);
    this.criticAgent = new CriticAgent(llmProvider);
  }

  async run(
    initialState: {
      projectId: string;
      generationId: string;
      topic: string;
      platform: Platform;
      tone?: string;
      audience?: string;
      maxIterations?: number;
    },
    options?: GraphExecutionOptions
  ): Promise<ContentAgentState> {
    const state: ContentAgentState = {
      projectId: initialState.projectId,
      generationId: initialState.generationId,
      topic: initialState.topic,
      platform: initialState.platform,
      tone: initialState.tone || 'Professional',
      audience: initialState.audience || 'General Professional',
      iteration: 1,
      maxIterations: Math.min(Math.max(initialState.maxIterations || 3, 1), 5),
      approved: false,
      status: 'RESEARCHING',
    };

    try {
      // Step 1: Research Node (Runs ONCE per generation workflow)
      await this.executeResearchNode(state, options);

      // Step 2 & 3: Writer <-> Critic Autonomous Refinement Loop
      while (true) {
        // Writer Node
        await this.executeWriterNode(state, options);

        // Critic Node
        await this.executeCriticNode(state, options);

        // Conditional Edge Evaluation
        if (state.approved) {
          console.log(`[Graph] Content approved on iteration ${state.iteration}! Completing pipeline.`);
          state.status = 'COMPLETED';
          await db.updateGeneration(state.generationId, {
            status: 'COMPLETED',
            approved: true,
            currentIteration: state.iteration,
            completedAt: new Date(),
          });
          await db.updateProjectStatus(state.projectId, 'COMPLETED');
          break;
        }

        if (state.iteration >= state.maxIterations) {
          console.log(
            `[Graph] Max iterations (${state.maxIterations}) reached without approval. Terminating with best available draft.`
          );
          state.status = 'COMPLETED';
          state.approved = false;
          await db.updateGeneration(state.generationId, {
            status: 'COMPLETED',
            approved: false,
            currentIteration: state.iteration,
            completedAt: new Date(),
          });
          await db.updateProjectStatus(state.projectId, 'COMPLETED');
          break;
        }

        // Loop continuation: prepare next iteration
        console.log(
          `[Graph] Content rejected on iteration ${state.iteration}. Routing back to Writer Agent for iteration ${state.iteration + 1}.`
        );
        state.iteration += 1;
        await db.updateGeneration(state.generationId, {
          currentIteration: state.iteration,
          status: 'WRITING',
        });
        await db.updateProjectStatus(state.projectId, 'WRITING');
      }

      return state;
    } catch (err: any) {
      console.error(`[Graph] Pipeline error in generation ${state.generationId}:`, err);
      state.status = 'FAILED';
      state.error = err.message || 'Pipeline execution failed';

      await db.updateGeneration(state.generationId, {
        status: 'FAILED',
        completedAt: new Date(),
      });
      await db.updateProjectStatus(state.projectId, 'FAILED');

      throw err;
    }
  }

  private async executeResearchNode(state: ContentAgentState, options?: GraphExecutionOptions) {
    state.status = 'RESEARCHING';
    await db.updateGeneration(state.generationId, { status: 'RESEARCHING' });
    await db.updateProjectStatus(state.projectId, 'RESEARCHING');

    const exec = await db.recordAgentExecution({
      generationId: state.generationId,
      agentType: 'RESEARCH',
      status: 'RUNNING',
      iteration: 1,
      input: { topic: state.topic },
      startedAt: new Date(),
    });

    options?.onStepChange?.({
      agentType: 'RESEARCH',
      status: 'RUNNING',
      iteration: 1,
      state,
    });

    try {
      const research = await this.researchAgent.execute(state.topic);
      state.research = research;

      await db.saveResearchResult({
        generationId: state.generationId,
        summary: research.summary,
        keyPoints: research.keyPoints,
        facts: research.facts,
        sources: research.sources,
        cautions: research.cautions,
      });

      await db.updateAgentExecution(exec.id, {
        status: 'COMPLETED',
        output: research,
        completedAt: new Date(),
      });

      options?.onStepChange?.({
        agentType: 'RESEARCH',
        status: 'COMPLETED',
        iteration: 1,
        state,
      });
    } catch (err: any) {
      await db.updateAgentExecution(exec.id, {
        status: 'FAILED',
        error: err.message,
        completedAt: new Date(),
      });
      options?.onStepChange?.({
        agentType: 'RESEARCH',
        status: 'FAILED',
        iteration: 1,
        state,
      });
      throw err;
    }
  }

  private async executeWriterNode(state: ContentAgentState, options?: GraphExecutionOptions) {
    state.status = 'WRITING';
    await db.updateGeneration(state.generationId, {
      status: 'WRITING',
      currentIteration: state.iteration,
    });
    await db.updateProjectStatus(state.projectId, 'WRITING');

    const exec = await db.recordAgentExecution({
      generationId: state.generationId,
      agentType: 'WRITER',
      status: 'RUNNING',
      iteration: state.iteration,
      input: {
        iteration: state.iteration,
        hasCriticFeedback: !!state.criticReview,
      },
      startedAt: new Date(),
    });

    options?.onStepChange?.({
      agentType: 'WRITER',
      status: 'RUNNING',
      iteration: state.iteration,
      state,
    });

    try {
      const draft = await this.writerAgent.execute({
        topic: state.topic,
        platform: state.platform,
        tone: state.tone,
        audience: state.audience,
        research: state.research!,
        previousDraft: state.draft || null,
        criticFeedback: state.criticReview || null,
        iteration: state.iteration,
      });

      state.draft = draft;

      const savedDraft = await db.saveContentDraft({
        generationId: state.generationId,
        iteration: state.iteration,
        platform: state.platform,
        content: draft,
      });

      await db.updateAgentExecution(exec.id, {
        status: 'COMPLETED',
        output: { draftId: savedDraft.id, draft },
        completedAt: new Date(),
      });

      options?.onStepChange?.({
        agentType: 'WRITER',
        status: 'COMPLETED',
        iteration: state.iteration,
        state,
      });
    } catch (err: any) {
      await db.updateAgentExecution(exec.id, {
        status: 'FAILED',
        error: err.message,
        completedAt: new Date(),
      });
      options?.onStepChange?.({
        agentType: 'WRITER',
        status: 'FAILED',
        iteration: state.iteration,
        state,
      });
      throw err;
    }
  }

  private async executeCriticNode(state: ContentAgentState, options?: GraphExecutionOptions) {
    state.status = 'REVIEWING';
    await db.updateGeneration(state.generationId, {
      status: 'REVIEWING',
      currentIteration: state.iteration,
    });
    await db.updateProjectStatus(state.projectId, 'REVIEWING');

    const exec = await db.recordAgentExecution({
      generationId: state.generationId,
      agentType: 'CRITIC',
      status: 'RUNNING',
      iteration: state.iteration,
      input: { iteration: state.iteration },
      startedAt: new Date(),
    });

    options?.onStepChange?.({
      agentType: 'CRITIC',
      status: 'RUNNING',
      iteration: state.iteration,
      state,
    });

    try {
      const review = await this.criticAgent.execute({
        topic: state.topic,
        platform: state.platform,
        tone: state.tone,
        audience: state.audience,
        research: state.research!,
        draft: state.draft!,
        iteration: state.iteration,
      });

      state.criticReview = review;
      state.approved = review.approved;

      await db.saveCriticReview({
        generationId: state.generationId,
        iteration: state.iteration,
        approved: review.approved,
        score: review.score,
        factualAccuracy: review.factualAccuracy,
        relevance: review.relevance,
        platformFit: review.platformFit,
        clarity: review.clarity,
        originality: review.originality,
        issues: review.issues,
        requiredChanges: review.requiredChanges,
      });

      await db.updateAgentExecution(exec.id, {
        status: 'COMPLETED',
        output: review,
        completedAt: new Date(),
      });

      options?.onStepChange?.({
        agentType: 'CRITIC',
        status: 'COMPLETED',
        iteration: state.iteration,
        state,
      });
    } catch (err: any) {
      await db.updateAgentExecution(exec.id, {
        status: 'FAILED',
        error: err.message,
        completedAt: new Date(),
      });
      options?.onStepChange?.({
        agentType: 'CRITIC',
        status: 'FAILED',
        iteration: state.iteration,
        state,
      });
      throw err;
    }
  }
}
