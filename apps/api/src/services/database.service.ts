import { prisma } from '@contentforge/database';
import {
  Platform,
  ProjectStatus,
  AgentType,
  AgentExecutionStatus,
  ContentProjectDTO,
  ContentGenerationDTO,
  ResearchResultDTO,
  ContentDraftDTO,
  CriticReviewDTO,
  AgentExecutionDTO,
  CreateProjectInput,
} from '@contentforge/shared';
import crypto from 'crypto';

export interface DatabaseAdapter {
  isPostgresConnected(): boolean;
  createProject(input: CreateProjectInput & { userId: string }): Promise<ContentProjectDTO>;
  getProjectById(id: string): Promise<ContentProjectDTO | null>;
  updateProjectStatus(id: string, status: ProjectStatus): Promise<ContentProjectDTO>;
  listProjects(): Promise<ContentProjectDTO[]>;

  createGeneration(projectId: string): Promise<ContentGenerationDTO>;
  getGenerationById(id: string): Promise<ContentGenerationDTO | null>;
  updateGeneration(
    id: string,
    data: {
      status?: ProjectStatus;
      currentIteration?: number;
      approved?: boolean;
      topicAnalysis?: any;
      strategy?: any;
      completedAt?: Date | null;
    }
  ): Promise<ContentGenerationDTO>;

  saveResearchResult(data: {
    generationId: string;
    summary: string;
    keyPoints: string[];
    facts: any[];
    sources: any[];
    cautions?: string[];
  }): Promise<ResearchResultDTO>;

  saveContentDraft(data: {
    generationId: string;
    iteration: number;
    platform: Platform;
    content: any;
    contentHash?: string;
    revisionNotes?: string[];
  }): Promise<ContentDraftDTO>;

  saveCriticReview(data: {
    draftId?: string;
    generationId: string;
    iteration: number;
    approved: boolean;
    score: number;
    topicFidelity?: number;
    toneMatch?: number;
    factualAccuracy: number;
    relevance: number;
    platformFit: number;
    clarity: number;
    originality: number;
    usefulness?: number;
    naturalness?: number;
    scriptQuality?: number;
    narrativeQuality?: number;
    noFabricatedExperience?: boolean;
    noFabricatedStatistics?: boolean;
    issues: any[];
    requiredChanges: string[];
    postReviews?: any[];
  }): Promise<CriticReviewDTO>;

  recordAgentExecution(data: {
    generationId: string;
    agentType: AgentType;
    status: AgentExecutionStatus;
    iteration: number;
    input?: any;
    output?: any;
    error?: string | null;
    startedAt?: Date;
    completedAt?: Date | null;
  }): Promise<AgentExecutionDTO>;

  updateAgentExecution(
    id: string,
    data: {
      status: AgentExecutionStatus;
      output?: any;
      error?: string | null;
      completedAt?: Date;
    }
  ): Promise<AgentExecutionDTO>;
}

// In-Memory/Fallback Database Store (mirrors Prisma schema structure 1:1)
class MemoryDatabaseStore implements DatabaseAdapter {
  private users: Map<string, any> = new Map();
  private projects: Map<string, any> = new Map();
  private generations: Map<string, any> = new Map();
  private researchResults: Map<string, any> = new Map();
  private drafts: Map<string, any> = new Map();
  private criticReviews: Map<string, any> = new Map();
  private agentExecutions: Map<string, any> = new Map();

  constructor() {
    // Seed default developer user for MVP
    const devUserId = 'dev-user-default';
    this.users.set(devUserId, {
      id: devUserId,
      email: 'creator@contentforge.ai',
      name: 'ContentForge Creator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  isPostgresConnected(): boolean {
    return false;
  }

  async createProject(input: CreateProjectInput & { userId: string }): Promise<ContentProjectDTO> {
    const id = `proj_${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const title = input.topic.length > 50 ? `${input.topic.substring(0, 47)}...` : input.topic;

    const project: ContentProjectDTO = {
      id,
      userId: input.userId || 'dev-user-default',
      title,
      topic: input.topic,
      platform: input.platform,
      tone: input.tone || 'Professional',
      audience: input.audience || 'General Professional',
      status: 'DRAFT',
      maxIterations: input.maxIterations || 3,
      createdAt: now,
      updatedAt: now,
      generations: [],
    };

    this.projects.set(id, project);
    return project;
  }

  async getProjectById(id: string): Promise<ContentProjectDTO | null> {
    const proj = this.projects.get(id);
    if (!proj) return null;

    // Attach generations
    const gens = Array.from(this.generations.values())
      .filter((g) => g.projectId === id)
      .map((g) => this.assembleGeneration(g.id))
      .filter(Boolean) as ContentGenerationDTO[];

    return {
      ...proj,
      generations: gens,
    };
  }

  async updateProjectStatus(id: string, status: ProjectStatus): Promise<ContentProjectDTO> {
    const proj = this.projects.get(id);
    if (!proj) throw new Error(`Project ${id} not found`);
    proj.status = status;
    proj.updatedAt = new Date().toISOString();
    this.projects.set(id, proj);
    return this.getProjectById(id) as Promise<ContentProjectDTO>;
  }

  async listProjects(): Promise<ContentProjectDTO[]> {
    return Array.from(this.projects.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createGeneration(projectId: string): Promise<ContentGenerationDTO> {
    const id = `gen_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const gen: any = {
      id,
      projectId,
      currentIteration: 1,
      status: 'ANALYZING',
      approved: false,
      topicAnalysis: null,
      strategy: null,
      createdAt: now,
      completedAt: null,
    };

    this.generations.set(id, gen);
    return this.assembleGeneration(id)!;
  }

  async getGenerationById(id: string): Promise<ContentGenerationDTO | null> {
    return this.assembleGeneration(id);
  }

  async updateGeneration(
    id: string,
    data: {
      status?: ProjectStatus;
      currentIteration?: number;
      approved?: boolean;
      topicAnalysis?: any;
      strategy?: any;
      completedAt?: Date | null;
    }
  ): Promise<ContentGenerationDTO> {
    const gen = this.generations.get(id);
    if (!gen) throw new Error(`Generation ${id} not found`);

    if (data.status !== undefined) gen.status = data.status;
    if (data.currentIteration !== undefined) gen.currentIteration = data.currentIteration;
    if (data.approved !== undefined) gen.approved = data.approved;
    if (data.topicAnalysis !== undefined) gen.topicAnalysis = data.topicAnalysis;
    if (data.strategy !== undefined) gen.strategy = data.strategy;
    if (data.completedAt !== undefined) {
      gen.completedAt = data.completedAt ? data.completedAt.toISOString() : null;
    }

    this.generations.set(id, gen);
    return this.assembleGeneration(id)!;
  }

  async saveResearchResult(data: {
    generationId: string;
    summary: string;
    keyPoints: string[];
    facts: any[];
    sources: any[];
    cautions?: string[];
  }): Promise<ResearchResultDTO> {
    const id = `res_${crypto.randomUUID()}`;
    const result: ResearchResultDTO = {
      id,
      generationId: data.generationId,
      summary: data.summary,
      keyPoints: data.keyPoints,
      facts: data.facts,
      sources: data.sources,
      cautions: data.cautions || [],
      createdAt: new Date().toISOString(),
    };
    this.researchResults.set(data.generationId, result);
    return result;
  }

  async saveContentDraft(data: {
    generationId: string;
    iteration: number;
    platform: Platform;
    content: any;
    contentHash?: string;
    revisionNotes?: string[];
  }): Promise<ContentDraftDTO> {
    const id = `draft_${crypto.randomUUID()}`;
    const draft: ContentDraftDTO = {
      id,
      generationId: data.generationId,
      iteration: data.iteration,
      platform: data.platform,
      content: data.content,
      contentHash: data.contentHash,
      revisionNotes: data.revisionNotes,
      createdAt: new Date().toISOString(),
    };
    this.drafts.set(id, draft);
    return draft;
  }

  async saveCriticReview(data: {
    draftId?: string;
    generationId: string;
    iteration: number;
    approved: boolean;
    score: number;
    topicFidelity?: number;
    toneMatch?: number;
    factualAccuracy: number;
    relevance: number;
    platformFit: number;
    clarity: number;
    originality: number;
    usefulness?: number;
    naturalness?: number;
    scriptQuality?: number;
    narrativeQuality?: number;
    noFabricatedExperience?: boolean;
    noFabricatedStatistics?: boolean;
    issues: any[];
    requiredChanges: string[];
    postReviews?: any[];
  }): Promise<CriticReviewDTO> {
    const id = `rev_${crypto.randomUUID()}`;
    const review: CriticReviewDTO = {
      id,
      draftId: data.draftId || null,
      generationId: data.generationId,
      iteration: data.iteration,
      approved: data.approved,
      score: data.score,
      topicFidelity: data.topicFidelity !== undefined ? data.topicFidelity : 100,
      toneMatch: data.toneMatch !== undefined ? data.toneMatch : 90,
      factualAccuracy: data.factualAccuracy,
      relevance: data.relevance,
      platformFit: data.platformFit,
      clarity: data.clarity,
      originality: data.originality,
      usefulness: data.usefulness !== undefined ? data.usefulness : 90,
      naturalness: data.naturalness !== undefined ? data.naturalness : 90,
      scriptQuality: data.scriptQuality,
      narrativeQuality: data.narrativeQuality,
      noFabricatedExperience: data.noFabricatedExperience !== undefined ? data.noFabricatedExperience : true,
      noFabricatedStatistics: data.noFabricatedStatistics !== undefined ? data.noFabricatedStatistics : true,
      issues: data.issues,
      requiredChanges: data.requiredChanges,
      postReviews: data.postReviews,
      createdAt: new Date().toISOString(),
    };
    this.criticReviews.set(id, review);
    return review;
  }

  async recordAgentExecution(data: {
    generationId: string;
    agentType: AgentType;
    status: AgentExecutionStatus;
    iteration: number;
    input?: any;
    output?: any;
    error?: string | null;
    startedAt?: Date;
    completedAt?: Date | null;
  }): Promise<AgentExecutionDTO> {
    const id = `exec_${crypto.randomUUID()}`;
    const exec: AgentExecutionDTO = {
      id,
      generationId: data.generationId,
      agentType: data.agentType,
      status: data.status,
      iteration: data.iteration,
      input: data.input,
      output: data.output,
      startedAt: (data.startedAt || new Date()).toISOString(),
      completedAt: data.completedAt ? data.completedAt.toISOString() : null,
      error: data.error || null,
    };
    this.agentExecutions.set(id, exec);
    return exec;
  }

  async updateAgentExecution(
    id: string,
    data: {
      status: AgentExecutionStatus;
      output?: any;
      error?: string | null;
      completedAt?: Date;
    }
  ): Promise<AgentExecutionDTO> {
    const exec = this.agentExecutions.get(id);
    if (!exec) throw new Error(`AgentExecution ${id} not found`);

    exec.status = data.status;
    if (data.output !== undefined) exec.output = data.output;
    if (data.error !== undefined) exec.error = data.error;
    if (data.completedAt !== undefined) {
      exec.completedAt = data.completedAt.toISOString();
    }

    this.agentExecutions.set(id, exec);
    return exec;
  }

  private assembleGeneration(id: string): ContentGenerationDTO | null {
    const gen = this.generations.get(id);
    if (!gen) return null;

    const research = this.researchResults.get(id) || null;
    const drafts = Array.from(this.drafts.values()).filter((d) => d.generationId === id);
    const reviews = Array.from(this.criticReviews.values()).filter((r) => r.generationId === id);
    const executions = Array.from(this.agentExecutions.values()).filter((e) => e.generationId === id);

    return {
      ...gen,
      topicAnalysis: gen.topicAnalysis || null,
      strategy: gen.strategy || null,
      researchResult: research,
      drafts,
      criticReviews: reviews,
      agentExecutions: executions,
    };
  }
}

// PostgreSQL Prisma Adapter
class PrismaDatabaseAdapter implements DatabaseAdapter {
  isPostgresConnected(): boolean {
    return true;
  }

  async createProject(input: CreateProjectInput & { userId: string }): Promise<ContentProjectDTO> {
    // Ensure user exists
    await prisma.user.upsert({
      where: { id: input.userId },
      create: {
        id: input.userId,
        email: 'creator@contentforge.ai',
        name: 'ContentForge Creator',
      },
      update: {},
    });

    const title = input.topic.length > 50 ? `${input.topic.substring(0, 47)}...` : input.topic;

    const record = await prisma.contentProject.create({
      data: {
        userId: input.userId,
        title,
        topic: input.topic,
        platform: input.platform as any,
        tone: input.tone || 'Professional',
        audience: input.audience || 'General Professional',
        status: 'DRAFT',
        maxIterations: input.maxIterations || 3,
      },
    });

    return {
      id: record.id,
      userId: record.userId,
      title: record.title,
      topic: record.topic,
      platform: record.platform as Platform,
      tone: record.tone,
      audience: record.audience,
      status: record.status as ProjectStatus,
      maxIterations: record.maxIterations,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  async getProjectById(id: string): Promise<ContentProjectDTO | null> {
    const record = await prisma.contentProject.findUnique({
      where: { id },
      include: {
        generations: {
          include: {
            researchResult: true,
            drafts: true,
            criticReviews: true,
            agentExecutions: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!record) return null;

    return {
      id: record.id,
      userId: record.userId,
      title: record.title,
      topic: record.topic,
      platform: record.platform as Platform,
      tone: record.tone,
      audience: record.audience,
      status: record.status as ProjectStatus,
      maxIterations: record.maxIterations,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
      generations: record.generations.map((g: any) => ({
        id: g.id,
        projectId: g.projectId,
        currentIteration: g.currentIteration,
        status: g.status as ProjectStatus,
        approved: g.approved,
        createdAt: g.createdAt.toISOString(),
        completedAt: g.completedAt?.toISOString() || null,
        researchResult: g.researchResult
          ? {
              id: g.researchResult.id,
              generationId: g.researchResult.generationId,
              summary: g.researchResult.summary,
              keyPoints: g.researchResult.keyPoints as string[],
              facts: g.researchResult.facts as any[],
              sources: g.researchResult.sources as any[],
              cautions: (g.researchResult.cautions as string[]) || [],
              createdAt: g.researchResult.createdAt.toISOString(),
            }
          : null,
        drafts: g.drafts.map((d: any) => ({
          id: d.id,
          generationId: d.generationId,
          iteration: d.iteration,
          platform: d.platform as Platform,
          content: d.content,
          createdAt: d.createdAt.toISOString(),
        })),
        criticReviews: g.criticReviews.map((r: any) => ({
          id: r.id,
          draftId: r.draftId,
          generationId: r.generationId,
          iteration: r.iteration,
          approved: r.approved,
          score: r.score,
          factualAccuracy: r.factualAccuracy,
          relevance: r.relevance,
          platformFit: r.platformFit,
          clarity: r.clarity,
          originality: r.originality,
          issues: r.issues as any[],
          requiredChanges: r.requiredChanges as string[],
          createdAt: r.createdAt.toISOString(),
        })),
        agentExecutions: g.agentExecutions.map((e: any) => ({
          id: e.id,
          generationId: e.generationId,
          agentType: e.agentType as AgentType,
          status: e.status as AgentExecutionStatus,
          iteration: e.iteration,
          input: e.input,
          output: e.output,
          startedAt: e.startedAt.toISOString(),
          completedAt: e.completedAt?.toISOString() || null,
          error: e.error,
        })),
      })),
    };
  }

  async updateProjectStatus(id: string, status: ProjectStatus): Promise<ContentProjectDTO> {
    await prisma.contentProject.update({
      where: { id },
      data: { status: status as any },
    });
    return (await this.getProjectById(id))!;
  }

  async listProjects(): Promise<ContentProjectDTO[]> {
    const list = await prisma.contentProject.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return list.map((record: any) => ({
      id: record.id,
      userId: record.userId,
      title: record.title,
      topic: record.topic,
      platform: record.platform as Platform,
      tone: record.tone,
      audience: record.audience,
      status: record.status as ProjectStatus,
      maxIterations: record.maxIterations,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }));
  }

  async createGeneration(projectId: string): Promise<ContentGenerationDTO> {
    const record = await prisma.contentGeneration.create({
      data: {
        projectId,
        currentIteration: 1,
        status: 'ANALYZING',
        approved: false,
      },
    });

    return {
      id: record.id,
      projectId: record.projectId,
      currentIteration: record.currentIteration,
      status: record.status as ProjectStatus,
      approved: record.approved,
      topicAnalysis: null,
      strategy: null,
      createdAt: record.createdAt.toISOString(),
      completedAt: null,
      drafts: [],
      criticReviews: [],
      agentExecutions: [],
    };
  }

  async getGenerationById(id: string): Promise<ContentGenerationDTO | null> {
    const g = await prisma.contentGeneration.findUnique({
      where: { id },
      include: {
        researchResult: true,
        drafts: { orderBy: { iteration: 'asc' } },
        criticReviews: { orderBy: { iteration: 'asc' } },
        agentExecutions: { orderBy: { startedAt: 'asc' } },
      },
    });

    if (!g) return null;

    return {
      id: g.id,
      projectId: g.projectId,
      currentIteration: g.currentIteration,
      status: g.status as ProjectStatus,
      approved: g.approved,
      topicAnalysis: (g.topicAnalysis as any) || null,
      strategy: (g.strategy as any) || null,
      createdAt: g.createdAt.toISOString(),
      completedAt: g.completedAt?.toISOString() || null,
      researchResult: g.researchResult
        ? {
            id: g.researchResult.id,
            generationId: g.researchResult.generationId,
            summary: g.researchResult.summary,
            keyPoints: g.researchResult.keyPoints as string[],
            facts: g.researchResult.facts as any[],
            sources: g.researchResult.sources as any[],
            cautions: (g.researchResult.cautions as string[]) || [],
            createdAt: g.researchResult.createdAt.toISOString(),
          }
        : null,
      drafts: g.drafts.map((d: any) => ({
        id: d.id,
        generationId: d.generationId,
        iteration: d.iteration,
        platform: d.platform as Platform,
        content: d.content,
        contentHash: d.contentHash || undefined,
        revisionNotes: (d.revisionNotes as string[]) || undefined,
        createdAt: d.createdAt.toISOString(),
      })),
      criticReviews: g.criticReviews.map((r: any) => ({
        id: r.id,
        draftId: r.draftId,
        generationId: r.generationId,
        iteration: r.iteration,
        approved: r.approved,
        score: r.score,
        topicFidelity: r.topicFidelity,
        toneMatch: r.toneMatch !== undefined ? r.toneMatch : 90,
        factualAccuracy: r.factualAccuracy,
        relevance: r.relevance,
        platformFit: r.platformFit,
        clarity: r.clarity,
        originality: r.originality,
        usefulness: r.usefulness !== undefined ? r.usefulness : 90,
        naturalness: r.naturalness,
        scriptQuality: r.scriptQuality !== undefined ? r.scriptQuality : undefined,
        narrativeQuality: r.narrativeQuality !== undefined ? r.narrativeQuality : undefined,
        noFabricatedExperience: r.noFabricatedExperience,
        noFabricatedStatistics: r.noFabricatedStatistics,
        issues: r.issues as any[],
        requiredChanges: r.requiredChanges as string[],
        createdAt: r.createdAt.toISOString(),
      })),
      agentExecutions: g.agentExecutions.map((e: any) => ({
        id: e.id,
        generationId: e.generationId,
        agentType: e.agentType as AgentType,
        status: e.status as AgentExecutionStatus,
        iteration: e.iteration,
        input: e.input,
        output: e.output,
        startedAt: e.startedAt.toISOString(),
        completedAt: e.completedAt?.toISOString() || null,
        error: e.error,
      })),
    };
  }

  async updateGeneration(
    id: string,
    data: {
      status?: ProjectStatus;
      currentIteration?: number;
      approved?: boolean;
      topicAnalysis?: any;
      strategy?: any;
      completedAt?: Date | null;
    }
  ): Promise<ContentGenerationDTO> {
    await prisma.contentGeneration.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status as any }),
        ...(data.currentIteration !== undefined && { currentIteration: data.currentIteration }),
        ...(data.approved !== undefined && { approved: data.approved }),
        ...(data.topicAnalysis !== undefined && { topicAnalysis: data.topicAnalysis as any }),
        ...(data.strategy !== undefined && { strategy: data.strategy as any }),
        ...(data.completedAt !== undefined && { completedAt: data.completedAt }),
      },
    });

    return (await this.getGenerationById(id))!;
  }

  async saveResearchResult(data: {
    generationId: string;
    summary: string;
    keyPoints: string[];
    facts: any[];
    sources: any[];
    cautions?: string[];
  }): Promise<ResearchResultDTO> {
    const res = await prisma.researchResult.create({
      data: {
        generationId: data.generationId,
        summary: data.summary,
        keyPoints: data.keyPoints as any,
        facts: data.facts as any,
        sources: data.sources as any,
        cautions: (data.cautions || []) as any,
      },
    });

    return {
      id: res.id,
      generationId: res.generationId,
      summary: res.summary,
      keyPoints: res.keyPoints as string[],
      facts: res.facts as any[],
      sources: res.sources as any[],
      cautions: (res.cautions as string[]) || [],
      createdAt: res.createdAt.toISOString(),
    };
  }

  async saveContentDraft(data: {
    generationId: string;
    iteration: number;
    platform: Platform;
    content: any;
    contentHash?: string;
    revisionNotes?: string[];
  }): Promise<ContentDraftDTO> {
    const d = await prisma.contentDraft.create({
      data: {
        generationId: data.generationId,
        iteration: data.iteration,
        platform: data.platform as any,
        content: data.content as any,
        contentHash: data.contentHash || null,
        revisionNotes: (data.revisionNotes as any) || null,
      },
    });

    return {
      id: d.id,
      generationId: d.generationId,
      iteration: d.iteration,
      platform: d.platform as Platform,
      content: d.content as any,
      contentHash: d.contentHash || undefined,
      revisionNotes: (d.revisionNotes as string[]) || undefined,
      createdAt: d.createdAt.toISOString(),
    };
  }

  async saveCriticReview(data: {
    draftId?: string;
    generationId: string;
    iteration: number;
    approved: boolean;
    score: number;
    topicFidelity?: number;
    toneMatch?: number;
    factualAccuracy: number;
    relevance: number;
    platformFit: number;
    clarity: number;
    originality: number;
    usefulness?: number;
    naturalness?: number;
    scriptQuality?: number;
    narrativeQuality?: number;
    noFabricatedExperience?: boolean;
    noFabricatedStatistics?: boolean;
    issues: any[];
    requiredChanges: string[];
    postReviews?: any[];
  }): Promise<CriticReviewDTO> {
    const r = await prisma.criticReview.create({
      data: {
        draftId: data.draftId || null,
        generationId: data.generationId,
        iteration: data.iteration,
        approved: data.approved,
        score: data.score,
        topicFidelity: data.topicFidelity !== undefined ? data.topicFidelity : 100,
        toneMatch: data.toneMatch !== undefined ? data.toneMatch : 90,
        factualAccuracy: data.factualAccuracy,
        relevance: data.relevance,
        platformFit: data.platformFit,
        clarity: data.clarity,
        originality: data.originality,
        usefulness: data.usefulness !== undefined ? data.usefulness : 90,
        naturalness: data.naturalness !== undefined ? data.naturalness : 90,
        scriptQuality: data.scriptQuality !== undefined ? data.scriptQuality : null,
        narrativeQuality: data.narrativeQuality !== undefined ? data.narrativeQuality : null,
        noFabricatedExperience: data.noFabricatedExperience !== undefined ? data.noFabricatedExperience : true,
        noFabricatedStatistics: data.noFabricatedStatistics !== undefined ? data.noFabricatedStatistics : true,
        issues: data.issues as any,
        requiredChanges: data.requiredChanges as any,
      },
    });

    return {
      id: r.id,
      draftId: r.draftId,
      generationId: r.generationId,
      iteration: r.iteration,
      approved: r.approved,
      score: r.score,
      topicFidelity: r.topicFidelity,
      toneMatch: r.toneMatch,
      factualAccuracy: r.factualAccuracy,
      relevance: r.relevance,
      platformFit: r.platformFit,
      clarity: r.clarity,
      originality: r.originality,
      usefulness: r.usefulness,
      naturalness: r.naturalness,
      scriptQuality: r.scriptQuality !== null ? r.scriptQuality : undefined,
      narrativeQuality: r.narrativeQuality !== null ? r.narrativeQuality : undefined,
      noFabricatedExperience: r.noFabricatedExperience,
      noFabricatedStatistics: r.noFabricatedStatistics,
      issues: r.issues as any[],
      requiredChanges: r.requiredChanges as string[],
      postReviews: data.postReviews,
      createdAt: r.createdAt.toISOString(),
    };
  }

  async recordAgentExecution(data: {
    generationId: string;
    agentType: AgentType;
    status: AgentExecutionStatus;
    iteration: number;
    input?: any;
    output?: any;
    error?: string | null;
    startedAt?: Date;
    completedAt?: Date | null;
  }): Promise<AgentExecutionDTO> {
    const e = await prisma.agentExecution.create({
      data: {
        generationId: data.generationId,
        agentType: data.agentType as any,
        status: data.status as any,
        iteration: data.iteration,
        input: data.input as any,
        output: data.output as any,
        startedAt: data.startedAt || new Date(),
        completedAt: data.completedAt || null,
        error: data.error || null,
      },
    });

    return {
      id: e.id,
      generationId: e.generationId,
      agentType: e.agentType as AgentType,
      status: e.status as AgentExecutionStatus,
      iteration: e.iteration,
      input: e.input,
      output: e.output,
      startedAt: e.startedAt.toISOString(),
      completedAt: e.completedAt?.toISOString() || null,
      error: e.error,
    };
  }

  async updateAgentExecution(
    id: string,
    data: {
      status: AgentExecutionStatus;
      output?: any;
      error?: string | null;
      completedAt?: Date;
    }
  ): Promise<AgentExecutionDTO> {
    const e = await prisma.agentExecution.update({
      where: { id },
      data: {
        status: data.status as any,
        ...(data.output !== undefined && { output: data.output as any }),
        ...(data.error !== undefined && { error: data.error }),
        ...(data.completedAt !== undefined && { completedAt: data.completedAt }),
      },
    });

    return {
      id: e.id,
      generationId: e.generationId,
      agentType: e.agentType as AgentType,
      status: e.status as AgentExecutionStatus,
      iteration: e.iteration,
      input: e.input,
      output: e.output,
      startedAt: e.startedAt.toISOString(),
      completedAt: e.completedAt?.toISOString() || null,
      error: e.error,
    };
  }
}

// Global Database Singleton with Auto-Detection
let activeDatabase: DatabaseAdapter = new MemoryDatabaseStore();

export async function initDatabase(): Promise<DatabaseAdapter> {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql://')) {
    try {
      // Test Prisma connection
      await prisma.$connect();
      console.log('[Database] Connected successfully to PostgreSQL via Prisma');
      activeDatabase = new PrismaDatabaseAdapter();
    } catch (err: any) {
      console.warn(
        `[Database] PostgreSQL at DATABASE_URL unreachable (${err.message}). Using high-fidelity Memory Store for seamless local operation.`
      );
      activeDatabase = new MemoryDatabaseStore();
    }
  } else {
    console.log('[Database] Using high-fidelity Memory Store (configure DATABASE_URL for PostgreSQL)');
  }
  return activeDatabase;
}

export const db: DatabaseAdapter = new Proxy({} as DatabaseAdapter, {
  get(_target, prop) {
    return (activeDatabase as any)[prop];
  },
});
