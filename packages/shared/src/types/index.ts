import { z } from 'zod';
import {
  PlatformSchema,
  ProjectStatusSchema,
  AgentTypeSchema,
  AgentExecutionStatusSchema,
  ResearchFactSchema,
  ResearchSourceSchema,
  ResearchResultSchema,
  LinkedInPostSchema,
  LinkedInOutputSchema,
  ReelSectionSchema,
  InstagramReelOutputSchema,
  WriterOutputSchema,
  CriticIssueSchema,
  CriticReviewSchema,
  CreateProjectSchema,
} from '../schemas/index.js';

export type Platform = z.infer<typeof PlatformSchema>;
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;
export type AgentType = z.infer<typeof AgentTypeSchema>;
export type AgentExecutionStatus = z.infer<typeof AgentExecutionStatusSchema>;

export type ResearchFact = z.infer<typeof ResearchFactSchema>;
export type ResearchSource = z.infer<typeof ResearchSourceSchema>;
export type ResearchResult = z.infer<typeof ResearchResultSchema>;

export type LinkedInPost = z.infer<typeof LinkedInPostSchema>;
export type LinkedInOutput = z.infer<typeof LinkedInOutputSchema>;

export type ReelSection = z.infer<typeof ReelSectionSchema>;
export type InstagramReelOutput = z.infer<typeof InstagramReelOutputSchema>;

export type WriterOutput = z.infer<typeof WriterOutputSchema>;

export type CriticIssue = z.infer<typeof CriticIssueSchema>;
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
  research?: ResearchResult;
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
  researchResult?: ResearchResultDTO | null;
  drafts?: ContentDraftDTO[];
  criticReviews?: CriticReviewDTO[];
  agentExecutions?: AgentExecutionDTO[];
}

export interface ResearchResultDTO {
  id: string;
  generationId: string;
  summary: string;
  keyPoints: string[];
  facts: ResearchFact[];
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
  createdAt: string;
}

export interface CriticReviewDTO {
  id: string;
  draftId?: string | null;
  generationId?: string | null;
  iteration: number;
  approved: boolean;
  score: number;
  factualAccuracy: number;
  relevance: number;
  platformFit: number;
  clarity: number;
  originality: number;
  issues: CriticIssue[];
  requiredChanges: string[];
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
