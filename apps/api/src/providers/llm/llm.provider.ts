import { ZodType } from 'zod';
import { env } from '../../config/env.js';

export interface LLMGenerateOptions {
  systemPrompt?: string;
  temperature?: number;
  maxRetries?: number;
}

export interface LLMProvider {
  name: string;
  generateStructured<T>(
    prompt: string,
    schema: ZodType<T, any, any>,
    options?: LLMGenerateOptions
  ): Promise<T>;
}

export function extractJsonFromText(text: string): string {
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  return trimmed;
}

// Mock LLM Provider that strictly respects topic fidelity, generates human-sounding content, and forbids meta-agent drift
export class MockLLMProvider implements LLMProvider {
  name = 'mock';

  async generateStructured<T>(
    prompt: string,
    schema: ZodType<T, any, any>,
    options?: LLMGenerateOptions
  ): Promise<T> {
    const system = (options?.systemPrompt || '').toLowerCase();
    const lowerPrompt = prompt.toLowerCase();

    // ---------------------------------------------------------
    // 1. TOPIC ANALYZER AGENT
    // ---------------------------------------------------------
    if (
      system.includes('topic analysis') ||
      lowerPrompt.includes('analyze user content request')
    ) {
      const topicMatch = prompt.match(/User Topic:\s*"([^"]+)"/i) || prompt.match(/TOPIC:\s*([^\n\r]+)/i);
      const rawTopic = topicMatch ? topicMatch[1].trim() : 'Software Engineering';
      const t = rawTopic.toLowerCase();

      let analysis: any;

      if (t.includes('data structure')) {
        analysis = {
          normalizedTopic: 'Why Data Structures Are Essential in Software Engineering and Computer Science',
          coreSubject: 'Data Structures and Algorithm Performance',
          userIntent: 'Understand why data structures matter for code efficiency, memory layout, and problem solving',
          contentGoal: 'Deliver clear, relatable, and technically sound LinkedIn content explaining why choosing the right data structure matters',
          allowedSubtopics: [
            'efficient memory organization',
            'time and space complexity',
            'arrays vs linked lists',
            'hash tables and O(1) lookups',
            'trees and graphs in real systems',
            'cache locality and hardware performance',
            'scalability trade-offs',
          ],
          forbiddenTopicDrift: [
            'AI agents',
            'prompt engineering',
            'ContentForge',
            'multi-agent systems',
            'AI content generation',
            'unrelated corporate buzzwords',
          ],
        };
      } else if (t.includes('recursion')) {
        analysis = {
          normalizedTopic: 'What Recursion Is and Why It Is Difficult for Beginners to Master',
          coreSubject: 'Computer Science Fundamentals & Function Execution Models',
          userIntent: 'Explain the mechanics of recursion, why beginner mental models struggle with it, and how to understand it intuitively',
          contentGoal: 'Demystify recursive thinking, the call stack, and base cases with clear practical comparisons',
          allowedSubtopics: [
            'call stack mechanics',
            'stack frames and memory',
            'base case vs recursive step',
            'stack overflow risks',
            'tree traversal and divide-and-conquer',
            'mental models vs loop thinking',
          ],
          forbiddenTopicDrift: [
            'AI agents',
            'prompt engineering',
            'ContentForge',
            'multi-agent systems',
            'automated content pipelines',
          ],
        };
      } else if (t.includes('git')) {
        analysis = {
          normalizedTopic: 'Why Developers Must Learn Git and Distributed Version Control',
          coreSubject: 'Software Development Practices & Version Control',
          userIntent: 'Highlight the practical and career importance of mastering Git beyond basic push and pull',
          contentGoal: 'Demonstrate how Git provides safety nets, collaboration workflows, and audit trails for engineers',
          allowedSubtopics: [
            'commit history as an audit trail',
            'branching workflows and safe experimentation',
            'distributed collaboration',
            'merge conflict resolution',
            'code reviews via pull requests',
            'snapshots vs deltas DAG model',
          ],
          forbiddenTopicDrift: [
            'AI agents',
            'prompt engineering',
            'ContentForge',
            'multi-agent systems',
            'content marketing automation',
          ],
        };
      } else if (t.includes('cpu') || t.includes('instruction')) {
        analysis = {
          normalizedTopic: 'How a CPU Executes an Instruction: The Hardware Cycle Demystified',
          coreSubject: 'Computer Architecture and Hardware Systems',
          userIntent: 'Explain the fundamental fetch-decode-execute cycle inside a modern processor',
          contentGoal: 'Break down complex low-level computer architecture into clear, intuitive explanations for software engineers',
          allowedSubtopics: [
            'fetch-decode-execute cycle',
            'program counter and instruction register',
            'arithmetic logic unit (ALU)',
            'registers and memory bus',
            'clock cycles and pipelining',
            'machine code to electrical micro-operations',
          ],
          forbiddenTopicDrift: [
            'AI agents',
            'prompt engineering',
            'ContentForge',
            'multi-agent systems',
            'marketing funnels',
          ],
        };
      } else if (t.includes('sleep') || t.includes('productivity')) {
        analysis = {
          normalizedTopic: 'The Biological and Cognitive Link Between Sleep Quality and Professional Productivity',
          coreSubject: 'Neurobiology, Cognitive Health, and Human Performance',
          userIntent: 'Understand the biological mechanisms through which adequate sleep drives cognitive performance, decision making, and focus',
          contentGoal: 'Deliver evidence-grounded insights on why sleep is a biological necessity for sustained intellectual productivity',
          allowedSubtopics: [
            'REM and slow-wave deep sleep',
            'memory consolidation in hippocampus',
            'glymphatic brain waste clearance',
            'adenosine accumulation and mental fatigue',
            'prefrontal cortex executive function',
            'long-term cognitive preservation',
          ],
          forbiddenTopicDrift: [
            'AI agents',
            'prompt engineering',
            'ContentForge',
            'multi-agent systems',
            'software development frameworks',
          ],
        };
      } else {
        analysis = {
          normalizedTopic: `Comprehensive Practical Analysis of ${rawTopic}`,
          coreSubject: `${rawTopic} Fundamentals & Practical Applications`,
          userIntent: `Understand core concepts, trade-offs, and actionable principles of ${rawTopic}`,
          contentGoal: `Provide authentic, highly valuable professional content directly addressing ${rawTopic}`,
          allowedSubtopics: [
            `core principles of ${rawTopic}`,
            `practical real-world applications`,
            `common misconceptions and pitfalls`,
            `best practices for practitioners`,
            `system trade-offs and decision criteria`,
          ],
          forbiddenTopicDrift: [
            'AI agents',
            'prompt engineering',
            'ContentForge',
            'multi-agent systems',
            'AI content generation',
          ],
        };
      }

      return schema.parse(analysis);
    }

    // ---------------------------------------------------------
    // 2. RESEARCH AGENT
    // ---------------------------------------------------------
    if (
      system.includes('research specialist') ||
      lowerPrompt.includes('verified search findings & domain sources') ||
      lowerPrompt.includes('synthesize a comprehensive, factual overview')
    ) {
      const topicMatch =
        prompt.match(/NORMALIZED TOPIC:\s*([^\n\r]+)/i) ||
        prompt.match(/TOPIC:\s*([^\n\r]+)/i);
      const rawTopic = topicMatch ? topicMatch[1].trim() : 'Computer Science Fundamentals';
      const t = rawTopic.toLowerCase();

      let research: any;

      if (t.includes('data structure')) {
        research = {
          topic: rawTopic,
          summary: 'Data structures define how data is formatted, organized, and stored in computer memory. Choosing the appropriate structure dictates whether an operation runs in O(1) constant time or O(n) linear time, fundamentally bounding the scalability of any software system.',
          keyPoints: [
            'Data structures are not theoretical academic exercises; they directly determine memory access patterns and CPU cache efficiency.',
            'An array provides instantaneous O(1) indexed lookups due to contiguous memory, but inserting into the middle incurs an O(n) memory shift.',
            'Hash tables provide average O(1) key-value retrieval, but suffer when hash collisions force bucket chaining or re-hashing.',
            'Hierarchical data structures like B-Trees and Binary Search Trees enable logarithmic O(log n) lookups, forming the backbone of database indexes and file systems.',
          ],
          facts: [
            {
              claim: 'Array elements reside contiguously in memory, allowing hardware CPU cache prefetching to drastically speed up sequential access.',
              source: 'Stanford CS Education Library: Memory & Cache Locality',
              confidence: 'high',
            },
            {
              claim: 'Hash table lookups average O(1) time complexity, whereas unindexed linear searches scale as O(n).',
              source: 'Introduction to Algorithms (Cormen, Leiserson, Rivest, Stein)',
              confidence: 'high',
            },
            {
              claim: 'B-Trees minimize disk I/O operations by storing multiple keys per node, making them the industry standard for relational database indexes.',
              source: 'Database Systems: The Complete Book (Garcia-Molina et al.)',
              confidence: 'high',
            },
          ],
          sources: [
            {
              title: 'MIT OpenCourseWare: Introduction to Algorithms & Data Structures',
              url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms/',
              publisher: 'MIT',
              date: 'Canonical Curriculum',
            },
            {
              title: 'Stanford CS Library: Essential Data Structures',
              url: 'https://cs.stanford.edu/people/eroberts/courses/cs106b/data-structures-overview',
              publisher: 'Stanford University',
              date: 'Academic Reference',
            },
          ],
          cautions: [
            'Avoid premature optimization: a simple array or list is often faster than a complex linked list for small datasets due to cache locality overhead.',
          ],
        };
      } else if (t.includes('recursion')) {
        research = {
          topic: rawTopic,
          summary: 'Recursion is an algorithmic paradigm where a function calls itself to resolve progressively smaller instances of a problem. Beginners often struggle because execution does not progress sequentially down a single line; instead, execution stacks multiple paused contexts on the call stack until a base case unwinds them.',
          keyPoints: [
            'Every recursive function requires a base case to terminate execution and a recursive step that reduces the problem size.',
            'Each invocation allocates a stack frame containing local variables and return addresses on the runtime call stack.',
            'Failing to reach a base case consumes all available stack memory, triggering a stack overflow exception.',
            'Recursive solutions naturally reflect hierarchical data such as trees, JSON structures, and filesystem directories.',
          ],
          facts: [
            {
              claim: 'In languages without tail-call optimization, each recursive call consumes stack space proportional to the depth of recursion (O(d) auxiliary space).',
              source: 'Structure and Interpretation of Computer Programs (Abelson & Sussman)',
              confidence: 'high',
            },
            {
              claim: 'Depth-first search in tree structures requires only a few lines of recursive code compared to maintaining an explicit stack data structure in an iterative approach.',
              source: 'Harvard CS50 Course Notes: Recursion',
              confidence: 'high',
            },
          ],
          sources: [
            {
              title: 'Harvard CS50: Understanding Recursion and Stack Memory',
              url: 'https://cs50.harvard.edu/x/notes/recursion/',
              publisher: 'Harvard University',
              date: 'Course Archive',
            },
            {
              title: 'Princeton Algorithms: Stacks and Function Invocations',
              url: 'https://algs4.cs.princeton.edu/13stacks/',
              publisher: 'Princeton University',
              date: 'Reference Text',
            },
          ],
          cautions: [
            'Deep recursion can trigger stack overflow in environments with limited stack sizes unless converted to tail recursion or iteration.',
          ],
        };
      } else if (t.includes('git')) {
        research = {
          topic: rawTopic,
          summary: 'Git is a distributed version control system designed by Linus Torvalds. Unlike older centralized systems, Git models repository history as a directed acyclic graph (DAG) of immutable snapshots, enabling reliable offline collaboration, branching, and auditability.',
          keyPoints: [
            'Git records snapshots of the entire repository rather than line-by-line delta differences between files.',
            'Branches in Git are lightweight 41-byte pointers referencing a commit SHA hash, making branch creation virtually instant.',
            'Every clone contains the full historical repository, providing cryptographic verification and resilience against central server failures.',
            'Tools like git bisect enable automated binary search across hundreds of commits to pinpoint the exact commit introducing a bug.',
          ],
          facts: [
            {
              claim: 'Git uses SHA-1/SHA-256 cryptographic hashing to ensure that commit history cannot be altered without changing subsequent hashes.',
              source: 'Pro Git Book (Chacon & Straub)',
              confidence: 'high',
            },
            {
              claim: 'Distributed version control allows every engineer to commit, branch, and inspect diffs locally without an active network connection.',
              source: 'Git SCM Official Technical Documentation',
              confidence: 'high',
            },
          ],
          sources: [
            {
              title: 'Pro Git: Distributed Architecture & Graph Models',
              url: 'https://git-scm.com/book/en/v2',
              publisher: 'Git Community',
              date: 'Official Standard',
            },
          ],
          cautions: [
            'Commands that rewrite commit history (e.g. rebase, force push) require caution when collaborating on shared branches.',
          ],
        };
      } else if (t.includes('cpu') || t.includes('instruction')) {
        research = {
          topic: rawTopic,
          summary: 'A Central Processing Unit (CPU) executes software instructions through continuous repetitions of the Fetch, Decode, and Execute cycle. Hardware registers, control logic, and arithmetic circuitry collaborate at gigahertz clock speeds to turn binary opcodes into electrical state changes.',
          keyPoints: [
            'The Program Counter (PC) stores the memory address of the next instruction, which is fetched into the Instruction Register (IR).',
            'The Control Unit decodes the opcode bits to determine the operation and select the source and destination registers.',
            'The Arithmetic Logic Unit (ALU) performs arithmetic calculations or logical comparisons on register inputs.',
            'Modern microarchitectures utilize instruction pipelining and superscalar execution to overlap multiple stages across clock cycles.',
          ],
          facts: [
            {
              claim: 'The instruction cycle consists of three fundamental stages: Fetching from memory/cache, Decoding the bitfield opcode, and Executing via the ALU or control logic.',
              source: 'Computer Organization and Design (Patterson & Hennessy)',
              confidence: 'high',
            },
            {
              claim: 'Internal CPU registers provide sub-nanosecond access latency compared to tens of nanoseconds for main RAM.',
              source: 'MIT 6.004 Computation Structures',
              confidence: 'high',
            },
          ],
          sources: [
            {
              title: 'MIT 6.004: Computation Structures & Processor Microarchitecture',
              url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-004-computation-structures/',
              publisher: 'MIT EECS',
              date: 'Academic Text',
            },
          ],
          cautions: [
            'Branch mispredictions in modern out-of-order execution pipelines cause pipeline flushes that temporarily stall throughput.',
          ],
        };
      } else if (t.includes('sleep') || t.includes('productivity')) {
        research = {
          topic: rawTopic,
          summary: 'Sleep is a biologically essential restorative process required for neuroplasticity, memory consolidation, and physiological homeostasis. Rather than being passive downtime, deep slow-wave and REM sleep actively restore executive cognitive faculties in the prefrontal cortex.',
          keyPoints: [
            'During slow-wave sleep, the glymphatic system expands to flush neurotoxic waste products accumulated during waking hours.',
            'The hippocampus transfers declarative memory traces to the neocortex during sleep, converting short-term learnings into durable long-term retention.',
            'Adenosine builds up continuously in the brain while awake, creating homeostatic sleep pressure that only sleep can clear.',
            'Sleep restriction impairs attention, error detection, emotional regulation, and high-order decision making.',
          ],
          facts: [
            {
              claim: 'Cerebrospinal fluid circulation increases significantly during slow-wave sleep, clearing metabolic waste like amyloid-beta proteins.',
              source: 'National Institutes of Health (NIH) Neuroscience Research',
              confidence: 'high',
            },
            {
              claim: 'Memory replay during REM and slow-wave sleep is essential for synaptic consolidation and procedural skill retention.',
              source: 'Nature Reviews Neuroscience / NIH',
              confidence: 'high',
            },
          ],
          sources: [
            {
              title: 'NIH Brain Basics: Understanding Sleep and Cognitive Function',
              url: 'https://www.nih.gov/health-information/brain-basics-understanding-sleep',
              publisher: 'National Institutes of Health',
              date: 'Clinical Overview',
            },
          ],
          cautions: [
            'Caffeine only masks adenosine receptors temporarily; it does not clear metabolic sleep debt.',
          ],
        };
      } else {
        research = {
          topic: rawTopic,
          summary: `Factual overview examining the core principles, verified mechanics, and practical applications of ${rawTopic}. Grounded in established domain literature.`,
          keyPoints: [
            `Understanding ${rawTopic} requires mastering its foundational terminology and core mechanics.`,
            `Practitioners evaluate trade-offs based on operational reliability, performance, and maintainability.`,
            `Common pitfalls often stem from surface-level assumptions without examining underlying constraints.`,
          ],
          facts: [
            {
              claim: `${rawTopic} establishes systematic methods for managing complexity and optimizing real-world outcomes.`,
              source: `Domain Standard Reference`,
              confidence: 'high',
            },
          ],
          sources: [
            {
              title: `Authoritative Guide to ${rawTopic}`,
              url: `https://en.wikipedia.org/wiki/${encodeURIComponent(rawTopic.replace(/\s+/g, '_'))}`,
              publisher: `Standard Academic Press`,
              date: 'Verified Reference',
            },
          ],
          cautions: [
            `Avoid oversimplifying trade-offs; practical context determines the optimal approach.`,
          ],
        };
      }

      return schema.parse(research);
    }

    // ---------------------------------------------------------
    // 3. CONTENT STRATEGIST AGENT
    // ---------------------------------------------------------
    if (
      system.includes('content strategist') ||
      lowerPrompt.includes('formulate content strategy') ||
      lowerPrompt.includes('content strategy schema') ||
      lowerPrompt.includes('targetaudiencepainpoint')
    ) {
      const topicMatch =
        prompt.match(/USER TOPIC:\s*"([^"]+)"/i) ||
        prompt.match(/NORMALIZED TOPIC:\s*"([^"]+)"/i) ||
        prompt.match(/TOPIC:\s*([^\n\r]+)/i);
      const rawTopic = topicMatch ? topicMatch[1].trim() : 'Software Engineering';
      const t = rawTopic.toLowerCase();

      let strategy: any;

      if (t.includes('data structure')) {
        strategy = {
          topic: rawTopic,
          targetAudiencePainPoint: 'Many developers treat data structures as academic interview trivia rather than everyday architecture decisions that dictate real-world software performance.',
          coreInsight: 'An algorithm can only be as efficient as the data structure that feeds it. Choosing the right layout in memory solves performance bottlenecks before writing complex logic.',
          angles: [
            {
              id: 'angle_educational',
              name: 'Educational',
              description: 'Explain the fundamental connection between memory organization and runtime complexity.',
              targetTakeaway: 'Data structures determine time complexity; picking the wrong one makes fast code impossible.',
              hookIdea: 'Most slow code has nothing to do with slow processors. It has to do with how data sits in memory.',
              suggestedExampleOrAnalogy: 'Think of looking for a book: scanning every shelf sequentially (array search) vs walking straight to the catalog call number (hash table).',
            },
            {
              id: 'angle_contrarian',
              name: 'Contrarian/question-driven',
              description: 'Challenge the myth that LeetCode data structures are useless in practical production systems.',
              targetTakeaway: 'You use advanced data structures every single day through databases, caches, and routers.',
              hookIdea: 'Why do so many engineers say "I never use data structures at work"? Because their libraries are doing it for them.',
              suggestedExampleOrAnalogy: 'Your relational database index is a B-Tree; your Redis cache is a hash map with LRU eviction.',
            },
            {
              id: 'angle_storytelling',
              name: 'Storytelling',
              description: 'Relatable engineering dilemma of diagnosing a sluggish feature caused by an accidental O(n^2) nested loop.',
              targetTakeaway: 'Replacing a nested linear search with a Set or Map turns minutes of waiting into milliseconds.',
              hookIdea: 'A single data structure change once turned a 45-second API query into an 8-millisecond response.',
              suggestedExampleOrAnalogy: 'Checking membership in an array of 50,000 items on every loop iteration vs using a Set.',
            },
            {
              id: 'angle_practical',
              name: 'Practical/step-by-step',
              description: 'A 3-question mental checklist for choosing between Array, Set, Map, and Tree.',
              targetTakeaway: 'Developers gain an immediate heuristic for picking the right collection type.',
              hookIdea: 'Before picking a generic list or array in your next feature, answer these 3 questions:',
              suggestedExampleOrAnalogy: 'Do you need ordered indexes, unique values, fast key lookups, or sorted hierarchy?',
            },
            {
              id: 'angle_data',
              name: 'Data/insight driven',
              description: 'Explore the concrete mechanics of CPU cache locality and Big-O notation.',
              targetTakeaway: 'Understanding Big-O and hardware memory hierarchies prevents premature complexity.',
              hookIdea: 'Here is what Big-O actually looks like when your dataset scales from 1,000 to 1,000,000 items.',
              suggestedExampleOrAnalogy: 'O(1) stays flat at 1 microsecond; O(n) takes seconds; O(n^2) takes hours.',
            },
          ],
          avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'fabricated statistics', 'vague buzzwords'],
          keyPointsToEmphasize: [
            'Time and space complexity trade-offs',
            'Hardware memory layout and cache locality',
            'Real database and systems use cases',
          ],
        };
      } else {
        strategy = {
          topic: rawTopic,
          targetAudiencePainPoint: `Professionals struggle to grasp the core trade-offs and practical value of ${rawTopic} without getting bogged down in jargon.`,
          coreInsight: `${rawTopic} is best understood by connecting its foundational mechanics directly to everyday practical outcomes.`,
          angles: [
            {
              id: 'angle_educational',
              name: 'Educational',
              description: `Clear breakdown of what ${rawTopic} actually is and how its foundational mechanics operate.`,
              targetTakeaway: `Solid conceptual mastery of ${rawTopic}.`,
              hookIdea: `If you want to master ${rawTopic}, start with the underlying mental model.`,
              suggestedExampleOrAnalogy: 'Building a sturdy foundation before adding higher-level features.',
            },
            {
              id: 'angle_contrarian',
              name: 'Contrarian/question-driven',
              description: `A thoughtful challenge to common misconceptions surrounding ${rawTopic}.`,
              targetTakeaway: `Deeper critical reflection on standard industry assumptions.`,
              hookIdea: `The most common belief about ${rawTopic} overlooks an essential truth.`,
              suggestedExampleOrAnalogy: 'Looking beneath conventional wisdom to inspect actual constraints.',
            },
            {
              id: 'angle_storytelling',
              name: 'Storytelling',
              description: `A realistic scenario illustrating the consequence of ignoring ${rawTopic}.`,
              targetTakeaway: `Appreciation for how small oversights compound in complex systems.`,
              hookIdea: `When teams overlook ${rawTopic}, the breakdown rarely happens immediately—it surfaces when the system scales.`,
              suggestedExampleOrAnalogy: 'A crack in the foundation appearing only when traffic spikes.',
            },
            {
              id: 'angle_practical',
              name: 'Practical/step-by-step',
              description: `Actionable, step-by-step methodology for applying ${rawTopic} effectively.`,
              targetTakeaway: `Immediate practical steps practitioners can implement today.`,
              hookIdea: `A simple 3-part framework for navigating ${rawTopic} with confidence:`,
              suggestedExampleOrAnalogy: 'A practical diagnostic checklist.',
            },
            {
              id: 'angle_data',
              name: 'Data/insight driven',
              description: `Core principles and empirical considerations governing ${rawTopic}.`,
              targetTakeaway: `Clear understanding of trade-offs and quantitative constraints.`,
              hookIdea: `Understanding the trade-offs in ${rawTopic} comes down to measuring the right constraints.`,
              suggestedExampleOrAnalogy: 'Balancing short-term speed against long-term maintainability.',
            },
          ],
          avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'fabricated statistics', 'generic buzzwords'],
          keyPointsToEmphasize: [
            'First-principles understanding',
            'Real-world operational trade-offs',
            'Actionable takeaways for practitioners',
          ],
        };
      }

      return schema.parse(strategy);
    }

    // ---------------------------------------------------------
    // 4. CRITIC AGENT
    // ---------------------------------------------------------
    if (
      system.includes('quality reviewer') ||
      system.includes('editorial reviewer') ||
      system.includes('critic') ||
      lowerPrompt.includes('audit content quality') ||
      lowerPrompt.includes('evaluation checklist') ||
      lowerPrompt.includes('draft content under evaluation')
    ) {
      const iterationMatch = prompt.match(/ITERATION:\s*(\d+)/i);
      const iteration = iterationMatch ? parseInt(iterationMatch[1], 10) : 1;

      // Extract user topic from prompt header
      const userTopicMatch = prompt.match(/USER TOPIC:\s*([^\n\r]+)/i) || prompt.match(/TOPIC:\s*([^\n\r]+)/i);
      const userTopicLower = (userTopicMatch ? userTopicMatch[1] : '').toLowerCase();
      const topicIsAboutAI =
        userTopicLower.includes('autonomous ai') ||
        userTopicLower.includes('multi-agent') ||
        userTopicLower.includes('ai agent');

      // Check for topic drift ONLY within the draft content section (not the forbidden topics prompt header)
      const draftSectionMatch = prompt.match(/DRAFT CONTENT UNDER EVALUATION:\s*([\s\S]+?)\s*EVALUATION CHECKLIST:/i);
      const draftContent = (draftSectionMatch ? draftSectionMatch[1] : '').toLowerCase();
      const hasSevereDrift =
        (draftContent.includes('ai agent') ||
          draftContent.includes('contentforge') ||
          draftContent.includes('prompt fatigue')) &&
        !topicIsAboutAI;

      if (hasSevereDrift) {
        const driftReview = {
          approved: false,
          score: 45,
          topicFidelity: 35,
          factualAccuracy: 60,
          relevance: 40,
          platformFit: 70,
          clarity: 70,
          originality: 50,
          naturalness: 60,
          noFabricatedExperience: false,
          noFabricatedStatistics: false,
          issues: [
            {
              type: 'topic_drift',
              severity: 'high',
              description: 'The draft discusses AI agents, prompt fatigue, or ContentForge rather than staying 100% focused on the user topic.',
            },
          ],
          requiredChanges: [
            'Rewrite all content to be 100% about the user topic. Completely remove any mention of AI agents, prompt engineering, or internal tools.',
          ],
        };
        return schema.parse(driftReview);
      }

      // If iteration >= 2 or if prompt explicitly requests always approve:
      const shouldApprove = iteration >= 2 || lowerPrompt.includes('high quality draft') || lowerPrompt.includes('approve: true');

      if (shouldApprove) {
        const approvedReview = {
          approved: true,
          score: 95,
          topicFidelity: 98,
          factualAccuracy: 96,
          relevance: 97,
          platformFit: 95,
          clarity: 94,
          originality: 92,
          naturalness: 95,
          noFabricatedExperience: true,
          noFabricatedStatistics: true,
          issues: [],
          requiredChanges: [],
        };
        return schema.parse(approvedReview);
      } else {
        const revisionReview = {
          approved: false,
          score: 82,
          topicFidelity: 95,
          factualAccuracy: 88,
          relevance: 92,
          platformFit: 86,
          clarity: 85,
          originality: 84,
          naturalness: 90,
          noFabricatedExperience: true,
          noFabricatedStatistics: true,
          issues: [
            {
              type: 'hook_strength',
              severity: 'low',
              description: 'The opening hook could be even more punchy and direct to stop scrollers in the first two lines.',
            },
          ],
          requiredChanges: [
            'Tighten the opening hook to be more direct and immediately compelling.',
          ],
        };
        return schema.parse(revisionReview);
      }
    }

    // ---------------------------------------------------------
    // 5. WRITER AGENT - LINKEDIN
    // ---------------------------------------------------------
    if (
      lowerPrompt.includes('platform: linkedin') ||
      lowerPrompt.includes('requirements for linkedin') ||
      lowerPrompt.includes('distinct linkedin posts')
    ) {
      const topicMatch =
        prompt.match(/USER TOPIC:\s*([^\n\r]+)/i) ||
        prompt.match(/TOPIC:\s*([^\n\r]+)/i);
      const rawTopic = topicMatch ? topicMatch[1].trim() : 'Software Engineering';
      const t = rawTopic.toLowerCase();

      let posts: any[] = [];

      if (t.includes('data structure')) {
        posts = [
          {
            id: 'post_educational',
            angle: 'Educational',
            hook: 'Most slow code has nothing to do with slow CPUs. It comes down to how your data is organized in memory.',
            body: 'When you choose a data structure, you are not just picking a collection type. You are setting the physical performance boundary of your program.\n\nTake two common operations:\n\n1. Looking up an item in an unsorted array: Your CPU has to inspect elements one by one from index 0 to N. At 100,000 items, that is up to 100,000 checks.\n\n2. Looking up an item in a hash table: A mathematical hash function converts the key into an exact memory address in O(1) constant time, whether you have 10 items or 10,000,000 items.\n\nAlgorithms dictate what your code does. Data structures dictate how fast it can actually do it.',
            cta: 'What was the first data structure that completely changed the way you write code?',
          },
          {
            id: 'post_contrarian',
            angle: 'Contrarian/question-driven',
            hook: 'Why do so many developers believe they "never use data structures" in real-world work?',
            body: 'Because modern frameworks hide them so well that engineers forget they exist.\n\nWhen you create a database index, you are using a B-Tree or B+ Tree designed to minimize disk reads.\n\nWhen you set up an LRU cache in Redis, you are pairing a doubly linked list with a hash map.\n\nWhen your frontend router resolves nested URL paths, it traverses a Trie or tree hierarchy.\n\nYou do not avoid data structures in production. You either understand the ones your libraries use, or you wonder why your service runs out of memory when traffic spikes.',
            cta: 'Do you think junior developers should focus more on LeetCode-style data structures, or on systems architecture?',
          },
          {
            id: 'post_storytelling',
            angle: 'Storytelling',
            hook: 'A simple data structure change once turned a 45-second database export into an 8-millisecond operation.',
            body: 'The culprit was innocent-looking code:\n\nA batch job checked whether incoming IDs already existed in a database export. The developer stored the existing IDs in a standard array and ran `array.includes(id)` inside a loop of 60,000 incoming records.\n\nThat meant 60,000 records × 60,000 checks = up to 3.6 billion operations. The CPU was spinning at 100% just doing linear array scans.\n\nThe fix took two lines of code:\nConverting the array into a Set (a hash-based lookup table) turned every check from O(n) to O(1).\n\nTotal run time dropped from nearly a minute to under 10 milliseconds.\n\nYou do not need complex microservices to fix performance bottlenecks. You just need to know how data sits in memory.',
            cta: 'Have you ever fixed a major performance bottleneck with a single data structure swap?',
          },
          {
            id: 'post_practical',
            angle: 'Practical/step-by-step',
            hook: 'Before picking a generic list or array in your next feature, run through this 3-question checklist:',
            body: '1. How often will you read vs write?\nIf you read constantly by index and write infrequently, an array offers contiguous memory and unbeatable CPU cache locality. If you constantly insert and delete in the middle, pointer-based structures save reallocation cost.\n\n2. Does lookup speed matter as data grows?\nIf your dataset will scale past a few hundred items and you query by unique keys, switch from a linear list to a Map or Set immediately.\n\n3. Is your data inherently hierarchical or sorted?\nIf your data has parent-child relationships or requires range queries (e.g. timestamps between date A and date B), tree structures like Binary Search Trees or B-Trees outperform flat lists.\n\nPick the structure that matches your access pattern, not just the one that is fastest to type.',
            cta: 'Save this checklist for your next code review.',
          },
          {
            id: 'post_data',
            angle: 'Data/insight driven',
            hook: 'Here is what Big-O complexity actually means when your software scales from 1,000 to 1,000,000 items:',
            body: 'Consider three data structure operations handling 1,000,000 records:\n\n• O(1) Hash Map Lookup: 1 single operation. Instantaneous, regardless of dataset size.\n\n• O(log n) Balanced Binary Tree Search: ~20 comparisons to find any record among a million items.\n\n• O(n) Linear Array Scan: Up to 1,000,000 sequential checks.\n\n• O(n^2) Nested Array Search: 1,000,000,000,000 operations. Your process will freeze, timeouts will trigger, and memory will spike.\n\nHardware improvements cannot outrun poor algorithmic complexity. The smartest optimization you can ever make happens before you write the first loop.',
            cta: 'How does your engineering team test for algorithmic scaling before deploying to production?',
          },
        ];
      } else if (t.includes('recursion')) {
        posts = [
          {
            id: 'post_educational',
            angle: 'Educational',
            hook: 'Recursion is notoriously difficult for beginners—not because the math is complex, but because human brains do not naturally think in call stacks.',
            body: 'When you write an iterative loop (`for` or `while`), you follow a straight line: do step A, then step B, then repeat until done.\n\nRecursion works in three dimensions:\n1. A function calls itself to solve a smaller subproblem.\n2. The computer pauses the current function and stacks a brand-new "frame" on top of the call stack.\n3. This continues until the function hits a "base case"—a condition where it can answer immediately without calling itself again.\n4. Only then does the stack begin unwinding, passing answers back down the chain.\n\nIf you understand the call stack, recursion stops feeling like magic and starts feeling like an organized stack of plates.',
            cta: 'What was the mental model that finally helped you understand recursion?',
          },
          {
            id: 'post_contrarian',
            angle: 'Contrarian/question-driven',
            hook: 'Unpopular opinion: If you can solve a problem cleanly with an iterative loop, you should probably avoid recursion.',
            body: 'Computer science courses love showing recursive Fibonacci numbers and factorial calculations. But in production software, naive recursion introduces real risks:\n\n• Memory overhead: Every recursive call allocates a new stack frame in memory.\n• Stack overflow risk: If your base case fails or your recursion depth exceeds the stack limit (often a few thousand calls), your entire program crashes.\n• Readability: Non-linear code is harder for your teammates to debug at 2 AM.\n\nRecursion shines when data is inherently recursive—like traversing DOM trees, JSON objects, or file directories. For flat sequences, standard loops are almost always safer.',
            cta: 'Do you prefer iterative or recursive solutions in production code? Let\'s discuss below.',
          },
          {
            id: 'post_storytelling',
            angle: 'Storytelling',
            hook: 'The first time I encountered a stack overflow error, I stared at a two-line recursive function for three hours.',
            body: 'The code looked completely innocent:\nIt was supposed to count down from a number to zero. But whenever a negative number was passed in, the base case `if (n === 0)` was bypassed completely.\n\nThe function happily called itself with -1, -2, -3... all the way to -10,000 until the JavaScript engine threw `Maximum call stack size exceeded`.\n\nThat bug taught me the golden rule of recursion: always write and test your base case before you touch the recursive step.\n\nA recursive function without an airtight base case is just an infinite loop that consumes memory on every pass.',
            cta: 'What is the most memorable recursion bug you have ever encountered?',
          },
          {
            id: 'post_practical',
            angle: 'Practical/step-by-step',
            hook: 'Struggling with a recursive problem? Here is the 3-step formula senior engineers use to write recursive code without getting confused:',
            body: 'Step 1: Identify the Base Case\nWhat is the absolute smallest, simplest input where you already know the answer without any calculation? Write that `if` statement first and return immediately.\n\nStep 2: Define the Recursive Step with a Smaller Input\nHow does this function solve just one piece of the problem and pass a smaller version of the input to itself? If you start with N, make sure the next call receives N - 1 or a smaller subtree.\n\nStep 3: Trust the Return Value\nDo not try to trace ten layers of calls in your head. Assume the smaller call returns the correct answer, and focus only on combining that result with your current step.\n\nKeep the base case bulletproof, and the stack handles the rest.',
            cta: 'Try using this 3-step approach on your next tree traversal problem.',
          },
          {
            id: 'post_data',
            angle: 'Data/insight driven',
            hook: 'Why do compilers and runtime engines care so much about recursion? It comes down to stack memory vs heap memory.',
            body: 'When a function executes, its local variables live in a dedicated stack frame (typically a few kilobytes).\n\nIn standard iterative loops:\n• Memory is reused in place: O(1) auxiliary space.\n\nIn recursive functions without tail-call optimization:\n• Depth D means D separate stack frames held simultaneously: O(D) auxiliary space.\n\nAt a recursion depth of 10,000, you are holding 10,000 stack frames in memory at the same time.\n\nThis is why modern compilers use Tail-Call Optimization (TCO)—reusing the existing stack frame when the recursive call is the very last operation—turning a recursive function into an iterative loop behind the scenes.',
            cta: 'Does your preferred programming language support tail-call optimization?',
          },
        ];
      } else if (t.includes('git')) {
        posts = [
          {
            id: 'post_educational',
            angle: 'Educational',
            hook: 'Git is not just a tool for backing up code to the cloud. It is a distributed safety net for engineering teams.',
            body: 'Many developers start by memorizing five commands: `add`, `commit`, `push`, `pull`, and `status`.\n\nBut Git becomes truly powerful when you understand its core architecture:\n\nGit does not store file differences or deltas. It stores complete snapshots of your project in a Directed Acyclic Graph (DAG) of cryptographic commits.\n\nBecause every commit has a unique SHA hash pointing back to its parent, you have an immutable, mathematically verifiable history of every line of code ever written.\n\nOnce you grasp that Git is just a graph of commits and branches are just pointers, merge conflicts stop being terrifying.',
            cta: 'How long did you use Git before you truly felt comfortable with branching and merging?',
          },
          {
            id: 'post_contrarian',
            angle: 'Contrarian/question-driven',
            hook: 'If your git commit messages look like "fixed bug", "wip", and "updates", you are defeating the entire purpose of version control.',
            body: 'Version control is not a backup drive. It is a communication tool for your future self and your teammates.\n\nWhen a production incident happens six months from now, `git blame` should reveal why a decision was made, what trade-offs were considered, and what issue was being resolved.\n\nA great commit message tells the story:\n- Short summary of the change\n- Why the change was necessary\n- Any non-obvious side effects\n\nWriting clean commits is one of the highest-leverage habits any software engineer can build.',
            cta: 'What is your team\'s rule for writing commit messages and PR descriptions?',
          },
          {
            id: 'post_storytelling',
            angle: 'Storytelling',
            hook: 'The command that transformed me from an anxious Git user into a confident engineer was `git reflog`.',
            body: 'Early in my career, I accidentally ran a hard reset on the wrong branch and watched two days of unpushed feature work vanish from my editor.\n\nI thought the code was gone forever.\n\nThen a senior engineer showed me `git reflog`—a ledger that tracks every single head movement across your local repository, even commits orphaned by resets or deleted branches.\n\nWithin 30 seconds, we located the orphaned commit hash, checked it out, and restored the branch.\n\nGit is almost impossible to truly break if you have committed your changes. It is designed from the ground up to never lose data.',
            cta: 'What Git command or feature saved you from a near disaster?',
          },
          {
            id: 'post_practical',
            angle: 'Practical/step-by-step',
            hook: '3 Git commands that every developer should learn beyond `git push` and `git pull`:',
            body: '1. `git bisect`\nWhen a regression appears in production and you have 200 commits since the last release, `git bisect` performs an automated binary search through the commit graph to find the exact commit that broke the build.\n\n2. `git stash -u`\nQuickly switch context without committing half-finished work. The `-u` flag ensures untracked new files are saved alongside your tracked changes.\n\n3. `git diff --stat`\nBefore committing, get a concise overview of which files changed and how many lines were inserted or deleted.\n\nMastering your development tools saves hours of debugging frustration every single week.',
            cta: 'Which Git command do you rely on most during complex debugging sessions?',
          },
          {
            id: 'post_data',
            angle: 'Data/insight driven',
            hook: 'Why did Git dominate the software industry and replace older tools like SVN and CVS? Distributed architecture.',
            body: 'In older centralized version control systems (like Subversion):\n• Every commit required an active network connection to a central server.\n• Branching meant copying entire directory trees, taking minutes and consuming heavy server storage.\n• If the central server went down, development came to a standstill.\n\nIn Git:\n• Every cloned repository is a complete, standalone backup with full history.\n• A branch is a tiny 41-byte pointer referencing a commit SHA hash—making branch creation instantaneous.\n• Commits, diffs, and logs run 100% locally at microsecond speeds.\n\nSpeed and decentralization changed how the world writes software.',
            cta: 'Do you remember the transition from centralized version control to Git? Share your experience below.',
          },
        ];
      } else if (t.includes('cpu') || t.includes('instruction')) {
        posts = [
          {
            id: 'post_educational',
            angle: 'Educational',
            hook: 'At 3.5 GHz, your processor executes billions of instructions every single second. Here is what actually happens during each instruction cycle:',
            body: 'Every single line of software you write compiles down to machine code instructions. Inside the silicon, execution follows the fundamental Fetch-Decode-Execute cycle:\n\n1. FETCH: The Program Counter (PC) register points to the next instruction in memory or cache. That bitfield is fetched into the Instruction Register.\n\n2. DECODE: The Control Unit analyzes the opcode bits. It determines which operation to perform (add, compare, jump) and identifies the operand registers.\n\n3. EXECUTE: The Arithmetic Logic Unit (ALU) or control logic executes the electrical calculation. The result is written back to high-speed registers or queued for memory writeback.\n\nBillions of microscopic transistors switching state in perfect synchronization.',
            cta: 'Did you learn computer architecture in school, or on the job?',
          },
          {
            id: 'post_contrarian',
            angle: 'Contrarian/question-driven',
            hook: 'Why should a modern high-level software developer care about how a CPU executes instructions?',
            body: 'Because your code does not run in the cloud. It runs on silicon.\n\nWhen you understand that reading from L1 cache takes 1 nanosecond while fetching from main RAM takes 50-100 nanoseconds, you write code with better memory locality.\n\nWhen you know how branch predictors work, you understand why sorting an array before filtering can speed up a loop by 3x.\n\nHigh-level abstractions are wonderful, but the engineers who build resilient, ultra-fast systems understand the machine beneath the code.',
            cta: 'Do you consider hardware architecture when optimizing backend software?',
          },
          {
            id: 'post_storytelling',
            angle: 'Storytelling',
            hook: 'The first time I saw the legendary "Why is processing a sorted array faster than processing an unsorted array?" benchmark, my mind was blown.',
            body: 'A developer noticed that iterating over an array and summing numbers greater than 128 took 11 seconds when the array was random, but only 4 seconds when the array was sorted.\n\nThe algorithm was identical. The data was identical.\n\nThe difference was CPU branch prediction:\n\nModern CPUs pipeline instructions dozens of cycles ahead. When they hit an `if` condition, the branch predictor guesses which path the code will take so execution does not stall.\n\nWith sorted data, the CPU guessed right every time. With unsorted data, branch mispredictions forced the CPU to flush its pipeline over and over again.\n\nHardware matters more than most software developers realize.',
            cta: 'Have you ever encountered a performance anomaly caused by hardware-level branch prediction or caching?',
          },
          {
            id: 'post_practical',
            angle: 'Practical/step-by-step',
            hook: 'The 3 core components inside a CPU that turn electrical current into software execution:',
            body: '1. The Control Unit (CU)\nThe orchestrator. It decodes incoming binary opcodes and sends electrical control signals to activate registers and data pathways.\n\n2. The Arithmetic Logic Unit (ALU)\nThe calculator. It performs binary addition, bitwise AND/OR operations, and numerical comparisons.\n\n3. The Registers\nThe fastest storage in existence. Located directly on the processor die, registers hold immediate operands and memory pointers with sub-nanosecond access latency.\n\nUnderstanding these three pieces clarifies everything from assembly code to high-level concurrency.',
            cta: 'Save this post if you want a clean mental model of processor architecture.',
          },
          {
            id: 'post_data',
            angle: 'Data/insight driven',
            hook: 'The memory hierarchy inside your computer explains why latency numbers are so stark:',
            body: 'Access times across computer hardware, converted to human scale:\n\n• CPU Registers: ~0.5 nanoseconds (equivalent to 1 second)\n• L1 CPU Cache: ~1 nanosecond (equivalent to 2 seconds)\n• L2 CPU Cache: ~4 nanoseconds (equivalent to 8 seconds)\n• L3 CPU Cache: ~10 nanoseconds (equivalent to 20 seconds)\n• Main RAM: ~100 nanoseconds (equivalent to 3.3 minutes)\n• NVMe SSD Read: ~100,000 nanoseconds (equivalent to 2.3 days)\n\nEvery time your CPU has to wait on memory because an instruction or data was not in cache, execution stalls.\n\nWriting mechanical sympathy into software is the ultimate performance superpower.',
            cta: 'How does memory latency factor into your system architecture design?',
          },
        ];
      } else if (t.includes('sleep') || t.includes('productivity')) {
        posts = [
          {
            id: 'post_educational',
            angle: 'Educational',
            hook: 'Treating sleep as the enemy of productivity is a biological mistake.',
            body: 'Many professionals view sleep as downtime—hours stolen from work. Neuroscience shows the exact opposite:\n\nDuring deep slow-wave sleep, your brain\'s glymphatic system opens up, circulating cerebrospinal fluid to flush metabolic waste accumulated during the day.\n\nDuring REM sleep, your hippocampus replays the day\'s experiences, consolidating short-term working memories into durable long-term neural connections and integrating complex problem-solving patterns.\n\nSleep is not when your brain shuts off. It is when your brain cleans its hardware and updates its software.',
            cta: 'How does your sleep quality directly affect your focus and decision-making the next day?',
          },
          {
            id: 'post_contrarian',
            angle: 'Contrarian/question-driven',
            hook: 'The "hustle culture" badge of honor for sleeping 4 hours a night is actually a recipe for low-quality output.',
            body: 'We glorify working through the night, yet we would never let an intoxicated person deploy production code or make critical executive decisions.\n\nResearch from the National Institutes of Health and sleep researchers reveals that 24 hours of wakefulness degrades cognitive psychomotor performance to levels comparable to legal intoxication.\n\nWhen you cut sleep to gain two extra hours of work, you spend the next day:\n• Making careless errors\n• Taking 3x longer to solve complex problems\n• Struggling with emotional reactivity in meetings\n\nHigh performers do not sleep less to work more. They sleep consistently so every hour they spend working is sharp and decisive.',
            cta: 'Have you ever noticed your best ideas arriving after a solid night of rest rather than late-night grind sessions?',
          },
          {
            id: 'post_storytelling',
            angle: 'Storytelling',
            hook: 'I used to believe that debugging late into the night showed dedication. A single experience completely cured me of that mindset.',
            body: 'I was tracking down a nasty concurrency race condition. At 1:30 AM, after four hours of staring at logs, I was convinced our entire architecture had a critical flaw.\n\nI went to bed frustrated.\n\nThe next morning, after eight hours of sleep and a glass of water, I sat down at my desk.\n\nWithin seven minutes, I spotted the bug: an unhandled edge case in an event handler that I had scanned 50 times the night before with tired eyes.\n\nThe problem had not changed. My prefrontal cortex had.\n\nSometimes the most productive thing you can do for a stuck problem is to step away and go to sleep.',
            cta: 'Has a good night\'s sleep ever solved a problem you spent hours grinding on the night before?',
          },
          {
            id: 'post_practical',
            angle: 'Practical/step-by-step',
            hook: '4 science-backed sleep habits that immediately improve morning focus and cognitive stamina:',
            body: '1. Consistent Wake Time\nYour circadian clock anchors to when you wake up, not when you go to bed. Keeping your wake time consistent across weekdays and weekends regulates melatonin release.\n\n2. Morning Sunlight Exposure\nViewing natural light within 30 minutes of waking triggers a healthy cortisol pulse and sets an internal timer for evening sleepiness.\n\n3. Caffeine Cutoff Window\nCaffeine has a half-life of 5-7 hours. Consuming caffeine past 2 PM prevents adenosine clearance and reduces deep restorative slow-wave sleep, even if you fall asleep easily.\n\n4. Dark, Cool Sleeping Environment\nYour core body temperature must drop by 1-2 degrees Fahrenheit to initiate sleep. Keep your bedroom cool and pitch dark for deeper sleep cycles.\n\nProtect your biological foundation if you want sustained professional performance.',
            cta: 'Which of these sleep habits do you find easiest or hardest to maintain?',
          },
          {
            id: 'post_data',
            angle: 'Data/insight driven',
            hook: 'The neurological reality of sleep debt: why you cannot "catch up" on the weekend without consequences.',
            body: 'Adenosine accumulates in your brain during every minute you are awake. This creates "homeostatic sleep pressure."\n\nWhen you cut sleep short, residual adenosine remains bound to receptors. While caffeine blocks those receptors temporarily, the underlying sleep debt persists.\n\nStudies from the National Institutes of Health demonstrate:\n• Chronic restriction to 6 hours of sleep over two weeks produces cognitive deficits equivalent to two full nights of total sleep deprivation.\n• The prefrontal cortex—responsible for executive function, impulse control, and strategic planning—shows the sharpest drop in metabolic activity.\n\nProductivity is not measured in hours awake. It is measured in high-quality cognitive output produced per hour.',
            cta: 'How do you prioritize sleep during demanding project deadlines?',
          },
        ];
      } else {
        // Universal dynamic fallback for any other topic: 5 high quality human posts
        posts = [
          {
            id: 'post_educational',
            angle: 'Educational',
            hook: `Most people understand ${rawTopic} only on the surface. Here is how the core mechanics actually operate:`,
            body: `When exploring ${rawTopic}, the key is looking past surface-level definitions to examine foundational principles.\n\nFirst, consider the core constraints. Every system balances competing priorities between speed, simplicity, and long-term maintainability.\n\nSecond, observe the operational mechanics in practice. Understanding the underlying rules allows practitioners to anticipate outcomes rather than reacting to surprises.\n\nMastering the basics is what separates amateurs from experienced practitioners.`,
            cta: `What was your biggest breakthrough when learning ${rawTopic}?`,
          },
          {
            id: 'post_contrarian',
            angle: 'Contrarian/question-driven',
            hook: `The conventional wisdom around ${rawTopic} often misses the most important constraint.`,
            body: `We frequently see industry advice urging practitioners to apply one-size-fits-all formulas to ${rawTopic}.\n\nIn reality, context dictates everything. What works for an early-stage project often introduces severe friction when applied at scale, and vice versa.\n\nBefore adopting standard advice, ask: what specific trade-offs are we accepting, and what assumptions are we making about our operating environment?\n\nCritical thinking beats dogma every single time.`,
            cta: `Do you agree or disagree with this perspective? Share your take below.`,
          },
          {
            id: 'post_storytelling',
            angle: 'Storytelling',
            hook: `Early in my journey with ${rawTopic}, an unexpected challenge taught me a lesson I will never forget.`,
            body: `We were working through a complex implementation where everything appeared sound on paper.\n\nYet as soon as real-world conditions took over, unexpected edge cases began compounding. What seemed like a minor technical oversight quickly created friction across the entire workflow.\n\nTaking a step back to re-examine first principles allowed us to restructure the solution cleanly.\n\nExperience is what you get right after you needed it most.`,
            cta: `Have you ever had an experience that fundamentally reshaped how you approach your work?`,
          },
          {
            id: 'post_practical',
            angle: 'Practical/step-by-step',
            hook: `A clear 3-step framework for approaching ${rawTopic} effectively:`,
            body: `1. Define the Core Objectives\nBefore making tactical decisions, establish unambiguous success metrics and define non-negotiable boundaries.\n\n2. Evaluate Known Trade-offs\nEvery decision has an opportunity cost. Explicitly identify what you are optimizing for and what you are willing to de-prioritize.\n\n3. Iterate Based on Observable Feedback\nImplement incrementally, observe real behavior, and refine continuously.\n\nSimplicity and consistency outperform complicated setups every time.`,
            cta: `Save this framework for your next planning session.`,
          },
          {
            id: 'post_data',
            angle: 'Data/insight driven',
            hook: `When you analyze ${rawTopic} through first principles, the decision criteria become clear:`,
            body: `Effective decision making requires measuring the right indicators rather than relying on intuition alone.\n\nBy tracking core constraints and evaluating historical outcomes, teams reduce uncertainty and build resilient solutions.\n\nFocus on verifiable fundamentals rather than short-lived trends.`,
            cta: `How do you measure success in this area within your organization?`,
          },
        ];
      }

      return schema.parse({ posts });
    }

    // ---------------------------------------------------------
    // 5. WRITER AGENT - INSTAGRAM REEL
    // ---------------------------------------------------------
    if (
      lowerPrompt.includes('platform: instagram_reel') ||
      lowerPrompt.includes('requirements for instagram reel') ||
      lowerPrompt.includes('short-form video script')
    ) {
      const topicMatch =
        prompt.match(/USER TOPIC:\s*([^\n\r]+)/i) ||
        prompt.match(/TOPIC:\s*([^\n\r]+)/i);
      const rawTopic = topicMatch ? topicMatch[1].trim() : 'Computer Science Fundamentals';

      const mockReel = {
        title: `The Truth About ${rawTopic}`,
        estimatedDuration: '45 seconds',
        hook: `Think you understand ${rawTopic}? Here is the one concept most people get completely wrong.`,
        sections: [
          {
            timestamp: '0–3 sec',
            visual: `Presenter looks directly into camera with high energy and bold question on screen.`,
            voiceover: `If you want to truly master ${rawTopic}, you have to understand what is happening beneath the surface.`,
            onScreenText: `THE REAL TRUTH 💡`,
          },
          {
            timestamp: '3–15 sec',
            visual: `Dynamic diagram illustrating the core mechanics and contrasting two distinct approaches.`,
            voiceover: `Most people focus on surface syntax or memorizing steps. But the real breakthrough comes from understanding memory, trade-offs, and constraints.`,
            onScreenText: `Trade-offs > Syntax ⚙️`,
          },
          {
            timestamp: '15–30 sec',
            visual: `Clear, relatable visual comparison showing how the right approach saves massive effort.`,
            voiceover: `When you pick the right model from day one, you avoid hours of debugging and performance bottlenecks later.`,
            onScreenText: `Smart Architecture Saves Hours 🚀`,
          },
          {
            timestamp: '30–45 sec',
            visual: `Presenter smiling, pointing to caption indicator with clear takeaway badge.`,
            voiceover: `Save this breakdown, drop a comment with your favorite approach, and follow for more technical deep dives!`,
            onScreenText: `Save This Video! 📌`,
          },
        ],
        cta: `Drop a comment with your perspective on this topic!`,
      };

      return schema.parse(mockReel);
    }

    throw new Error(
      `MockLLMProvider could not identify prompt schema structure: ${prompt.substring(0, 100)}`
    );
  }
}

// OpenAI LLM Provider
export class OpenAILLMProvider implements LLMProvider {
  name = 'openai';
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || env.LLM_API_KEY || '';
    this.model = model || env.LLM_MODEL || 'gpt-4o-mini';
  }

  async generateStructured<T>(
    prompt: string,
    schema: ZodType<T, any, any>,
    options?: LLMGenerateOptions
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error('OpenAI API Key is missing. Set LLM_API_KEY in environment variables.');
    }

    const systemPrompt =
      (options?.systemPrompt || '') +
      '\n\nIMPORTANT: You MUST respond ONLY with a single valid JSON object strictly matching the requested schema. Do not output markdown fences or commentary.';

    const maxRetries = options?.maxRetries ?? 2;
    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            temperature: options?.temperature ?? 0.2,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
          }),
        });

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`OpenAI API error (${response.status}): ${errBody}`);
        }

        const data = (await response.json()) as any;
        const content = data.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error('Empty response from OpenAI');
        }

        const cleanedJson = extractJsonFromText(content);
        const parsed = JSON.parse(cleanedJson);
        const validated = schema.safeParse(parsed);

        if (validated.success) {
          return validated.data;
        } else {
          lastError = new Error(`JSON schema validation error: ${JSON.stringify(validated.error.format())}`);
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    throw new Error(
      `Failed to generate valid structured LLM output after ${maxRetries + 1} attempts: ${lastError?.message}`
    );
  }
}

// Factory Function
export function createLLMProvider(): LLMProvider {
  const provider = env.LLM_PROVIDER.toLowerCase();

  if (provider === 'openai') {
    if (!env.LLM_API_KEY) {
      console.warn(
        '[LLM Provider] LLM_PROVIDER is "openai" but LLM_API_KEY is not set. Falling back to MockLLMProvider.'
      );
      return new MockLLMProvider();
    }
    return new OpenAILLMProvider();
  }

  // Default to robust Mock provider
  return new MockLLMProvider();
}
