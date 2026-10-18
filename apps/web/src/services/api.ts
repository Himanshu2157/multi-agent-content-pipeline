import type {
  ContentProjectDTO,
  CreateProjectInput,
  ContentGenerationDTO,
} from '@contentforge/shared';

const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new ApiError(
        data.error || `HTTP error ${res.status}: ${res.statusText}`,
        res.status,
        data.details
      );
    }

    return data as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || 'Network request failed', 0);
  }
}

export const api = {
  // Health
  getHealth: () => request<{ status: string; app: string; timestamp: string; uptime: number }>('/health'),

  // Projects
  createProject: (input: CreateProjectInput) =>
    request<{ project: ContentProjectDTO }>('/projects', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  getProject: (projectId: string) =>
    request<{
      project: ContentProjectDTO;
      latestGeneration?: ContentGenerationDTO;
    }>(`/projects/${projectId}`),

  listProjects: () =>
    request<{ projects: ContentProjectDTO[] }>('/projects'),


  // Generations
  startGeneration: (projectId: string) =>
    request<{ generationId: string; status: string }>(`/projects/${projectId}/generate`, {
      method: 'POST',
    }),

  getGeneration: (generationId: string) =>
    request<{ generation: ContentGenerationDTO }>(`/generations/${generationId}`),
};
