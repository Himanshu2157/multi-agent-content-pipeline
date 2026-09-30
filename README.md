# ContentForge

> **Autonomous Multi-Agent AI Content Creation & Fact-Checking Pipeline**

[![CI](https://img.shields.io/badge/Status-Production--Ready%20MVP-emerald)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)]()
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%20%2B%20Tailwind-61dafb)]()
[![Prisma](https://img.shields.io/badge/ORM-Prisma%20PostgreSQL-2D3748)]()

---

## 1. Problem Statement

Creators and digital teams spend hours struggling with AI tools:
- A user prompts an AI for a social post.
- The AI produces shallow or factually questionable content.
- The user is forced to repeatedly re-prompt: *"Be more concise"*, *"Add citations"*, *"Fix the tone"*, *"Remove clichés"*.

This trial-and-error cycle wastes cognitive bandwidth, drains creator energy, and frequently allows subtle hallucinations to slip through unnoticed.

---

## 2. The ContentForge Solution

ContentForge is engineered around one core product principle:

> **"Don't make the user repeatedly prompt the AI. Let the AI research, write, critique, and refine itself."**

The user specifies a topic, platform (LinkedIn or Instagram Reel), and tone. An autonomous multi-agent pipeline then takes over:
1. **Researches** the topic using web search citations and extracts verified statistics.
2. **Writes** platform-specific content (e.g. 5 distinct angles for LinkedIn, or timed scripts with visual cues for Reels).
3. **Critiques** the generated draft against ground truth research, platform fit, and clarity.
4. **Feeds actionable critique back** to the Writer Agent.
5. **Iterates autonomously** until content passes quality thresholds or the configurable maximum iteration limit is reached.

---

## 3. High-Level Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend (React + Vite + Tailwind)"]
        User(["Creator Input (Topic, Platform, Tone)"])
        UI["Live Pipeline Visualizer"]
        Results["Results Workspace (LinkedIn Posts / Reel Script)"]
    end

    subgraph Backend["API Layer (Node.js + Express + TypeScript)"]
        API["REST API & SSE Event Stream"]
        Orchestrator["ContentGenerationGraph State Machine"]
    end

    subgraph Agents["Autonomous Multi-Agent Layer"]
        ResearchAgent["Agent 1: Research Specialist"]
        WriterAgent["Agent 2: Platform Writer Agent"]
        CriticAgent["Agent 3: Critic & Quality Reviewer"]
    end

    subgraph External["Provider Layer"]
        LLM["LLM Provider (OpenAI / Gemini / Mock)"]
        Search["Research Provider (Tavily / Mock Web Search)"]
    end

    subgraph DB["Persistence Layer (Prisma ORM)"]
        Postgres[(PostgreSQL Database)]
    end

    User -->|Configure & Submit| API
    API -->|Trigger Async| Orchestrator
    Orchestrator -->|1. Deep Research (Run Once)| ResearchAgent
    ResearchAgent --> Search
    ResearchAgent --> LLM
    ResearchAgent -->|ResearchResult| Orchestrator

    Orchestrator -->|2. Draft Content| WriterAgent
    WriterAgent --> LLM
    WriterAgent -->|ContentDraft| Orchestrator

    Orchestrator -->|3. Rigorous Evaluation| CriticAgent
    CriticAgent --> LLM
    CriticAgent -->|CriticReview| Orchestrator

    Orchestrator -->|Check Approval| Decision{Approved OR Max Cycles?}
    Decision -->|Rejected| WriterAgent
    Decision -->|Approved| Done[Save & Emit Final]

    Orchestrator -->|Live SSE Events & Polling| UI
    Orchestrator --> DB
    Done --> Results
```

---

## 4. Supported Platforms (MVP)

### 1. LinkedIn
Generates **4–5 distinct angle posts** around the user's topic:
- **Educational**: Foundational breakdown of architectural shifts and concepts.
- **Contrarian/Question-driven**: Challenges prevailing industry orthodoxies.
- **Storytelling**: Narrative-driven lessons and operational insights.
- **Practical/Step-by-Step**: Actionable implementation frameworks.
- **Data/Insight Driven**: Grounded in empirical benchmark metrics and industry reports.

Each post includes:
- Scroll-stopping hook (1–2 sentences)
- Factually grounded body with source citations
- Actionable Call-To-Action (CTA)
- One-click copy buttons and in-browser editor

### 2. Instagram Reel
Generates a complete **scene-by-scene short-form video script** (30–60 seconds):
- **0–3s Scroll-Stopping Hook**
- **Timed Scene Progressions** (e.g. `0–5 sec`, `5–15 sec`, `15–30 sec`, `30–45 sec`)
- **Visual & Camera Direction** (exact framing and B-roll cues)
- **Spoken Voiceover Script**
- **On-Screen Text Overlays**
- **Ending CTA**

---

## 5. Project Monorepo Structure

```
contentforge/
│
├── apps/
│   ├── web/                     # React + Vite + Tailwind CSS Frontend
│   │   ├── src/
│   │   │   ├── components/      # UI components (AgentTracker, LinkedIn, Reel, Critic)
│   │   │   ├── pages/           # HomePage, ProjectPage
│   │   │   ├── services/        # API client & SSE integrations
│   │   │   ├── lib/             # Utility helpers
│   │   │   ├── App.tsx          # Application shell & routes
│   │   │   └── main.tsx         # Entrypoint
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/                     # Node.js + Express + TypeScript Backend
│       ├── src/
│       │   ├── agents/          # Multi-Agent implementations
│       │   │   ├── research/    # ResearchAgent & research.prompt
│       │   │   ├── writer/      # WriterAgent & writer.prompt
│       │   │   ├── critic/      # CriticAgent & critic.prompt
│       │   │   └── graph/       # ContentGenerationGraph state machine
│       │   ├── controllers/     # ProjectController, GenerationController
│       │   ├── routes/          # REST route endpoints
│       │   ├── providers/       # LLM & Research provider abstractions
│       │   ├── services/        # Database & SSE event bus services
│       │   ├── middleware/      # Error & request logger middlewares
│       │   ├── config/          # Zod-validated environment config
│       │   ├── app.ts           # Express application setup
│       │   └── server.ts        # HTTP server entrypoint
│       └── test/                # Unit and integration test suites
│
├── packages/
│   ├── shared/                  # Shared Zod schemas, TypeScript types, and constants
│   │   ├── src/
│   │   │   ├── constants/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   └── package.json
│   │
│   └── database/                # Prisma ORM package
│       ├── prisma/
│       │   └── schema.prisma    # Complete PostgreSQL schema
│       └── src/index.ts         # Prisma client singleton
│
├── docs/                        # Architectural specifications
│   ├── architecture.md
│   ├── agent-workflow.md
│   └── api.md
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 6. Environment Variables

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/contentforge?schema=public"

# LLM Configuration
# LLM_PROVIDER can be 'mock', 'openai', 'gemini'
LLM_PROVIDER=mock
LLM_API_KEY=
LLM_MODEL=gpt-4o-mini

# Search / Research Provider Configuration
# SEARCH_PROVIDER can be 'mock', 'tavily', 'serper', 'duckduckgo'
SEARCH_PROVIDER=mock
SEARCH_API_KEY=

# Client URL (for CORS)
CLIENT_URL="http://localhost:5173"
```

> **Zero-Cost Local Mode**: When `LLM_PROVIDER=mock` and `SEARCH_PROVIDER=mock`, the application runs completely locally with realistic research citations, rigorous critique cycles, and multi-angle outputs without consuming paid API tokens.

---

## 7. Installation & Quick Start

### Prerequisites
- Node.js >= 20 (Tested on Node.js v24.19.0)
- npm >= 10 (Tested on npm 11.17.0)

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Build Packages
```bash
npm run db:generate
npm run build
```

### 3. Run Development Servers
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:4000/api`
- **Health Check**: `http://localhost:4000/api/health`

---

## 8. Development & Testing Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs both backend API and frontend Vite app concurrently |
| `npm run dev:api` | Runs backend API with `tsx watch` hot-reloading |
| `npm run dev:web` | Runs frontend Vite dev server on port 5173 |
| `npm run build` | Compiles `@contentforge/shared`, `@contentforge/database`, `apps/api`, and `apps/web` |
| `npm run test` | Executes full Vitest unit and integration test suites |
| `npm run db:generate` | Generates typed Prisma Client from schema |
| `npm run db:push` | Synchronizes Prisma schema directly with PostgreSQL |
| `npm run db:migrate` | Runs database migrations |

---

## 9. Comprehensive Test Suite

ContentForge includes rigorous automated unit and integration tests with mocked providers (zero external API dependencies required for CI):

```bash
npm run test --workspace=apps/api
```

Test coverage includes:
- **Research Agent**: Source extraction, schema compliance, confidence rating verification.
- **Writer Agent (LinkedIn)**: 4–5 distinct angles verification (`Educational`, `Contrarian`, `Storytelling`, `Practical`, `Data-driven`).
- **Writer Agent (Instagram Reel)**: Timed scene breakdowns, visuals, voiceovers, on-screen text overlays.
- **Critic Agent**: Constructive rejection with actionable instructions, approval threshold rules, high-severity issue disqualification.
- **Pipeline Integration**:
  1. Critic approves on first iteration when quality bar is met.
  2. Critic rejects iteration 1 then approves iteration 2 with direct feedback incorporation.
  3. Critic rejects until max iterations, returning "best available draft" with `approved = false`.
  4. Max iterations = 1 boundary condition.
  5. Unsupported platform graceful failure.
  6. Search provider network failure resilience.

---

## 10. Future Roadmap

- [ ] **Phase 2**: User authentication and organization workspaces.
- [ ] **Phase 3**: Custom Brand Voice Profiles (tone, preferred vocabulary, negative keywords, reference posts).
- [ ] **Phase 4**: Additional platforms (X / Twitter Threads, YouTube Shorts, Technical Blogs, Newsletters).
- [ ] **Phase 5**: Direct Social Publishing APIs (LinkedIn Marketing API, Instagram Graph API).

---

## License

MIT &copy; 2026 ContentForge.
