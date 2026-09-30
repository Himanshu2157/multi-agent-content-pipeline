# ContentForge Multi-Agent Workflow

## Overview

ContentForge replaces trial-and-error prompting with a deterministic 3-agent orchestration pipeline.

```mermaid
sequenceDiagram
    autonumber
    actor User as Creator / User
    participant Orch as ContentGenerationGraph
    participant DB as Persistence Layer
    participant Res as Research Agent
    participant Wri as Writer Agent
    participant Cri as Critic Agent

    User->>Orch: Start Generation (Topic, Platform, Tone, Max Iterations)
    Orch->>DB: Set status: RESEARCHING, Record AgentExecution
    Orch->>Res: execute(topic)
    Res-->>Orch: ResearchResult (Facts, Sources, Cautions)
    Orch->>DB: Save ResearchResult, Complete Execution

    loop Refinement Cycle (1 to Max Iterations)
        Orch->>DB: Set status: WRITING, Record AgentExecution
        Orch->>Wri: execute(topic, research, previousDraft, criticFeedback, iteration)
        Wri-->>Orch: WriterOutput (LinkedIn 5 Angles OR Reel Script)
        Orch->>DB: Save ContentDraft, Complete Execution

        Orch->>DB: Set status: REVIEWING, Record AgentExecution
        Orch->>Cri: execute(topic, research, draft, iteration)
        Cri-->>Orch: CriticReview (Score, Issues, RequiredChanges, Approved)
        Orch->>DB: Save CriticReview, Complete Execution

        alt Approved == true
            Orch->>DB: Set status: COMPLETED, approved: true
            Orch-->>User: Final Verified Content & Critic Report
        else Iteration >= Max Iterations
            Orch->>DB: Set status: COMPLETED, approved: false (Best Available)
            Orch-->>User: Latest Draft with Manual Review Notice
        else Needs Revision
            Note over Orch: Increment iteration count, pass Critic feedback to Writer
        end
    end
```

---

## Agent Responsibilities

### 1. Research Agent
- **System Prompt**: *"You are a research specialist. Your job is to gather reliable information for another AI system. Do not write social media content. Do not fabricate sources. Clearly distinguish verified facts from uncertain information."*
- **Inputs**: User topic.
- **Tools**: `ResearchProvider` (Web Search).
- **Outputs**:
  - `summary`: Factual overview.
  - `keyPoints`: 3–5 high-signal takeaways.
  - `facts`: Specific factual assertions mapped to sources with confidence ratings (`high`, `medium`, `low`).
  - `sources`: Authoritative title, publisher, and valid URL.
  - `cautions`: Data limitations and disputed claims.

### 2. Writer Agent
- **System Prompt**: *"You are a professional content writer. Use the supplied research as your factual foundation. Do not invent statistics or sources. Adapt the content to the specified platform, audience, and tone. When revising, directly address the critic's feedback."*
- **Platform Behaviors**:
  - **LinkedIn**: Generates 4–5 distinct angle posts (`Educational`, `Contrarian/question-driven`, `Storytelling`, `Practical/step-by-step`, `Data/insight driven`). Each contains a scroll-stopping hook, structured body, and tailored CTA.
  - **Instagram Reel**: Generates a scene-by-scene short-form video script with timestamps (e.g. `0–5 sec`), camera & visual cues, voiceover script, and on-screen text overlays.
- **Revisions**: In iterations > 1, the Writer receives the exact issues and required changes flagged by the Critic Agent.

### 3. Critic & Quality Agent
- **System Prompt**: *"You are a rigorous content quality reviewer. Evaluate factual support, clarity, platform fit, originality, structure, and unsupported claims. Do not approve content merely because it sounds convincing. Identify concrete problems and provide actionable revision instructions."*
- **Evaluation Criteria**:
  - Factual Accuracy & Research Grounding
  - Platform Fit & Structural Compliance
  - Hook Quality & Scroll-Stopping Power
  - Clarity & Absence of Generic AI Clichés
- **Approval Logic**:
  - High severity issues immediately force `approved: false`.
  - Content with factual accuracy < 80% is rejected and returned to the Writer with specific instructions.
  - When rejected, explicit numbered instructions are written into `requiredChanges`.

---

## Best-Available Fallback
When maximum review iterations (configurable 1–5) are reached without meeting strict approval criteria:
- The system returns the latest draft.
- It explicitly marks `approved = false`.
- The UI renders a prominent warning: *"Maximum review iterations reached. This content is the latest draft and may need manual review."*
- Content is never deceptively labeled as fully verified if rejected by the Critic.
