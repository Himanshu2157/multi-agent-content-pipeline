export const PLATFORMS = {
  LINKEDIN: 'LINKEDIN',
  INSTAGRAM_REEL: 'INSTAGRAM_REEL',
} as const;

export type PlatformType = (typeof PLATFORMS)[keyof typeof PLATFORMS];

export const PROJECT_STATUSES = {
  DRAFT: 'DRAFT',
  RESEARCHING: 'RESEARCHING',
  WRITING: 'WRITING',
  REVIEWING: 'REVIEWING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type ProjectStatusType = (typeof PROJECT_STATUSES)[keyof typeof PROJECT_STATUSES];

export const AGENT_TYPES = {
  RESEARCH: 'RESEARCH',
  WRITER: 'WRITER',
  CRITIC: 'CRITIC',
} as const;

export type AgentTypeEnum = (typeof AGENT_TYPES)[keyof typeof AGENT_TYPES];

export const AGENT_EXECUTION_STATUSES = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type AgentExecutionStatusType =
  (typeof AGENT_EXECUTION_STATUSES)[keyof typeof AGENT_EXECUTION_STATUSES];

export const LINKEDIN_ANGLES = [
  'Educational',
  'Contrarian/question-driven',
  'Storytelling',
  'Practical/step-by-step',
  'Data/insight driven',
] as const;

export const DEFAULT_MAX_ITERATIONS = 3;
export const MIN_ITERATIONS = 1;
export const MAX_ITERATIONS = 5;

export const DEFAULT_TONES = [
  'Professional',
  'Engaging & punchy',
  'Thought-provoking',
  'Conversational',
  'Authoritative & technical',
] as const;
