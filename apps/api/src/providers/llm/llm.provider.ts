import { ZodType } from 'zod';
import { ResearchResult, ContentStrategy } from '@contentforge/shared';
import { env } from '../../config/env.js';
import {
  getMockStrategy,
  getMockLinkedInPosts,
  getMockReelScript,
  getMockCriticReview,
  normalizeTopic,
  matchesKeyword,
} from './mock-data.js';

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

export function parseResearchFromPrompt(prompt: string): any {
  const summaryMatch =
    prompt.match(/Summary:\s*([^\n\r]+(?:\n(?![A-Z\s]+:)[^\n\r]+)*)/i) ||
    prompt.match(/RESEARCH SUMMARY:\s*([^\n\r]+(?:\n(?![A-Z\s]+:)[^\n\r]+)*)/i);
  if (!summaryMatch) return undefined;

  const summary = summaryMatch[1].trim();

  const keyPointsMatch =
    prompt.match(/Key Points:\s*([\s\S]+?)(?=(?:Verified Facts|FACTS|EDITORIAL STRATEGY|ALLOWED SUBTOPICS|$))/i) ||
    prompt.match(/KEY RESEARCH POINTS:\s*([\s\S]+?)(?=(?:VERIFIED FACTS|FACTS|EDITORIAL STRATEGY|STRATEGY REQUIREMENTS|$))/i);
  const keyPoints: string[] = [];
  if (keyPointsMatch) {
    const lines = keyPointsMatch[1].split('\n');
    for (const line of lines) {
      const cleaned = line.replace(/^\s*[-*•\d.]+\s*/, '').trim();
      if (cleaned.length > 5) keyPoints.push(cleaned);
    }
  }

  const factsMatch =
    prompt.match(/Verified Facts:\s*([\s\S]+?)(?=(?:Relevant Real-World Examples|Relevant Examples|Cautions|SOURCES|$))/i) ||
    prompt.match(/VERIFIED FACTS:\s*([\s\S]+?)(?=(?:STRATEGY REQUIREMENTS|INSTRUCTIONS|$))/i);
  const facts: Array<{ claim: string; source: string; confidence: 'high' | 'medium' | 'low' }> = [];
  if (factsMatch) {
    const lines = factsMatch[1].split('\n');
    for (const line of lines) {
      const cleaned = line
        .replace(/^\s*(?:Fact \d+:\s*)?["']?/, '')
        .replace(/["']?\s*\(Source:.*?\)$/, '')
        .replace(/\[.*?\]$/, '')
        .replace(/^\s*[-*•\d.]+\s*/, '')
        .trim();
      if (cleaned.length > 10) {
        facts.push({
          claim: cleaned,
          source: 'Verified Domain Reference',
          confidence: 'high',
        });
      }
    }
  }

  const examplesMatch = prompt.match(/Relevant Real-World Examples[^:]*:\s*([\s\S]+?)(?=(?:Cautions|SOURCES|$))/i);
  const relevantExamples: string[] = [];
  if (examplesMatch) {
    const lines = examplesMatch[1].split('\n');
    for (const line of lines) {
      const cleaned = line.replace(/^\s*[-*•\d.]+\s*/, '').trim();
      if (cleaned.length > 5) relevantExamples.push(cleaned);
    }
  }

  const cautionsMatch = prompt.match(/Cautions & Pitfalls:\s*([\s\S]+?)(?=(?:SOURCES|EDITORIAL STRATEGY|CRITICAL REVISION|$))/i);
  const cautions: string[] = [];
  if (cautionsMatch) {
    const lines = cautionsMatch[1].split('\n');
    for (const line of lines) {
      const cleaned = line.replace(/^\s*[-*•\d.]+\s*/, '').trim();
      if (cleaned.length > 5) cautions.push(cleaned);
    }
  }

  return {
    topic: 'Parsed Topic',
    centralSubject: 'Parsed Subject',
    subtopics: [],
    summary,
    keyPoints: keyPoints.length > 0 ? keyPoints : [summary],
    facts: facts.length > 0 ? facts : [{ claim: summary, source: 'Canonical Domain Knowledge', confidence: 'high' as const }],
    relevantExamples: relevantExamples.length > 0 ? relevantExamples : ['Real-world domain implementation'],
    sources: [],
    cautions: cautions.length > 0 ? cautions : ['Unverified assumptions and lack of empirical domain grounding.'],
  };
}

export interface ParsedSearchFinding {
  title: string;
  url: string;
  publisher: string;
  date: string;
  snippet: string;
}

export function parseSearchFindingsFromPrompt(prompt: string): ParsedSearchFinding[] | null {
  const sourcesSectionMatch = prompt.match(/VERIFIED SEARCH FINDINGS & DOMAIN SOURCES:\s*([\s\S]+?)(?=INSTRUCTIONS:|$)/i);
  if (!sourcesSectionMatch) return null;

  const rawSection = sourcesSectionMatch[1].trim();
  const sourceBlocks = rawSection.split(/\[Source \d+\]/i).filter((b) => b.trim().length > 10);
  if (sourceBlocks.length === 0) return null;

  const sources: ParsedSearchFinding[] = [];
  for (const block of sourceBlocks) {
    const titleMatch = block.match(/Title:\s*([^\n\r]+)/i);
    const urlMatch = block.match(/URL:\s*([^\n\r]+)/i);
    const pubMatch = block.match(/Publisher:\s*([^\n\r]+)/i);
    const dateMatch = block.match(/Date:\s*([^\n\r]+)/i);
    const snippetMatch = block.match(/Snippet:\s*([\s\S]+?)(?=(?:\n\n\[Source|\n[A-Z]+:|$))/i);

    if (titleMatch && snippetMatch) {
      sources.push({
        title: titleMatch[1].trim(),
        url: urlMatch ? urlMatch[1].trim() : 'https://en.wikipedia.org',
        publisher: pubMatch ? pubMatch[1].trim() : 'Domain Authority',
        date: dateMatch ? dateMatch[1].trim() : 'Canonical Standard',
        snippet: snippetMatch[1].trim(),
      });
    }
  }

  return sources.length > 0 ? sources : null;
}

export function parseStrategyFromPrompt(prompt: string): ContentStrategy | undefined {
  const painPointMatch = prompt.match(/Target Pain Point:\s*([^\n\r]+)/i);
  const coreInsightMatch = prompt.match(/Core Insight:\s*([^\n\r]+)/i);
  if (!painPointMatch && !coreInsightMatch) return undefined;

  return {
    topic: 'Parsed Strategy Topic',
    targetAudiencePainPoint: painPointMatch ? painPointMatch[1].trim() : 'Domain execution challenges',
    coreInsight: coreInsightMatch ? coreInsightMatch[1].trim() : 'Mastery requires respecting fundamental constraints',
    angles: [],
    avoidTopics: [],
    keyPointsToEmphasize: [],
  };
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
          domain: 'Computer Science & Software Systems',
          domainContext: ['arrays', 'hash tables', 'linked lists', 'trees', 'cache locality', 'time complexity'],
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
          domain: 'Computer Science Fundamentals',
          domainContext: ['call stack', 'stack frames', 'base cases', 'stack overflow', 'recursive branching'],
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
          domain: 'Software Engineering & Version Control',
          domainContext: ['commit snapshots', 'DAG branches', 'merge conflicts', 'git bisect', 'distributed remotes'],
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
      } else if (t.includes('binary search')) {
        analysis = {
          normalizedTopic: 'Binary Search Implementation in C',
          coreSubject: 'Algorithms and Systems Programming in C',
          domain: 'Algorithms & Systems Programming',
          domainContext: ['midpoint calculation', 'O(log n)', 'inclusive boundaries', 'cache locality', 'pointer indexing'],
          userIntent: 'Understand the mechanics, boundary invariants, and integer overflow edge cases of binary search in C',
          contentGoal: 'Deliver technically accurate, bug-free explanations of binary search in C and its hardware trade-offs',
          allowedSubtopics: [
            'midpoint calculation overflow',
            'inclusive vs exclusive boundary conditions',
            'O(log n) time complexity vs O(n) scan',
            'cache line friendliness vs branch prediction',
            'pointer arithmetic in C',
            'signed vs unsigned index types',
          ],
          forbiddenTopicDrift: [
            'AI agents',
            'prompt engineering',
            'ContentForge',
            'multi-agent systems',
            'unrelated corporate buzzwords',
          ],
        };
      } else if (t.includes('antigravity')) {
        analysis = {
          normalizedTopic: 'Software Engineering with Google Antigravity',
          coreSubject: 'Autonomous Pair Programming and Software Engineering Agents',
          domain: 'Software Engineering & Autonomous AI',
          domainContext: ['codebase grounding', 'closed-loop execution', 'AST symbol indexing', 'test verification'],
          userIntent: 'Understand how Google Antigravity operates as an autonomous agentic pair programmer through closed-loop execution and test verification',
          contentGoal: 'Explain the closed-loop agentic paradigm, codebase grounding, and test verification that distinguishes Antigravity from chat assistants',
          allowedSubtopics: [
            'closed-loop agentic execution',
            'AST symbol and codebase indexing',
            'deterministic tool execution',
            'automated test runner verification',
            'autonomous error diagnosis and self-correction',
            'developer context-switching economics',
          ],
          forbiddenTopicDrift: [
            'ungrounded hype',
            'hallucinated metrics',
            'marketing fluff',
          ],
        };
      } else if (t.includes('merge sort')) {
        analysis = {
          normalizedTopic: 'Time Complexity of Merge Sort',
          coreSubject: 'Algorithmic Complexity & Divide-and-Conquer Recurrences',
          domain: 'Algorithms & Computational Complexity',
          domainContext: ['divide and conquer', 'recurrence relations', 'O(n log n)', 'O(n) auxiliary space', 'Timsort'],
          userIntent: 'Understand the mathematical proof and practical trade-offs behind merge sort O(n log n) time and O(n) space complexity',
          contentGoal: 'Deliver mathematically sound explanations of recurrence relations, Master Theorem proofs, and auxiliary memory trade-offs',
          allowedSubtopics: [
            'recurrence relation T(n) = 2T(n/2) + O(n)',
            'Master Theorem Case 2 proof',
            'O(n log n) best, average, and worst-case guarantees',
            'O(n) auxiliary memory overhead',
            'stability in sorting algorithms',
            'comparison to QuickSort and Timsort',
          ],
          forbiddenTopicDrift: [
            'AI agents',
            'prompt engineering',
            'ContentForge',
            'multi-agent systems',
            'marketing funnels',
          ],
        };
      } else if (t.includes('expense') || t.includes('tracker')) {
        analysis = {
          normalizedTopic: 'Building a Personal Expense Tracker',
          coreSubject: 'Application Architecture, Data Modeling, and Local-First Storage',
          domain: 'Software Architecture & Data Modeling',
          domainContext: ['relational schemas', 'integer minor units', 'SQLite local-first', 'aggregation views'],
          userIntent: 'Learn how to architect and build a robust, privacy-respecting personal expense tracker with proper currency data modeling',
          contentGoal: 'Provide an actionable blueprint covering relational schemas, integer cents storage, and indexed aggregation views',
          allowedSubtopics: [
            'transaction schema design',
            'integer cents vs floating-point rounding errors',
            'category taxonomy and recurring expense separation',
            'SQLite local-first architecture vs hosted PostgreSQL',
            'SQL aggregation queries and indexing',
            'data export and backup strategies',
          ],
          forbiddenTopicDrift: [
            'AI agents',
            'prompt engineering',
            'ContentForge',
            'multi-agent systems',
            'unrelated corporate buzzwords',
          ],
        };
      } else if (t.includes('cpu') || t.includes('instruction')) {
        analysis = {
          normalizedTopic: 'CPU Instruction Execution Cycle',
          coreSubject: 'Computer Architecture and Hardware Systems',
          domain: 'Computer Architecture & Hardware',
          domainContext: ['fetch-decode-execute', 'program counter', 'instruction register', 'ALU', 'machine cycles'],
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
          normalizedTopic: 'Sleep Quality and Cognitive Productivity',
          coreSubject: 'Neurobiology, Cognitive Health, and Human Performance',
          domain: 'Neurobiology & Human Performance',
          domainContext: ['REM and deep sleep', 'hippocampal consolidation', 'glymphatic clearance', 'adenosine buildup', 'prefrontal cortex'],
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
      } else if (t.includes('webb') || t.includes('beryllium') || t.includes('telescope')) {
        analysis = {
          normalizedTopic: 'James Webb Space Telescope Beryllium Mirrors & Infrared Optics',
          coreSubject: 'Cryogenic Optical Engineering and Infrared Astronomy',
          domain: 'Aerospace Engineering & Cryogenic Optics',
          domainContext: ['beryllium substrate', 'cryogenic stability', 'vapor-deposited gold', 'infrared reflectivity', 'hexapod actuators', 'cosmological redshift'],
          userIntent: 'Understand why NASA selected beryllium and vapor-deposited gold for the JWST primary mirror segments',
          contentGoal: 'Deliver technically accurate, deeply fascinating explanations of material physics, cryogenic thermal stability, and infrared wavelength reflection',
          allowedSubtopics: [
            'beryllium cryogenic stability at 35 Kelvin',
            'coefficient of thermal expansion vs glass and aluminum',
            'vapor-deposited gold infrared reflectivity (0.6 to 28 microns)',
            'hexagonal mirror segment alignment with hexapod actuators',
            'cosmological redshift and observing early universe galaxies',
            'cryogenic optical figuring and wavefront sensing',
          ],
          forbiddenTopicDrift: [
            'AI agents',
            'software development',
            'prompt engineering',
            'ContentForge',
            'unrelated IT jargon',
          ],
        };
      } else if (t.includes('sourdough') || t.includes('fermentation') || t.includes('bread')) {
        analysis = {
          normalizedTopic: 'Microbial Ecology of Sourdough Fermentation',
          coreSubject: 'Food Microbiology and Biochemistry of Fermentation',
          domain: 'Culinary Arts & Microbial Fermentation',
          domainContext: [
            'wild yeast (Candida humilis)',
            'Lactobacillus sanfranciscensis',
            'lactic and acetic acids',
            'gluten protein matrix',
            'bulk fermentation kinetics',
            'protease and amylase enzyme activity',
          ],
          userIntent: 'Understand the biological and biochemical mechanisms governing sourdough starter health, gluten extensibility, and crumb structure',
          contentGoal: 'Deliver technically authoritative, deeply fascinating explanations of yeast-bacteria symbiosis and fermentation biochemistry without generic filler',
          allowedSubtopics: [
            'symbiotic balance between Candida humilis and Lactobacillus sanfranciscensis',
            'maltose co-metabolism and glucose competition',
            'lactic vs acetic acid production ratios and temperature kinetics',
            'protease enzyme activity and gluten network degradation below pH 3.8',
            'hydration percentage, flour ash content, and dough rheology',
            'bulk fermentation volume and visual dome curvature diagnostics',
          ],
          forbiddenTopicDrift: [
            'AI agents',
            'prompt engineering',
            'ContentForge',
            'software development',
            'microservices',
            'Big-O',
            'code snippets',
          ],
        };
      } else if (t.includes('photosynthesis') || t.includes('chlorophyll') || t.includes('calvin cycle')) {
        analysis = {
          normalizedTopic: 'Biochemistry of Photosynthesis and the Calvin Cycle',
          coreSubject: 'Plant Physiology and Biophysical Photochemistry',
          domain: 'Biochemistry & Plant Physiology',
          domainContext: [
            'Photosystem II (P680)',
            'water photolysis (oxygen-evolving complex)',
            'thylakoid proton gradient',
            'ATP synthase rotary motor',
            'Calvin cycle carbon fixation',
            'RuBisCO enzyme oxygenation',
          ],
          userIntent: 'Understand the biophysical mechanics of how photon absorption splits water and powers enzymatic carbon fixation',
          contentGoal: 'Deliver rigorous, fascinating explanations of light reactions, electron transport chains, and RuBisCO evolutionary trade-offs',
          allowedSubtopics: [
            'P680 resonance energy transfer and water splitting',
            'Z-scheme electron transport across cytochrome b6f',
            'chemiosmotic proton gradient driving ATP synthase',
            'RuBisCO carbon fixation and photorespiration oxygenase activity',
            'C3 vs C4 spatial separation adaptations',
            'PAR absorption spectrum and whole-plant solar thermodynamic limits',
          ],
          forbiddenTopicDrift: [
            'AI agents',
            'prompt engineering',
            'ContentForge',
            'software development',
            'microservices',
            'code snippets',
          ],
        };
      } else {
        const norm = normalizeTopic(rawTopic);
        let domain = 'Applied Science & Engineering';
        let domainContext = [`${norm} core principles`, 'operational mechanics', 'system boundaries', 'functional parameters'];
        const lowNorm = norm.toLowerCase();
        if (lowNorm.includes('bread') || lowNorm.includes('sourdough') || lowNorm.includes('ferment') || lowNorm.includes('culinary') || lowNorm.includes('food')) {
          domain = 'Culinary Arts & Microbial Fermentation';
          domainContext = ['wild yeast', 'lactobacillus bacteria', 'lactic/acetic acid ratio', 'gluten protein matrix', 'bulk fermentation', 'autolyse'];
        } else if (lowNorm.includes('photo') || lowNorm.includes('plant') || lowNorm.includes('cell') || lowNorm.includes('biology')) {
          domain = 'Biochemistry & Plant Physiology';
          domainContext = ['chloroplast thylakoids', 'chlorophyll photons', 'Calvin cycle', 'ATP and NADPH', 'RuBisCO enzyme', 'carbon fixation'];
        } else if (lowNorm.includes('finance') || lowNorm.includes('invest') || lowNorm.includes('market') || lowNorm.includes('money')) {
          domain = 'Finance & Economics';
          domainContext = ['capital allocation', 'risk-adjusted yield', 'compound interest', 'liquidity reserves', 'valuation multiples'];
        } else if (lowNorm.includes('aero') || lowNorm.includes('flight') || lowNorm.includes('space') || lowNorm.includes('rocket')) {
          domain = 'Aerospace & Fluid Dynamics';
          domainContext = ['Bernoulli pressure differentials', 'aerodynamic lift', 'angle of attack', 'stagnation pressure', 'boundary layer airflow'];
        }

        analysis = {
          normalizedTopic: norm,
          coreSubject: `${norm} Fundamentals & Practical Applications`,
          domain,
          domainContext,
          userIntent: `Understand core concepts, trade-offs, and actionable principles of ${norm}`,
          contentGoal: `Provide authentic, highly valuable professional content directly addressing ${norm}`,
          allowedSubtopics: [
            `core principles of ${norm}`,
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
          centralSubject: 'Data Structures and Memory Organization',
          subtopics: [
            'Array indexing, contiguous allocation, and CPU cache prefetching',
            'Hash table bucket hashing, load factors, and collision resolution',
            'Tree hierarchies, B-Trees, and logarithmic branching factors',
            'Time-space complexity trade-offs between O(1) and O(n)',
          ],
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
          relevantExamples: [
            'Relational database indexing using B+ trees to avoid linear table scans',
            'Hash collisions degrading O(1) dictionary lookups into O(n) linked list traversal',
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
      } else if (t.includes('binary search')) {
        research = {
          topic: rawTopic,
          centralSubject: 'Binary Search Algorithm and C Implementation Nuances',
          subtopics: [
            'Midpoint calculation and 32-bit integer overflow bug',
            'Loop invariants: inclusive bounds [low, high] vs exclusive [low, high)',
            'Logarithmic time complexity O(log n) vs linear scans',
            'Hardware effects: cache locality, pointer traversal, and branch prediction',
          ],
          summary: 'Binary search is an optimal comparison-based search algorithm on sorted contiguous sequences, dividing search space in half each iteration to achieve O(log n) time complexity. In C, implementations must guard against integer overflow in midpoint calculations and maintain strict boundary invariants.',
          keyPoints: [
            'Midpoint formula `(low + high) / 2` triggers integer overflow in C if `low + high > INT_MAX`; robust code uses `low + (high - low) / 2`.',
            'Boundary choice dictates loop condition: `low <= high` requires `high = mid - 1`, whereas `low < high` requires `high = mid`.',
            'Contiguous array indexing provides hardware cache locality, but unpredictable branches on mid comparisons can incur CPU pipeline stalls.',
            'Requires an already sorted sequence; sorting upfront costs O(n log n), so binary search is justified when multiple lookups amortize the sort.',
          ],
          facts: [
            {
              claim: 'The classic `(low + high) / 2` midpoint calculation contains an integer overflow bug that remained in Java standard library and many C codebases for years.',
              source: 'Joshua Bloch / Google Research (Nearly All Binary Searches and Mergesorts are Broken)',
              confidence: 'high',
            },
            {
              claim: 'Binary search operates in O(1) auxiliary space and guaranteed O(log n) worst-case time complexity.',
              source: 'Knuth, The Art of Computer Programming, Vol 3: Sorting and Searching',
              confidence: 'high',
            },
          ],
          relevantExamples: [
            'C implementation: `int mid = low + (high - low) / 2;`',
            'Comparison between linear search 1,000,000 checks vs binary search max 20 checks',
          ],
          sources: [
            {
              title: 'Nearly All Binary Searches and Mergesorts are Broken',
              url: 'https://ai.googleblog.com/2006/06/extra-extra-read-all-about-it-nearly.html',
              publisher: 'Google Research',
              date: 'Technical Paper',
            },
            {
              title: 'The Art of Computer Programming: Sorting and Searching',
              url: 'https://www-cs-faculty.stanford.edu/~knuth/taocp.html',
              publisher: 'Stanford University / Addison-Wesley',
              date: 'Reference Standard',
            },
          ],
          cautions: [
            'Do not use binary search on singly-linked lists; node traversal is O(n), completely defeating the logarithmic efficiency.',
          ],
        };
      } else if (t.includes('antigravity')) {
        research = {
          topic: rawTopic,
          centralSubject: 'Google Antigravity Agentic IDE & Autonomous Development',
          subtopics: [
            'Autonomous execution loop: Plan, Inspect, Edit, and Test',
            'Codebase indexing via AST analysis and semantic symbol navigation',
            'Deterministic tool execution and self-healing test loops',
            'Developer ergonomics: eliminating prompt fatigue through autonomous delegation',
          ],
          summary: 'Google Antigravity is an agentic development platform that pairs developers with autonomous coding agents. Unlike simple chat autocomplete extensions, Antigravity executes tasks inside a closed loop: inspecting repositories, editing files, running compiler diagnostics, executing test suites, and autonomously refining code until specifications pass.',
          keyPoints: [
            'Operates with direct workspace tool access to search code, edit files, and run test suites locally.',
            'Uses AST-level symbol graphs rather than naive file grep to understand multi-file architectural dependencies.',
            'Features autonomous self-correction: when a test or linter fails, Antigravity diagnoses the stack trace and edits the code without human re-prompting.',
            'Supports multi-agent orchestration, delegating research, implementation, and review across specialized subagents.',
          ],
          facts: [
            {
              claim: 'Antigravity integrates full tool-use feedback loops, allowing autonomous verification of changes against local build and test commands.',
              source: 'Google Antigravity Architecture & Customization Guide',
              confidence: 'high',
            },
            {
              claim: 'Deterministic execution loops reduce human context switching by resolving diagnostic errors prior to returning control to the engineer.',
              source: 'Google DeepMind Systems Research',
              confidence: 'high',
            },
          ],
          relevantExamples: [
            'Subagent orchestration: Researcher -> Planner -> Coder -> Test Verifier',
            'Automated error correction: reading Jest test failure -> locating line -> patching file -> re-running test',
          ],
          sources: [
            {
              title: 'Google Antigravity Documentation & Agent Framework',
              url: 'https://antigravity.google.com/docs',
              publisher: 'Google DeepMind',
              date: 'Official Documentation',
            },
          ],
          cautions: [
            'Agents must have strict workspace boundaries and sandbox permissions to prevent unintended filesystem operations.',
          ],
        };
      } else if (t.includes('merge sort')) {
        research = {
          topic: rawTopic,
          centralSubject: 'Merge Sort Time Complexity and Algorithmic Analysis',
          subtopics: [
            'Recurrence relation: T(n) = 2T(n/2) + O(n)',
            'Master Theorem Case 2 proof yielding O(n log n)',
            'Guaranteed O(n log n) best, average, and worst-case performance',
            'O(n) auxiliary memory requirement and stability characteristics',
          ],
          summary: 'Merge Sort is a canonical divide-and-conquer sorting algorithm. It recursively bisects an array of size n into two halves of size n/2, sorts each sub-array, and merges the sorted halves in linear O(n) time. The Master Theorem proves its guaranteed O(n log n) time complexity across all input distributions.',
          keyPoints: [
            'The recurrence relation is T(n) = 2T(n/2) + O(n), where a=2, b=2, and f(n)=O(n).',
            'By the Master Theorem (Case 2), since log_b(a) = log_2(2) = 1 and f(n) = Theta(n^1), T(n) is Theta(n log n).',
            'Unlike QuickSort, which degrades to O(n^2) on adversarial inputs, Merge Sort strictly guarantees O(n log n) worst-case time.',
            'The primary trade-off is O(n) auxiliary memory space needed to merge sub-arrays, making in-place algorithms like QuickSort or HeapSort preferable when RAM is severely constrained.',
          ],
          facts: [
            {
              claim: 'Merge Sort maintains guaranteed O(n log n) time complexity across best, average, and worst cases.',
              source: 'Introduction to Algorithms (CLRS)',
              confidence: 'high',
            },
            {
              claim: 'Merge Sort is a stable sort, preserving the relative order of equal elements without modifying their original keys.',
              source: 'Algorithms (Sedgewick & Wayne)',
              confidence: 'high',
            },
          ],
          relevantExamples: [
            'Sorting 10,000,000 records: ~233 million operations guaranteed',
            'Merge tree depth: exactly log2(n) levels, each doing n merge operations',
          ],
          sources: [
            {
              title: 'Introduction to Algorithms (4th Edition): Divide-and-Conquer',
              url: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/',
              publisher: 'MIT Press',
              date: 'Academic Text',
            },
          ],
          cautions: [
            'Memory allocation overhead: allocating and copying the O(n) auxiliary array can be slower in practice than QuickSort cache-friendly in-place swaps.',
          ],
        };
      } else if (t.includes('expense') || t.includes('tracker')) {
        research = {
          topic: rawTopic,
          centralSubject: 'Personal Expense Tracker Architecture and Data Modeling',
          subtopics: [
            'Relational schema design: transactions, categories, and accounts',
            'Financial accuracy: integer cents vs IEEE-754 floating-point rounding errors',
            'Storage architecture: local-first SQLite vs hosted PostgreSQL vs IndexedDB',
            'Aggregation optimization: SQL window functions and indexing by date and category',
          ],
          summary: 'Building a personal expense tracker requires sound relational data modeling and numerical precision. Storing monetary amounts as integer minor units (cents) eliminates floating-point drift, while a local-first SQLite architecture provides sub-millisecond query performance and complete financial privacy.',
          keyPoints: [
            'Never use floating-point types (float, double) for currency; store amounts as integer cents ($19.99 -> 1999) to avoid IEEE-754 rounding inaccuracies.',
            'Separate transactional ledgers from category taxonomy; distinguish fixed non-discretionary costs from variable discretionary spending.',
            'A local-first SQLite database provides zero-latency offline transaction logging, total user privacy, and zero server infrastructure costs.',
            'Composite indexes on `(timestamp, category_id)` allow sub-millisecond monthly aggregation queries across tens of thousands of transactions.',
          ],
          facts: [
            {
              claim: 'IEEE-754 binary floating-point representation cannot precisely represent fractions like 0.1 or 0.2 in binary, leading to cumulative calculation errors over time.',
              source: 'What Every Computer Scientist Should Know About Floating-Point Arithmetic (Goldberg)',
              confidence: 'high',
            },
            {
              claim: 'SQLite handles up to 100,000 transactions with single-file disk persistence and less than 1ms read latencies on consumer hardware.',
              source: 'SQLite Architecture Documentation',
              confidence: 'high',
            },
          ],
          relevantExamples: [
            'Schema: `CREATE TABLE transactions (id TEXT PRIMARY KEY, amount_cents INTEGER, category_id TEXT, timestamp TEXT);`',
            'Aggregation: `SELECT category_id, SUM(amount_cents) FROM transactions GROUP BY category_id;`',
          ],
          sources: [
            {
              title: 'Designing Data-Intensive Applications',
              url: 'https://dataintensive.net/',
              publisher: "O'Reilly Media",
              date: 'Reference Standard',
            },
          ],
          cautions: [
            'Avoid cloud-only architectures for simple personal finance tools, as recurring hosting costs and security breaches create unnecessary liability.',
          ],
        };
      } else if (t.includes('recursion')) {
        research = {
          topic: rawTopic,
          centralSubject: 'Recursion and Call Stack Dynamics',
          subtopics: [
            'Base case termination invariants',
            'Stack frame memory allocation and call stack unwinding',
            'Stack overflow prevention and tail-call optimization',
            'Hierarchical traversal in trees, graphs, and nested JSON',
          ],
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
          relevantExamples: [
            'Computing Fibonacci with naive recursion (O(2^n)) vs memoized recursion (O(n))',
            'Traversing DOM and AST node trees using pre-order depth-first traversal',
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
          centralSubject: 'Git Architecture and Directed Acyclic Graph Snapshots',
          subtopics: [
            'Content-addressable object store: blobs, trees, commits, and tags',
            'Directed Acyclic Graph (DAG) commit history',
            'Lightweight branch pointers vs commit snapshots',
            'Automated binary search debugging with git bisect',
          ],
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
          relevantExamples: [
            'Using `git bisect` to find regression bugs in 12 iterations across 4,000 commits',
            'Branch pointers as simple reference files in `.git/refs/heads/`',
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
          centralSubject: 'CPU Instruction Execution Microarchitecture',
          subtopics: [
            'Fetch stage: Program Counter (PC) and instruction cache access',
            'Decode stage: Control Unit decoding opcode bitfields and operands',
            'Execute stage: Arithmetic Logic Unit (ALU) operations and register writebacks',
            'Pipelining, hazard handling, and branch prediction',
          ],
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
          relevantExamples: [
            'Executing `ADD R1, R2, R3`: fetch opcode -> decode registers -> ALU sum -> writeback to R1',
            'Pipeline hazard stall when branch outcome is delayed',
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
          centralSubject: 'Sleep Physiology and Neurocognitive Performance',
          subtopics: [
            'Glymphatic system expansion and metabolic waste clearance',
            'Synaptic plasticity and hippocampal memory consolidation',
            'Adenosine accumulation and homeostatic sleep pressure',
            'Prefrontal cortex executive control and decision making',
          ],
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
          relevantExamples: [
            'Adenosine binding to A1 receptors causing perceived mental fatigue',
            'Glymphatic clearance channel dilation by 60% during non-REM slow-wave sleep',
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
      } else if (t.includes('webb') || t.includes('beryllium') || t.includes('telescope')) {
        research = {
          topic: rawTopic,
          centralSubject: 'JWST Primary Mirror Substrate Materials & Infrared Reflection Physics',
          subtopics: [
            'Beryllium material properties: high strength-to-weight ratio and cryogenic thermal contraction',
            'Vapor-deposited gold: 100nm thickness providing 98% reflectivity between 0.6 and 28 microns',
            '18 hexagonal segments actuated by cryogenic hexapod positioners with 10nm resolution',
            'Cryogenic optical figuring: polishing intentional room-temperature inverse distortion',
          ],
          summary: 'The James Webb Space Telescope (JWST) primary mirror consists of 18 hexagonal segments constructed from beryllium and coated with a 100-nanometer layer of vapor-deposited gold. Operating at 35 Kelvin (-238°C) in deep space, beryllium ensures near-zero thermal distortion while gold provides optimal 98% reflectivity across the infrared spectrum.',
          keyPoints: [
            'Beryllium was selected over glass because it is lightweight (1.85 g/cm³) and has a near-zero coefficient of thermal expansion below 100 K, preventing warping in cryogenic space.',
            'Gold was chosen over aluminum or silver because it reflects 98% of infrared photons between 0.6 and 28 micrometers, the exact spectrum where ancient redshifted light appears.',
            'A total of only 48 grams of gold was used across all 18 segments—a layer just 100 nanometers thick, protected by a micro-thin layer of silicon dioxide (SiO2).',
            'Each mirror was cryogenically polished with an intentional inverse distortion at room temperature so it deforms into an optically perfect parabola at 35 Kelvin.',
          ],
          facts: [
            {
              claim: 'Gold reflects approximately 98% of near- and mid-infrared light, compared to aluminum which drops in reflectivity and scatters thermal background noise.',
              source: 'NASA Goddard Space Flight Center: JWST Optical Specifications',
              confidence: 'high',
            },
            {
              claim: 'Beryllium maintains an exceptionally high specific stiffness (E/rho) and near-zero thermal expansion coefficient at deep space operating temperatures of 35 to 50 Kelvin.',
              source: 'NASA Technical Reports Server / Materion Optical Systems',
              confidence: 'high',
            },
          ],
          relevantExamples: [
            '18 hexagonal segments operating as a single 6.5-meter aperture aligned to 70nm wavefront accuracy',
            '48 grams of gold covering 25 square meters of mirror area',
          ],
          sources: [
            {
              title: 'NASA JWST Mirrors: Innovations in Cryogenic Beryllium Optics',
              url: 'https://webb.nasa.gov/content/observatory/ote/mirrors/index.html',
              publisher: 'NASA / Goddard',
              date: 'Technical Standard',
            },
          ],
          cautions: [
            'Beryllium dust is toxic during machining on Earth; optical grinding requires specialized vacuum cleanrooms.',
          ],
        };
      } else if (t.includes('consensus') || t.includes('paxos') || t.includes('raft')) {
        research = {
          topic: rawTopic,
          centralSubject: 'Distributed Consensus Mechanics: Paxos and Raft State Machine Replication',
          subtopics: [
            'Leader election: randomized election timers (150–300ms) and RequestVote RPCs',
            'Log replication and commit invariants: strict majority quorums (floor(N/2) + 1)',
            'Safety guarantees: state machine safety and leader completeness',
            'Split-brain prevention and PreVote extensions during asymmetric network partitions',
          ],
          summary: 'Distributed consensus algorithms like Paxos and Raft coordinate multiple independent nodes to agree on a sequence of state transitions without a single point of failure. By requiring a strict majority quorum (N/2 + 1) for leader elections and log commits, any two quorums must overlap by at least one node, rendering split-brain states mathematically impossible.',
          keyPoints: [
            'Raft decomposes consensus into three independent subproblems: Leader Election, Log Replication, and Safety Invariants.',
            'A candidate node requires votes from floor(N/2) + 1 nodes to claim leadership for a specific numbered term.',
            'A log entry is committed only when it has been replicated and fsynced to disk across a majority of nodes.',
            'PreVote checks prevent isolated partitioned nodes from continuously bumping election terms and disrupting healthy clusters.',
          ],
          facts: [
            {
              claim: 'In an N-node Raft cluster, consensus is maintained as long as a strict majority of floor(N/2) + 1 nodes remain operational and connected.',
              source: 'In Search of an Understandable Consensus Algorithm (Ongaro & Ousterhout / Stanford)',
              confidence: 'high',
            },
            {
              claim: 'Two-phase commit (2PC) blocks indefinitely when a coordinator crashes, whereas Raft consensus automatically elects a new leader within one election timeout.',
              source: 'Designing Data-Intensive Applications (Kleppmann)',
              confidence: 'high',
            },
          ],
          relevantExamples: [
            'etcd Raft cluster maintaining consensus across 3 Kubernetes control-plane nodes',
            'Handling an asymmetric network partition where candidate PreVote checks prevent leader flaps',
          ],
          sources: [
            {
              title: 'The Raft Consensus Algorithm Specification',
              url: 'https://raft.github.io/',
              publisher: 'Stanford University',
              date: 'Canonical Paper',
            },
          ],
          cautions: [
            'Even-numbered node clusters (e.g., 4 nodes) require 3 nodes for quorum (the same as a 5-node cluster) without providing extra fault tolerance.',
          ],
        };
      } else if (t.includes('postgres') || t.includes('mvcc') || t.includes('vacuum')) {
        research = {
          topic: rawTopic,
          centralSubject: 'PostgreSQL Multi-Version Concurrency Control (MVCC) and Heap Storage Mechanics',
          subtopics: [
            'Tuple header metadata: xmin (creating XID) and xmax (expiring XID)',
            'Transaction snapshot isolation and visibility maps',
            'Dead tuple accumulation, table bloat, and autovacuum cost limits',
            'Online index and table defragmentation with pg_repack',
          ],
          summary: 'PostgreSQL uses Multi-Version Concurrency Control (MVCC) so readers never block writers and writers never block readers. Rows in Postgres are immutable heap tuples tagged with creation (xmin) and expiration (xmax) transaction IDs. Updates create new tuple versions rather than overwriting in-place, relying on background autovacuum processes to reclaim space.',
          keyPoints: [
            'Every tuple header contains xmin and xmax transaction IDs that define its visibility to concurrent transactions.',
            'Updates write a new tuple version to the heap and stamp the old version with xmax = current_xid.',
            'Long-running read transactions hold open the global xmin horizon, preventing autovacuum from cleaning dead tuples across the table.',
            'Autovacuum throttling parameters (vacuum_cost_limit) must be tuned to prevent disk bloat on high-throughput systems.',
          ],
          facts: [
            {
              claim: 'PostgreSQL does not use rollback segments or undo logs for MVCC; previous tuple versions remain directly in the table heap until autovacuum reclaims them.',
              source: 'PostgreSQL Internal Documentation: MVCC & Tuple Storage',
              confidence: 'high',
            },
            {
              claim: 'An open transaction in PostgreSQL blocks autovacuum from reclaiming any dead tuple whose xmax is newer than the transaction snapshot start time.',
              source: 'The Internals of PostgreSQL (Hironobu Suzuki)',
              confidence: 'high',
            },
          ],
          relevantExamples: [
            'Diagnosing 200 GB table bloat caused by an idle transaction holding open the xmin horizon',
            'Tuning autovacuum_vacuum_cost_limit from 200 to 2000 on high-IOPS NVMe storage',
          ],
          sources: [
            {
              title: 'PostgreSQL Official Documentation: Concurrency Control',
              url: 'https://www.postgresql.org/docs/current/mvcc.html',
              publisher: 'PostgreSQL Global Development Group',
              date: 'Technical Standard',
            },
          ],
          cautions: [
            'Never run VACUUM FULL on a production database because it takes an AccessExclusiveLock, blocking all reads and writes until completion.',
          ],
        };
      } else if (t.includes('sourdough') || t.includes('fermentation') || t.includes('bread')) {
        research = {
          topic: rawTopic,
          centralSubject: 'Microbial Ecology of Sourdough Fermentation: Yeast-Bacteria Symbiosis and Dough Rheology',
          subtopics: [
            'Symbiosis between Candida humilis wild yeast and Lactobacillus sanfranciscensis bacteria',
            'Maltose co-metabolism: bacteria consume maltose and excrete glucose, which yeast metabolizes',
            'Lactic vs acetic acid production: temperature-controlled flavor and gluten strength kinetics',
            'Proteolytic gluten breakdown: acidic pH below 3.8 activating endogenous proteases',
          ],
          summary: 'Sourdough fermentation relies on a stable microbial mutualism between wild yeast and hetero-fermentative lactic acid bacteria (LAB) at an average 1:100 cell ratio. LAB metabolize maltose into lactic acid (soft, creamy acidity) and acetic acid (sharp acidity), dropping dough pH to 3.8–4.2. This acidity activates wheat amylases and proteases, strengthening initial gas retention while risking enzymatic gluten liquefaction if over-fermented.',
          keyPoints: [
            'Candida humilis wild yeast cannot metabolize maltose, while Lactobacillus sanfranciscensis consumes maltose and excretes glucose, creating a perfectly non-competing ecological niche.',
            'Fermentation temperature directly controls acid balance: warm fermentation (26–28°C) favors lactic acid, while cooler fermentation (18–21°C) favors acetic acid.',
            'Dough pH drops as fermentation progresses; dropping below pH 3.8 triggers wheat proteases to degrade the gluten matrix, turning firm dough into slack soup.',
            'High hydration (>80%) requires flour with high protein quality and sufficient mixing to develop gluten extensibility before enzymatic breakdown occurs.',
          ],
          facts: [
            {
              claim: 'Lactobacillus sanfranciscensis and Candida humilis maintain a stable 100:1 population ratio in mature sourdough starters due to non-competing carbohydrate metabolism.',
              source: 'Microbial Ecology: Applied and Environmental Microbiology (Gänzle et al.)',
              confidence: 'high',
            },
            {
              claim: 'Wheat flour proteases exhibit maximal activity at pH 3.8–4.4, leading to rapid gluten network breakdown during extended warm fermentation.',
              source: 'Cereal Chemistry Journal: Proteolysis in Sourdough Fermentation',
              confidence: 'high',
            },
          ],
          relevantExamples: [
            'Cool retarding at 4°C to selectively accumulate acetic acid without triggering enzymatic gluten collapse',
            'Visual dome curvature and blister aeration indicating 30–50% fermentation rise before over-proofing',
          ],
          sources: [
            {
              title: 'The Sourdough Microflora (Gänzle & Vogel)',
              url: 'https://www.sciencedirect.com/science/article/pii/S0740002008000624',
              publisher: 'Food Microbiology',
              date: 'Foundational Review',
            },
          ],
          cautions: [
            'Relying purely on clock timers instead of dough pH, temperature, and volume increase causes frequent under- or over-fermentation.',
          ],
        };
      } else if (t.includes('photosynthesis') || t.includes('chlorophyll')) {
        research = {
          topic: rawTopic,
          centralSubject: 'Biophysical and Biochemical Mechanics of Photosynthesis',
          subtopics: [
            'Light reactions: Photosystem II photon absorption and water photolysis (2 H2O -> 4 H+ + 4 e- + O2)',
            'Thylakoid proton gradients and ATP Synthase photophosphorylation',
            'Calvin cycle: Carbon fixation via RuBisCO enzyme in the chloroplast stroma',
            'Photorespiration oxygenase inefficiencies and C4/CAM evolutionary adaptations',
          ],
          summary: 'Photosynthesis is the solar energy conversion process inside plant chloroplasts. In the thylakoid membrane, light reactions split water molecules to generate ATP and NADPH while releasing oxygen. In the stroma, the Calvin cycle uses RuBisCO to fix atmospheric carbon dioxide into 3-carbon sugars.',
          keyPoints: [
            'Chlorophyll pigments absorb photons primarily in blue (430–450nm) and red (640–660nm) wavelengths, reflecting green light.',
            'Light energy drives the photolysis of water in Photosystem II, creating an electrochemical proton gradient that powers ATP Synthase.',
            'The enzyme RuBisCO fixes carbon dioxide to RuBP, producing 3-phosphoglycerate, which is reduced to G3P sugars using ATP and NADPH.',
            'RuBisCO misbinds oxygen roughly 25% of the time, triggering photorespiration that wastes significant cellular energy in hot environments.',
          ],
          facts: [
            {
              claim: 'Photosystem II utilizes a manganese-calcium oxygen-evolving complex to oxidize water molecules, generating all molecular oxygen in Earth atmosphere.',
              source: 'Molecular Biology of the Cell (Alberts et al.)',
              confidence: 'high',
            },
            {
              claim: 'RuBisCO catalyzes carbon fixation at a relatively sluggish rate of 3 to 10 reactions per second per active site.',
              source: 'Biochemistry (Berg, Tymoczko, Stryer)',
              confidence: 'high',
            },
          ],
          relevantExamples: [
            'C4 spatial carbon concentration separating initial CO2 capture from RuBisCO in bundle sheath cells',
            'Photoprotective non-photochemical quenching (NPQ) dissipating excess solar radiation as heat',
          ],
          sources: [
            {
              title: 'Plant Physiology and Development (Taiz & Zeiger)',
              url: 'https://academic.oup.com/plphys',
              publisher: 'Oxford University Press',
              date: 'Canonical Textbook',
            },
          ],
          cautions: [
            'Light saturation points limit photosynthesis; increasing light intensity beyond saturation produces phototoxic free radicals without increasing yield.',
          ],
        };
      } else if (t.includes('quantum') || t.includes('qubit')) {
        research = {
          topic: rawTopic,
          centralSubject: 'Quantum Computing Principles: Qubits, Superposition, and Quantum Interference',
          subtopics: [
            'Bloch sphere representation of two-level quantum states (|psi> = alpha|0> + beta|1>)',
            'Entanglement and exponential Hilbert state spaces (2^N simultaneous amplitudes)',
            'Quantum phase interference: constructive vs destructive probability amplification',
            'Decoherence noise, T1/T2 relaxation times, and Surface Code quantum error correction',
          ],
          summary: 'Quantum computing leverages quantum mechanical phenomena—primarily superposition and quantum phase interference—to solve specialized mathematical problems with super-polynomial speedups over classical algorithms. An N-qubit system manipulates 2^N probability amplitudes simultaneously, using unitary quantum logic gates to amplify correct answers while canceling wrong solutions.',
          keyPoints: [
            'A qubit is a coherent two-level quantum system existing as a continuous linear combination of basis states on the Bloch sphere.',
            'Entangled qubit registers span an exponential state space, where operations manipulate all 2^N state amplitudes concurrently.',
            'Quantum algorithms do not simply evaluate all inputs in parallel; they engineer constructive wave interference for target solutions and destructive interference for incorrect candidates.',
            'Physical qubits are extremely sensitive to thermal and electromagnetic noise (decoherence), necessitating fault-tolerant logical qubits via quantum error correction.',
          ],
          facts: [
            {
              claim: 'Shor algorithm factors an N-bit integer in polynomial O(N^3) time on a fault-tolerant quantum computer, compared to sub-exponential classical algorithms.',
              source: 'SIAM Journal on Computing (Peter Shor)',
              confidence: 'high',
            },
            {
              claim: 'Superconducting transmon qubits require cryogenic dilution refrigeration down to 10–20 millikelvin to suppress thermal excitations.',
              source: 'Nature: Quantum Supremacy Using a Programmable Superconducting Processor',
              confidence: 'high',
            },
          ],
          relevantExamples: [
            'Grover search providing a quadratic speedup (O(sqrt(N))) for unstructured database search',
            'Surface code lattice measuring syndrome stabilizer check operators without collapsing qubit state',
          ],
          sources: [
            {
              title: 'Quantum Computation and Quantum Information (Nielsen & Chuang)',
              url: 'https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/01E678AE8597022C0A5F90C9B6A192B4',
              publisher: 'Cambridge University Press',
              date: 'Standard Text',
            },
          ],
          cautions: [
            'Quantum speedup does not apply to general software; without special mathematical algebraic structure, classical processors remain faster.',
          ],
        };
      } else if (t.includes('espresso') || t.includes('coffee')) {
        research = {
          topic: rawTopic,
          centralSubject: 'Espresso Coffee Extraction: Hydraulics, Solubles Kinetics, and Thermodynamics',
          subtopics: [
            'Hydraulic pressure: 9 bars (130 psi) generating emulsified crema and solubles dissolution',
            'Water temperature: 90–96°C balancing fruit acid extraction against bitter tannin leaching',
            'Portafilter puck mechanics: tamped bed resistance, particle size distribution, and channeling',
            'Extraction yield metrics: 18–22% target window measured by digital optical refractometer (TDS)',
          ],
          summary: 'Espresso is a concentrated coffee beverage produced by forcing pressurized water (9–10 bars) heated to 90–96°C through a compacted puck of finely ground roasted coffee beans in 25–30 seconds. The intense hydraulic pressure rapidly dissolves organic acids and sugars while emulsifying insoluble coffee oils with carbon dioxide into a dense foam crown called crema.',
          keyPoints: [
            'An espresso pump delivers 9 atmospheres of pressure (130 psi), forcing water to permeate microscopic channels between ground coffee particles.',
            'Soluble compounds dissolve sequentially: fast-dissolving fruit acids and caffeine first, caramelized sugars second, and astringent tannins last.',
            'Channeling occurs when water cracks fissures through the puck, producing shots that taste simultaneously sour, weak, and unpleasantly bitter.',
            'The golden baseline is an 18g dry dose yielding 36g liquid espresso in 25–30 seconds, hitting an 18% to 22% total extraction yield.',
          ],
          facts: [
            {
              claim: 'Espresso extraction operates at 9 bars (approx 900 kPa / 130 psi) of hydraulic water pressure at 90–96°C.',
              source: 'Specialty Coffee Association (SCA) Espresso Technical Standards',
              confidence: 'high',
            },
            {
              claim: 'Optimal espresso extraction yield is scientifically defined between 18% and 22% of dry coffee mass dissolved into liquid.',
              source: 'The Coffee Brewing Handbook (Ted R. Lingle / SCA)',
              confidence: 'high',
            },
          ],
          relevantExamples: [
            '18.0g dry dose yielding 36.0g liquid espresso in 27 seconds with 9.5% TDS (19% extraction yield)',
            'WDT needle tool declumping grounds to prevent puck micro-channeling under 9 bars of pressure',
          ],
          sources: [
            {
              title: 'Espresso Coffee: The Science of Quality (Illy & Viani)',
              url: 'https://en.wikipedia.org/wiki/Espresso',
              publisher: 'Academic Press / Elsevier',
              date: 'Standard Scientific Reference',
            },
          ],
          cautions: [
            'Grinding too fine triggers micro-channeling rather than higher extraction, producing sour and astringent espresso.',
          ],
        };
      } else if (t.includes('aerodynamic') || t.includes('flight') || t.includes('lift')) {
        research = {
          topic: rawTopic,
          centralSubject: 'Aerodynamic Lift: Fluid Dynamics, Streamline Curvature, and Navier-Stokes Mechanics',
          subtopics: [
            'Bernoulli principle and streamline curvature pressure differentials',
            'Newton third law: downward momentum deflection generating upward reaction force',
            'Angle of attack, stagnation point, and critical stall boundaries',
            'Boundary layer flow separation and turbulent wake drag',
          ],
          summary: 'Aerodynamic lift is the upward mechanical force generated by an aircraft wing moving through fluid air. As air flows over the curved upper surface (camber) and angled lower surface, streamlines curve downward. This streamline curvature creates low static pressure above the wing and higher pressure below, while deflecting mass downward to generate net upward lift.',
          keyPoints: [
            'Lift is generated by pressure differences between the upper and lower surfaces of an airfoil caused by streamline curvature.',
            'The popular "equal transit time" explanation is a physical myth; air over the upper camber travels much faster than air below.',
            'Increasing angle of attack increases lift up to a critical angle (typically 15–18°), beyond which airflow separates, causing an aerodynamic stall.',
            'Total lift scales with air density, the square of airspeed, wing surface area, and the coefficient of lift: L = 0.5 * rho * v^2 * S * C_L.',
          ],
          facts: [
            {
              claim: 'Airflow over the upper camber of a lifting wing travels significantly faster than the lower airflow, refuting the equal-transit myth.',
              source: 'NASA Glenn Research Center: What is Lift?',
              confidence: 'high',
            },
            {
              claim: 'Aerodynamic lift is governed by Navier-Stokes momentum equations and the conservation of mass in fluid streamlines.',
              source: 'Fundamentals of Aerodynamics (John D. Anderson)',
              confidence: 'high',
            },
          ],
          relevantExamples: [
            'Wind tunnel smoke pulse visualizations demonstrating faster flow over upper camber',
            'Boundary layer vortex generators delaying flow separation at high angles of attack',
          ],
          sources: [
            {
              title: 'NASA Aerodynamics: Mechanics of Lift and Flight',
              url: 'https://www.grc.nasa.gov/www/k-12/airplane/lift1.html',
              publisher: 'NASA Glenn Research Center',
              date: 'Technical Standard',
            },
          ],
          cautions: [
            'Never teach equal transit time; it violates aerodynamic fluid conservation laws.',
          ],
        };
      } else if (t.includes('penicillin') || t.includes('antibiotic')) {
        research = {
          topic: rawTopic,
          centralSubject: 'Biochemistry of Penicillin: Beta-Lactam Ring Mechanism and Transpeptidase Inhibition',
          subtopics: [
            'Bacterial cell wall structure: Peptidoglycan mesh and D-Ala-D-Ala peptides',
            'Beta-lactam ring: covalent acylation of penicillin-binding proteins (PBPs)',
            'Transpeptidase enzyme inhibition causing autolysis and osmotic cell rupture',
            'Resistance mechanisms: plasmid-borne beta-lactamase enzyme degradation',
          ],
          summary: 'Penicillin is a beta-lactam antibiotic discovered by Alexander Fleming in 1928. It acts by structurally mimicking D-alanyl-D-alanine, the substrate for bacterial transpeptidase enzymes (penicillin-binding proteins). Penicillin irreversibly acylates the enzyme active site, preventing cross-linking of the peptidoglycan cell wall, causing growing bacteria to rupture under osmotic pressure.',
          keyPoints: [
            'Penicillin contains a strained four-membered beta-lactam ring fused to a thiazolidine ring.',
            'The beta-lactam ring acylates catalytic serine residues in transpeptidase enzymes, permanently halting bacterial cell wall synthesis.',
            'Human cells lack peptidoglycan cell walls, making penicillin selectively toxic to bacteria with minimal human tissue cytotoxicity.',
            'Bacteria evolve resistance by producing beta-lactamase enzymes that hydrolyze the beta-lactam ring before it reaches PBPs.',
          ],
          facts: [
            {
              claim: 'Penicillin irreversibly inhibits DD-transpeptidase enzymes that cross-link peptidoglycan polymers in bacterial cell walls.',
              source: 'Microbiology: An Introduction (Tortora, Funke, Case)',
              confidence: 'high',
            },
            {
              claim: 'Beta-lactamase enzymes confer antibiotic resistance by hydrolyzing the cyclic amide bond of the four-membered beta-lactam ring.',
              source: 'Goodman & Gilman The Pharmacological Basis of Therapeutics',
              confidence: 'high',
            },
          ],
          relevantExamples: [
            'Zone of inhibition in Staphylococcus aureus petri dish around Penicillium notatum mold',
            'Augmentin pairing amoxicillin with clavulanic acid to irreversibly bind beta-lactamase enzymes',
          ],
          sources: [
            {
              title: 'The Mechanism of Action of Penicillin (Tipper & Strominger)',
              url: 'https://en.wikipedia.org/wiki/Penicillin',
              publisher: 'Proceedings of the National Academy of Sciences',
              date: 'Foundational Molecular Biology',
            },
          ],
          cautions: [
            'Penicillin has zero efficacy against viruses because viruses have no peptidoglycan cell walls or metabolic enzymes.',
          ],
        };
      } else if (t.includes('autonomous') || t.includes('multi-agent') || t.includes('agentic')) {
        research = {
          topic: rawTopic,
          centralSubject: 'Autonomous Multi-Agent AI Content Systems: Deterministic Graphs and Self-Healing Loops',
          subtopics: [
            'State machine graphs: decoupling generation, critique, and revision into discrete agent nodes',
            'Deterministic validation gates: regex linters and AST parsers preventing compounding hallucinations',
            'Subagent orchestration: Researcher, Strategist, Coder, and Critic specialization',
            'Execution telemetry and persistence: structured schema state transitions',
          ],
          summary: 'Autonomous multi-agent systems coordinate specialized AI agent nodes within a deterministic state graph. Rather than relying on open-ended conversational reflection that compounds hallucinations, production multi-agent pipelines enforce strongly typed Zod schemas, execute external validation tools (linters, test runners), and selectively route rejected tasks for targeted revision loops.',
          keyPoints: [
            'Multi-agent architectures separate generation from evaluation, avoiding single-context self-bias.',
            'Unconstrained agent reflection without programmatic validation gates frequently degrades output quality across iterations.',
            'Selective post-level revision allows agents to preserve passing content while revising only failing components.',
            'Closed feedback loops with workspace tool execution compress multi-hour workflows into minutes of verifiable work.',
          ],
          facts: [
            {
              claim: 'Multi-agent systems using deterministic graph transitions prevent conversational drift and bounded token recursion.',
              source: 'Agentic Software Engineering Architecture Standards',
              confidence: 'high',
            },
            {
              claim: 'Combining programmatic regex and schema validation with LLM semantic grading catches 100% of generic filler templates.',
              source: 'Autonomous AI Verification Benchmarks',
              confidence: 'high',
            },
          ],
          relevantExamples: [
            'ContentGenerationGraph orchestrating Analyzer -> Researcher -> Strategist -> Writer -> Critic',
            'Agent diagnosing a failed integration test, locating the offending line, and autonomously patching code',
          ],
          sources: [
            {
              title: 'Multi-Agent State Graphs in Production Engineering',
              url: 'https://github.com/contentforge/architecture',
              publisher: 'ContentForge Technical Architecture',
              date: 'Technical Specification',
            },
          ],
          cautions: [
            'Never allow agents to loop without hard iteration boundaries; unbounded execution risks runaway token costs.',
          ],
        };
      } else {
        const norm = normalizeTopic(rawTopic);
        const searchSources = parseSearchFindingsFromPrompt(prompt);

        if (searchSources && searchSources.length > 0) {
          const firstSnippet = searchSources[0].snippet;
          const combinedSummary = searchSources.map((s: ParsedSearchFinding) => s.snippet).join(' ');
          const sentences = combinedSummary
            .split(/(?<=[.!?])\s+/)
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 20);

          const keyPoints = sentences.slice(0, 4);
          const facts = searchSources.map((s: ParsedSearchFinding) => ({
            claim: s.snippet.split(/(?<=[.!?])\s+/)[0] || s.snippet,
            source: `${s.title} (${s.publisher})`,
            confidence: 'high' as const,
          }));

          research = {
            topic: rawTopic,
            centralSubject: `${norm} Mechanics, Principles, and Applications`,
            subtopics: [
              `Core mechanisms and physical laws governing ${norm}`,
              `Key variables and operational parameters in ${norm}`,
              `Practical implementation and boundary conditions for ${norm}`,
              `Common pitfalls and trade-offs observed in ${norm}`,
            ],
            summary: firstSnippet,
            keyPoints: keyPoints.length > 0 ? keyPoints : [firstSnippet],
            facts: facts.length > 0 ? facts : [{ claim: firstSnippet, source: searchSources[0].title, confidence: 'high' as const }],
            relevantExamples: sentences.length > 2 ? [sentences[1], sentences[2]] : [firstSnippet],
            sources: searchSources.map((s: ParsedSearchFinding) => ({
              title: s.title,
              url: s.url,
              publisher: s.publisher,
              date: s.date,
            })),
            cautions: [
              `Failing to account for the physical constraints of ${norm} leads to erratic performance.`,
            ],
          };
        } else {
          research = {
            topic: rawTopic,
            centralSubject: `${norm} Core Principles and Mechanics`,
            subtopics: [
              `Foundational concepts of ${norm}`,
              `Operational mechanisms and parameters`,
              `Practical real-world applications`,
              `Common misconceptions and edge cases`,
            ],
            summary: `Examination of ${norm} analyzing its foundational principles, operational dynamics, and practical constraints.`,
            keyPoints: [
              `The core behavior of ${norm} is governed by specific domain laws and causal interactions.`,
              `Practitioners must balance key operational variables to achieve reliable results with ${norm}.`,
              `Observing real-world constraints prevents misdiagnosing the primary root causes of failure.`,
            ],
            facts: [
              {
                claim: `In ${norm}, stable results depend on maintaining operational parameters within verified tolerance limits.`,
                source: `Domain Technical Standards Archive`,
                confidence: 'high',
              },
              {
                claim: `Operating outside recommended boundaries introduces non-linear degradation and higher failure rates.`,
                source: `Applied Technical Review`,
                confidence: 'high',
              },
            ],
            relevantExamples: [
              `Standard operational execution of ${norm} under nominal conditions`,
              `Diagnostic isolation of parameter drift during load testing`,
            ],
            sources: [
              {
                title: `Principles of ${norm}`,
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(norm.replace(/\s+/g, '_'))}`,
                publisher: `Standard Reference Library`,
                date: 'Authoritative Overview',
              },
            ],
            cautions: [
              `Superficial summaries of ${norm} that omit governing constraints lead to common execution errors.`,
            ],
          };
        }
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

      const toneMatch = prompt.match(/TONE:\s*([^\n\r]+)/i);
      const requestedTone = toneMatch ? toneMatch[1].trim() : 'Professional';

      const parsedResearch = parseResearchFromPrompt(prompt);
      const strategy = getMockStrategy(rawTopic, requestedTone, parsedResearch);
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
      const userTopicMatch =
        prompt.match(/USER TOPIC:\s*([^\n\r]+)/i) ||
        prompt.match(/TOPIC:\s*([^\n\r]+)/i);
      const rawTopic = userTopicMatch ? userTopicMatch[1].trim() : 'Software Engineering';
      const userTopicLower = rawTopic.toLowerCase();
      const topicIsAboutAI =
        userTopicLower.includes('autonomous ai') ||
        userTopicLower.includes('multi-agent') ||
        userTopicLower.includes('ai agent') ||
        userTopicLower.includes('antigravity') ||
        userTopicLower.includes('agent');

      // Check for topic drift ONLY within the draft content section (not the forbidden topics prompt header)
      const draftSectionMatch = prompt.match(/DRAFT CONTENT UNDER EVALUATION:\s*([\s\S]+?)\s*EVALUATION CHECKLIST/i);
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
          toneMatch: 40,
          factualAccuracy: 60,
          relevance: 40,
          platformFit: 70,
          clarity: 70,
          originality: 50,
          usefulness: 40,
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

      // Programmatic Semantic Relevance & Cross-Domain Audit in Mock Critic
      const topicKeywords = rawTopic
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length >= 3 && !['what', 'why', 'how', 'does', 'the', 'and', 'for', 'with', 'about', 'important'].includes(w));

      const draftTokens = draftContent
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length >= 3);

      const hasSemanticOverlap =
        topicKeywords.length === 0 ||
        topicKeywords.some((kw) => draftTokens.some((tok) => matchesKeyword(tok, kw)));

      const isNonSoftware =
        !rawTopic.toLowerCase().includes('software') &&
        !rawTopic.toLowerCase().includes('code') &&
        !rawTopic.toLowerCase().includes('data structure') &&
        !rawTopic.toLowerCase().includes('cpu') &&
        !rawTopic.toLowerCase().includes('recursion') &&
        !rawTopic.toLowerCase().includes('git') &&
        !rawTopic.toLowerCase().includes('merge sort') &&
        !rawTopic.toLowerCase().includes('expense') &&
        !rawTopic.toLowerCase().includes('postgres') &&
        !rawTopic.toLowerCase().includes('consensus') &&
        !rawTopic.toLowerCase().includes('binary search') &&
        !rawTopic.toLowerCase().includes('antigravity');

      const forcedSoftwareTerms = ['microservice', 'kubernetes', 'b-tree', 'database index', 'tuple header', 'autovacuum', 'big-o'];
      const hasCrossDomainContamination = isNonSoftware && forcedSoftwareTerms.some((t) => draftContent.includes(t));

      let parsedDraft: any = undefined;
      if (draftSectionMatch) {
        try {
          parsedDraft = JSON.parse(draftSectionMatch[1].trim());
        } catch {
          // not raw json
        }
      }

      if (draftContent.length > 50 && (!hasSemanticOverlap || hasCrossDomainContamination)) {
        const postList = parsedDraft && 'posts' in parsedDraft && Array.isArray((parsedDraft as any).posts)
          ? ((parsedDraft as any).posts as any[])
          : [];

        const failureReview = {
          approved: false,
          score: 42,
          topicFidelity: 35,
          toneMatch: 50,
          factualAccuracy: 60,
          relevance: 35,
          platformFit: 70,
          clarity: 70,
          originality: 50,
          usefulness: 35,
          naturalness: 60,
          noFabricatedExperience: true,
          noFabricatedStatistics: true,
          issues: [
            {
              type: !hasSemanticOverlap ? 'semantic_misalignment' : 'cross_domain_contamination',
              severity: 'high',
              description: !hasSemanticOverlap
                ? `Draft content fails semantic relevance validation: zero overlap with requested topic "${rawTopic}".`
                : `Draft content suffers from template overfitting: forced software engineering jargon detected in non-software topic "${rawTopic}".`,
            },
          ],
          requiredChanges: [
            `Rewrite all content to be 100% about "${rawTopic}". Focus on authentic domain mechanics and remove unrelated jargon.`,
          ],
          postReviews: parsedDraft && 'posts' in parsedDraft
            ? (postList.length > 0 ? postList : [{ id: 'post_educational', category: 'Educational' }]).map((p: any) => ({
                postId: p.id,
                category: p.category || p.angle || 'Educational',
                approved: false,
                scores: { relevance: 35, depth: 40, accuracy: 50, readability: 70, categoryMatch: 60, originality: 40, total: 45 },
                issues: [
                  {
                    problem: !hasSemanticOverlap ? 'Semantic Misalignment (Zero Topic Overlap)' : 'Cross-Domain Contamination (Forced Software/IT Jargon)',
                    whyItFails: `Draft content does not address "${rawTopic}".`,
                    missingTopicInfo: `Requires concrete details about "${rawTopic}".`,
                    requiredChange: `Rewrite completely for "${rawTopic}".`,
                  },
                ],
                requiredChanges: [`Focus 100% on "${rawTopic}".`],
              }))
            : undefined,
        };
        return schema.parse(failureReview);
      }

      const toneMatch =
        prompt.match(/REQUESTED TONE:\s*([^\n\r]+)/i) ||
        prompt.match(/TONE:\s*([^\n\r]+)/i);
      const requestedTone = toneMatch ? toneMatch[1].trim() : 'Professional';

      const platformMatch =
        prompt.match(/TARGET PLATFORM:\s*([^\n\r]+)/i) ||
        prompt.match(/PLATFORM:\s*([^\n\r]+)/i);
      const rawPlatform = (platformMatch ? platformMatch[1].trim() : 'LINKEDIN').toUpperCase();
      const platform: 'LINKEDIN' | 'INSTAGRAM_REEL' = rawPlatform.includes('REEL')
        ? 'INSTAGRAM_REEL'
        : 'LINKEDIN';

      // If iteration >= 2 or if prompt explicitly requests always approve:
      const shouldApprove =
        (iteration >= 2 ||
        lowerPrompt.includes('high quality draft') ||
        lowerPrompt.includes('approve: true')) &&
        hasSemanticOverlap &&
        !hasCrossDomainContamination &&
        !hasSevereDrift;

      const review = getMockCriticReview(rawTopic, platform, requestedTone, iteration, shouldApprove, parsedDraft);
      return schema.parse(review);
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

      const toneMatch = prompt.match(/TONE:\s*([^\n\r]+)/i);
      const requestedTone = toneMatch ? toneMatch[1].trim() : 'Professional';

      const iterationMatch = prompt.match(/ITERATION:\s*(\d+)/i);
      const iteration = iterationMatch ? parseInt(iterationMatch[1], 10) : 1;
      const isRevision = iteration > 1 || lowerPrompt.includes('critical revision instructions');

      const parsedResearch = parseResearchFromPrompt(prompt);
      const parsedStrategy = parseStrategyFromPrompt(prompt);
      const posts = getMockLinkedInPosts(
        rawTopic,
        requestedTone,
        iteration,
        isRevision,
        parsedResearch,
        parsedStrategy
      );
      return schema.parse(posts);
    }

    // ---------------------------------------------------------
    // 6. WRITER AGENT - INSTAGRAM REEL
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

      const toneMatch = prompt.match(/TONE:\s*([^\n\r]+)/i);
      const requestedTone = toneMatch ? toneMatch[1].trim() : 'Professional';

      const iterationMatch = prompt.match(/ITERATION:\s*(\d+)/i);
      const iteration = iterationMatch ? parseInt(iterationMatch[1], 10) : 1;
      const isRevision = iteration > 1 || lowerPrompt.includes('critical revision instructions');

      const parsedResearch = parseResearchFromPrompt(prompt);
      const reel = getMockReelScript(rawTopic, requestedTone, iteration, isRevision, parsedResearch);
      return schema.parse(reel);
    }

    throw new Error(
      `MockLLMProvider could not identify prompt schema structure: ${prompt.substring(0, 100)}`
    );
  }
}

// Google Gemini LLM Provider (Native REST with JSON Structured Output)
export class GeminiLLMProvider implements LLMProvider {
  name = 'gemini';
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || env.LLM_API_KEY || process.env.GEMINI_API_KEY || '';
    this.model =
      model ||
      (env.LLM_MODEL && env.LLM_MODEL !== 'gpt-4o-mini'
        ? env.LLM_MODEL
        : 'gemini-1.5-flash');
  }

  async generateStructured<T>(
    prompt: string,
    schema: ZodType<T, any, any>,
    options?: LLMGenerateOptions
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error(
        'Gemini API Key is missing. Set LLM_API_KEY or GEMINI_API_KEY in environment variables.'
      );
    }

    const systemPrompt =
      options?.systemPrompt ||
      'You are an expert technical writer and AI assistant that always returns valid JSON adhering to specifications.';
    const temperature = options?.temperature ?? 0.2;
    const maxRetries = options?.maxRetries ?? 2;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      this.model
    )}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

    const body: any = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature,
        responseMimeType: 'application/json',
      },
    };

    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`Gemini API error (${response.status}): ${errBody}`);
        }

        const data = (await response.json()) as any;
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          throw new Error('Empty response from Gemini API');
        }

        const cleanedJson = extractJsonFromText(text);
        const parsed = JSON.parse(cleanedJson);
        const validated = schema.safeParse(parsed);

        if (validated.success) {
          return validated.data;
        } else {
          lastError = new Error(
            `JSON schema validation error: ${JSON.stringify(validated.error.format())}`
          );
        }
      } catch (err: any) {
        lastError = err;
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }

    throw new Error(
      `Failed to generate valid structured LLM output from Gemini after ${maxRetries + 1} attempts: ${lastError?.message}`
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

  if (provider === 'gemini') {
    if (!env.LLM_API_KEY && !process.env.GEMINI_API_KEY) {
      console.warn(
        '[LLM Provider] LLM_PROVIDER is "gemini" but neither LLM_API_KEY nor GEMINI_API_KEY is set. Falling back to MockLLMProvider.'
      );
      return new MockLLMProvider();
    }
    return new GeminiLLMProvider();
  }

  // Default to robust Mock provider
  return new MockLLMProvider();
}
