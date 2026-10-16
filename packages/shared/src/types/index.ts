import { z } from 'zod';
import {
  PlatformSchema,
  ProjectStatusSchema,
  AgentTypeSchema,
  AgentExecutionStatusSchema,
  TopicAnalysisSchema,
  ResearchFactSchema,
  ResearchSourceSchema,
  ResearchResultSchema,
  ContentAngleSchema,
  ContentStrategySchema,
  LinkedInPostSchema,
  LinkedInOutputSchema,
  ReelSectionSchema,
  InstagramReelOutputSchema,
  WriterOutputSchema,
  CriticIssueSchema,
  CriticReviewSchema,
  PostReviewIssueSchema,
  PostScoresSchema,
  PostReviewSchema,
  CreateProjectSchema,
} from '../schemas/index.js';

export type Platform = z.infer<typeof PlatformSchema>;
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;
export type AgentType = z.infer<typeof AgentTypeSchema>;
export type AgentExecutionStatus = z.infer<typeof AgentExecutionStatusSchema>;

export type TopicAnalysis = z.infer<typeof TopicAnalysisSchema>;
export type ResearchFact = z.infer<typeof ResearchFactSchema>;
export type ResearchSource = z.infer<typeof ResearchSourceSchema>;
export type ResearchResult = z.infer<typeof ResearchResultSchema>;

export type ContentAngle = z.infer<typeof ContentAngleSchema>;
export type ContentStrategy = z.infer<typeof ContentStrategySchema>;

export type LinkedInPost = z.infer<typeof LinkedInPostSchema>;
export type LinkedInOutput = z.infer<typeof LinkedInOutputSchema>;

export type ReelSection = z.infer<typeof ReelSectionSchema>;
export type InstagramReelOutput = z.infer<typeof InstagramReelOutputSchema>;

export type WriterOutput = z.infer<typeof WriterOutputSchema>;

export type CriticIssue = z.infer<typeof CriticIssueSchema>;
export type PostReviewIssue = z.infer<typeof PostReviewIssueSchema>;
export type PostScores = z.infer<typeof PostScoresSchema>;
export type PostReview = z.infer<typeof PostReviewSchema>;
export type CriticReview = z.infer<typeof CriticReviewSchema>;

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

// Agent State (used by pipeline/orchestrator)
export interface ContentAgentState {
  projectId: string;
  generationId: string;
  topic: string;
  platform: Platform;
  tone?: string;
  audience?: string;
  topicAnalysis?: TopicAnalysis;
  research?: ResearchResult;
  strategy?: ContentStrategy;
  draft?: WriterOutput;
  criticReview?: CriticReview;
  iteration: number;
  maxIterations: number;
  approved: boolean;
  status: ProjectStatus;
  error?: string;
}

// Database-compatible interfaces for client-server exchange
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentProjectDTO {
  id: string;
  userId: string;
  title: string;
  topic: string;
  platform: Platform;
  tone: string;
  audience: string;
  status: ProjectStatus;
  maxIterations: number;
  createdAt: string;
  updatedAt: string;
  generations?: ContentGenerationDTO[];
}

export interface ContentGenerationDTO {
  id: string;
  projectId: string;
  currentIteration: number;
  status: ProjectStatus;
  approved: boolean;
  createdAt: string;
  completedAt?: string | null;
  topicAnalysis?: TopicAnalysis | null;
  strategy?: ContentStrategy | null;
  researchResult?: ResearchResultDTO | null;
  drafts?: ContentDraftDTO[];
  criticReviews?: CriticReviewDTO[];
  agentExecutions?: AgentExecutionDTO[];
}

export interface ResearchResultDTO {
  id: string;
  generationId: string;
  centralSubject?: string;
  subtopics?: string[];
  summary: string;
  keyPoints: string[];
  facts: ResearchFact[];
  relevantExamples?: string[];
  sources: ResearchSource[];
  cautions?: string[];
  createdAt: string;
}

export interface ContentDraftDTO {
  id: string;
  generationId: string;
  iteration: number;
  content: WriterOutput;
  platform: Platform;
  contentHash?: string;
  revisionNotes?: string[];
  createdAt: string;
}

export interface CriticReviewDTO {
  id: string;
  draftId?: string | null;
  generationId?: string | null;
  iteration: number;
  approved: boolean;
  score: number;
  topicFidelity: number;
  toneMatch: number;
  factualAccuracy: number;
  relevance: number;
  platformFit: number;
  clarity: number;
  originality: number;
  usefulness: number;
  naturalness?: number;
  scriptQuality?: number;
  narrativeQuality?: number;
  noFabricatedExperience?: boolean;
  noFabricatedStatistics?: boolean;
  issues: CriticIssue[];
  requiredChanges: string[];
  postReviews?: PostReview[];
  createdAt: string;
}

export interface AgentExecutionDTO {
  id: string;
  generationId: string;
  agentType: AgentType;
  status: AgentExecutionStatus;
  iteration: number;
  input?: any;
  output?: any;
  startedAt: string;
  completedAt?: string | null;
  error?: string | null;
}
