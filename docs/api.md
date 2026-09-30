# ContentForge REST API Reference

The ContentForge API operates on standard REST principles and returns JSON responses.

---

## Base URL
```
http://localhost:4000/api
```

---

## 1. System Health

### `GET /api/health`
Checks server and database connectivity.

**Response (200 OK):**
```json
{
  "status": "ok",
  "app": "ContentForge API",
  "timestamp": "2026-09-30T14:40:00.000Z",
  "uptime": 124.5
}
```

---

## 2. Projects

### `POST /api/projects`
Creates a new content generation project.

**Request Body:**
```json
{
  "topic": "AI agents in software development",
  "platform": "LINKEDIN",
  "tone": "Thought-provoking",
  "audience": "Senior Engineers & Founders",
  "maxIterations": 3
}
```

**Parameters:**
- `topic` *(string, required)*: Topic or thesis (3–300 characters).
- `platform` *(string, required)*: `"LINKEDIN"` or `"INSTAGRAM_REEL"`.
- `tone` *(string, optional)*: Tone descriptor (e.g. `"Professional"`, `"Thought-provoking"`).
- `audience` *(string, optional)*: Target demographic.
- `maxIterations` *(integer, optional)*: Maximum refinement loops (1–5, default: 3).

**Response (201 Created):**
```json
{
  "project": {
    "id": "proj_b60543eb-4033-4fc0-b3be-a7ff79237395",
    "userId": "dev-user-default",
    "title": "AI agents in software development",
    "topic": "AI agents in software development",
    "platform": "LINKEDIN",
    "tone": "Thought-provoking",
    "audience": "Senior Engineers & Founders",
    "status": "DRAFT",
    "maxIterations": 3,
    "createdAt": "2026-09-30T14:42:00.000Z",
    "updatedAt": "2026-09-30T14:42:00.000Z"
  }
}
```

---

### `GET /api/projects/:projectId`
Retrieves a project by ID with its latest generation and draft history.

**Response (200 OK):**
```json
{
  "project": { ... },
  "latestGeneration": { ... }
}
```

---

### `GET /api/projects`
Lists all content projects sorted by creation date.

**Response (200 OK):**
```json
{
  "projects": [ ... ]
}
```

---

## 3. Generations & Execution

### `POST /api/projects/:projectId/generate`
Starts the multi-agent generation graph asynchronously.

**Response (202 Accepted):**
```json
{
  "generationId": "gen_f98ba713-99ba-4997-a1f1-5c0145a0b589",
  "status": "RESEARCHING"
}
```

---

### `GET /api/generations/:generationId`
Retrieves the complete state of a generation.

**Response (200 OK):**
```json
{
  "generation": {
    "id": "gen_f98ba713-99ba-4997-a1f1-5c0145a0b589",
    "projectId": "proj_b60543eb-4033-4fc0-b3be-a7ff79237395",
    "currentIteration": 2,
    "status": "COMPLETED",
    "approved": true,
    "createdAt": "2026-09-30T14:42:10.000Z",
    "completedAt": "2026-09-30T14:42:14.000Z",
    "researchResult": {
      "summary": "...",
      "keyPoints": [ "..." ],
      "facts": [
        { "claim": "...", "source": "...", "confidence": "high" }
      ],
      "sources": [
        { "title": "...", "url": "https://...", "publisher": "..." }
      ]
    },
    "drafts": [
      {
        "id": "draft_1",
        "iteration": 1,
        "platform": "LINKEDIN",
        "content": { ... }
      }
    ],
    "criticReviews": [
      {
        "id": "rev_1",
        "iteration": 1,
        "approved": false,
        "score": 78,
        "issues": [ ... ],
        "requiredChanges": [ ... ]
      }
    ],
    "agentExecutions": [
      {
        "id": "exec_1",
        "agentType": "RESEARCH",
        "status": "COMPLETED",
        "iteration": 1,
        "startedAt": "...",
        "completedAt": "..."
      }
    ]
  }
}
```

---

### `GET /api/generations/:generationId/events`
Server-Sent Events (SSE) streaming endpoint for real-time reactive agent progress.

**Event Format:**
```
data: {"type":"CONNECTED","generation":{...}}

data: {"type":"STEP_CHANGE","agentType":"RESEARCH","status":"RUNNING","iteration":1}

data: {"type":"STEP_CHANGE","agentType":"RESEARCH","status":"COMPLETED","iteration":1}

data: {"type":"STEP_CHANGE","agentType":"WRITER","status":"RUNNING","iteration":1}

data: {"type":"PIPELINE_COMPLETE","status":"COMPLETED","approved":true,"iteration":2}
```
