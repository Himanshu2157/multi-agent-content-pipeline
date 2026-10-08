import { z } from 'zod';
import {
  PLATFORMS,
  PROJECT_STATUSES,
  AGENT_TYPES,
  AGENT_EXECUTION_STATUSES,
  MIN_ITERATIONS,
  MAX_ITERATIONS,
  DEFAULT_MAX_ITERATIONS,
} from '../constants/index.js';

// Platform Enum Schema
export const PlatformSchema = z.enum([PLATFORMS.LINKEDIN, PLATFORMS.INSTAGRAM_REEL]);

// Project Status Schema
export const ProjectStatusSchema = z.enum([
  PROJECT_STATUSES.DRAFT,
  PROJECT_STATUSES.ANALYZING,
  PROJECT_STATUSES.RESEARCHING,
  PROJECT_STATUSES.STRATEGIZING,
  PROJECT_STATUSES.WRITING,
  PROJECT_STATUSES.REVIEWING,
  PROJECT_STATUSES.COMPLETED,
  PROJECT_STATUSES.FAILED,
]);

// Agent Type Schema
export const AgentTypeSchema = z.enum([
  AGENT_TYPES.TOPIC_ANALYZER,
  AGENT_TYPES.RESEARCH,
  AGENT_TYPES.STRATEGIST,
  AGENT_TYPES.WRITER,
  AGENT_TYPES.CRITIC,
]);

export const AgentExecutionStatusSchema = z.enum([
  AGENT_EXECUTION_STATUSES.PENDING,
  AGENT_EXECUTION_STATUSES.RUNNING,
  AGENT_EXECUTION_STATUSES.COMPLETED,
  AGENT_EXECUTION_STATUSES.FAILED,
]);

// ==========================================
// 1. Topic Analyzer Schema
// ==========================================
export const TopicAnalysisSchema = z.object({
  normalizedTopic: z.string().min(3, 'Normalized topic must be at least 3 characters'),
  coreSubject: z.string().min(2, 'Core subject is required'),
  userIntent: z.string().min(3, 'User intent is required'),
  contentGoal: z.string().min(3, 'Content goal is required'),
  allowedSubtopics: z.array(z.string().min(1)).min(1, 'Must specify at least 1 allowed subtopic'),
  forbiddenTopicDrift: z.array(z.string().min(1)).min(1, 'Must specify forbidden drift topics'),
});

// ==========================================
// 2. Research Schema
// ==========================================
export const ResearchFactSchema = z.object({
  claim: z.string().min(1, 'Claim cannot be empty'),
  source: z.string().min(1, 'Source name/title cannot be empty'),
  confidence: z.enum(['high', 'medium', 'low']),
});

export const ResearchSourceSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  url: z.string().url('Source must have a valid URL'),
  publisher: z.string().optional(),
  date: z.string().optional(),
});

export const ResearchResultSchema = z.object({
  topic: z.string().min(1),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  keyPoints: z.array(z.string().min(1)).min(2, 'Must provide at least 2 key points'),
  facts: z.array(ResearchFactSchema).min(1, 'Must provide at least 1 fact'),
  sources: z.array(ResearchSourceSchema).min(1, 'Must provide at least 1 verified source'),
  cautions: z.array(z.string()).default([]),
});

// ==========================================
// 3. Content Strategy Schema
// ==========================================
export const ContentAngleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(5),
  targetTakeaway: z.string().min(5),
  hookIdea: z.string().min(5),
  suggestedExampleOrAnalogy: z.string().optional(),
});

export const ContentStrategySchema = z.object({
  topic: z.string().min(1),
  targetAudiencePainPoint: z.string().min(5),
  coreInsight: z.string().min(5),
  angles: z.array(ContentAngleSchema).min(3, 'Must have at least 3 distinct angles').max(5),
  avoidTopics: z.array(z.string().min(1)),
  keyPointsToEmphasize: z.array(z.string().min(1)),
});

// ==========================================
// 4. Writer Output Schemas
// ==========================================
export const LinkedInPostSchema = z.object({
  id: z.string().min(1),
  angle: z.string().min(1),
  hook: z.string().min(5, 'Hook must be compelling and at least 5 characters'),
  body: z.string().min(20, 'Body must have meaningful substance'),
  cta: z.string().optional(),
});

export const LinkedInOutputSchema = z.object({
  posts: z
    .array(LinkedInPostSchema)
    .min(3, 'LinkedIn content requires multiple diverse posts')
    .max(5, 'Maximum 5 posts'),
});

export const ReelSectionSchema = z.object({
  timestamp: z.string().min(1, 'Timestamp or section time is required (e.g. 0-3 sec)'),
  visual: z.string().min(3, 'Visual direction is required'),
  voiceover: z.string().min(1, 'Voiceover script is required'),
  onScreenText: z.string().min(1, 'On-screen text is required'),
});

export const InstagramReelOutputSchema = z.object({
  title: z.string().min(3, 'Reel title is required'),
  estimatedDuration: z.string().min(2, 'Estimated duration (e.g. 30-45 sec)'),
  hook: z.string().min(5, 'Hook is required'),
  sections: z.array(ReelSectionSchema).min(3, 'At least 3 scene sections are required'),
  cta: z.string().optional(),
});

export const WriterOutputSchema = z.union([
  LinkedInOutputSchema,
  InstagramReelOutputSchema,
]);

// ==========================================
// 5. Critic Review Schema (with Strict Topic Fidelity)
// ==========================================
export const CriticIssueSchema = z.object({
  type: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high']),
  description: z.string().min(3),
});

export const CriticReviewSchema = z.object({
  approved: z.boolean(),
  score: z.number().min(0).max(100),
  topicFidelity: z.number().min(0).max(100).default(100),
  factualAccuracy: z.number().min(0).max(100),
  relevance: z.number().min(0).max(100),
  platformFit: z.number().min(0).max(100),
  clarity: z.number().min(0).max(100),
  originality: z.number().min(0).max(100),
  naturalness: z.number().min(0).max(100).default(90),
  noFabricatedExperience: z.boolean().default(true),
  noFabricatedStatistics: z.boolean().default(true),
  issues: z.array(CriticIssueSchema),
  requiredChanges: z.array(z.string()),
});

// ==========================================
// 6. Project Creation Schema
// ==========================================
export const CreateProjectSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(3, 'Topic must be at least 3 characters long')
    .max(300, 'Topic must be at most 300 characters'),
  platform: PlatformSchema,
  tone: z.string().trim().max(100).optional().default('Professional but natural'),
  audience: z.string().trim().max(150).optional().default('Tech professionals & software developers'),
  maxIterations: z
    .number()
    .int()
    .min(MIN_ITERATIONS, `Minimum iterations is ${MIN_ITERATIONS}`)
    .max(MAX_ITERATIONS, `Maximum iterations is ${MAX_ITERATIONS}`)
    .default(DEFAULT_MAX_ITERATIONS),
});
