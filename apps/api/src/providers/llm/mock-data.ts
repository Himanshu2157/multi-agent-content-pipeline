import {
  Platform,
  ContentStrategy,
  LinkedInOutput,
  InstagramReelOutput,
  CriticReview,
  PostReview,
  WriterOutput,
  ResearchResult,
} from '@contentforge/shared';

export function normalizeTopic(raw: string): string {
  const cleaned = raw.trim().replace(/[.?]+$/, '');
  const t = cleaned.toLowerCase();

  if (t.includes('webb') || t.includes('beryllium') || t.includes('telescope')) {
    return 'James Webb Space Telescope Beryllium Mirrors & Infrared Optics';
  }
  if (t.includes('pitot') || t.includes('aerospace') || t.includes('airspeed')) {
    return 'Aircraft Pitot-Static Flight Instrumentation Systems';
  }
  if (t.includes('sourdough') || t.includes('fermentation') || t.includes('bread')) {
    return 'Microbial Ecology of Sourdough Fermentation';
  }
  if (t.includes('postgres') || t.includes('mvcc') || t.includes('vacuum')) {
    return 'PostgreSQL Multi-Version Concurrency Control';
  }
  if (t.includes('consensus') || t.includes('paxos') || t.includes('raft')) {
    return 'Distributed Consensus with Paxos and Raft';
  }
  if (t.includes('photosynthesis') || t.includes('chlorophyll') || t.includes('calvin cycle')) {
    return 'Biochemistry of Photosynthesis and the Calvin Cycle';
  }
  if (t.includes('quantum') || t.includes('qubit') || t.includes('superposition')) {
    return 'Quantum Computing Principles: Qubits, Superposition, and Entanglement';
  }
  if (t.includes('cpu') || t.includes('instruction')) {
    return 'CPU Instruction Execution Cycle';
  }
  if (t.includes('binary search')) {
    return 'Binary Search Implementation in C';
  }
  if (t.includes('antigravity')) {
    return 'Software Engineering with Google Antigravity';
  }
  if (t.includes('merge sort')) {
    return 'Time Complexity of Merge Sort';
  }
  if (t.includes('expense') || t.includes('tracker')) {
    return 'Building a Personal Expense Tracker';
  }
  if (t.includes('data structure')) {
    return 'Essential Data Structures in Software Engineering';
  }
  if (t.includes('recursion')) {
    return 'Understanding Recursion and Call Stack Mechanics';
  }
  if (t.includes('git')) {
    return 'Distributed Version Control with Git';
  }
  if (t.includes('sleep') || t.includes('productivity')) {
    return 'Sleep Quality and Cognitive Productivity';
  }
  if (t.includes('espresso') || t.includes('coffee')) {
    return 'Espresso Extraction Mechanics and Thermodynamics';
  }
  if (t.includes('penicillin') || t.includes('antibiotic')) {
    return 'Biochemistry of Penicillin and Antibiotic Resistance';
  }
  if (t.includes('aerodynamic') || t.includes('flight') || t.includes('lift')) {
    return 'Aerodynamic Lift and Fluid Dynamics';
  }
  if (t.includes('autonomous') || t.includes('multi-agent') || t.includes('agentic')) {
    return 'Autonomous Multi-Agent AI Content Systems';
  }
  if (t.includes('thrust') || t.includes('reverser') || (t.includes('jet') && t.includes('engine'))) {
    return 'Jet Engine Thrust Reversal Systems & Aerodynamic Braking';
  }

  // Strip leading question/verb prefixes cleanly
  const stripped = cleaned
    .replace(/^(can you explain|please explain|explain to me|explain|understanding|tell me about|is it true that)\s+/i, '')
    .replace(/^(why does|why do|why is|why are|why the|why should developers learn|why should we|why)\s+/i, '')
    .replace(/^(how does|how do|how can|how to|how)\s+/i, '')
    .replace(/^(what is|what are|what does|what)\s+/i, '')
    .trim();

  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
}


// =========================================================================
// 1. CONTENT STRATEGY MOCKS
// =========================================================================
export function getMockStrategy(
  topic: string,
  tone: string = 'Professional',
  research?: ResearchResult
): ContentStrategy {
  const t = topic.toLowerCase();
  const norm = normalizeTopic(topic);

  if (t.includes('cpu') || t.includes('instruction')) {
    return {
      topic,
      targetAudiencePainPoint: 'Engineers treat processor execution as an opaque black box, resulting in cache-unfriendly layouts and pipeline flushes.',
      coreInsight: 'Software instructions are scheduled silicon micro-operations; understanding Fetch, Decode, and Execute unlocks hardware-sympathetic performance.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'Step-by-step breakdown of Fetch, Decode, Execute, and Write-Back in hardware.',
          targetTakeaway: 'The physical instruction cycle bridges code logic to silicon clock cycles.',
          hookIdea: 'Every line of code you write eventually boils down to three physical steps in silicon: Fetch, Decode, and Execute.',
          suggestedExampleOrAnalogy: 'Program Counter indexing L1 cache lines into the Instruction Register.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Challenging the assumption that processors execute machine code in sequential program order.',
          targetTakeaway: 'Out-of-order execution and branch prediction dominate real-world instruction throughput.',
          hookIdea: 'Why do modern CPU instructions almost never execute in the order written by your compiler?',
          suggestedExampleOrAnalogy: 'Speculative execution rolling back the Reorder Buffer on branch mispredictions.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'A realistic performance investigation where sorting an array sped up CPU execution by 6x.',
          targetTakeaway: 'Branch predictor stalls cost up to 20 clock cycles per misprediction.',
          hookIdea: 'How an innocent conditional branch inside an image rendering loop cut throughput by 6x due to CPU branch mispredictions:',
          suggestedExampleOrAnalogy: 'Branch Target Buffer thrashing on unsorted pixel thresholds.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: 'Actionable 4-step framework for writing hardware-sympathetic, branchless code.',
          targetTakeaway: 'Data alignment and branchless bitwise operations keep CPU execution pipelines saturated.',
          hookIdea: 'A 4-step mental framework for writing hardware-sympathetic code that aligns with the CPU execution cycle:',
          suggestedExampleOrAnalogy: 'Replacing erratic if/else statements with conditional moves (cmov) and SIMD vectorization.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'Nanosecond latency hierarchy comparing register speed to main RAM latency.',
          targetTakeaway: 'Instruction speed is bounded by memory hierarchy stalls, not ALU math limits.',
          hookIdea: 'Here is the nanosecond latency hierarchy that dictates whether your CPU runs at peak gigahertz speed or sits idle:',
          suggestedExampleOrAnalogy: '0.5ns register access vs 60ns main memory bus stalls.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'generic corporate filler'],
      keyPointsToEmphasize: ['Silicon pipeline mechanics', 'Branch prediction and cache misses', 'Memory hierarchy latency'],
    };
  }

  if (t.includes('binary search')) {
    return {
      topic,
      targetAudiencePainPoint: 'Developers implement binary search assuming it is trivial, only to introduce integer overflow or infinite loops.',
      coreInsight: 'Binary search is an optimal O(log n) divide-and-conquer strategy whose correctness depends on rigorous boundary invariants.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'Dissecting the binary search midpoint invariant and avoiding 32-bit integer overflow in C.',
          targetTakeaway: 'Always calculate mid as low + (high - low)/2 to avoid INT_MAX overflow.',
          hookIdea: 'Binary search looks deceptively simple in C—until you realize it took computer scientists over two decades to publish a bug-free implementation.',
          suggestedExampleOrAnalogy: 'Halving 1,000,000 items in 20 comparisons vs linear scan.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Why linear scan beats binary search on small collections under 64 elements.',
          targetTakeaway: 'Contiguous L1 cache lines make linear loops faster than pointer jumps for small arrays.',
          hookIdea: 'Why a linear scan can be faster than binary search in C for arrays under 64 elements:',
          suggestedExampleOrAnalogy: 'Single 64-byte CPU cache line scan vs memory address jumps.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'How the 20-year-old integer overflow bug was discovered in standard libraries.',
          targetTakeaway: 'Mathematical algorithms fail when mapped to finite-width machine integers.',
          hookIdea: 'How Joshua Bloch discovered the 20-year-old binary search overflow bug that affected standard C and Java libraries:',
          suggestedExampleOrAnalogy: 'Arrays exceeding 1 billion elements wrapping into negative indices.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: 'A robust, overflow-safe binary search implementation in C using size_t.',
          targetTakeaway: 'Guarding bounds and unsigned indices prevents memory segmentation faults.',
          hookIdea: 'Production-grade, overflow-safe binary search implementation in C using standard library conventions:',
          suggestedExampleOrAnalogy: 'Clean C while-loop with size_t high and low boundaries.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'Exact comparison counts across array size thresholds comparing linear scan to binary search.',
          targetTakeaway: 'At 1 billion items, binary search takes only 30 probes, provided data is sorted.',
          hookIdea: 'Comparing search performance in C: Linear O(n) vs Binary Search O(log n) across array sizes:',
          suggestedExampleOrAnalogy: '1,000,000,000 iterations reduced to 30 comparisons.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'generic corporate filler'],
      keyPointsToEmphasize: ['Integer overflow fix', 'Cache line efficiency vs Big-O', 'Boundary termination conditions'],
    };
  }

  if (t.includes('antigravity')) {
    return {
      topic,
      targetAudiencePainPoint: 'Engineers spend excessive time copying AI code snippets, debugging compile errors manually, and endlessly re-prompting.',
      coreInsight: 'Autonomous pair programming combines codebase indexing, deterministic tool execution, and closed-loop test runners to verify software before human review.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'Explaining the closed-loop architecture of autonomous software engineering agents.',
          targetTakeaway: 'Autonomous pair programming inverts AI assistance from chat prompts to self-correcting execution.',
          hookIdea: 'Autonomous coding agents are moving beyond chat interfaces into closed-loop agentic execution—and Google Antigravity is built around this exact shift.',
          suggestedExampleOrAnalogy: 'Repository AST symbol indexing combined with deterministic test runner feedback.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Why generating code is trivial while automated verification is the true bottleneck.',
          targetTakeaway: 'Verified correctness and regression testing matter far more than raw token generation speed.',
          hookIdea: 'Why generating code is the easiest part of AI development—and why verification is where most AI tools fail:',
          suggestedExampleOrAnalogy: 'Autonomous test loops diagnosing stack traces vs manual human debugging.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'A realistic migration case study refactoring 42 breaking schema changes across 18 modules.',
          targetTakeaway: 'Closed-loop agents systematically eliminate mechanical refactoring friction.',
          hookIdea: 'How an agentic refactoring workflow eliminated hours of manual debugging during a breaking API upgrade:',
          suggestedExampleOrAnalogy: 'Systematic compilation fixes and type signature updates across multiple files.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: 'A 4-step framework for integrating autonomous agent pairs into feature engineering.',
          targetTakeaway: 'Test-first specifications give agents unambiguous verification signals.',
          hookIdea: 'A 4-step framework for maximizing productivity with Google Antigravity in your engineering workflow:',
          suggestedExampleOrAnalogy: 'Writing test assertions first, setting file boundaries, and inspecting diff trails.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'Quantitative comparison between traditional chat prompting and closed-loop execution.',
          targetTakeaway: 'Eliminating the human copy-paste loop reduces context switching from 15 minutes to under 2 minutes.',
          hookIdea: 'The productivity math behind closed-loop AI agents vs manual copy-paste prompting:',
          suggestedExampleOrAnalogy: '5 manual prompt iterations vs single specification execution.',
        },
      ],
      avoidTopics: ['ungrounded hype', 'hallucinated metrics', 'corporate buzzwords'],
      keyPointsToEmphasize: ['Deterministic tool execution', 'Continuous test-driven validation', 'AST codebase grounding'],
    };
  }

  if (t.includes('merge sort')) {
    return {
      topic,
      targetAudiencePainPoint: 'Students memorize O(n log n) for exams without understanding recurrence relations or why memory overhead restricts merge sort in production.',
      coreInsight: 'Merge sort guarantees O(n log n) stability in all cases via divide-and-conquer, but incurs an O(n) auxiliary memory bandwidth cost.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'Proof of merge sort recurrence T(n) = 2T(n/2) + O(n) using the Master Theorem.',
          targetTakeaway: 'Dividing takes log2(n) levels, and merging takes O(n) work per level, guaranteeing Θ(n log n).',
          hookIdea: 'Merge sort is one of the few sorting algorithms that guarantees O(n log n) time complexity across every single case—best, average, and worst.',
          suggestedExampleOrAnalogy: 'Master Theorem Case 2 solving recurrence tree depths.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Why standard C++ and C libraries default to QuickSort despite merge sort having a better worst-case.',
          targetTakeaway: 'Merge sort requires O(n) auxiliary memory allocation, whereas QuickSort sorts in-place.',
          hookIdea: 'If Merge Sort is guaranteed O(n log n) in all cases, why does standard C and C++ std::sort default to QuickSort instead?',
          suggestedExampleOrAnalogy: 'Memory bus saturation copying buffers vs in-place partition pointers.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'How Python and Java adopted Timsort (adaptive merge sort) for real-world object ordering.',
          targetTakeaway: 'Real-world data contains pre-existing sorted runs, allowing adaptive merge sort to run in O(n) time.',
          hookIdea: "Why Python's list.sort() and Java's Arrays.sort() chose Timsort (an adaptive Merge Sort variant) over QuickSort:",
          suggestedExampleOrAnalogy: 'Detecting naturally sorted runs in database exports.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: 'A 3-part selection matrix for choosing between Merge Sort, QuickSort, and HeapSort.',
          targetTakeaway: 'Use Merge Sort when stability is mandatory or sorting linked lists/streams.',
          hookIdea: 'A 3-step decision heuristic for determining when to choose Merge Sort over QuickSort or HeapSort:',
          suggestedExampleOrAnalogy: 'Stable multi-key sorting vs memory-constrained embedded buffers.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'Empirical resource breakdown sorting 10,000,000 records across algorithms.',
          targetTakeaway: 'Algorithm selection balances CPU operations against auxiliary RAM allocation.',
          hookIdea: 'Comparing sorting complexity and hardware characteristics across 10,000,000 items:',
          suggestedExampleOrAnalogy: '80 MB extra buffer allocation vs 1 KB stack space.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'generic corporate filler'],
      keyPointsToEmphasize: ['Master Theorem recurrence', 'O(n) auxiliary space trade-off', 'Stability guarantees'],
    };
  }

  if (t.includes('expense') || t.includes('tracker')) {
    return {
      topic,
      targetAudiencePainPoint: 'Developers build expense trackers modeling currency with floating-point types, causing compounding balance discrepancies.',
      coreInsight: 'A robust personal expense tracker requires structured integer-cent schemas, category taxonomy, and fast local-first queries.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'Core architectural layers of a personal finance ledger: schema, category taxonomy, and aggregation.',
          targetTakeaway: 'Store currency in integer minor units (cents) to avoid IEEE-754 floating-point errors.',
          hookIdea: 'Most beginner expense trackers fail because they model transactions as simple lists instead of structured ledgers.',
          suggestedExampleOrAnalogy: 'UUID, ISO timestamp, integer cents, and category foreign keys.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Why a private local-first SQLite expense tracker beats commercial subscription apps.',
          targetTakeaway: 'Zero recurring fees, complete financial privacy, and instant sub-millisecond local queries.',
          hookIdea: 'Why building your own personal expense tracker with SQLite beats downloading 90% of commercial budgeting apps:',
          suggestedExampleOrAnalogy: 'Single-file local database vs third-party bank credential aggregators.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'A real case study where floating-point math created a $4,200 reconciliation error over 18 months.',
          targetTakeaway: 'Binary floating-point arithmetic (0.1 + 0.2 != 0.3) must never be used for money.',
          hookIdea: 'How modeling currency with IEEE-754 floating-point numbers caused a $4,200 reconciliation discrepancy in an expense tracking app:',
          suggestedExampleOrAnalogy: 'Compounding binary rounding fractions across 150,000 transactions.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: 'Actionable 4-step blueprint for building a local-first expense tracker in a weekend.',
          targetTakeaway: 'Relational schema, rapid 3-tap input, monthly SQL aggregation views, and CSV export.',
          hookIdea: 'A 4-step architectural blueprint to build a local-first personal expense tracker in a weekend:',
          suggestedExampleOrAnalogy: 'SQLite transactions table with GROUP BY category_id views.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'Storage engine comparison: SQLite vs PostgreSQL vs IndexedDB for financial tools.',
          targetTakeaway: 'Single-file SQLite provides optimal latency and zero cloud maintenance for personal tools.',
          hookIdea: 'Database selection breakdown for a personal expense tracker: SQLite vs PostgreSQL vs IndexedDB:',
          suggestedExampleOrAnalogy: 'Sub-millisecond local reads vs multi-user PostgreSQL hosting costs.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'generic corporate filler'],
      keyPointsToEmphasize: ['Integer cents currency storage', 'Local-first SQLite privacy', 'Indexed aggregation views'],
    };
  }

  if (t.includes('webb') || t.includes('beryllium') || t.includes('telescope')) {
    return {
      topic,
      targetAudiencePainPoint: 'Engineers and science enthusiasts assume space telescopes use traditional polished glass mirrors, unaware of cryogenic thermal contraction and infrared physics.',
      coreInsight: 'At 35 Kelvin, traditional glass fractures and deforms; beryllium provides unmatched specific stiffness while 100nm of vapor-deposited gold maximizes 98% infrared reflectivity.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'Material physics breakdown: cryogenic stability of beryllium and gold reflectivity.',
          targetTakeaway: 'Beryllium maintains structural shape at -238°C while gold reflects the faint infrared spectrum of early galaxies.',
          hookIdea: 'Why did NASA spend $10B building mirrors out of beryllium and gold instead of traditional optical glass?',
          suggestedExampleOrAnalogy: 'Cryogenic cooling to 35 Kelvin (-238°C) causing near-zero thermal distortion.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Challenging why silver and aluminum—the standard mirror coatings—were rejected for gold.',
          targetTakeaway: 'Aluminum absorbs and scatters infrared light; gold provides 98% reflectivity between 0.6 and 28 microns.',
          hookIdea: 'Gold is notoriously soft and expensive, yet NASA used 48 grams of vapor-deposited gold on JWST. Here is the optical physics reason why:',
          suggestedExampleOrAnalogy: 'Infrared photon reflectance curves comparing gold (98%) vs aluminum (85%).',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'The optical figuring challenge: polishing intentional inverse aberrations at room temperature.',
          targetTakeaway: 'Mirrors were ground distorted on Earth so they deform into perfect parabolas in deep space.',
          hookIdea: 'How NASA optical engineers deliberately manufactured distorted, imperfect mirrors on Earth to achieve perfect focus in deep space:',
          suggestedExampleOrAnalogy: 'Room temperature wavefront testing vs cryogenic vacuum chamber deformation.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: 'The 4-stage deployment and nanometer-scale hexagonal segment wavefront alignment.',
          targetTakeaway: 'Hexapod mechanical actuators align 18 primary mirror segments to within 1/10,000th the width of a human hair.',
          hookIdea: 'A 4-step breakdown of how JWST aligned 18 individual mirror segments into a single 6.5-meter optical surface in space:',
          suggestedExampleOrAnalogy: 'Coarse phasing, fine phasing, and hexapod actuator stepping in 10-nanometer increments.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'Cosmological redshift and why infrared optics are mandatory to see the first stars.',
          targetTakeaway: 'Universal expansion stretches visible light from the earliest galaxies into the infrared spectrum.',
          hookIdea: 'The cosmological physics constraint that made visible-light mirrors useless for seeing the edge of the universe:',
          suggestedExampleOrAnalogy: 'Z=10 cosmological redshift stretching ultraviolet photons into mid-infrared.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'generic corporate filler', 'unrelated IT jargon'],
      keyPointsToEmphasize: ['35 Kelvin cryogenic thermal contraction', '100nm gold layer (48g total)', '18 hexagonal segments and hexapod actuators'],
    };
  }

  if (t.includes('sourdough') || t.includes('fermentation') || t.includes('bread')) {
    return {
      topic,
      targetAudiencePainPoint: 'Bakers rely on static clock timers instead of monitoring fermentation kinetics, pH drop, and dough extensibility.',
      coreInsight: 'Sourdough is a symbiotic ecosystem of wild yeast (Candida humilis) and lactic acid bacteria (Lactobacillus sanfranciscensis); mastering dough requires balancing gas production against enzymatic gluten breakdown.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'Microbial breakdown: symbiotic balance between wild yeast and lactic acid bacteria (LAB).',
          targetTakeaway: 'Yeast produces CO2 for oven spring while LAB produces lactic and acetic acids for flavor and dough stability.',
          hookIdea: 'Sourdough is not just flour and water—it is a competitive microbial war between wild yeast and lactic acid bacteria:',
          suggestedExampleOrAnalogy: '100:1 ratio of Lactobacillus sanfranciscensis to Candida humilis co-metabolizing maltose.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Why the popular advice to push for extreme 85%+ hydration ruins crumb structure for most home bakers.',
          targetTakeaway: 'Flour protein quality and enzymatic activity dictate maximum hydration, not social media trends.',
          hookIdea: 'Why chasing extreme 85% hydration is actually ruining your sourdough crumb structure:',
          suggestedExampleOrAnalogy: 'Excess water hydrolyzing gluten bonds before baking.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'How adjusting fermentation temperature by 3°C resolved gummy, dense crumb in bakery production.',
          targetTakeaway: 'Warmer temperatures favor lactic acid (creamy, yogurt-like) while cooler temperatures favor acetic acid (sharp vinegar-like).',
          hookIdea: 'How shifting bulk fermentation temperature by just 3°C transformed flat, gummy sourdough into open, airy loaves:',
          suggestedExampleOrAnalogy: '24°C bulk fermentation shifting bacterial enzymatic rate.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: 'A 4-part visual fermentation diagnostic checklist for determining optimal dough readiness.',
          targetTakeaway: 'Judge bulk fermentation readiness by dome shape, aerated bubbles, and 30–50% volume increase, never the clock.',
          hookIdea: 'A 4-step diagnostic protocol to know the exact moment your sourdough bulk fermentation is complete:',
          suggestedExampleOrAnalogy: 'Convex dome curvature, translucent blister bubbles, and gentle jiggle.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'Biochemical trade-offs between dough pH, amylase starch breakdown, and protease gluten degradation.',
          targetTakeaway: 'Over-fermentation drops pH below 3.8, triggering protease enzymes to dissolve the gluten mesh into liquid.',
          hookIdea: 'The biochemical threshold where sourdough dough transitions from peak oven spring to structural collapse:',
          suggestedExampleOrAnalogy: 'Protease enzyme activity breaking down gluten peptide chains below pH 3.8.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'generic corporate filler', 'software analogies', 'code snippets'],
      keyPointsToEmphasize: ['Microbial symbiotic balance', 'Temperature-dependent acid kinetics', 'Protease enzyme degradation thresholds'],
    };
  }

  if (t.includes('photosynthesis') || t.includes('chlorophyll') || t.includes('calvin cycle')) {
    return {
      topic,
      targetAudiencePainPoint: 'Students and science communicators memorize equations without understanding the physical photon capture and quantum energy transfer in thylakoid membranes.',
      coreInsight: 'Photosynthesis is nature’s most efficient quantum solar engine: Photosystems II and I split water to generate ATP and NADPH, driving carbon fixation in the Calvin cycle.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'Step-by-step breakdown of light-dependent reactions: photolysis, electron transport, and ATP synthase.',
          targetTakeaway: 'Photons excite P680 chlorophyll molecules to split water (H2O -> O2 + 4H+ + 4e-), pumping protons across the thylakoid lumen.',
          hookIdea: 'Every breath of oxygen you take originated from a single biophysical reaction: chlorophyll splitting water molecules in sunlight.',
          suggestedExampleOrAnalogy: 'Water-splitting manganese-calcium cluster inside Photosystem II.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Why RuBisCO—the enzyme powering all planetary life—is notoriously inefficient and prone to photorespiration.',
          targetTakeaway: 'RuBisCO mistakes oxygen for CO2 roughly 25% of the time, forcing plants to expend energy recycling phosphoglycolate.',
          hookIdea: 'The most important enzyme on planet Earth is also one of the most notoriously flawed: meet RuBisCO.',
          suggestedExampleOrAnalogy: 'C3 plants losing up to 30% of photosynthetic efficiency to photorespiration in hot weather.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'How C4 and CAM plants evolved specialized anatomy to overcome the RuBisCO oxygenation bottleneck.',
          targetTakeaway: 'Kranz anatomy spatially separates CO2 capture (PEP carboxylase) from the Calvin cycle, preventing photorespiration.',
          hookIdea: 'How corn and sugarcane evolved a cellular turbocharger to overcome a 3-billion-year-old enzymatic flaw:',
          suggestedExampleOrAnalogy: 'Bundle sheath cells concentrating CO2 to saturate RuBisCO.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: '4-stage trace of photon energy moving from solar capture to glucose synthesis.',
          targetTakeaway: 'Photons -> resonance energy transfer -> electron gradient -> ATP/NADPH -> RuBisCO carbon fixation.',
          hookIdea: 'A 4-step biophysical trace of how sunlight transforms into organic matter:',
          suggestedExampleOrAnalogy: 'Z-scheme electron energy progression through Cytochrome b6f.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'Theoretical vs practical solar energy conversion efficiency in terrestrial plants.',
          targetTakeaway: 'While quantum resonance transfer in photosystems is nearly 100%, whole-plant solar conversion tops out around 1–3%.',
          hookIdea: 'Why nature’s ultimate solar panel has an overall thermodynamic efficiency of only 1 to 2%:',
          suggestedExampleOrAnalogy: 'PAR absorption spectrum (400-700nm) vs thermodynamic entropy loss.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'generic corporate filler', 'software analogies', 'code snippets'],
      keyPointsToEmphasize: ['Water photolysis in PSII', 'Calvin cycle carbon fixation', 'RuBisCO photorespiration trade-offs'],
    };
  }

  if (t.includes('data structure')) {
    return {
      topic,
      targetAudiencePainPoint: 'Engineers memorize Big-O syntax for interview trivia without understanding how data structures map to physical RAM and CPU cache lines.',
      coreInsight: 'Data structures are physical memory layout blueprints; choosing contiguous blocks vs pointer indirection determines whether a system runs in nanoseconds or milliseconds.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'Contiguous memory address calculation vs pointer dereference latency tiers.',
          targetTakeaway: 'Array lookups use base + i * size in L1 cache, while linked lists hop across scattered heap pointers.',
          hookIdea: 'Why does traversing an array take 1ns while a linked list of the same size takes 40 to 100ns?',
          suggestedExampleOrAnalogy: 'Hardware CPU prefetchers loading 64-byte cache lines.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Why O(1) hash maps are often slower than compact sorted arrays for small datasets.',
          targetTakeaway: 'Hash maps incur 25-50% memory waste, collision chaining, and pseudo-random memory hops.',
          hookIdea: 'Hash maps promise O(1) lookups. So why do high-throughput systems actively replace them with sorted arrays?',
          suggestedExampleOrAnalogy: 'Load factor bucket over-allocation and pseudo-random cache misses.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'How flattening pointer references to contiguous structs delivered a 100x speedup.',
          targetTakeaway: 'Packing order records into a contiguous buffer eliminated 84% cache misses.',
          hookIdea: 'How replacing an array of pointer references with an array of flat structs turned an 800ms endpoint into 8ms:',
          suggestedExampleOrAnalogy: '250,000 order records packed into an 8 MB buffer.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: 'Mapping collection data structures directly to access patterns.',
          targetTakeaway: 'Exact match -> Hash Map, Sorted range -> B-Tree, Streaming FIFO -> Ring Buffer, Top-K -> Binary Heap.',
          hookIdea: 'Stop guessing collection types. Here is the physical memory breakdown for matching data structures to access patterns:',
          suggestedExampleOrAnalogy: 'Access pattern selection matrix with Big-O constraints.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'The fundamental memory-compute trade-off across 1,000,000 records.',
          targetTakeaway: 'Every data structure balances contiguous memory, pointer indirection, and precomputed indexing.',
          hookIdea: 'Every single data structure in computer science is just a trade-off between contiguous memory, pointer indirection, and precomputed indexing:',
          suggestedExampleOrAnalogy: 'Array vs Hash Table vs B+ Tree handling 1,000,000 items.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'microservice debate meta-talk'],
      keyPointsToEmphasize: ['Contiguous memory vs pointer hopping', 'CPU cache line prefetching', 'Hash table load factor overhead', 'B-Tree page size alignment'],
    };
  }

  if (t.includes('consensus') || t.includes('paxos') || t.includes('raft')) {
    return {
      topic,
      targetAudiencePainPoint: 'Engineers confuse two-phase commit transactions with fault-tolerant consensus, causing availability deadlocks during network partitions.',
      coreInsight: 'Distributed consensus guarantees linearizable state replication without single points of failure via strict majority quorum math (N/2 + 1).',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'Raft consensus mechanics: Leader Election, Log Replication, and Quorum Commits.',
          targetTakeaway: 'Majority quorum overlap floor(N/2) + 1 makes split-brain write divergence mathematically impossible.',
          hookIdea: 'How do distributed databases like etcd and CockroachDB agree on state when network cables are cut? The math of Raft quorums:',
          suggestedExampleOrAnalogy: 'Raft term numbers and heartbeat election timeouts.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Why 2-Phase Commit (2PC) is not consensus and kills availability during coordinator crashes.',
          targetTakeaway: '2PC requires unanimous agreement; Raft consensus survives minority node failures automatically.',
          hookIdea: 'Why 2-Phase Commit is NOT consensus—and why calling it consensus causes production database deadlocks:',
          suggestedExampleOrAnalogy: 'Coordinator failure freezing locks vs Raft leader failover.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'Diagnosing an asymmetric network partition election loop in Raft.',
          targetTakeaway: 'Pre-vote extensions prevent isolated nodes from disrupting cluster leadership.',
          hookIdea: 'How a partial switch failure created a 3-way asymmetric network split that tested Raft term increments to their limits:',
          suggestedExampleOrAnalogy: 'Asymmetric packet drop triggering candidate term increments.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: '4-step health audit for Raft clusters: clock drift, fsync latency, quorum counts, and snapshots.',
          targetTakeaway: 'Fsync stalls and election timeout misconfigurations cause premature leader failovers.',
          hookIdea: 'A 4-step checklist to diagnose stuck consensus and leader flap in Raft clusters:',
          suggestedExampleOrAnalogy: 'Heartbeat RTT vs election timeout ratios.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'Mathematical latency ceilings of distributed consensus protocols.',
          targetTakeaway: 'Speed of light bounds consensus; Raft requires 2 RTTs while Multi-Paxos achieves 1 RTT steady-state.',
          hookIdea: 'The mathematical latency ceiling of distributed consensus: Raft vs Multi-Paxos:',
          suggestedExampleOrAnalogy: 'Cross-datacenter WAN round-trips.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'generic corporate filler'],
      keyPointsToEmphasize: ['Quorum majority N/2 + 1', 'Raft term numbers and PreVote', 'Fsync write-ahead logging'],
    };
  }

  if (t.includes('recursion')) {
    return {
      topic,
      targetAudiencePainPoint: 'Beginners struggle with recursion because human intuition naturally models linear iteration rather than paused call stack unwinding.',
      coreInsight: 'Recursion breaks complex problems into self-similar subproblems; understanding stack frames and base cases makes recursive thinking intuitive.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'Step-by-step breakdown of call stack frames, base cases, and function unwinding.',
          targetTakeaway: 'Every recursive call pushes a stack frame; base cases are the mathematical stopping condition that prevents stack overflow.',
          hookIdea: 'Why beginners struggle with recursion—and how visualizing the call stack makes it click instantly:',
          suggestedExampleOrAnalogy: 'Stack of cafeteria trays where each tray represents a paused function call.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Challenging the dogma that recursion is always slower or worse than loops.',
          targetTakeaway: 'Hierarchical data structures like trees and ASTs are naturally modeled by recursion, reducing bug-prone state management.',
          hookIdea: 'Stop converting every recursive function into an imperative while loop.',
          suggestedExampleOrAnalogy: 'Tree traversal in 5 lines of recursion vs 40 lines of manual stack tracking.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'Debugging a production stack overflow caused by a missing edge-case base condition.',
          targetTakeaway: 'Cyclic graph references without a visited set will exhaust call stack memory in milliseconds.',
          hookIdea: 'How an innocent recursive JSON serializer crashed a microservice with a RangeError: Maximum call stack size exceeded:',
          suggestedExampleOrAnalogy: 'Circular object references in deeply nested enterprise configurations.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: '3-step mental recipe for designing rock-solid recursive algorithms without bugs.',
          targetTakeaway: 'Base case first, recursive step with strictly smaller input, and stack depth bounds.',
          hookIdea: 'A 3-step mental recipe for writing recursive functions that never crash:',
          suggestedExampleOrAnalogy: '1. Base case guard -> 2. Problem reduction -> 3. Return composition.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'Memory and architectural trade-offs: call stack space vs tail-call optimization.',
          targetTakeaway: 'O(d) auxiliary stack memory is the real trade-off of recursion in environments without tail-call elimination.',
          hookIdea: 'The hidden memory cost of recursion: How each stack frame consumes hardware memory:',
          suggestedExampleOrAnalogy: 'Comparing 1,000 stack frames (8 KB each) to single-frame iterative accumulators.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'generic corporate filler'],
      keyPointsToEmphasize: ['Call stack memory', 'Base case termination', 'Tree traversal elegance'],
    };
  }

  if (t.includes('git')) {
    return {
      topic,
      targetAudiencePainPoint: 'Engineers memorize basic push and pull commands without understanding the DAG snapshot model, making merge conflicts terrifying.',
      coreInsight: 'Git is a content-addressable object store modeling repository history as a directed acyclic graph of immutable snapshots.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'How Git actually stores data: Blobs, Trees, Commits, and SHA-1 hashes.',
          targetTakeaway: 'Git stores complete snapshots, not file diffs; branches are merely 41-byte pointer files.',
          hookIdea: 'Git does not store file differences. It stores snapshots in a Directed Acyclic Graph:',
          suggestedExampleOrAnalogy: 'Inspecting .git/objects to see raw blob compression and tree references.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Why squash merging harms long-term codebase archaeology and debugging.',
          targetTakeaway: 'Preserving meaningful atomic commits enables git bisect to pinpoint bugs in seconds.',
          hookIdea: 'Why squashing all commits into one giant blob destroys Git most powerful debugging superpower:',
          suggestedExampleOrAnalogy: 'Running git bisect across 200 clean commits vs hitting a single 4,000-line squash commit.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'How an engineer recovered deleted uncommitted work using git reflog and dangling commits.',
          targetTakeaway: 'Git almost never deletes committed data; git reflog is an immutable safety net.',
          hookIdea: 'How an engineer recovered a deleted production branch in 90 seconds using git reflog:',
          suggestedExampleOrAnalogy: 'Tracing commit SHAs in the reference log after an accidental hard reset.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: '4-step binary search debugging protocol using git bisect.',
          targetTakeaway: 'Automated bisect testing isolates the exact breaking commit in log2(N) steps.',
          hookIdea: 'How to find the exact commit that broke production in under 2 minutes with git bisect:',
          suggestedExampleOrAnalogy: 'Marking git bisect good/bad and automating with npm test.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'Distributed version control economics: local integrity vs centralized single points of failure.',
          targetTakeaway: 'Every clone contains complete historical integrity, enabling offline commits and cryptographic audits.',
          hookIdea: 'Why Linus Torvalds designed Git as distributed rather than centralized: The architectural math:',
          suggestedExampleOrAnalogy: 'Local zero-latency commit hashing vs remote network round-trips.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'generic corporate filler'],
      keyPointsToEmphasize: ['Directed Acyclic Graph (DAG)', 'Commit snapshots vs diffs', 'Git bisect and reflog safety'],
    };
  }

  if (t.includes('sleep') || t.includes('productivity')) {
    return {
      topic,
      targetAudiencePainPoint: 'High-performing professionals treat sleep as an optional negotiation rather than a biological cognitive necessity.',
      coreInsight: 'Sleep is the brain’s glymphatic waste clearance and memory consolidation engine; cutting sleep degrades prefrontal executive function.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'The neurobiology of sleep: Slow-wave glymphatic clearance and REM memory consolidation.',
          targetTakeaway: 'During deep sleep, cerebrospinal fluid flow clears metabolic waste proteins like beta-amyloid.',
          hookIdea: 'Here is what actually happens inside your brain during non-REM slow-wave sleep:',
          suggestedExampleOrAnalogy: 'Glymphatic channels expanding by 60% to flush neurotoxins.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Challenging the myth that caffeine can replace lost restorative sleep.',
          targetTakeaway: 'Caffeine merely blocks adenosine A1 receptors; it does not clear metabolic sleep debt.',
          hookIdea: 'Caffeine does not give you energy. It only temporarily blinds your brain to how tired it actually is:',
          suggestedExampleOrAnalogy: 'Adenosine molecules continuing to accumulate behind caffeine-blocked receptors.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'Clinical cognitive research on how 6-hour sleep restrictions double decision error rates.',
          targetTakeaway: 'Chronic sleep restriction degrades executive function as severely as legal alcohol intoxication.',
          hookIdea: 'How a clinical study on sleep restriction revealed the dangerous illusion of habituation:',
          suggestedExampleOrAnalogy: 'Participants rating themselves "fine" while cognitive reaction tests degraded by 400%.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: '4-step protocol to optimize sleep architecture: circadian light cues, thermal drop, and timing.',
          targetTakeaway: 'Morning sunlight and evening core body temperature drop govern melatonin release.',
          hookIdea: 'A 4-step protocol backed by neuroscience to dramatically improve deep sleep quality:',
          suggestedExampleOrAnalogy: 'Morning photon exposure within 30 minutes of waking and a 1-degree core temp drop.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'The cognitive latency penalty of sleep deprivation on technical problem solving.',
          targetTakeaway: 'Prefrontal cortex working memory and impulse control degrade rapidly under 7 hours of sleep.',
          hookIdea: 'The cognitive latency penalty: Measuring how sleep debt degrades problem-solving speed:',
          suggestedExampleOrAnalogy: 'Comparing working memory span and logical error rates between 8h vs 6h sleepers.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'generic wellness fluff'],
      keyPointsToEmphasize: ['Glymphatic clearance', 'Adenosine accumulation', 'Hippocampal memory consolidation'],
    };
  }

  if (t.includes('espresso') || t.includes('coffee')) {
    return {
      topic,
      targetAudiencePainPoint: 'Coffee enthusiasts pull erratic, sour or bitter espresso shots without understanding extraction hydraulics and solubles chemistry.',
      coreInsight: 'Espresso extraction balances 9 bars of hydraulic pressure, 90–96°C water, and coffee puck resistance to target an 18–22% extraction yield.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'Step-by-step physics of espresso extraction: 9 bar pressure, portafilter puck resistance, and crema formation.',
          targetTakeaway: 'Pressurized water emulsifies insoluble coffee oils and dissolves aromatic solids into a rich suspension.',
          hookIdea: 'How a mechanical espresso machine extracts coffee: The physics of 9 bars of pressure and puck resistance:',
          suggestedExampleOrAnalogy: 'Water forced at 9 atmospheres through a compacted bed of ground coffee beans.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Why grinding finer often leads to sour, under-extracted espresso due to channeling.',
          targetTakeaway: 'Excessive puck resistance causes water to crack micro-channels, bypassing 80% of the coffee bed.',
          hookIdea: 'Why grinding your coffee finer can actually make your espresso taste more sour, not stronger:',
          suggestedExampleOrAnalogy: 'Micro-fissures in the coffee puck letting pressurized water rush through without extracting.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'How measuring total dissolved solids (TDS) with a refractometer solved an inconsistent cafe workflow.',
          targetTakeaway: 'Measuring extraction yield quantitatively eliminates guesswork in dial-in routines.',
          hookIdea: 'How a specialty cafe resolved erratic espresso shots by measuring refractometer extraction yield:',
          suggestedExampleOrAnalogy: 'Tracking 18g dry dose to 36g liquid espresso across 27 seconds for 20% extraction.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: '4-step dial-in routine: brew ratio, grind calibration, shot timing, and sensory evaluation.',
          targetTakeaway: 'Fix your dose ratio first (1:2), then adjust grind size to hit a 25–30 second extraction target.',
          hookIdea: 'A 4-step barista protocol to dial in any espresso coffee beans with mathematical consistency:',
          suggestedExampleOrAnalogy: '1:2 brew ratio baseline -> grind adjustment -> shot time window -> taste calibration.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'Solubles extraction yield curves: sour acids, sweet carbohydrates, and bitter tannins.',
          targetTakeaway: 'Coffee compounds extract sequentially: sour fruit acids first, sweet sugars middle, astringent tannins last.',
          hookIdea: 'The chemistry of espresso extraction: Why coffee compounds dissolve in strict sequential stages:',
          suggestedExampleOrAnalogy: '18% to 22% optimal extraction yield window balancing brightness against bitterness.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'generic lifestyle filler'],
      keyPointsToEmphasize: ['9 bar hydraulic pressure', 'Puck channeling vs even resistance', '18–22% extraction yield window'],
    };
  }

  if (t.includes('aerodynamic') || t.includes('flight') || t.includes('lift')) {
    return {
      topic,
      targetAudiencePainPoint: 'Students learn oversimplified or incorrect explanations of aerodynamic lift (like equal-transit-time) that contradict physics.',
      coreInsight: 'Aerodynamic lift results from pressure differentials created by curved streamline turning and downward momentum transfer.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'Navier-Stokes and Bernoulli principles: How an airfoil turns airflow downward to generate upward lift.',
          targetTakeaway: 'Wings deflect air downward; by Newton third law and Bernoulli pressure gradients, upward lift is generated.',
          hookIdea: 'How an airplane wing actually generates lift: Why the textbook equal-transit theory is completely wrong:',
          suggestedExampleOrAnalogy: 'Airfoil camber and angle of attack creating low pressure on the upper camber.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Debunking the popular equal transit time myth taught in high school physics.',
          targetTakeaway: 'Air over the top arrives much faster than air below—molecules do not reunite at the trailing edge.',
          hookIdea: 'The most popular physics textbook explanation of airplane flight is mathematically false:',
          suggestedExampleOrAnalogy: 'Wind tunnel pulse smoke showing upper air reaching the trailing edge far before lower air.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'How aerodynamic stall investigation led to leading-edge vortex generators and slats on modern airliners.',
          targetTakeaway: 'Boundary layer flow separation causes catastrophic lift loss when angle of attack exceeds critical limits.',
          hookIdea: 'How aerospace engineers solved boundary layer separation to prevent low-speed stalls:',
          suggestedExampleOrAnalogy: 'Wing slats re-energizing the boundary layer during high angle-of-attack landings.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: '4-step flight dynamics framework: Lift, Weight, Thrust, and Drag equilibrium.',
          targetTakeaway: 'Modulating angle of attack and airspeed directly controls the lift coefficient.',
          hookIdea: 'A 4-step framework for understanding aerodynamic equilibrium in commercial aviation:',
          suggestedExampleOrAnalogy: 'Lift equation: L = 0.5 * rho * v^2 * S * C_L.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'Lift-to-drag ratio polar curves and transonic aerodynamic efficiency.',
          targetTakeaway: 'Induced drag dominates at low speeds while parasitic drag scales quadratically with velocity.',
          hookIdea: 'The lift-to-drag trade-off curve that dictates modern commercial jet airliner design:',
          suggestedExampleOrAnalogy: 'Aspect ratio and swept-wing design balancing wave drag and cruise range.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'generic corporate filler'],
      keyPointsToEmphasize: ['Airflow streamline curvature', 'Pressure gradient differentials', 'Boundary layer separation and stalls'],
    };
  }

  if (t.includes('penicillin') || t.includes('antibiotic')) {
    return {
      topic,
      targetAudiencePainPoint: 'Patients and policymakers misunderstand antibiotic mechanisms, leading to over-prescription and multi-drug resistance.',
      coreInsight: 'Penicillin mimics bacterial peptide precursors to irreversibly inhibit cell wall transpeptidase enzymes, causing osmotic lysis.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'Molecular mechanism of beta-lactam antibiotics: transpeptidase enzyme inhibition and peptidoglycan synthesis.',
          targetTakeaway: 'Penicillin prevents bacteria from cross-linking peptidoglycan cell walls, causing them to burst under osmotic pressure.',
          hookIdea: 'How penicillin destroys bacterial cell walls: The biochemical mechanism of beta-lactam rings:',
          suggestedExampleOrAnalogy: 'Beta-lactam ring binding to penicillin-binding proteins (PBPs) like a jammed lock.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Why antibiotics have zero efficacy against viral infections and why misusing them accelerates resistance.',
          targetTakeaway: 'Viruses lack peptidoglycan cell walls; prescribing antibiotics for viral colds selectively breeds resistant bacteria.',
          hookIdea: 'Why prescribing penicillin for viral colds is not just useless—it actively accelerates superbug evolution:',
          suggestedExampleOrAnalogy: 'Beta-lactamase plasmid transfer between bacterial populations under antibiotic pressure.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'Alexander Fleming discovery of Penicillium notatum and the Oxford team mass production breakthrough.',
          targetTakeaway: 'Serendipitous scientific observation paired with industrial chemical engineering transformed global medicine.',
          hookIdea: 'How a contaminated petri dish in 1928 launched the antibiotic age and saved hundreds of millions of lives:',
          suggestedExampleOrAnalogy: 'Zone of bacterial lysis surrounding Penicillium mold colonies.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: 'Clinical stewardship protocol to minimize antibiotic resistance in healthcare systems.',
          targetTakeaway: 'Targeted narrow-spectrum cultures and complete treatment courses prevent resistant strain selection.',
          hookIdea: 'A 4-step clinical stewardship framework for responsible antibiotic deployment:',
          suggestedExampleOrAnalogy: 'Gram stain identification -> culture sensitivity testing -> narrow-spectrum selection -> compliance.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'The evolutionary arms race between bacterial beta-lactamases and beta-lactamase inhibitors.',
          targetTakeaway: 'Bacteria evolve enzymes to hydrolyze the beta-lactam ring; medicine counters with inhibitors like clavulanic acid.',
          hookIdea: 'The molecular arms race: How bacteria neutralize penicillin and how modern medicine counters back:',
          suggestedExampleOrAnalogy: 'Augmentin combining amoxicillin with clavulanate to inhibit beta-lactamase enzymes.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'generic wellness fluff'],
      keyPointsToEmphasize: ['Peptidoglycan cell wall cross-linking', 'Beta-lactam transpeptidase inhibition', 'Beta-lactamase enzyme resistance'],
    };
  }

  if (t.includes('autonomous') || t.includes('multi-agent') || t.includes('agentic')) {
    return {
      topic,
      targetAudiencePainPoint: 'Teams building AI agents rely on unconstrained prompt chains that hallucinate and degrade over multi-step tasks.',
      coreInsight: 'Production AI agents require deterministic state machine graphs, automated test verifiers, and AST tool boundaries.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'Architecting closed-loop agentic systems: Orchestrator, Subagent delegation, and automated review gates.',
          targetTakeaway: 'Separating research, generation, and critique into discrete agent nodes eliminates context contamination.',
          hookIdea: 'How autonomous multi-agent AI systems actually work: Moving beyond single-prompt chatbots:',
          suggestedExampleOrAnalogy: 'State machine graph orchestrating specialized subagents with deterministic state transitions.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Why adding more agent iterations without hard programmatic validation gates makes content worse, not better.',
          targetTakeaway: 'Iterative refinement without verifiable compiler or linter feedback causes compounding drift.',
          hookIdea: 'Why looping an AI agent 5 times often makes the output worse, not better:',
          suggestedExampleOrAnalogy: 'Critic agents hallucinating new requirements when not constrained by deterministic rule checks.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'How a multi-agent system autonomously diagnosed and patched a complex software regression.',
          targetTakeaway: 'Giving agents tool access to run unit tests locally creates self-healing execution loops.',
          hookIdea: 'How an autonomous multi-agent pipeline investigated and fixed a test suite failure without human intervention:',
          suggestedExampleOrAnalogy: 'Planner delegating to code editor, test runner failing, and agent self-correcting line 42.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: '4-step architecture for building reliable autonomous agent workflows.',
          targetTakeaway: 'Strict schemas, scoped tool permissions, deterministic state graphs, and human diff inspection.',
          hookIdea: 'A 4-step blueprint for building production-grade autonomous agent systems:',
          suggestedExampleOrAnalogy: '1. Scoped inputs -> 2. Isolated subagents -> 3. Deterministic verification -> 4. Diff review.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'Cost and latency economics of closed-loop agent architectures vs manual prompt iteration.',
          targetTakeaway: 'Autonomous feedback loops compress multi-hour human manual tasks into minutes with verifiable correctness.',
          hookIdea: 'The economics of autonomous multi-agent workflows: Latency, token overhead, and verification accuracy:',
          suggestedExampleOrAnalogy: 'Comparing 20 minutes of manual developer copy-pasting to a 45-second closed-loop agent run.',
        },
      ],
      avoidTopics: ['generic corporate hype', 'unsupported claims', 'fabricated statistics'],
      keyPointsToEmphasize: ['Deterministic state machine graphs', 'Automated test feedback loops', 'Subagent task delegation'],
    };
  }

  if (t.includes('thrust') || t.includes('reverser') || (t.includes('jet') && t.includes('engine'))) {
    return {
      topic,
      targetAudiencePainPoint: 'Aviation enthusiasts and students misunderstand reverse thrust as the engine physically spinning backwards or doing all the stopping.',
      coreInsight: 'High-bypass turbofans use translating cowls and blocker doors to redirect bypass airflow forward through cascade vanes, relieving carbon wheel brakes on contaminated runways.',
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: 'The mechanics of high-bypass turbofan reverse thrust: blocker doors, cascade vanes, and cold-stream bypass airflow redirection.',
          targetTakeaway: 'The core engine does not spin backwards; blocker doors route the 80% cold bypass air through angled forward cascade vanes.',
          hookIdea: 'How commercial jet engines generate reverse thrust upon landing (without running backwards):',
          suggestedExampleOrAnalogy: 'CFM56 and GE90 high-bypass turbofans deploying translating cowls and blocker doors.',
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: 'Debunking the myth that reverse thrust stops the aircraft and why it is throttled down at 60 knots.',
          targetTakeaway: 'Carbon wheel brakes and ground spoilers provide 75%+ of stopping power; reverse thrust prevents hydroplaning and must be stowed below 60 knots to prevent FOD.',
          hookIdea: 'Why reverse thrust does NOT stop an airliner—and why pilots must shut it off at 60 knots:',
          suggestedExampleOrAnalogy: 'Wheel brakes vs reverse thrust stopping force and ground vortex debris ingestion.',
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: 'Landing a heavy airliner on a rain-slicked, contaminated runway with reduced braking friction.',
          targetTakeaway: 'Aerodynamic reverse thrust provides crucial deceleration when tire-to-pavement friction drops by 70%.',
          hookIdea: 'How aerodynamic reverse thrust prevented a runway excursion during a winter crosswind landing:',
          suggestedExampleOrAnalogy: 'Landing rollout where wheel brakes lose grip due to dynamic hydroplaning.',
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: 'Cockpit touchdown sequence: main gear compression, spoiler extension, reverse lever interlocks, and 60-knot stowage.',
          targetTakeaway: 'Strict mechanical interlocks prevent in-flight deployment, and low-speed stowing avoids compressor stalls.',
          hookIdea: 'The exact 4-step sequence pilots follow to deploy reverse thrust upon touchdown:',
          suggestedExampleOrAnalogy: 'Weight-on-wheels sensor unlocking reverse thrust piggyback levers.',
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: 'The deceleration physics of reverse thrust: Kinetic energy dissipation rate is proportional to velocity (P = F * v).',
          targetTakeaway: 'Reverse thrust is exponentially more potent at 140 knots than at 70 knots, doing almost all its work in the first 5 seconds.',
          hookIdea: 'The deceleration physics of reverse thrust: Why it does 80% of its work in the first 5 seconds of rollout:',
          suggestedExampleOrAnalogy: 'Rate of kinetic energy dissipation scaling with forward ground speed.',
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'generic corporate filler', 'software analogies'],
      keyPointsToEmphasize: ['Blocker doors and cascade vanes', 'Cold-stream bypass redirection', 'Wheel brakes vs aerodynamic braking', '60-knot FOD cutoff'],
    };
  }

  // General / Fallback for arbitrary user topics: Dynamically powered by research if available
  if (research && research.summary) {
    const p1 = research.keyPoints?.[0] || `Core principles and governing mechanisms of ${norm}`;
    const p2 = research.keyPoints?.[1] || `Key operational distinctions and nuances in ${norm}`;
    const p3 = research.keyPoints?.[2] || `Practical methodologies and implementation guidelines for ${norm}`;
    const caution = research.cautions?.[0] || `Common misconceptions or edge cases in ${norm}`;
    const fact1 = research.facts?.[0]?.claim || `Verifiable empirical findings regarding ${norm}`;
    const fact2 = research.facts?.[1]?.claim || `Quantitative boundaries and trade-offs observed in ${norm}`;
    const example1 = research.relevantExamples?.[0] || `Real-world application of ${norm}`;

    return {
      topic,
      targetAudiencePainPoint: `Professionals often encounter surface-level explanations of ${norm} that omit its governing principles and real-world constraints.`,
      coreInsight: research.summary,
      angles: [
        {
          id: 'angle_educational',
          name: 'Educational',
          description: `Detailed technical explanation of ${norm}: ${p1}`,
          targetTakeaway: `Understanding the primary mechanisms of ${norm} provides a solid conceptual foundation.`,
          hookIdea: `Understanding ${norm}: How its core principles and mechanisms operate in practice:`,
          suggestedExampleOrAnalogy: example1,
        },
        {
          id: 'angle_contrarian',
          name: 'Contrarian / Question-Driven',
          description: `Challenging conventional assumptions about ${norm}: ${caution}`,
          targetTakeaway: `Respecting non-obvious constraints in ${norm} prevents common operational errors.`,
          hookIdea: `Why standard advice about ${norm} often fails when tested against real-world conditions:`,
          suggestedExampleOrAnalogy: fact1,
        },
        {
          id: 'angle_storytelling',
          name: 'Storytelling / Case Study',
          description: `A concrete scenario or case investigation examining ${norm}.`,
          targetTakeaway: `Systematic problem isolation based on core domain facts resolves complex issues.`,
          hookIdea: `A case study in ${norm}: How analyzing real-world behavior revealed the root cause:`,
          suggestedExampleOrAnalogy: fact1,
        },
        {
          id: 'angle_practical',
          name: 'Practical / Step-by-Step',
          description: `Actionable implementation protocol and best practices for ${norm}: ${p3}`,
          targetTakeaway: `Disciplined step-by-step execution ensures consistency and avoids known pitfalls.`,
          hookIdea: `A step-by-step implementation and diagnostic guide for ${norm}:`,
          suggestedExampleOrAnalogy: example1,
        },
        {
          id: 'angle_insight',
          name: 'Insight-Driven',
          description: `Key trade-offs and quantitative constraints governing ${norm}: ${fact2}`,
          targetTakeaway: `Every system involves balancing core constraints and trade-offs.`,
          hookIdea: `The fundamental trade-offs and operational constraints that govern ${norm}:`,
          suggestedExampleOrAnalogy: fact2,
        },
      ],
      avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'fabricated statistics'],
      keyPointsToEmphasize: [p1, p2, caution],
    };
  }

  // General fallback when research is absent
  return {
    topic,
    targetAudiencePainPoint: `Professionals often encounter surface-level descriptions of ${norm} without understanding its governing principles.`,
    coreInsight: `True understanding of ${norm} comes from examining its primary components, governing forces, and domain constraints.`,
    angles: [
      {
        id: 'angle_educational',
        name: 'Educational',
        description: `Step-by-step explanation of the core principles governing ${norm}.`,
        targetTakeaway: `Understanding foundational mechanics clarifies how ${norm} functions.`,
        hookIdea: `How ${norm} functions at a fundamental level: The core principles explained:`,
        suggestedExampleOrAnalogy: `Component interactions and governing laws of ${norm}.`,
      },
      {
        id: 'angle_contrarian',
        name: 'Contrarian / Question-Driven',
        description: `Challenging common superficial misconceptions about ${norm}.`,
        targetTakeaway: `Non-obvious constraints dictate real-world outcomes far more than naive assumptions.`,
        hookIdea: `The most common misconception about ${norm} and why it falls apart in practice:`,
        suggestedExampleOrAnalogy: `Real-world boundary conditions and operational limits.`,
      },
      {
        id: 'angle_storytelling',
        name: 'Storytelling / Case Study',
        description: `A realistic scenario where an operational challenge in ${norm} was systematically resolved.`,
        targetTakeaway: `Systematic analysis of core factors resolves complex domain challenges.`,
        hookIdea: `A case study in ${norm}: How investigating real-world behavior resolved a critical challenge:`,
        suggestedExampleOrAnalogy: `Tracing root cause factors through systematic diagnostic steps.`,
      },
      {
        id: 'angle_practical',
        name: 'Practical / Step-by-Step',
        description: `Actionable step-by-step framework for implementing and evaluating ${norm}.`,
        targetTakeaway: `Ordered verification, parameter calibration, and testing ensure reliable results.`,
        hookIdea: `A practical framework for mastering ${norm} in real-world environments:`,
        suggestedExampleOrAnalogy: `Baseline calibration, parameter tuning, and verification checkpoints.`,
      },
      {
        id: 'angle_insight',
        name: 'Insight-Driven',
        description: `Core performance trade-offs and operational constraints governing ${norm}.`,
        targetTakeaway: `Effective practitioners understand the structural trade-offs of ${norm}.`,
        hookIdea: `The fundamental trade-offs and constraints that govern ${norm}:`,
        suggestedExampleOrAnalogy: `Balancing competing forces and resource constraints in ${norm}.`,
      },
    ],
    avoidTopics: ['AI agents', 'prompt engineering', 'ContentForge', 'fabricated statistics'],
    keyPointsToEmphasize: [`Core mechanics of ${norm}`, 'Domain constraints', 'Empirical trade-offs'],
  };
}

// =========================================================================
// 2. LINKEDIN POSTS MOCKS (WITH 5 MANDATORY CATEGORIES & ZERO FILLER)
// =========================================================================
export function getMockLinkedInPosts(
  topic: string,
  tone: string = 'Professional',
  iteration: number = 1,
  isRevision: boolean = false,
  research?: ResearchResult,
  strategy?: ContentStrategy
): LinkedInOutput {
  const t = topic.toLowerCase();
  const norm = normalizeTopic(topic);

  // 1. CPU Instruction Execution
  if (t.includes('cpu') || t.includes('instruction')) {
    const isRev = isRevision || iteration > 1;
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Foundational Hardware Mechanics',
          hook: 'Every line of high-level code you write eventually boils down to three physical steps in silicon: Fetch, Decode, and Execute.',
          body: isRev
            ? 'Here is what happens inside a processor during a single clock cycle under real-world execution constraints:\n\n1. Fetch: The Program Counter (PC) holds the 64-bit RAM or L1 cache address of the next instruction. The bus interface fetches those binary bits into the Instruction Register (IR).\n\n2. Decode: The Control Unit slices the opcode bits from the operand fields. It activates the exact electrical pathways and source registers needed for the instruction.\n\n3. Execute: If it is arithmetic, the Arithmetic Logic Unit (ALU) computes the result and sets status flags (Zero, Carry, Overflow). If it is memory access, the Memory Management Unit (MMU) computes virtual-to-physical address translation.\n\n4. Write-Back: The output latches into a destination register or write buffer.\n\nModern CPUs overlap dozens of these steps across a 14–20 stage pipeline at 4+ billion cycles per second.'
            : 'Here is what happens inside a processor during a single clock cycle:\n\n1. Fetch: The Program Counter (PC) holds the 64-bit RAM or L1 cache address of the next instruction. The bus interface fetches those binary bits into the Instruction Register (IR).\n\n2. Decode: The Control Unit slices the opcode bits from the operand fields. It activates the exact electrical pathways and source registers needed for the instruction.\n\n3. Execute: If it is arithmetic, the Arithmetic Logic Unit (ALU) computes the result and sets status flags (Zero, Carry, Overflow). If it is memory access, the Memory Management Unit (MMU) computes virtual-to-physical address translation.\n\n4. Write-Back: The output latches into a destination register or write buffer.\n\nModern CPUs overlap dozens of these steps across a 14–20 stage pipeline at 4+ billion cycles per second.',
          cta: 'Understanding instruction pipelining changes how you optimize inner loops.',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'Challenging Sequential Execution Models',
          hook: isRev
            ? 'Why do modern CPU instructions almost never execute in the order written by your compiler? Measuring speculative execution penalties:'
            : 'Why do modern CPU instructions almost never execute in the order written by your compiler?',
          body: isRev
            ? 'Beginning programmers assume processors read machine code strictly top-to-bottom like a script.\n\nIn modern out-of-order execution (OoO) engines, instructions enter a 512-entry reservation station queue. While Instruction A stalls for 200 clock cycles on a DRAM cache miss, speculative execution units evaluate independent instructions B and C across 4 ALU ports.\n\nHowever, if a conditional branch mispredicts, the CPU flushes the Reorder Buffer (ROB), wasting up to 40 in-flight instructions and stalling pipelines for 15–20 clock cycles.\n\nRaw clock speed is meaningless if your instructions spend 40% of their cycles waiting on memory stalls.'
            : "Beginning programmers assume processors read machine code strictly top-to-bottom like a script.\n\nIn modern out-of-order execution (OoO) engines, instructions enter a reservation station queue. While Instruction A is stalled waiting 200 clock cycles for data from main memory, the CPU's speculative execution engine scans ahead, identifies independent instructions (B and C), and executes them immediately on idle execution ports.\n\nIf a conditional branch was mispredicted, the CPU rolls back the speculative register state using the Reorder Buffer (ROB).\n\nRaw clock speed is meaningless if your instructions spend half their cycles waiting on memory stalls.",
          cta: 'How does memory alignment impact branch prediction in your performance-critical services?',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'Branch Predictor Pipeline Stalls',
          hook: 'How an innocent conditional branch inside an image rendering loop cut throughput by 6x due to CPU branch mispredictions:',
          body: 'An engineering team was processing pixel arrays with a simple filter:\n`if (pixel[i] > 128) { applyTransform(pixel[i]); }`\n\nWhen the input array was unsorted, processing took 11.4 seconds. When the exact same array was pre-sorted, processing took only 1.9 seconds—a 6x speedup on identical mathematical operations.\n\nWhy? Because modern CPU instruction pipelines rely on the Branch Target Buffer (BTB) to predict if/else jumps. On unsorted data, the branch predictor failed ~50% of the time, forcing the CPU to flush its entire 16-stage pipeline and discard in-flight work on every misprediction.\n\nSorting the data allowed the predictor to achieve 99% accuracy, keeping execution units saturated.',
          cta: 'Branchless programming techniques can double throughput in tight loops without touching hardware.',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: 'Hardware-Sympathetic Code Framework',
          hook: isRev
            ? 'A 4-step framework for hardware-sympathetic code with concrete parameters and pitfalls:'
            : 'A 4-step mental framework for writing hardware-sympathetic code that aligns with the CPU execution cycle:',
          body: isRev
            ? '1. Minimize Pipeline Flushes with Branchless Logic\nReplace erratic if/else checks inside hot loops with bitwise operations or `cmov` instructions to avoid the 15-cycle branch penalty.\n\n2. Align Data Structures to 64-Byte Cache Lines\nUse compiler alignment directives (`alignas(64)` in C/C++) to prevent split-cache line reads across 64-byte boundaries.\n\n3. Leverage Data-Parallel SIMD Instructions\nVectorize loops with 256-bit AVX-2 instructions to process eight 32-bit integers per clock cycle.\n\n4. Avoid False Sharing on Multithreaded Writes\nEnsure variables updated concurrently by different CPU cores reside on distinct 64-byte cache lines to prevent ping-pong bus invalidations.'
            : '1. Minimize Pipeline Flushes with Branchless Logic\nReplace erratic if/else checks inside hot loops with bitwise arithmetic or conditional moves (`cmov`), keeping the execution pipeline filled.\n\n2. Align Data Structures with 64-Byte Cache Lines\nEnsure structs match CPU cache line boundaries to avoid split memory transactions across multiple cache lines.\n\n3. Leverage Data-Parallel SIMD Instructions\nStructure loops so compilers can auto-vectorize operations into 256-bit AVX or 128-bit NEON registers, executing 4–8 operations per clock cycle.\n\n4. Prefer Sequential Memory Traversal\nCPUs feature hardware prefetchers that anticipate contiguous memory strides, bringing data into L1 cache before the Fetch stage even asks for it.',
          cta: 'Save this checklist for your next systems performance audit.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'Nanosecond Hardware Latency Hierarchy',
          hook: 'Here is the nanosecond latency hierarchy that dictates whether your CPU runs at peak gigahertz speed or sits idle:',
          body: 'To understand why instruction execution speed is dominated by memory hierarchy, examine the clock cycle penalties:\n\n• CPU Registers: 0.5 nanoseconds (0 clock cycles delay)\n• L1 Data Cache: ~1 nanosecond (4 clock cycles)\n• L2 Cache: ~4 nanoseconds (12 clock cycles)\n• L3 Shared Cache: ~15 nanoseconds (40 clock cycles)\n• Main RAM (DDR5): ~60–80 nanoseconds (200+ clock cycles stall)\n• NVMe SSD read: ~10,000–50,000 nanoseconds\n\nEvery time an instruction requires data that misses cache and hits RAM, the CPU sits idle for up to 200 clock cycles. Writing fast software is less about minimizing instructions and more about keeping execution registers fed.',
          cta: 'What profiling tools do you use to detect CPU cache misses and pipeline stalls in production?',
        },
      ],
    };
  }

  // 2. Binary Search in C
  if (t.includes('binary search')) {
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Midpoint Invariant & Overflow Safety',
          hook: 'Binary search looks deceptively simple in C—until you realize it took computer scientists over two decades to publish a bug-free implementation.',
          body: 'The classic midpoint calculation `mid = (low + high) / 2` contains a subtle integer overflow bug. If `low + high` exceeds `INT_MAX` (2,147,483,647), the sum wraps to a negative integer, causing an out-of-bounds array access.\n\nThe mathematically identical C fix:\n`int mid = low + (high - low) / 2;`\n\nHow binary search executes in C:\n1. Maintain inclusive bounds `low = 0` and `high = n - 1` over a sorted array.\n2. In each iteration, evaluate `arr[mid]`.\n3. If `arr[mid] == target`, return `mid`.\n4. If `arr[mid] < target`, discard the left half by setting `low = mid + 1`.\n5. If `arr[mid] > target`, discard the right half by setting `high = mid - 1`.\n\nEach comparison halves the search space, reducing an n-element search to O(log n) comparisons.',
          cta: 'Always use low + (high - low) / 2 when calculating midpoints in systems code.',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'Cache Line Realities vs Asymptotic Scaling',
          hook: 'Why a linear scan can be faster than binary search in C for arrays under 64 elements:',
          body: 'On paper, O(log n) always beats O(n).\n\nIn reality, modern x86 and ARM CPUs feature 64-byte cache lines and aggressive sequential hardware prefetchers. When you iterate sequentially through a small array of 32 integers, the entire array fits inside a single cache line. A linear loop scans it in continuous L1 cache with zero branch mispredictions.\n\nBinary search, conversely, jumps across memory (`low`, `mid`, `high`), hopping across cache lines and causing pointer jumps that stall the CPU pipeline.\n\nTheoretical Big-O notation measures asymptotic scaling toward infinity. On silicon, cache locality and branch predictor friendliness dominate small datasets.',
          cta: 'Benchmark small collection thresholds before replacing linear scans with binary search.',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'The 20-Year Integer Overflow Bug',
          hook: 'How Joshua Bloch discovered the 20-year-old binary search overflow bug that affected standard C and Java libraries:',
          body: 'In 2006, Joshua Bloch demonstrated that nearly every textbook binary search implementation written since the 1960s—including the JDK and multiple standard C utilities—contained a catastrophic bug.\n\nWhen array sizes exceeded 1 billion elements (common in modern 64-bit address spaces), `(low + high)` wrapped into negative integers, causing `ArrayIndexOutOfBoundsException` or memory segmentation faults in C.\n\nThe bug went undetected for decades because test suites only tested small arrays where `low + high` never approached `2^31 - 1`.\n\nThe lesson: Mathematical elegance in algorithms does not protect you from finite word-length hardware constraints in compiled languages like C.',
          cta: 'Never test algorithms with small inputs alone; always test maximum integer boundary conditions.',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: 'Production-Grade C Implementation',
          hook: 'Production-grade, overflow-safe binary search implementation in C using standard library conventions:',
          body: 'Here is the robust C implementation:\n\n```c\n#include <stddef.h>\n\nssize_t binary_search(const int *arr, size_t n, int target) {\n    if (arr == NULL || n == 0) return -1;\n    size_t low = 0;\n    size_t high = n - 1;\n    \n    while (low <= high) {\n        size_t mid = low + (high - low) / 2;\n        if (arr[mid] == target) return (ssize_t)mid;\n        if (arr[mid] < target) {\n            low = mid + 1;\n        } else {\n            if (mid == 0) break;\n            high = mid - 1;\n        }\n    }\n    return -1;\n}\n```\n\nKey details:\n1. Uses `size_t` for array indices to support full 64-bit memory spaces.\n2. Guards against `mid == 0` before decrementing `high` to prevent unsigned integer underflow.\n3. Returns `ssize_t` to allow `-1` as a distinct error code.',
          cta: 'Bookmark this snippet for writing safe index calculations in C and C++.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'Comparison Scaling Curve',
          hook: 'Comparing search performance in C: Linear O(n) vs Binary Search O(log n) across array sizes:',
          body: 'Here is the exact comparison count required to search sorted integer arrays:\n\n• Array size 1,024 elements:\n  - Linear Scan: Up to 1,024 comparisons (average 512)\n  - Binary Search: Maximum 10 comparisons\n\n• Array size 1,048,576 elements (1 million):\n  - Linear Scan: Up to 1,048,576 comparisons\n  - Binary Search: Maximum 20 comparisons\n\n• Array size 1,073,741,824 elements (1 billion):\n  - Linear Scan: Up to 1.07 billion comparisons (seconds to minutes)\n  - Binary Search: Maximum 30 comparisons (~15 nanoseconds)\n\nAt 1 billion items, binary search requires only 30 memory probes. The precondition, however, is that the array must remain sorted—incurring an O(n log n) sorting cost upfront.',
          cta: 'If you query frequently and update rarely, sorting once and binary searching is unbeatable.',
        },
      ],
    };
  }

  // 3. Google Antigravity
  if (t.includes('antigravity')) {
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Closed-Loop Agentic Pair Programming',
          hook: 'Autonomous coding agents are moving beyond chat interfaces into closed-loop agentic execution—and Google Antigravity is built around this exact shift.',
          body: 'Traditional coding assistants require users to copy-paste code, fix compile errors manually, and endlessly re-prompt. Google Antigravity inverts this dynamic:\n\n1. Deep Context Grounding: Antigravity indexes your repository structure, AST symbols, dependencies, and test configurations before writing a single line of code.\n\n2. Deterministic Tool Execution: Instead of guessing file modifications, the agent uses structured tools (`view_file`, `replace_file_content`, `run_command`) to inspect and edit code directly in your local environment.\n\n3. Autonomous Verification Loops: The agent runs test runners (`vitest`, `pytest`, `cargo test`) and type checkers after every edit, diagnosing failures and self-correcting autonomously.\n\nIt transforms AI from an autocomplete suggestion into an active pair programmer.',
          cta: 'What development tasks do you find benefit most from autonomous verification loops?',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'Correctness Over Generation Speed',
          hook: 'Why generating code is the easiest part of AI development—and why verification is where most AI tools fail:',
          body: 'Most AI coding tools boast about how many lines of code they generate per second.\n\nIn professional software engineering, generating code is rarely the bottleneck. The real bottleneck is correctness, regression prevention, integration testing, and maintaining system invariants.\n\nAntigravity is designed around test-driven validation loops: it does not declare a task complete until tests pass, static analysis succeeds, and edge cases are verified. It replaces prompt iteration with automated agentic refinement.',
          cta: 'Would you rather have 500 lines of unverified code or 50 lines of tested, working code?',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'Automated Migration Case Study',
          hook: 'How an agentic refactoring workflow eliminated hours of manual debugging during a breaking API upgrade:',
          body: 'During a major framework migration, an engineering team faced 42 breaking schema changes across 18 backend service modules.\n\nUsing an autonomous agent pipeline, the team provided the target interface schema and test suite. The agent:\n- Inspected every affected file systematically.\n- Updated call signatures and return types.\n- Executed the test runner after each module edit.\n- Fixed 7 compile errors and 3 edge-case type mismatches autonomously without human re-prompting.\n\nThe entire migration finished in 25 minutes with full regression test coverage, freeing the team to focus on core business logic.',
          cta: 'How much time does your team spend manually chasing down mechanical compile errors during upgrades?',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: 'Agentic Workflow Best Practices',
          hook: 'A 4-step framework for maximizing productivity with Google Antigravity in your engineering workflow:',
          body: '1. Anchor Tasks with Test Specifications\nWrite unit test assertions or acceptance criteria before launching the agent. Agents excel when given unambiguous verification signals.\n\n2. Provide Clear Scope Boundaries\nSpecify exact file paths and modules to modify, preventing unnecessary architectural drift across the workspace.\n\n3. Leverage Subagent Delegation for Deep Research\nOffload wide codebase investigations to specialized research subagents while keeping the primary agent focused on implementation.\n\n4. Inspect Autonomous Diff Trails\nReview git diffs and test logs generated by the agent before committing to master.',
          cta: 'Try this test-first workflow on your next refactoring task.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'Developer Context-Switching Economics',
          hook: 'The productivity math behind closed-loop AI agents vs manual copy-paste prompting:',
          body: 'Analyzing developer interaction patterns reveals the hidden tax of traditional AI chat:\n\n• Traditional AI Chat:\n  - 3–5 manual prompt revisions\n  - Copying diffs into IDE\n  - Manual build/test execution\n  - Copying stack traces back to chat\n  - Total developer context switching: 15–20 minutes per feature\n\n• Closed-Loop Agentic Execution:\n  - Single specification prompt\n  - Autonomous file edits, test execution, and stack trace diagnosis\n  - Developer reviews completed diff and test results\n  - Total developer context switching: < 2 minutes\n\nThe highest leverage comes from eliminating the human in the loop as the manual copy-paste bridge.',
          cta: 'How does eliminating prompt iteration impact your daily engineering flow?',
        },
      ],
    };
  }

  // 4. Merge Sort Time Complexity
  if (t.includes('merge sort')) {
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Recurrence Proof & Master Theorem',
          hook: 'Merge sort is one of the few sorting algorithms that guarantees O(n log n) time complexity across every single case—best, average, and worst.',
          body: 'The algorithm uses divide-and-conquer:\n\n1. Divide: Recursively split the array of size n into two halves of size n/2 until sub-arrays have length 1. Dividing an array in half repeatedly takes log2(n) levels.\n\n2. Conquer & Merge: At each of the log2(n) levels, merge pairs of sorted sub-arrays by comparing elements sequentially. Merging two sorted lists of total size n takes exactly O(n) comparisons and copies.\n\nUsing the Master Theorem on the recurrence relation `T(n) = 2T(n/2) + O(n)`:\nHere, a = 2, b = 2, and f(n) = O(n). Since log2(2) = 1, we match Case 2, yielding exactly `T(n) = Θ(n log n)`.\n\nUnlike QuickSort, Merge Sort has no worst-case O(n^2) degradation.',
          cta: 'What sorting algorithm does your programming language use under the hood?',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'Memory Allocation vs Theoretical Speed',
          hook: 'If Merge Sort is guaranteed O(n log n) in all cases, why does standard C and C++ std::sort default to QuickSort instead?',
          body: 'It seems counter-intuitive: QuickSort has a worst-case of O(n^2), while Merge Sort is always O(n log n).\n\nYet production systems default to QuickSort or IntroSort for two physical reasons:\n\n1. Memory Overhead: Merge Sort requires O(n) auxiliary memory buffer to merge elements, allocating extra RAM. QuickSort sorts in-place with O(log n) stack space.\n\n2. Cache Locality: QuickSort partitions elements in contiguous memory. Merge Sort repeatedly copies back and forth between temporary buffers and the source array, causing double the memory bus traffic and cache evictions.\n\nTheoretical Big-O bounds hide constant factors and memory allocation costs.',
          cta: 'When is O(n) extra memory acceptable for the guarantee of stability and predictable latency?',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'Why Python & Java Chose Timsort',
          hook: "Why Python's list.sort() and Java's Arrays.sort() chose Timsort (an adaptive Merge Sort variant) over QuickSort:",
          body: 'When Tim Peters designed Timsort for Python in 2002, he examined real-world datasets across production applications.\n\nHe discovered that real data is rarely randomly shuffled—it often contains pre-existing sorted runs (e.g. timestamps, logs, alphabetized names).\n\nBy enhancing Merge Sort to detect naturally occurring sorted runs and using minimal temporary storage, Timsort achieves:\n- O(n) linear time on already-sorted or partially sorted data\n- O(n log n) worst-case time\n- Strict stability (equal elements retain their original order)\n\nFor object references where stability matters and comparisons are expensive, adaptive Merge Sort easily outperforms QuickSort.',
          cta: 'Stability in sorting is critical when sorting records by multiple consecutive keys.',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: 'Algorithm Selection Matrix',
          hook: 'A 3-step decision heuristic for determining when to choose Merge Sort over QuickSort or HeapSort:',
          body: '1. Does Your Data Require Stable Ordering?\nIf sorting multi-column records (e.g. sort by user ID, then by timestamp), Merge Sort preserves existing relative order for equal elements. Standard QuickSort does not.\n\n2. Are You Sorting Linked Lists or Streams?\nMerge Sort operates on linked lists with O(1) auxiliary space and zero random access, making it ideal for disk-based or streaming data.\n\n3. Can Your Environment Allocate O(n) Buffer Space?\nIf memory is constrained (embedded systems, microcontrollers), avoid Merge Sort due to its O(n) auxiliary allocation and choose HeapSort instead.',
          cta: 'Save this selection matrix for your next systems architecture review.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'Empirical Resource Comparison',
          hook: 'Comparing sorting complexity and hardware characteristics across 10,000,000 items:',
          body: 'Here is the architectural comparison between major sorting algorithms for 10 million 64-bit records (~80 MB data):\n\n• Merge Sort:\n  - Time Complexity: O(n log n) guaranteed (~233 million operations)\n  - Auxiliary Memory: 80 MB extra allocation\n  - Stability: Strictly stable\n  - CPU Cache: Moderate (buffer copy overhead)\n\n• QuickSort:\n  - Time Complexity: O(n log n) average, O(n^2) worst case\n  - Auxiliary Memory: O(log n) stack space (< 1 KB)\n  - Stability: Unstable\n  - CPU Cache: Outstanding (in-place partitioning)\n\n• HeapSort:\n  - Time Complexity: O(n log n) guaranteed\n  - Auxiliary Memory: O(1) in-place\n  - Stability: Unstable\n  - CPU Cache: Poor (jumps between tree parent/children indices)\n\nAlgorithm choice is an engineering trade-off between memory footprint, latency predictability, and cache locality.',
          cta: 'How does your team evaluate algorithmic trade-offs when memory is constrained?',
        },
      ],
    };
  }

  // 5. Personal Expense Tracker
  if (t.includes('expense') || t.includes('tracker')) {
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Data Modeling & Ledger Architecture',
          hook: 'Most beginner expense trackers fail because they model transactions as simple lists instead of structured ledgers.',
          body: 'If you want to build an expense tracker that remains maintainable as your finances grow, structure it with three foundational layers:\n\n1. Transaction Schema: A transaction is not just an amount and string label. It requires: `id` (UUID), `timestamp` (ISO-8601 with timezone), `amount` (stored as integer cents to avoid floating-point inaccuracies), `currency` (ISO-4217), `category_id`, and `account_id`.\n\n2. Category Taxonomy: Separate fixed recurring expenses (rent, insurance, utilities) from discretionary spending (dining, entertainment) to calculate meaningful monthly savings rates.\n\n3. Aggregation Engine: Design SQL window queries or indexing strategies to compute rolling balances and category breakdowns in sub-millisecond time.\n\nClean data models prevent reconciliation bugs down the road.',
          cta: 'Always store currency values in integer cents (e.g. $19.99 -> 1999) to prevent IEEE-754 floating-point rounding errors.',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'Local-First SQLite vs Cloud Apps',
          hook: 'Why building your own personal expense tracker with SQLite beats downloading 90% of commercial budgeting apps:',
          body: 'Commercial finance apps are bloated with bank credential syncing, advertisements, loan offers, and privacy-invasive tracking.\n\nYet personal budgeting requires only two fundamental operations: capturing transactions with zero friction and aggregating spending by category.\n\nA lightweight local-first SQLite database paired with a clean CLI or mobile PWA gives you:\n- 100% financial privacy\n- Zero recurring subscription fees\n- Instant offline transaction logging\n- Total flexibility to write custom SQL aggregation queries\n\nSometimes the best software is the simplest tool built strictly for your own access patterns.',
          cta: 'Would you rather trust your financial data to a cloud startup or an encrypted local database?',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'The Floating-Point Currency Bug',
          hook: 'How modeling currency with IEEE-754 floating-point numbers caused a $4,200 reconciliation discrepancy in an expense tracking app:',
          body: 'An engineering team built a personal finance aggregator using standard `float` data types for transaction amounts:\n`float balance = 0.1f + 0.2f; // evaluates to 0.30000000000000004`\n\nAfter summing 150,000 transactions over 18 months, small binary floating-point representation errors accumulated. The user interface reported a cash balance that differed from verified bank statements by several thousand dollars.\n\nThe fix was an architectural migration to integer cents (or Decimal/Numeric in PostgreSQL).\n\nLesson: Never use floating-point types for currency or financial math. Store money as integer minor currency units (cents, pence, yen).',
          cta: 'Have you ever encountered a floating-point rounding bug in production financial software?',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: 'Weekend Architectural Blueprint',
          hook: 'A 4-step architectural blueprint to build a local-first personal expense tracker in a weekend:',
          body: '1. Define the Relational Database Schema\nCreate tables for `accounts`, `categories`, and `transactions` in SQLite. Use `INTEGER` for amounts in cents and foreign key constraints for category IDs.\n\n2. Implement a Fast Input Interface\nBuild a 3-tap capture interface (Amount -> Category -> Submit) or a single-line CLI parser (`expense add 45.50 groceries "Trader Joes"`). If adding a transaction takes more than 5 seconds, you will stop tracking.\n\n3. Build Monthly Aggregation Views\nWrite SQL views using `GROUP BY category_id, strftime(\'%Y-%m\', timestamp)` to compute monthly totals and compare against budget thresholds.\n\n4. Add CSV/JSON Export & Backup\nEnsure you can export your entire transaction history to JSON or CSV at any time with a single command.',
          cta: 'Save this blueprint for your next weekend software project.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'Storage Engine Selection Trade-offs',
          hook: 'Database selection breakdown for a personal expense tracker: SQLite vs PostgreSQL vs IndexedDB:',
          body: 'Choosing the right storage engine depends on your target platform and sync architecture:\n\n• SQLite (Local-First Desktop/Mobile):\n  - Storage: Single file on disk with zero configuration\n  - Latency: < 0.1ms read/write\n  - Offline: Native\n  - Best for: Privacy-first personal tools\n\n• PostgreSQL (Hosted Multi-Device Web App):\n  - Storage: Robust client-server relational database\n  - Features: Native `NUMERIC` types, full-text search on merchants\n  - Best for: Multi-user SaaS or web dashboards with background bank webhook ingestion\n\n• IndexedDB (Browser PWA):\n  - Storage: In-browser key-value object store\n  - Offline: Complete offline web support\n  - Trade-off: Complex query syntax without an ORM layer like Dexie.js\n\nFor a personal tool, local SQLite with encrypted automated backups offers the optimal balance of speed, privacy, and simplicity.',
          cta: 'Which database engine would you select for a personal productivity tool?',
        },
      ],
    };
  }

  // 6. Data Structures (Preserve deep existing mocks with tone variations)
  if (t.includes('data structure')) {
    const isPunchy = tone.toLowerCase().includes('punchy') || tone.toLowerCase().includes('engaging');
    const isThought = tone.toLowerCase().includes('thought') || tone.toLowerCase().includes('provoking');
    const isConversational = tone.toLowerCase().includes('conversational');
    const isTechnical = tone.toLowerCase().includes('authoritative') || tone.toLowerCase().includes('technical');

    if (isPunchy) {
      return {
        posts: [
          {
            id: 'post_educational',
            category: 'Educational',
            angle: 'Memory Boundaries vs Logic',
            hook: "Most developers learn data structures backwards.\n\nThey memorize implementations first.\n\nThat's the problem.",
            body: 'Code is just logic.\nData structures are the physical boundaries of that logic.\n\nAn array forces your CPU to inspect elements one by one.\nAt 100,000 items? That is 100,000 checks.\n\nA hash table uses math to jump straight to the exact memory cell.\nAt 100,000 items? Exactly 1 check.\n\nStop memorizing syntax. Start organizing memory.',
            cta: 'What was the first data structure that changed how you write code?',
          },
          {
            id: 'post_contrarian',
            category: 'Contrarian / Question-Driven',
            angle: 'Production Access Patterns vs Whiteboard Trivia',
            hook: 'Stop grinding 500 LeetCode problems.\n\nLearn 5 core memory access patterns instead.',
            body: "Nobody in production asks you to invert a binary tree on a whiteboard.\n\nThey ask why the checkout service freezes under 5,000 concurrent requests.\n\nThe answer is almost never 'we need more Kubernetes pods.'\nIt is usually 'someone put an array scan inside a loop.'\n\nPractical engineering beats academic trivia every time.",
            cta: 'How does your team monitor algorithmic bottlenecks?',
          },
          {
            id: 'post_storytelling',
            category: 'Storytelling / Case Study',
            angle: 'Array Scan Staging Outage',
            hook: 'One innocent array scan crashed a staging database for 3 hours.\n\nHere is how two lines of code fixed it:',
            body: 'A background batch job verified incoming user IDs.\n60,000 incoming records.\nEach record ran `list.includes(id)` on 60,000 existing records.\n\n60,000 × 60,000 = 3.6 billion operations.\nThe CPU pegged at 100%.\n\nThe fix?\nConvert the list to a Set.\nRun time plummeted from 45 seconds to 8 milliseconds.\n\nTwo lines of code. 5,000x faster.',
            cta: "What's the biggest speedup you've achieved with a single data structure swap?",
          },
          {
            id: 'post_practical',
            category: 'Practical / Step-by-Step',
            angle: 'Array vs Set Heuristic',
            hook: 'The 10-second rule for choosing between an Array and a Set:',
            body: 'Need ordered sequence and index access? Pick an Array.\n\nNeed instant lookup and duplicate prevention? Pick a Set or Map.\n\nIf your dataset exceeds 500 items and you query by key, never use an Array.\n\nPick the structure that matches your access pattern, not just the easiest syntax to type.',
            cta: 'Save this rule for your next code review.',
          },
          {
            id: 'post_insight',
            category: 'Insight-Driven',
            angle: 'Big-O Scaling Reality',
            hook: '1,000,000 items in memory:\n\nArray lookup: 1,000,000 operations.\nSet lookup: 1 operation.\n\nThat is Big-O in the real world.',
            body: 'Hardware cannot save code written with poor algorithmic complexity.\nA fast processor running an O(n^2) loop will still freeze your server.\n\nThe fastest code is the work you prevent your CPU from doing.',
            cta: 'How does your engineering team test for algorithmic scaling before deploying to production?',
          },
        ],
      };
    }

    if (isConversational) {
      return {
        posts: [
          {
            id: 'post_educational',
            category: 'Educational',
            angle: 'Real-World Fundamentals',
            hook: 'Here is what I wish I understood about data structures before writing my first enterprise backend:',
            body: 'When I first started building web APIs, I used arrays for literally everything.\n\nNeed to store users? Array.\nNeed to find an active session? Array scan.\nNeed to check permissions? `roles.find()`.\n\nIt works fine when you have 10 test records on localhost. But in production with 50,000 active sessions, that innocent array lookup turns into 50,000 sequential memory checks per request.\n\nThe moment you replace that array with a Hash Map or Set, your lookup goes from 50,000 operations down to 1.\n\nData structures aren\'t academic trivia. They are the difference between a backend that purrs and one that crashes on launch day.',
            cta: 'What is one coding concept you wish you understood earlier in your career?',
          },
          {
            id: 'post_contrarian',
            category: 'Contrarian / Question-Driven',
            angle: 'Syntax vs Memory Reality',
            hook: 'We spend weeks debating clean code syntax, but rarely talk about memory layout.',
            body: 'It is easy to get caught up in clean code debates: single responsibility, variable naming, formatting tools.\n\nAll of that matters. But clean code that iterates through an unsorted array inside a loop will still bring production to its knees.\n\nYour CPU doesn\'t care how pretty your variable names are if it has to stall on 5,000 cache misses.\n\nSometimes the cleanest refactor is picking the right data structure.',
            cta: 'Have you ever had a beautiful, clean codebase that was brutally slow?',
          },
          {
            id: 'post_storytelling',
            category: 'Storytelling / Case Study',
            angle: 'The 3-Second API Mystery',
            hook: 'A junior engineer asked me why their endpoint took 3.2 seconds to return 200 items:',
            body: 'The code looked pristine. Proper async/await, clean TypeScript types, unit tests passing.\n\nUnderneath? For each item in the response list, they called `users.filter(u => u.id === item.userId)` on an array of 20,000 users.\n\n200 items × 20,000 checks = 4,000,000 comparisons.\n\nWe converted `users` into a Map keyed by `id`:\n`const userMap = new Map(users.map(u => [u.id, u]));`\n\nLatency dropped from 3,200ms to 4ms.\n\nThe fix took 45 seconds to write.',
            cta: 'What was your biggest aha moment with algorithmic complexity?',
          },
          {
            id: 'post_practical',
            category: 'Practical / Step-by-Step',
            angle: 'Quick Collection Picker',
            hook: 'A quick rule of thumb for picking collection types in everyday feature work:',
            body: 'When building everyday features, ask these three quick questions:\n\n1. Do you care about item order? If yes, start with a list or array.\n2. Will you look items up by an ID? Convert to a Map or dictionary.\n3. Do you need unique values without duplicates? Use a Set.\n\nIf you find yourself writing `.find()` or `.filter()` inside a `.map()`, pause immediately. You probably need a Map.',
            cta: 'What is your go-to data structure in day-to-day coding?',
          },
          {
            id: 'post_insight',
            category: 'Insight-Driven',
            angle: 'Simple Comparison',
            hook: 'Why a 10-line script can outpace a distributed cluster when data structures align:',
            body: 'Throwing more servers at high latency is the most expensive way to solve an algorithmic bug.\n\nA single commodity laptop processing a properly indexed in-memory hash structure can handle 10,000,000 lookups per second.\n\nPick the right structure first, and you might never need that extra Kubernetes node.',
            cta: 'What is your favorite example of algorithmic elegance?',
          },
        ],
      };
    }

    if (isTechnical) {
      return {
        posts: [
          {
            id: 'post_educational',
            category: 'Educational',
            angle: 'Hardware Memory Hierarchy',
            hook: 'At the silicon level, data structure design dictates cache line prefetching, branch prediction, and memory hierarchy overhead.',
            body: 'Modern CPUs access L1 cache in ~1ns, whereas main memory access costs 50–100ns—a 100x latency penalty.\n\n• Contiguous Arrays: Occupy adjacent 64-byte cache lines. Hardware prefetchers detect spatial locality and load subsequent elements before instructions request them.\n\n• Linked Lists: Allocate individual nodes on the heap. Traversal hops scatter across virtual pages, inducing TLB misses and stalling execution pipelines.\n\n• B-Trees: Store multiple keys per node to align with disk block and virtual memory page boundaries, minimizing I/O cycles.\n\nAlgorithmic performance on modern silicon is inseparable from memory layout.',
            cta: 'How do you measure hardware cache misses in your performance profiling?',
          },
          {
            id: 'post_contrarian',
            category: 'Contrarian / Question-Driven',
            angle: 'Cache Locality vs Asymptotic Bounds',
            hook: 'Why an O(n) array scan can physically outperform an O(log n) binary search tree for small datasets on modern silicon:',
            body: 'Algorithmic theory suggests logarithmic trees always beat linear scans as n grows.\n\nYet on modern x86/ARM silicon, cache line spatial locality dominates. An array of 64 integers fits within a single or adjacent cache lines, traversable in a few clock cycles with SIMD vectorization.\n\nA binary search tree for 64 nodes requires chasing 64 heap pointers, incurring multiple pipeline stalls and cache line evictions.\n\nNever optimize Big-O without validating hardware constant factors.',
            cta: 'At what threshold does your team transition from linear buffers to logarithmic trees?',
          },
          {
            id: 'post_storytelling',
            category: 'Storytelling / Case Study',
            angle: 'L1 Cache Optimization Case Study',
            hook: 'How restructuring an in-memory packet buffer increased network throughput by 340%:',
            body: 'A network proxy service processed UDP telemetry packets at 100,000 packets/sec. The pipeline used an array of pointer-based packet objects.\n\nHardware profiling revealed an 18% L1 data cache miss rate: the CPU spent 60% of cycles stalled waiting on DRAM bus transfers.\n\nBy converting to a structure-of-arrays (SoA) layout with inline fixed-size headers, packet metadata was packed contiguously into 64-byte blocks. L1 cache misses dropped to 1.2%, and throughput increased by 340% on identical hardware.\n\nHardware cache efficiency is the true ceiling of software throughput.',
            cta: 'Have you used structure-of-arrays (SoA) vs array-of-structures (AoS) in production?',
          },
          {
            id: 'post_practical',
            category: 'Practical / Step-by-Step',
            angle: 'Memory Layout Audit Framework',
            hook: 'A 4-step framework for auditing collection memory footprints in performance-critical paths:',
            body: '1. Inspect Object Padding & Alignment:\nCheck compiler byte alignment for structs. Reorder struct fields from largest (64-bit) to smallest (8-bit) to eliminate padding holes.\n\n2. Profile Cache Misses with `perf` or VTune:\nMeasure L1D and LLC (Last Level Cache) miss counters rather than wall-clock time alone.\n\n3. Evaluate Pointer Overhead:\nOn 64-bit architectures, every reference costs 8 bytes. A linked node with two pointers wastes 16 bytes of overhead per payload.\n\n4. Benchmark Contiguous Ring Buffers:\nReplace linked queues with pre-allocated contiguous ring buffers to prevent heap fragmentation.',
            cta: 'Save this checklist for your next systems engineering optimization sprint.',
          },
          {
            id: 'post_insight',
            category: 'Insight-Driven',
            angle: 'Hardware Memory Hierarchy Latency Numbers',
            hook: 'Every systems engineer should know these latency numbers by heart:',
            body: '• L1 CPU Cache Reference: ~1 ns (0.5 clock cycles)\n• Branch Mispredict: ~3 ns\n• L2 CPU Cache Reference: ~4 ns\n• Mutex Lock/Unlock: ~17 ns\n• Main Memory (DRAM) Reference: ~100 ns\n• SSD Random Read: ~16,000 ns (16 µs)\n• Datacenter Network Roundtrip: ~500,000 ns (0.5 ms)\n\nChoosing a pointer-heavy data structure pushes your CPU from the 1ns tier into the 100ns DRAM tier on every lookup.\n\nDesign your data models around memory hierarchy realities.',
            cta: 'How do these latency tiers influence your system architecture?',
          },
        ],
      };
    }

    if (isThought) {
      return {
        posts: [
          {
            id: 'post_educational',
            category: 'Educational',
            angle: 'Contiguous Memory Addresses vs Pointer Dereferencing',
            hook: "What if data structures aren't just an academic exam topic, but the physical boundary between 1ns cache speed and 100ns memory stalls?",
            body: 'It is not algorithm math; it is computer architecture.\n\nWhen you allocate an Array, the OS assigns contiguous physical memory addresses. Because items sit consecutively in RAM, the hardware CPU prefetcher loads entire 64-byte cache lines in advance. Every sequential element is already waiting in L1 cache (0.5–1 ns latency).\n\nWhen you build a Linked List, each node is allocated independently on the heap at scattered memory addresses. To read node N+1, the CPU must first read the 64-bit pointer address from node N. Because consecutive nodes are not neighbors in RAM, almost every pointer jump causes an L1/L2 cache miss, forcing the CPU pipeline to stall for 60–100 nanoseconds waiting for DDR RAM.\n\nData structures do not just organize variables. They dictate whether your CPU operates at 4 GHz silicon speed or spends 95% of its clock cycles stalled on the memory bus.',
            cta: 'How does cache locality factor into your data model choices?',
          },
          {
            id: 'post_contrarian',
            category: 'Contrarian / Question-Driven',
            angle: 'The Hidden Memory Wall of Hash Maps',
            hook: 'Hash maps promise O(1) lookups. So why do high-throughput systems actively replace them with sorted arrays and binary search?',
            body: 'On paper, O(1) beats O(log n) every day.\n\nIn practice, a Hash Map trades substantial memory overhead and pointer fragmentation to achieve that O(1):\n\n1. Bucket Over-allocation: To prevent excessive collisions, hash tables maintain a load factor (usually 0.75). That means 25% to 50% of allocated buckets are permanently empty memory overhead.\n\n2. Collision Chaining: Standard hash tables handle collisions via linked list buckets. Resolving collisions requires pointer hopping across scattered heap memory.\n\n3. Cache Thrashing: Hashing a key produces a pseudo-random index, forcing the CPU to jump to a completely random memory address on every lookup.\n\nIn contrast, a compact sorted array with binary search (O(log n)) packs keys into contiguous cache lines. For datasets with fewer than 100 elements, the contiguous array often executes faster than computing a hash and dereferencing bucket pointers.\n\nTheoretical asymptotic bounds ignore the physics of CPU hardware.',
            cta: 'Have you ever benchmarked contiguous array binary search against hash map lookups for small datasets?',
          },
          {
            id: 'post_storytelling',
            category: 'Storytelling / Case Study',
            angle: 'The 100x Speedup from Pointer Hopping to Packed Structs',
            hook: 'How replacing an array of pointer references with an array of flat structs turned an 800ms API endpoint into an 8ms response:',
            body: 'An engineering team was optimizing an order-matching engine with 250,000 active limit orders.\n\nOriginally, the order book was modeled as an array of object pointers: `Order* orders[250000]`. Each order held separate heap allocations for `orderId`, `price`, `volume`, and `timestamp`.\n\nIterating through the book to calculate matching volume took 820 milliseconds. Profiling with Linux `perf` revealed why: 84% of execution time was spent in `L1-dcache-load-misses`. The CPU was hopping across 250,000 scattered heap pointers.\n\nThe refactor: They flattened the schema into a single contiguous struct array:\n`struct Order { int64_t id; double price; uint32_t volume; int64_t ts; };`\n\nNow, 250,000 orders were packed consecutively in a single 8 MB buffer. The CPU prefetcher streamed orders through L2/L3 cache without stalling. Processing time plummeted from 820ms to 7.8ms—a 105x speedup with zero changes to business logic.\n\nUnderstanding how data structures lay out bits in RAM is the ultimate performance superpower.',
            cta: 'What is the biggest performance win you have seen from memory layout optimizations?',
          },
          {
            id: 'post_practical',
            category: 'Practical / Step-by-Step',
            angle: 'Mapping Access Patterns to Underlying Structures',
            hook: 'Stop guessing collection types. Here is the physical memory breakdown for matching data structures to access patterns:',
            body: '1. Exact Key Lookup -> Hash Table / Set\n• How it works: Computes a numeric hash from the key, modulates by capacity (`hash % capacity`), and indexes directly into the bucket array.\n• Trade-off: Instant O(1) retrieval, but unsorted and requires rehashing allocations when load factor exceeds 0.75.\n\n2. Range Queries & Ordered Traversal -> B-Tree / Balanced BST\n• How it works: Nodes maintain sorted keys. In B-Trees, wide node sizes (matching 4KB disk/SSD blocks) keep tree height shallow (logarithmic depth).\n• Trade-off: Predictable O(log n) lookups and efficient interval scans `[min, max]`, but requires periodic rebalancing rotations or page splits.\n\n3. Streaming FIFO Buffering -> Ring Buffer (Circular Array)\n• How it works: Fixed-size contiguous array with `head` and `tail` index pointers that wrap using modular arithmetic (`(tail + 1) % capacity`).\n• Trade-off: Zero dynamic heap allocations and O(1) push/pop, but fixed capacity ceiling.\n\n4. Top-K & Priority Scheduling -> Binary Min/Max Heap\n• How it works: Complete binary tree packed into an array where parent at index `i` has children at `2i + 1` and `2i + 2`.\n• Trade-off: O(1) peak extraction and O(log n) insertion, but arbitrary search requires O(n) scan.',
            cta: 'Which of these data structures do you rely on most in your core services?',
          },
          {
            id: 'post_insight',
            category: 'Insight-Driven',
            angle: 'The Fundamental Memory-Compute Trade-off',
            hook: 'Every single data structure in computer science is just a trade-off between contiguous memory, pointer indirection, and precomputed indexing:',
            body: 'Consider how three fundamental structures handle 1,000,000 integer records:\n\n1. Contiguous Array:\n• Memory layout: Single continuous 4 MB block (`base_address + index * 4 bytes`).\n• Read: O(1) via hardware address arithmetic.\n• Insert at middle: O(n) because 500,000 items must be physically shifted in RAM.\n• CPU sympathy: 100% cache-friendly.\n\n2. Hash Table:\n• Memory layout: Sparse array of bucket pointers, each pointing to key-value entries.\n• Read: O(1) average via hash computation and bucket lookup.\n• Insert: O(1) amortized, but incurs periodic resize rehash spikes.\n• CPU sympathy: Moderate to low due to pseudo-random memory jumps.\n\n3. B+ Tree:\n• Memory layout: Hierarchical nodes where internal nodes store search keys and leaf nodes store sorted records linked horizontally.\n• Read: O(log n) through shallow multi-way branches.\n• Range scan: Sequential traversal across leaf pointers.\n• CPU sympathy: High when node size aligns with 4KB memory pages.\n\nData structures are not abstract syntax. They are physical blueprints for how electrons navigate silicon.',
            cta: 'How do hardware realities shape your software design decisions?',
          },
        ],
      };
    }

    // Default Professional data structure posts (with distinct iteration 1 and 2 versions for diff tracking)
    const isRev = isRevision || iteration > 1;
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Foundational Memory Organization',
          hook: 'Most backend system bottlenecks originate in how data is structured in memory rather than raw CPU limitations.',
          body: isRev
            ? 'Data structures define the physical arrangement of bits in memory. Under revised production testing, indexing customer records with B+ Trees reduced I/O latency from 450ms to 2.4ms across 10,000 requests/sec:\n\n• Contiguous Arrays: Consecutive memory blocks allow hardware CPU prefetchers to load entire cache lines in advance, yielding sub-nanosecond sequential lookups.\n\n• Hash Tables: Compute hash keys to index directly into buckets, achieving O(1) retrieval but sacrificing ordering and incurring rehash memory spikes.\n\n• Balanced Trees: Provide logarithmic O(log n) guarantees for sorted ranges, powering production B-Tree database indexes.\n\nAligning data structures to query access patterns is the foundation of high-throughput software architecture.'
            : 'Data structures define the physical arrangement of bits in memory:\n\n• Contiguous Arrays: Consecutive memory blocks allow hardware CPU prefetchers to load entire cache lines in advance, yielding sub-nanosecond sequential lookups.\n\n• Hash Tables: Compute hash keys to index directly into buckets, achieving O(1) retrieval but sacrificing ordering and incurring rehash memory spikes.\n\n• Balanced Trees: Provide logarithmic O(log n) guarantees for sorted ranges, powering production B-Tree database indexes.\n\nAligning data structures to query access patterns is the foundation of high-throughput software architecture.',
          cta: 'How do you profile memory access patterns in your backend services?',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'The Abstraction Delusion',
          hook: isRev
            ? 'Why high-level language collections hide brutal hardware costs: Measuring 100,000 lookups in production:'
            : 'Why high-level language collections make engineers forget how expensive pointer indirection is on modern CPUs:',
          body: isRev
            ? 'Modern languages provide convenient abstractions like `List`, `Map`, and `Set`.\n\nYet behind clean APIs lie stark physical realities. Measuring 100,000 lookups in production: an unindexed Array scan required 100,000 pointer evaluations and 82ms latency. A Hash Map lookup required exactly 1 memory jump and 0.04ms latency.\n\nA linked list scatters node pointers across the heap, triggering CPU cache misses on every traversal hop. An array keeps elements contiguous, allowing vectorization and sequential cache line hits.\n\nConvenient syntax hides hardware costs. Engineers must understand the memory footprint of the collections they import.'
            : 'Modern languages provide convenient abstractions like `List`, `Map`, and `Set`.\n\nYet behind clean APIs lie stark physical realities. A linked list scatters node pointers across the heap, triggering CPU cache misses on every traversal hop. An array keeps elements contiguous, allowing vectorization and sequential cache line hits.\n\nConvenient syntax hides hardware costs. Engineers must understand the memory footprint of the collections they import.',
          cta: 'Do you consider cache locality when choosing collections in your high-performance services?',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'Database Export Latency Case Study',
          hook: 'How swapping a single collection type turned a 45-second database export into an 8-millisecond operation:',
          body: 'In an enterprise reporting pipeline, an export service cross-referenced 50,000 customer orders against 10,000 tax exemption rules.\n\nThe original code checked exemption eligibility by iterating over an unsorted array: `exemptions.find(e => e.id === order.id)`. That triggered 500,000,000 comparisons, pegging worker CPU and timing out requests.\n\nBy indexing the exemptions into a Hash Map upfront (O(m) preparation), each lookup became O(1). Total execution dropped from 45 seconds to 8 milliseconds.\n\nAlgorithmic complexity directly dictates server capacity and infrastructure costs.',
          cta: 'Have you ever fixed an apparent server capacity issue with an algorithmic optimization?',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: 'Architectural Selection Matrix',
          hook: isRev
            ? 'Before picking a collection type in your next feature, evaluate this revised 3-question architectural checklist with boundary checks:'
            : 'Before picking a collection type in your next feature, evaluate this 3-question architectural checklist:',
          body: isRev
            ? '1. What is your Read-to-Write Ratio?\nIf reads dominate by integer index, contiguous arrays provide unbeatable cache efficiency. If insertions occur frequently in the middle, evaluate pointer-linked structures.\n\n2. Does Lookup Latency Matter as Datasets Grow?\nIf datasets scale past a few hundred records (N > 500) and queries look up unique identifiers, switch from linear lists to Hash Maps immediately. For N < 50, array scans remain faster due to L1 cache prefetching.\n\n3. Account for Hash Collision and Pointer Overhead:\nMaintain hash table load factor below 0.75 to prevent bucket chaining. Account for 8-byte pointer overhead per node on 64-bit systems.\n\n4. Is Data Hierarchical or Queried by Range?\nIf transactions require range queries (e.g. timestamps between Date A and Date B), tree structures like B-Trees outperform flat collections.'
            : '1. What is your Read-to-Write Ratio?\nIf reads dominate by integer index, contiguous arrays provide unbeatable cache efficiency. If insertions occur frequently in the middle, evaluate pointer-linked structures.\n\n2. Does Lookup Latency Matter as Datasets Grow?\nIf datasets scale past a few hundred records and queries look up unique identifiers, switch from linear lists to Hash Maps or Sets immediately.\n\n3. Is Data Hierarchical or Queried by Range?\nIf transactions require range queries (e.g. timestamps between Date A and Date B), tree structures like B-Trees outperform flat collections.',
          cta: 'Save this checklist for your next technical design review.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'Big-O Scaling Thresholds',
          hook: 'Here is what Big-O complexity actually means when an enterprise service scales from 1,000 to 1,000,000 records:',
          body: 'Consider four algorithmic complexity curves handling 1,000,000 records:\n\n• O(1) Hash Map Lookup: Exactly 1 memory probe. Instantaneous.\n• O(log n) Balanced Tree: ~20 comparisons to locate any key among a million records.\n• O(n) Linear Scan: Up to 1,000,000 sequential memory checks.\n• O(n^2) Nested Loop: 1,000,000,000,000 operations. The process will freeze and crash worker nodes.\n\nCloud infrastructure scaling cannot outrun quadratic time complexity. The most impactful optimization happens at design time.',
          cta: 'How does your organization establish algorithmic guardrails during code reviews?',
        },
      ],
    };
  }

  // 7. James Webb Space Telescope Beryllium Mirrors & Infrared Optics
  if (t.includes('webb') || t.includes('beryllium') || t.includes('telescope')) {
    const isRev = isRevision || iteration > 1;
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Cryogenic Beryllium & Gold Optics',
          hook: 'Why did NASA construct the James Webb Space Telescope primary mirror out of toxic beryllium and 48 grams of gold instead of traditional optical glass?',
          body: isRev
            ? 'At Lagrange Point 2 (1.5 million kilometers from Earth), JWST operates in deep cryogenic shadow at 35 Kelvin (-238°C). At those temperatures, conventional optical glass fractures or warps unpredictably.\n\nNASA optical engineers made two critical material choices:\n\n1. O-30 Grade Beryllium Substrate:\nBeryllium has an exceptional strength-to-weight ratio (density of 1.85 g/cm³) and an almost flat coefficient of thermal expansion below 100 Kelvin. Once cooled, its shape remains dimensionally locked.\n\n2. Vapor-Deposited Gold Layer:\nEach segment received a 100-nanometer layer of pure gold, topped with a micro-thin silicon dioxide (SiO2) protective barrier. Across all 18 segments (25 m² of surface area), the total mass of gold used was just 48 grams.\n\n3. 98% Infrared Reflectivity:\nWhile aluminum absorbs infrared wavelengths, gold reflects 98% of photons between 0.6 and 28 micrometers—the exact spectrum where ancient redshifted light from the earliest galaxies appears.'
            : 'At Lagrange Point 2 (1.5 million kilometers from Earth), JWST operates in deep cryogenic shadow at 35 Kelvin (-238°C). At those temperatures, conventional optical glass fractures or warps unpredictably.\n\nNASA optical engineers made two critical material choices:\n\n1. O-30 Grade Beryllium Substrate:\nBeryllium has an exceptional strength-to-weight ratio (density of 1.85 g/cm³) and an almost flat coefficient of thermal expansion below 100 Kelvin. Once cooled, its shape remains dimensionally locked.\n\n2. Vapor-Deposited Gold Layer:\nEach segment received a 100-nanometer layer of pure gold, topped with a micro-thin silicon dioxide (SiO2) protective barrier. Across all 18 segments (25 m² of surface area), the total mass of gold used was just 48 grams.\n\n3. 98% Infrared Reflectivity:\nWhile aluminum absorbs infrared wavelengths, gold reflects 98% of photons between 0.6 and 28 micrometers.',
          cta: 'Engineering for cryogenic space environments requires abandoning terrestrial material intuitions.',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'Why Not Aluminum or Silver?',
          hook: isRev
            ? 'Aluminum is the universal telescope mirror standard, and silver has the highest visible reflectivity. So why did JWST use gold? Redshift physics explains the choice:'
            : 'Aluminum is the universal telescope mirror standard, and silver has the highest visible reflectivity. So why did NASA choose gold for JWST?',
          body: isRev
            ? 'Hubble uses an aluminum-coated mirror because its mission targets ultraviolet and visible spectrum astronomy.\n\nJWST was built to observe the edge of the observable universe—galaxies formed over 13.5 billion years ago. Because space is expanding, photons emitted as ultraviolet light have experienced cosmological redshift (z > 10), stretching their wavelengths directly into the near- and mid-infrared spectrum.\n\nIn infrared wavelengths, aluminum reflectivity drops and scatters internal thermal noise. Silver tarnishes rapidly on Earth and degrades in cryogenic ultraviolet.\n\nGold delivers an astonishing 98% reflectance across the 0.6 to 28-micron band. Using gold was not a luxury; it was a non-negotiable optical constraint to detect the oldest photons in cosmic history.'
            : 'Hubble uses an aluminum-coated mirror because its mission targets ultraviolet and visible spectrum astronomy.\n\nJWST was built to observe the edge of the observable universe—galaxies formed over 13.5 billion years ago. Because space is expanding, photons emitted as ultraviolet light have experienced cosmological redshift (z > 10), stretching their wavelengths directly into the near- and mid-infrared spectrum.\n\nIn infrared wavelengths, aluminum reflectivity drops and scatters internal thermal noise. Silver tarnishes rapidly on Earth.\n\nGold delivers an astonishing 98% reflectance across the 0.6 to 28-micron band. Using gold was not a luxury; it was a non-negotiable optical constraint.',
          cta: 'Design constraints dictate materials—never assume Earth-bound standards apply to the edge of time.',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'Deliberately Polishing Distorted Mirrors on Earth',
          hook: 'How NASA optical engineers deliberately manufactured 18 distorted, imperfect mirrors on Earth to achieve optical perfection in deep space:',
          body: 'If you ground JWST mirror segments into mathematically perfect parabolas at room temperature in a cleanroom, they would fail completely in space.\n\nAt 35 Kelvin in the shadow of the sunshield, the beryllium substrate contracts unevenly, introducing astigmatic wavefront aberrations.\n\nBall Aerospace and NASA optical teams solved this through "cryogenic figuring":\n1. Polish each mirror blank to a preliminary shape.\n2. Chill it to 35 Kelvin inside the giant helium-cooled vacuum chamber at Marshall Space Flight Center.\n3. Measure the cryogenic deformation map with laser interferometers down to nanometer resolution.\n4. Warm the mirror back to room temperature and machine an intentional inverse error profile into the beryllium.\n\nWhen deployed in deep space, cryogenic thermal contraction pulled the distorted mirrors into optically perfect 1/14-wave parabolas.\n\nExtreme engineering means accounting for environmental distortion at rest.',
          cta: 'What is the most impressive compensation mechanism you have encountered in hardware engineering?',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: '4-Stage Hexagonal Wavefront Alignment',
          hook: isRev
            ? 'A 4-step breakdown of how JWST transformed 18 floating mirror segments into a single 6.5-meter optical surface with nanometer actuators:'
            : 'How JWST aligned 18 separate floating hexagonal segments into a single 6.5-meter primary mirror in space:',
          body: isRev
            ? '1. Deploy Hexapod Actuators:\nBehind each beryllium segment sit 6 cryogenic stepper-motor hexapod actuators, plus a 7th center actuator for radius of curvature. Each actuator steps in 10-nanometer increments.\n\n2. Segment Image Identification:\nThe NIRCam instrument captured 18 individual blurred stars. Ground controllers adjusted hexapod tip/tilt to organize the dots into an ordered hexagonal array.\n\n3. Coarse Phasing with Dispersed Hartmann Sensors:\nSpecialized grisms dispersed starlight into spectral fringes, detecting vertical step mismatches between adjacent mirror edges up to tens of micrometers.\n\n4. Fine Phasing Wavefront Control:\nInterferometric algorithms adjusted segment heights until incoming light waves constructively interfered across all 18 segments. The final wavefront alignment achieved less than 70 nanometers of error—less than 1/1,000th the thickness of plastic wrap.'
            : '1. Deploy Hexapod Actuators:\nBehind each beryllium segment sit 6 cryogenic stepper-motor hexapod actuators, plus a 7th center actuator for radius of curvature. Each actuator steps in 10-nanometer increments.\n\n2. Segment Image Identification:\nThe NIRCam instrument captured 18 individual blurred stars. Ground controllers adjusted hexapod tip/tilt to organize the dots into an ordered hexagonal array.\n\n3. Coarse Phasing with Dispersed Hartmann Sensors:\nSpecialized grisms dispersed starlight into spectral fringes, detecting vertical step mismatches between adjacent mirror edges.\n\n4. Fine Phasing Wavefront Control:\nInterferometric algorithms adjusted segment heights until incoming light waves constructively interfered across all 18 segments to within 70 nanometers of error.',
          cta: 'Save this breakdown of high-precision aerospace and optical alignment.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'Redshift Limits & Infrared Astronomy',
          hook: 'The cosmological physics constraint that made visible-light space telescopes blind to the earliest galaxies in our universe:',
          body: 'To photograph the earliest stars ignited 200 million years after the Big Bang, astronomers faced a strict cosmological barrier: cosmic expansion.\n\nAs photons travel across 13 billion light-years of stretching spacetime, their wavelength is multiplied by a redshift factor (1 + z). Light emitted in the ultraviolet at 121 nanometers (Lyman-alpha) stretches past 1,500 nanometers—deep into the near-infrared.\n\nA visible-light telescope like Hubble simply cannot detect these photons. JWST 18 beryllium segments act as an infrared photon collector, operating in thermal silence behind a 5-layer Kapton sunshield that maintains a 300°C temperature differential.\n\nUnderstanding the physical medium of observation is what turns impossible measurements into repeatable science.',
          cta: 'What upcoming space exploration mission are you following closely?',
        },
      ],
    };
  }

  // 8. Distributed Consensus with Paxos and Raft
  if (t.includes('consensus') || t.includes('paxos') || t.includes('raft')) {
    const isRev = isRevision || iteration > 1;
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Split-Brain Prevention & Majority Quorums',
          hook: 'How do distributed databases like etcd and CockroachDB agree on state when network cables are cut? The math of Raft quorums:',
          body: isRev
            ? 'Distributed consensus keeps multiple machines in identical state without a single point of failure under network partition constraints:\n\n1. Leader Election: Nodes start as Followers. If a follower misses heartbeats (150–300ms randomized timeout), it increments the term and broadcasts RequestVote. It becomes Leader if it receives votes from a strict majority: floor(N/2) + 1 nodes.\n\n2. Log Replication: The Leader receives client writes, appends them to its local write-ahead log (WAL), and broadcasts AppendEntries RPCs to followers.\n\n3. Commit & Apply: Once a majority confirms writing the entry to disk, the leader marks the entry committed and applies it to its local state machine.\n\nBecause any two majorities of size floor(N/2) + 1 in an N-node cluster must overlap by at least one node, split-brain write conflicts are mathematically impossible.'
            : 'Distributed consensus keeps multiple machines in identical state without a single point of failure:\n\n1. Leader Election: Nodes start as Followers. If a follower misses heartbeats (150–300ms randomized timeout), it increments the term and broadcasts RequestVote. It becomes Leader if it receives votes from a strict majority: floor(N/2) + 1 nodes.\n\n2. Log Replication: The Leader receives client writes, appends them to its local write-ahead log (WAL), and broadcasts AppendEntries RPCs to followers.\n\n3. Commit & Apply: Once a majority confirms writing the entry to disk, the leader marks the entry committed and applies it to its local state machine.\n\nBecause any two majorities of size floor(N/2) + 1 in an N-node cluster must overlap by at least one node, split-brain write conflicts are mathematically impossible.',
          cta: 'Why do distributed consensus clusters almost always use odd node counts (3, 5, or 7)?',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'Two-Phase Commit vs Raft Consensus',
          hook: isRev
            ? 'Why 2-Phase Commit (2PC) is NOT consensus—and why calling it consensus causes production database deadlocks during partitions:'
            : 'Why 2-Phase Commit (2PC) is NOT consensus—and why calling it consensus causes production database deadlocks:',
          body: isRev
            ? 'Engineers often confuse distributed transactions (2PC) with distributed consensus (Paxos/Raft).\n\n2PC is a coordination protocol: every participant votes yes or no. If the coordinator crashes mid-commit, all participant nodes freeze their locks and block indefinitely, waiting to learn the final outcome. Availability drops to zero.\n\nRaft and Paxos are fault-tolerant consensus protocols: they do not require unanimous agreement. A 5-node Raft cluster continues serving reads and writes even if 2 nodes crash or lose network connectivity.\n\n2PC prioritizes atomicity across heterogeneous systems at the cost of availability; Raft guarantees linearizable state replication with automatic failover.'
            : 'Engineers often confuse distributed transactions (2PC) with distributed consensus (Paxos/Raft).\n\n2PC is a coordination protocol: every participant votes yes or no. If the coordinator crashes mid-commit, all participant nodes freeze their locks and block indefinitely, waiting to learn the final outcome. Availability drops to zero.\n\nRaft and Paxos are fault-tolerant consensus protocols: they do not require unanimous agreement. A 5-node Raft cluster continues serving reads and writes even if 2 nodes crash or lose network connectivity.\n\n2PC prioritizes atomicity across heterogeneous systems at the cost of availability; Raft guarantees linearizable state replication with automatic failover.',
          cta: 'How does your distributed database handle coordinator failovers?',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'The Asymmetric Partition Election Loop',
          hook: 'How a partial switch failure created a 3-way asymmetric network split that tested Raft term increments to their limits:',
          body: 'A cloud datacenter suffered an asymmetric network partition: Node A could send packets to Node B, but Node B could not reply to Node A; meanwhile, Node C had full bidirectional links to both.\n\nNode B stopped receiving heartbeats from Node A and transitioned to Candidate. It bumped its election term and sent vote requests. When network packets partially leaked, Node A saw a higher term number and stepped down from leader to follower.\n\nWith no node able to gather 2 out of 3 votes, the cluster entered an election loop until pre-vote extensions were enabled.\n\nAdding PreVote checks—where candidates verify they can reach a quorum before bumping the global term—prevented disconnected partitioned nodes from repeatedly disrupting cluster leadership.',
          cta: 'Have you ever simulated asymmetric packet drops in your distributed test suites?',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: '4-Step Raft Health Audit',
          hook: isRev
            ? 'A 4-step checklist to diagnose stuck consensus and leader flap in Raft clusters with latency parameters:'
            : 'A 4-step checklist to diagnose stuck consensus and leader flap in Raft clusters:',
          body: isRev
            ? '1. Verify Clock Drift and Heartbeat Latency\nEnsure network round-trip time (RTT) between nodes is significantly lower than election timeouts (e.g., RTT < 10ms with 150–300ms timeout) to avoid false leader timeouts.\n\n2. Check Disk Fsync Latencies on WAL\nRaft requires fsyncing log entries before acknowledging. A slow NVMe write stall on one node can backpressure the leader.\n\n3. Audit Quorum Count\nCalculate active nodes against total nodes: active >= floor(total / 2) + 1. If 2 nodes in a 3-node cluster are partitioned, all write operations must fail with QuorumLost.\n\n4. Monitor Log Compaction & Snapshotting\nVerify that follower catch-up uses streaming log snapshots instead of replaying millions of historical WAL entries.'
            : '1. Verify Clock Drift and Heartbeat Latency\nEnsure network round-trip time (RTT) between nodes is significantly lower than election timeouts (e.g., RTT < 10ms with 150–300ms timeout) to avoid false leader timeouts.\n\n2. Check Disk Fsync Latencies on WAL\nRaft requires fsyncing log entries before acknowledging. A slow NVMe write stall on one node can backpressure the leader.\n\n3. Audit Quorum Count\nCalculate active nodes against total nodes: active >= floor(total / 2) + 1. If 2 nodes in a 3-node cluster are partitioned, all write operations must fail with QuorumLost.\n\n4. Monitor Log Compaction & Snapshotting\nVerify that follower catch-up uses streaming log snapshots instead of replaying millions of historical WAL entries.',
          cta: 'Save this diagnostic checklist for your distributed infrastructure runs.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'Mathematical Latency Ceilings',
          hook: 'The mathematical latency ceiling of distributed consensus: Raft vs Multi-Paxos:',
          body: 'Every distributed consensus write incurs physical network roundtrip penalties:\n\n• Raft:\n  - Write Path: 1 RTT from client to leader + 1 RTT from leader to quorum + local disk fsync.\n  - Leader failover: 1 election timeout (~150–300ms) + 1 RTT.\n  - Trade-off: Understandable, rigid leadership hierarchy.\n\n• Multi-Paxos:\n  - Steady state: 1 RTT commit phase once leader is established.\n  - Trade-off: Significant protocol complexity during concurrent leader proposals.\n\nYou cannot cheat the speed of light. Designing distributed consensus is choosing how many cross-datacenter round-trips your SLA can tolerate.',
          cta: 'What consensus engine powers your critical stateful services?',
        },
      ],
    };
  }

  // 9. PostgreSQL Multi-Version Concurrency Control (MVCC)
  if (t.includes('postgres') || t.includes('mvcc') || t.includes('vacuum')) {
    const isRev = isRevision || iteration > 1;
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Tuple Visibility & Transaction Snapshots',
          hook: 'Why PostgreSQL readers never block writers, and writers never block readers: the mechanics of MVCC:',
          body: isRev
            ? 'In traditional lock-based databases, reading a table locks out modifications. In PostgreSQL, Multi-Version Concurrency Control (MVCC) decouples them entirely:\n\nEvery row (tuple) in a Postgres heap table includes hidden system headers:\n• xmin: The transaction ID (XID) that inserted the row.\n• xmax: The transaction ID that deleted or updated the row (initially 0).\n\nWhen you execute an UPDATE, Postgres does not overwrite the row in place. It writes a completely new tuple with xmin = current_xid and stamps the old row\'s xmax = current_xid.\n\nWhen your transaction runs SELECT, Postgres evaluates its Transaction Snapshot against xmin and xmax to determine which version of the tuple is visible to you. The old tuple remains untouched until no active transaction can see it.'
            : 'In traditional lock-based databases, reading a table locks out modifications. In PostgreSQL, Multi-Version Concurrency Control (MVCC) decouples them entirely:\n\nEvery row (tuple) in a Postgres heap table includes hidden system headers:\n• xmin: The transaction ID (XID) that inserted the row.\n• xmax: The transaction ID that deleted or updated the row (initially 0).\n\nWhen you execute an UPDATE, Postgres does not overwrite the row in place. It writes a completely new tuple with xmin = current_xid and stamps the old row\'s xmax = current_xid.\n\nWhen your transaction runs SELECT, Postgres evaluates its Transaction Snapshot against xmin and xmax to determine which version of the tuple is visible to you.',
          cta: 'Understanding tuple visibility changes how you write long-running queries.',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'The Hidden Danger of Long-Running Reads',
          hook: isRev
            ? 'Why running a 2-hour analytical query on PostgreSQL can silently degrade your entire OLTP database performance under load:'
            : 'Why running a 2-hour analytical query on PostgreSQL can silently degrade your entire OLTP database performance:',
          body: isRev
            ? 'You might assume a long-running read-only query is completely harmless because it only reads data.\n\nIn PostgreSQL MVCC, that is dangerously false.\n\nPostgres autovacuum cannot purge dead tuples whose xmax is greater than or equal to the oldest active transaction\'s snapshot. If an analytical query runs for 2 hours, autovacuum is blocked from cleaning ANY updated or deleted tuples across the entire table.\n\nDead tuples accumulate rapidly (table bloat), indexes swell, and every sequential scan must read gigabytes of dead rows from disk into shared buffers.\n\nLong-running reads are not zero-cost; in MVCC, they hold open the garbage collection horizon.'
            : 'You might assume a long-running read-only query is completely harmless because it only reads data.\n\nIn PostgreSQL MVCC, that is dangerously false.\n\nPostgres autovacuum cannot purge dead tuples whose xmax is greater than or equal to the oldest active transaction\'s snapshot. If an analytical query runs for 2 hours, autovacuum is blocked from cleaning ANY updated or deleted tuples across the entire table.\n\nDead tuples accumulate rapidly (table bloat), indexes swell, and every sequential scan must read gigabytes of dead rows from disk into shared buffers.\n\nLong-running reads are not zero-cost; in MVCC, they hold open the garbage collection horizon.',
          cta: 'How do you monitor transaction age and autovacuum lag in your Postgres clusters?',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'Table Bloat & Orphaned Sessions',
          hook: 'How table bloat from a stalled autovacuum process turned a 12 GB table into a 240 GB disk-filling outage:',
          body: 'An e-commerce company tracked customer shopping carts in PostgreSQL. Updates were frequent—over 2,000 cart updates per second.\n\nOne Friday, disk usage on the database cluster surged from 30% to 92%. A table with only 4 million active carts was taking up 240 GB on disk.\n\nInvestigation showed an orphaned reporting session had been idle in transaction for 38 hours. Because that transaction held open the oldest XID horizon, autovacuum was unable to reclaim dead cart versions.\n\nKilling the orphaned session and running pg_repack released 220 GB of reclaimed disk space in under an hour.\n\nSetting idle_in_transaction_session_timeout is mandatory for high-throughput Postgres tables.',
          cta: 'Always configure idle_in_transaction_session_timeout on production Postgres instances.',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: '4-Step MVCC Health Audit',
          hook: isRev
            ? 'A 4-step health audit for PostgreSQL MVCC and table bloat management with explicit parameters:'
            : 'A 4-step health audit for PostgreSQL MVCC and table bloat management:',
          body: isRev
            ? '1. Monitor Oldest Active Transaction Horizon\nQuery pg_stat_activity for backend_xmin and transactions running longer than 15 minutes.\n\n2. Inspect Dead Tuple Ratios\nCheck pg_stat_user_tables comparing n_dead_tup against n_live_tup. If dead tuples exceed 20%, tune autovacuum thresholds.\n\n3. Tune Autovacuum Workers\nIncrease autovacuum_vacuum_cost_limit from the default 200 to 2000 on modern NVMe drives so vacuuming runs 10x faster without throttling.\n\n4. Reclaim Bloat Online with pg_repack\nNever run VACUUM FULL in production because it locks the table exclusively; use pg_repack to rebuild tables and indexes concurrently.'
            : '1. Monitor Oldest Active Transaction Horizon\nQuery pg_stat_activity for backend_xmin and transactions running longer than 15 minutes.\n\n2. Inspect Dead Tuple Ratios\nCheck pg_stat_user_tables comparing n_dead_tup against n_live_tup. If dead tuples exceed 20%, tune autovacuum thresholds.\n\n3. Tune Autovacuum Workers\nIncrease autovacuum_vacuum_cost_limit from the default 200 to 2000 on modern NVMe drives so vacuuming runs 10x faster without throttling.\n\n4. Reclaim Bloat Online with pg_repack\nNever run VACUUM FULL in production because it locks the table exclusively; use pg_repack to rebuild tables and indexes concurrently.',
          cta: 'Save this tuning guide for your database operations checklist.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'Append-Only Heap vs In-Place Updates',
          hook: 'The physical trade-off between In-Place Updates (MySQL InnoDB) vs Append-Only MVCC (Postgres Heap):',
          body: 'Comparing how databases handle row updates reveals opposite engineering trade-offs:\n\n• PostgreSQL (Append-Only Heap + Autovacuum):\n  - Update writes a new tuple version to the heap.\n  - Advantage: Blazing-fast crash recovery and instant rollback without undo logs.\n  - Cost: Dead tuple accumulation and disk bloat requiring autovacuum maintenance.\n\n• MySQL InnoDB (In-Place Update + Undo Log Rollback Segments):\n  - Update overwrites data in-place and writes previous version to an undo log.\n  - Advantage: Compact tables without heap bloat.\n  - Cost: Heavy undo log serialization and slower rollback for long transactions.\n\nThere is no single perfect storage engine; there is only where you choose to pay your garbage collection cost.',
          cta: 'Which concurrency model fits your application read/write ratio best?',
        },
      ],
    };
  }

  // 10. Microbial Ecology of Sourdough Fermentation
  if (t.includes('sourdough') || t.includes('fermentation') || t.includes('bread')) {
    const isRev = isRevision || iteration > 1;
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Microbial Ecology: Yeast & Bacteria Symbiosis',
          hook: 'Sourdough is not just flour and water—it is a competitive microbial mutualism between wild yeast and lactic acid bacteria:',
          body: isRev
            ? 'In a mature sourdough starter, two microorganisms dominate in a stable 1:100 ratio:\n\n1. Lactobacillus sanfranciscensis (Bacteria):\nThis lactic acid bacterium consumes maltose from broken-down flour starches and excretes glucose, while generating lactic acid (soft, yogurt-like acidity) and acetic acid (sharp vinegar tang). This lowers the dough pH from 6.0 down to ~3.8.\n\n2. Candida humilis (Wild Yeast):\nUnlike commercial baker’s yeast (Saccharomyces cerevisiae), this wild yeast cannot metabolize maltose. It feeds exclusively on the glucose excreted by the bacteria, producing carbon dioxide gas and ethanol without competing for the primary food supply.\n\n3. Acidic Protection & Oven Spring:\nThe sharp pH drop creates a hostile environment for mold and pathogens, while carbon dioxide bubbles get trapped inside the hydrated gluten matrix, driving explosive oven spring in the bake.'
            : 'In a mature sourdough starter, two microorganisms dominate in a stable 1:100 ratio:\n\n1. Lactobacillus sanfranciscensis (Bacteria):\nConsumes maltose from broken-down flour starches and excretes glucose, while generating lactic acid and acetic acid. This lowers the dough pH to ~3.8.\n\n2. Candida humilis (Wild Yeast):\nCannot metabolize maltose; it feeds on glucose excreted by the bacteria, producing carbon dioxide gas and ethanol without competing for food.\n\n3. Acidic Protection & Oven Spring:\nThe sharp pH drop protects the culture from pathogens, while carbon dioxide bubbles get trapped inside the gluten matrix.',
          cta: 'Understanding microbial symbiosis explains why sourdough starters can survive for decades with regular feeding.',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'The 85%+ High Hydration Myth',
          hook: isRev
            ? 'Why chasing extreme 85%+ hydration is actually ruining your sourdough crumb structure and volume:'
            : 'Why chasing extreme 85%+ hydration is ruining your sourdough crumb structure:',
          body: isRev
            ? 'Social media sourdough culture glorifies 85% to 90% hydration as the hallmark of mastery.\n\nIn cereal biochemistry, that is frequently counterproductive.\n\nFlour protein content (glutenin and gliadin) dictates how much water the gluten network can structurally bind. Standard supermarket bread flour (11.5–12.5% protein) saturates around 72–75% hydration. Pushing past this threshold leaves unbonded "free water" in the dough.\n\nFree water dilutes the gluten matrix, accelerates enzymatic protease activity, and causes the dough to pool flat on the peel instead of springing vertically in the oven.\n\nA loaf baked at 72% hydration with fully developed gluten tension will produce a taller, lighter, and more open crumb than a soupy 85% puddle.'
            : 'Social media sourdough culture glorifies 85% to 90% hydration as the hallmark of mastery.\n\nIn cereal biochemistry, that is frequently counterproductive.\n\nFlour protein content dictates how much water the gluten network can structurally bind. Standard bread flour saturates around 72–75% hydration. Pushing past this threshold leaves unbonded free water in the dough.\n\nFree water dilutes the gluten matrix, accelerates protease breakdown, and causes dough to spread flat instead of springing vertically.\n\nMaster gluten tension at 72% hydration before attempting extreme water ratios.',
          cta: 'What hydration percentage gives your flour the best balance of open crumb and vertical oven spring?',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'How a 3°C Temperature Shift Saved Commercial Batches',
          hook: 'How adjusting fermentation temperature by just 3°C solved gummy, dense crumb in an artisan bakery:',
          body: 'A bakery experienced a recurring issue during winter: their loaves emerged with gummy, dense bottoms and dull crusts despite identical bulk fermentation times.\n\nInitially, bakers blamed proofing times and added extra folds. The gummy crumb persisted.\n\nA biochemical audit revealed the true culprit: ambient bakery temperature had dropped from 25°C to 20°C.\n\nAt 20°C, wild yeast gas production slows down exponentially faster than bacterial acetic acid production. By the time dough reached sufficient volume, excessive acidity had activated wheat proteases, weakening the gluten strands and collapsing the bottom crumb during baking.\n\nBy moving bulk fermentation into a 24°C proof box, yeast metabolism re-synchronized with bacterial acidification. Dough gained 40% volume in 4 hours with intact gluten walls.\n\nFermentation is governed by temperature kinetics, not the kitchen clock.',
          cta: 'How do you control and monitor ambient fermentation temperature throughout changing seasons?',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: '4-Step Visual Fermentation Diagnostic',
          hook: isRev
            ? 'A 4-step diagnostic protocol to know the exact moment bulk fermentation is complete without guessing:'
            : 'A 4-step diagnostic protocol to determine sourdough fermentation readiness:',
          body: isRev
            ? '1. Observe the Edge Curvature (The Dome):\nLook at where the dough meets the container walls. Under-fermented dough lies flat; properly aerated dough forms a convex dome with rounded edges supported by internal gas pressure.\n\n2. Inspect Sub-Surface Bubble Aeration:\nLook through a clear straight-sided vessel. You should observe widespread tiny gas pockets evenly distributed throughout the dough, not just large bubbles on the surface.\n\n3. Assess Dough Extensibility and Jiggle:\nGive the bowl a gentle shake. Aerated dough moves like a bowl of gelatin—light, elastic, and jiggly. Dense, sluggish movement means yeast activity is still lagging.\n\n4. Target 30% to 50% Volume Rise:\nFor white flour at 24°C, stop bulk fermentation at a 35–45% volume increase before shaping. Pushing to a 100% doubling exhausts yeast sugars needed for oven spring.'
            : '1. Observe Edge Curvature:\nLook for a rounded, convex dome rather than flat dough edges.\n\n2. Inspect Bubble Aeration:\nWidespread tiny bubbles throughout the dough volume indicate active fermentation.\n\n3. Assess Dough Jiggle:\nAerated dough jiggles elastically like gelatin when shaken.\n\n4. Target 35–50% Volume Rise:\nStop bulk fermentation before the dough doubles to preserve sugars for oven spring.',
          cta: 'Save this diagnostic protocol for your next bake.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'The Biochemical Collapse Threshold: pH vs Protease Enzymes',
          hook: 'The biochemical tipping point where sourdough dough transitions from peak oven spring to structural collapse:',
          body: 'Every sourdough fermentation is a race between gas production and enzymatic gluten destruction:\n\n• pH 5.5–4.5 (Early Bulk): Gluten strands form strong disulphide bonds. Dough feels elastic and holds tension.\n• pH 4.2–3.9 (Optimal Window): Lactic acid softens gluten slightly, increasing extensibility while gas pockets expand freely. Peak oven spring is achieved.\n• pH < 3.8 (Over-Fermentation): Endogenous cereal protease enzymes (thiol proteases) reach peak enzymatic activity. Proteases cleave gluten protein chains into short peptides.\n\nOnce dough drops past pH 3.7, no amount of shaping or folding can restore structure—the gluten network has been chemically dissolved into liquid.\n\nMastering sourdough is managing the pH curve to maximize gas before protease enzymes dissolve the dough.',
          cta: 'Have you ever experienced dough liquefaction from extended warm fermentation?',
        },
      ],
    };
  }

  // 11. Photosynthesis & Calvin Cycle
  if (t.includes('photosynthesis') || t.includes('chlorophyll') || t.includes('calvin cycle')) {
    const isRev = isRevision || iteration > 1;
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Light Reactions & Water Photolysis',
          hook: 'Every molecule of oxygen you breathe originated from a single biophysical reaction: chlorophyll splitting water inside thylakoid membranes.',
          body: isRev
            ? 'Inside plant chloroplasts, the light-dependent reactions convert solar photons into chemical energy across two stages:\n\n1. Photolysis in Photosystem II (P680):\nWhen P680 chlorophyll absorbs a 680-nanometer photon, an electron is excited to a high-energy state. To replace that electron, an oxygen-evolving manganese-calcium cluster (Mn4CaO5) splits water: 2 H2O -> 4 H+ + 4 e- + O2. The oxygen is released as a byproduct.\n\n2. The Electrochemical Proton Gradient:\nAs electrons cascade down the electron transport chain (Plastoquinone -> Cytochrome b6f -> Plastocyanin), protons are actively pumped into the thylakoid lumen, generating a steep electrochemical gradient.\n\n3. Rotary ATP Synthesis:\nProtons escape back into the stroma through the rotor channel of ATP Synthase, spinning the catalytic head at up to 9,000 RPM to phosphorylate ADP into ATP, while Photosystem I generates NADPH.\n\nThese high-energy molecules supply the fuel required to fix carbon dioxide in the Calvin cycle.'
            : 'Inside plant chloroplasts, light reactions convert solar photons into chemical energy:\n\n1. Photolysis in Photosystem II:\nChlorophyll absorbs photons, triggering an oxygen-evolving manganese cluster to split water: 2 H2O -> 4 H+ + 4 e- + O2.\n\n2. Proton Gradient:\nElectrons moving down the transport chain pump protons into the thylakoid lumen, establishing a steep electrochemical gradient.\n\n3. ATP Synthesis:\nProtons flowing through ATP Synthase drive rotary catalysis to generate ATP and NADPH for carbon fixation.',
          cta: 'Photosynthesis is nature’s most refined molecular motor and solar energy converter.',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'RuBisCO: Nature’s Flawed Super-Enzyme',
          hook: isRev
            ? 'The most critical enzyme powering planetary life is also one of the slowest and most error-prone in biological history: meet RuBisCO.'
            : 'The most critical enzyme powering planetary life is also one of the most error-prone: meet RuBisCO.',
          body: isRev
            ? 'Ribulose-1,5-bisphosphate carboxylase-oxygenase (RuBisCO) is responsible for fixing atmospheric carbon dioxide into organic sugar.\n\nYet by biological standards, it is astonishingly clumsy:\n\n1. Sluggish Catalytic Rate:\nMost metabolic enzymes process thousands of substrate molecules per second. RuBisCO fixes only 3 to 10 CO2 molecules per second. To compensate, plants must manufacture vast quantities—making RuBisCO roughly 50% of all soluble protein in plant leaves.\n\n2. The Oxygenation Mistake (Photorespiration):\nRuBisCO evolved over 3 billion years ago when Earth atmosphere was oxygen-poor. Because it cannot cleanly distinguish between CO2 and O2, it binds oxygen roughly 25% of the time, producing toxic phosphoglycolate.\n\nPlants must spend up to 30% of their daily harvested solar energy detoxifying this error through photorespiration.\n\nEvolution does not produce perfection; it produces whatever is barely good enough to survive.'
            : 'RuBisCO fixes atmospheric carbon dioxide into organic sugar, yet it has major evolutionary flaws:\n\n1. Sluggish Catalytic Rate:\nRuBisCO fixes only 3 to 10 molecules per second, forcing plants to produce massive quantities of this enzyme.\n\n2. The Oxygenation Mistake:\nBecause it evolved in an anaerobic atmosphere, RuBisCO binds oxygen 25% of the time instead of CO2, causing photorespiration.\n\nPlants lose up to 30% of their harvested solar energy recycling this oxygenation error.',
          cta: 'Why haven’t billions of years of plant evolution engineered a replacement for RuBisCO?',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'How C4 Crops Built a Cellular Turbocharger',
          hook: 'How corn, sugarcane, and sorghum evolved a cellular turbocharger to bypass RuBisCO’s 3-billion-year-old flaw:',
          body: 'In hot, arid climates, C3 plants face a fatal dilemma: open their stomata to absorb CO2 and die of dehydration, or close stomata to conserve water and watch RuBisCO burn energy binding oxygen.\n\nOver millions of years, an elite group of grasses evolved C4 photosynthesis using Kranz anatomy:\n\n1. Two-Cell Compartmentalization:\nMesophyll cells capture atmospheric CO2 using PEP carboxylase—an enzyme with zero affinity for oxygen. They fix it into a 4-carbon acid (malate).\n\n2. The Malate Pump:\nThe 4-carbon acid is pumped into specialized, air-tight bundle sheath cells surrounding the leaf veins.\n\n3. CO2 Concentration Mechanism:\nMalate is decarboxylated inside the bundle sheath cells, raising the local CO2 concentration up to 10x atmospheric levels. RuBisCO is completely flooded with CO2, suppressing photorespiration to near zero.\n\nThis evolutionary adaptation allows C4 crops to produce twice the biomass of C3 plants using half the water.',
          cta: 'Understanding C4 plant anatomy is now the basis for genetic engineering efforts to supercharge rice crops.',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: '4-Stage Pathway: From Sunlight to Glucose',
          hook: isRev
            ? 'A 4-step biophysical trace of how a solar photon transforms into sugar molecules inside plant leaves:'
            : 'A 4-step trace of how sunlight transforms into organic sugar inside plants:',
          body: isRev
            ? '1. Photonic Excitation in Thylakoid Pigments\nPhotons strike light-harvesting complex antenna pigments, transferring energy via resonance transfer to P680 chlorophyll in Photosystem II.\n\n2. Charge Separation and Water Photolysis\nThe excited electron is ejected into the transport chain. The manganese cluster splits H2O, generating oxygen gas and releasing protons into the lumen.\n\n3. Chemiosmotic Photophosphorylation\nElectron flow down the Z-scheme generates a proton gradient across the thylakoid membrane, driving ATP Synthase to generate ATP and NADPH.\n\n4. Stromal Carbon Fixation (Calvin Cycle)\nRuBisCO combines CO2 with ribulose-1,5-bisphosphate. Using the ATP and NADPH produced in the light reactions, enzymes reduce the intermediate into glyceraldehyde 3-phosphate (G3P) to synthesize glucose and starch.'
            : '1. Photonic Excitation:\nPhotons strike antenna pigments, transferring energy to reaction center chlorophyll.\n\n2. Charge Separation:\nWater is split to replace excited electrons, releasing molecular oxygen.\n\n3. Photophosphorylation:\nA proton gradient powers ATP Synthase to create ATP and NADPH.\n\n4. Calvin Cycle Fixation:\nRuBisCO fixes atmospheric CO2 into 3-carbon sugars using light-reaction energy.',
          cta: 'Save this breakdown of nature’s fundamental solar conversion cascade.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'Thermodynamic Ceilings of Photosynthetic Efficiency',
          hook: 'Why nature’s ultimate solar panel achieves a whole-plant agricultural efficiency of only 1 to 2%:',
          body: 'While individual quantum photon capture steps in photosystems operate near 100% quantum efficiency, overall plant solar conversion drops drastically:\n\n• 47% PAR Loss: Only photosynthetically active radiation (400–700 nm) can be absorbed; ultraviolet and infrared solar energy is completely unusable.\n• 20% Reflection & Transmission: Sunlight reflects off leaf cuticle waxes or passes directly through leaf gaps.\n• 35% Thermodynamic Dissipation: Energy lost as heat during electron transfer between Photosystems II and I.\n• 25% Photorespiration & Respiration: Basal plant metabolism and RuBisCO oxygenation consume harvested sugars.\n\nNet result: theoretical maximum efficiency for C3 crops is roughly 4.6%, and real-world agricultural yield operates around 1–2%.\n\nNature optimized plants for survival and reproduction under variable sunlight, not maximum energy throughput.',
          cta: 'How does biological solar efficiency compare to modern commercial silicon photovoltaics in your view?',
        },
      ],
    };
  }

  // 9. Recursion & Call Stack Dynamics
  if (t.includes('recursion')) {
    const isRev = isRevision || iteration > 1;
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Call Stack Allocation & Base Case Invariants',
          hook: 'Recursion is not magic—it is a function that pauses its own execution, pushes a stack frame, and waits for a base case to unwind.',
          body: isRev
            ? 'When a recursive function executes, the runtime allocates a new stack frame on the call stack containing local variables, parameters, and the return address:\n\n1. The Base Case Guard:\nThe terminating condition that stops recursion. Without it, the function calls itself indefinitely until the thread stack space (typically 1–8 MB) is completely exhausted.\n\n2. The Recursive Step:\nThe function reduces the problem to a strictly smaller subproblem and calls itself with new arguments. The current execution frame pauses, preserving its state.\n\n3. Call Stack Unwinding:\nOnce the base case evaluates, return values propagate back up the stack frame by frame, popping frames off memory in LIFO (Last In, First Out) order.\n\nMastering recursion requires visualizing the stack frame push-and-pop sequence rather than trying to follow execution sequentially in your head.'
            : 'When a recursive function executes, the runtime allocates a new stack frame on the call stack containing local variables and return addresses:\n\n1. Base Case: The terminating condition that prevents unbounded execution.\n2. Recursive Step: The function reduces the problem size and calls itself.\n3. Unwinding: Once the base case returns, stack frames pop in reverse order.\n\nUnderstanding recursion requires visualizing the call stack push-and-pop sequence.',
          cta: 'What mental model helped you finally understand recursion?',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'Why Converting Everything to While Loops Hurts Readability',
          hook: 'Stop converting every recursive function into an imperative while loop just because of a theoretical stack overflow fear.',
          body: isRev
            ? 'Many engineering guidelines reflexively ban recursion in favor of imperative loops.\n\nFor linear data arrays, loops are indeed superior due to zero stack allocation overhead.\n\nHowever, for inherently hierarchical structures—such as JSON trees, HTML DOMs, and Abstract Syntax Trees (ASTs)—recursion is mathematically natural. Replacing a 6-line recursive tree traversal with an imperative loop requires manually creating and managing an auxiliary heap stack data structure.\n\nYou trade 6 lines of elegant, provably correct functional logic for 40 lines of boilerplate state management that is prone to off-by-one errors.\n\nIf recursion depth is bounded (e.g. tree depth < 100), recursive code is far more maintainable and less bug-prone.'
            : 'Many guidelines reflexively ban recursion in favor of imperative loops.\n\nFor hierarchical data like trees, JSON, and ASTs, recursion is mathematically natural. Converting it to a loop requires manually allocating and managing a custom heap stack.\n\nIf tree depth is naturally bounded, recursive functions are cleaner and less error-prone.',
          cta: 'Do you prefer recursion or explicit iterative stacks for tree traversal?',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'Circular Reference Stack Overflow Incident',
          hook: 'How an innocent recursive JSON serializer crashed a microservice with a RangeError: Maximum call stack size exceeded:',
          body: 'An engineering team deployed an internal auditing service that serialized user profile graphs to JSON.\n\nThe serialization function traversed nested object properties recursively: `function serialize(obj) { ... serialize(child); }`.\n\nIn staging with clean tree mock data, it passed flawlessly. But in production, a user account linked to a team workspace where the team owner referenced the same user account back, creating a circular graph reference.\n\nThe recursive function entered an infinite loop, pushing 10,000 stack frames onto the V8 call stack in 4 milliseconds before throwing `RangeError: Maximum call stack size exceeded` and crashing the worker process.\n\nThe fix: Pass a `visited = new Set()` to track object memory references and enforce a maximum depth bound (`depth > MAX_DEPTH`).',
          cta: 'Always guard recursive graph traversals with a visited reference set.',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: '3-Step Bug-Free Recursive Recipe',
          hook: isRev
            ? 'A 3-step mental recipe for writing recursive functions with explicit base invariants and depth bounds:'
            : 'A 3-step recipe for writing recursive functions that never crash:',
          body: isRev
            ? '1. Write the Base Case First\nIdentify the smallest possible input (e.g. `if (!node) return null;` or `if (n <= 1) return 1;`). Ensure it returns an immediate concrete value without calling the function.\n\n2. Ensure Strictly Monotonic Convergence\nVerify that the recursive argument strictly moves closer to the base case on every invocation (`n - 1`, `node.left`, `arr.slice(1)`). If the subproblem does not strictly decrease, you will create an infinite loop.\n\n3. Add Defensive Depth Bounding\nFor production code operating on untrusted data, pass an optional depth counter (`depth = 0`). If `depth > 200`, throw a descriptive configuration error before the runtime runtime stack crashes.'
            : '1. Write the Base Case First\nHandle the terminating condition before writing any recursive logic.\n\n2. Ensure Convergence\nVerify the subproblem strictly decreases in size toward the base case.\n\n3. Bound Recursion Depth\nAdd a safety depth counter to protect against malicious or malformed input cycles.',
          cta: 'Save this 3-step recursive checklist for your next algorithmic implementation.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'Call Stack Memory Overhead vs Tail-Call Elimination',
          hook: 'The physical memory cost of recursion: How stack frames consume hardware RAM:',
          body: 'In programming languages without compiler Tail-Call Optimization (TCO), every recursive call allocates a stack frame in thread memory:\n\n• Each frame allocates 64 to 256 bytes for parameters, local variables, and CPU instruction return pointers.\n• A recursion depth of 10,000 calls consumes roughly 2.5 MB of thread stack space.\n• Most operating systems and runtimes cap thread stack space at 1 MB (Node.js/V8) to 8 MB (Linux default).\n\nIf you rewrite the function using a tail-call accumulator (`return helper(n - 1, acc * n)`), a supporting compiler can reuse the existing stack frame in O(1) auxiliary space, converting recursion into a zero-overhead loop under the hood.\n\nAlways understand whether your runtime environment supports TCO before using deep recursion on large datasets.',
          cta: 'Does your primary programming language support tail-call optimization?',
        },
      ],
    };
  }

  // 10. Distributed Version Control with Git
  if (t.includes('git')) {
    const isRev = isRevision || iteration > 1;
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Content-Addressable DAG Object Store',
          hook: 'Git does not store file differences. It stores snapshots in a content-addressable Directed Acyclic Graph (DAG).',
          body: isRev
            ? 'Most developers believe Git records line-by-line diffs like older centralized systems (SVN). In reality, Git is a content-addressable object store:\n\n1. Blobs: When you stage a file, Git compresses its content and writes a "blob" object named by the SHA-1/SHA-256 hash of its bytes.\n\n2. Trees: A tree object acts like a directory, referencing blob hashes and nested sub-tree hashes with their filenames and file permissions.\n\n3. Commits: A commit object is a tiny text manifest pointing to a top-level Tree hash, parent commit hashes, author metadata, and commit message.\n\n4. Branches: A branch is literally a 41-byte text file in `.git/refs/heads/` storing the SHA hash of the latest commit.\n\nBecause every commit references the full tree snapshot, switching branches or inspecting history is virtually instantaneous.'
            : 'Git is not a diff tracker; it is an immutable content-addressable object store:\n\n1. Blobs: Compressed file contents keyed by cryptographic SHA hashes.\n2. Trees: Directory manifests referencing blobs and sub-trees.\n3. Commits: Metadata objects pointing to a root tree and parent commits.\n4. Branches: Lightweight text files storing a single 40-character commit hash.',
          cta: 'Have you ever inspected the raw objects inside your .git directory?',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'Why Giant Squash Merges Destroy Debugging',
          hook: 'Why squashing all commits into one giant 2,000-line blob destroys Git most powerful debugging superpower:',
          body: isRev
            ? 'Many engineering teams enforce a rigid rule: "Always squash and merge pull requests to keep history clean."\n\nWhile a single commit per PR looks tidy on GitHub, it completely destroys git bisect.\n\nWhen a regression appears in production 3 months later, git bisect cannot isolate which of the 18 distinct refactorings inside that 2,000-line squash commit caused the bug. You are forced to manually read 2,000 lines of code.\n\nAtomic commits with clear messages document the exact architectural rationale of each step. Keep commits atomic, and use interactive rebase (`git rebase -i`) to clean up messy WIP commits before merging.'
            : 'Squashing every PR into a single commit makes git log look clean, but it cripples git bisect.\n\nWhen a bug occurs months later, bisect points to a 2,000-line commit rather than the specific 5-line change that introduced the defect.\n\nAtomic commits provide an invaluable historical audit trail.',
          cta: 'Does your team prefer squash merges, merge commits, or rebase-and-merge?',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'Git Reflog Disaster Recovery',
          hook: 'How an engineer recovered 3 days of deleted commits after an accidental git reset --hard in 90 seconds:',
          body: 'A junior engineer accidentally ran `git reset --hard HEAD~5` and `git clean -fd` on their local feature branch, wiping out three days of unpushed commits.\n\nPanic set in. To Git, however, commits are immutable objects in the object database. Resetting a branch merely moves the branch pointer; it does not delete the commit objects.\n\nWe ran `git reflog`:\n`b7a1c49 HEAD@{1}: commit: Implement Stripe webhook verification`\n`9e2f012 HEAD@{2}: commit: Add idempotency table schema`\n\nThe reflog tracks every position of HEAD. In one command:\n`git branch recovery-branch b7a1c49`\n\nAll commits, files, and historical snapshots were restored instantaneously.\n\nLesson: In Git, as long as you committed your work, it is virtually impossible to lose it permanently.',
          cta: 'Git reflog is the ultimate developer safety net. Remember it next time you fear lost commits.',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: 'Automated Binary Search with Git Bisect',
          hook: isRev
            ? 'A 4-step protocol to isolate breaking production bugs in under 2 minutes using git bisect:'
            : 'How to find the exact commit that broke production with git bisect:',
          body: isRev
            ? '1. Start Bisect Session\n`git bisect start`\nMark the current broken commit: `git bisect bad`\nMark a known working release or tag: `git bisect good v2.4.0`\n\n2. Git Binary Search\nGit checks out the exact middle commit between good and bad. Run your test runner (`npm test`).\n\n3. Mark State\nIf tests pass: `git bisect good`\nIf tests fail: `git bisect bad`\nGit halves the search window automatically.\n\n4. Automate the Search\nEven faster: let Git run the test suite autonomously without human intervention:\n`git bisect run npm test`\nIn 6 to 10 automated test runs, Git will print the exact offending commit hash and author.'
            : '1. `git bisect start`\n2. `git bisect bad` (current broken commit)\n3. `git bisect good v1.0.0` (last known good commit)\n4. Run `git bisect run npm test` to let Git binary search and pinpoint the breaking commit autonomously.',
          cta: 'Bookmark this bisect workflow for your next tricky regression hunt.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'Cryptographic Integrity in Distributed Systems',
          hook: 'Why Linus Torvalds chose cryptographic SHA-1 hashes for Git: The mathematics of tamper-proof history:',
          body: 'In centralized version control systems, a rogue database administrator can alter past commit messages or change files without leaving a trace.\n\nGit cryptographic architecture makes silent history modification mathematically impossible:\n\n• Every commit hash is derived from its tree contents, author timestamp, and its parent commit hash.\n• Modifying a single character in a file from 5 years ago changes its blob hash, which changes the tree hash, which alters every downstream commit hash in the DAG.\n• Every developer clone contains the complete historical graph, providing decentralized cryptographic verification.\n\nGit is not just a tool for sharing code; it is a tamper-evident cryptographic ledger.',
          cta: 'Distributed consensus and cryptographic hashes make modern software collaboration possible.',
        },
      ],
    };
  }

  // 11. Sleep Quality & Cognitive Productivity
  if (t.includes('sleep') || t.includes('productivity')) {
    const isRev = isRevision || iteration > 1;
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Glymphatic Waste Clearance & Slow-Wave Sleep',
          hook: 'Here is what actually happens inside your brain during non-REM slow-wave sleep:',
          body: isRev
            ? 'During waking hours, active neural metabolism produces cellular byproducts including adenosine, tau proteins, and amyloid-beta.\n\nWhen you enter deep slow-wave non-REM sleep, something remarkable occurs:\n\n1. Astroglial Cell Shrinkage:\nGlial cells contract by up to 60%, dramatically expanding the interstitial space between neurons.\n\n2. Cerebrospinal Fluid (CSF) Flushing:\nThe brain glymphatic system pumps cerebrospinal fluid in rhythmic waves through brain tissue, flushing accumulated metabolic waste into the lymphatic system.\n\n3. Hippocampal Memory Consolidation:\nDuring slow-wave sleep and REM, the hippocampus replays short-term working memories, transferring them to the neocortex for permanent structural storage.\n\nCutting sleep short literally interrupts the biological waste disposal and memory consolidation cycle of your brain.'
            : 'During deep slow-wave sleep, glial cells contract by 60%, allowing cerebrospinal fluid to flush metabolic waste (including beta-amyloid) through the glymphatic system.\n\nMeanwhile, the hippocampus replays daily memory traces to consolidate them into long-term neocortical storage.\n\nSleep is an active neurobiological restoration process, not passive downtime.',
          cta: 'How does your sleep quality impact your focus and problem-solving ability the next day?',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'Caffeine Only Masks Adenosine Sleep Debt',
          hook: 'Caffeine does not give you energy. It only temporarily blinds your brain to how exhausted it actually is:',
          body: isRev
            ? 'Throughout the day, every minute you are awake, your neurons break down ATP for energy, releasing adenosine as a byproduct.\n\nAdenosine binds to A1 and A2A receptors in the brain, creating "sleep pressure"—that heavy feeling of mental fatigue that prompts you to sleep.\n\nCaffeine has a molecular structure almost identical to adenosine. It slots directly into adenosine receptors, blocking them without activating them.\n\nHowever: Caffeine does not stop adenosine production. While you feel artificially alert, adenosine continues to accumulate in the background.\n\nWhen the liver metabolizes the caffeine (half-life of 5 to 7 hours), the dam breaks: accumulated adenosine floods receptors simultaneously, triggering the dreaded afternoon crash.\n\nCaffeine borrows energy from tomorrow; it never pays off sleep debt.'
            : 'Adenosine accumulates in the brain throughout waking hours, creating natural sleep pressure.\n\nCaffeine binds to adenosine receptors and blocks them, but does not stop adenosine from building up.\n\nWhen caffeine metabolizes, accumulated adenosine rushes into the cleared receptors, causing a sharp energy crash.\n\nCaffeine masks fatigue; only slow-wave sleep clears it.',
          cta: 'Have you noticed an afternoon crash when relying heavily on morning caffeine?',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'The Illusion of Adaptation in Sleep Studies',
          hook: 'How a clinical study on 6-hour sleep restriction proved that self-reported alertness is completely unreliable:',
          body: 'Researchers at the University of Pennsylvania split healthy adult participants into three groups: 8 hours, 6 hours, and 4 hours of sleep per night for 14 consecutive days.\n\nThe 6-hour sleep group reported that after a few days, they felt "fine" and believed they had adapted to their new schedule.\n\nHowever, objective cognitive testing told a radically different story:\n• Psychomotor vigilance test reaction times degraded continuously.\n• Working memory capacity plummeted by over 50%.\n• Cognitive error rates on complex logical reasoning matched participants who had been kept awake for 24 hours straight without sleep.\n\nThe critical takeaway: You cannot subjectively assess your own cognitive impairment caused by sleep debt. Your brain loses the ability to recognize its own degradation.',
          cta: 'The human brain is notoriously bad at judging its own cognitive decline under sleep restriction.',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: '4-Step Neurobiology Sleep Protocol',
          hook: isRev
            ? 'A 4-step protocol backed by circadian neuroscience to maximize restorative slow-wave sleep:'
            : 'A 4-step protocol to improve sleep quality backed by circadian biology:',
          body: isRev
            ? '1. View Sunlight Within 30 Minutes of Waking\nExpose your eyes to 10–15 minutes of outdoor sunlight. Photons trigger intrinsically photosensitive retinal ganglion cells (ipRGCs), resetting the suprachiasmatic master circadian clock and timing melatonin release 14 hours later.\n\n2. Establish a 10-Hour Caffeine Cutoff\nWith a half-life of 5–7 hours and quarter-life of 12 hours, a 2:00 PM espresso leaves 25% of active caffeine in your brain at midnight, disrupting slow-wave deep sleep architecture.\n\n3. Facilitate Core Body Temperature Drop\nThe human body must drop its core temperature by 1–2°C to initiate and sustain deep sleep. Keep your bedroom cool (18–20°C / 65–68°F).\n\n4. Anchor a Consistent Wake Window\nWaking up at the exact same time (within a 30-minute window) 7 days a week anchors your circadian rhythm far more effectively than going to bed early.'
            : '1. Morning Sunlight: View outdoor light within 30 minutes of waking to reset circadian clocks.\n2. Caffeine Cutoff: Stop caffeine intake 10 hours before bed to protect deep sleep architecture.\n3. Thermal Drop: Sleep in a cool room (18–20°C) to allow core body temperature to decline.\n4. Fixed Wake Time: Maintain consistent wake times to anchor circadian melatonin release.',
          cta: 'Save this protocol to optimize your cognitive recovery and mental clarity.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'Prefrontal Executive Function Latency',
          hook: 'The cognitive latency penalty: Measuring how chronic sleep loss degrades technical problem solving:',
          body: 'Neuroimaging studies show that the prefrontal cortex—responsible for working memory, abstract reasoning, and emotional regulation—is the most sensitive region to sleep loss:\n\n• Working Memory Degradation: 1 night of partial sleep restriction drops active working memory span by 30%, making it difficult to hold multi-layered architectural problems in your head.\n• Amygdala Reactivity: Sleep deprivation disconnects the prefrontal cortex from the emotional amygdala, causing a 60% increase in stress response and irrational risk aversion.\n• Code Quality & Bugs: Studies tracking software development teams show that engineers with sleep debt take 50% longer to resolve algorithmic bugs and introduce significantly higher regression rates.\n\nPrioritizing 7.5 to 8.5 hours of sleep is not a lifestyle luxury; it is the highest-leverage performance optimization for knowledge workers.',
          cta: 'How many hours of sleep do you need to perform at your absolute peak?',
        },
      ],
    };
  }

  // 12. Espresso Machine Coffee Extraction
  if (t.includes('espresso') || t.includes('coffee')) {
    const isRev = isRevision || iteration > 1;
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Hydraulics & Pressure Extraction',
          hook: 'How a mechanical espresso machine extracts coffee: The physics of 9 bars of pressure and puck resistance:',
          body: isRev
            ? 'Espresso is not just concentrated drip coffee; it is a rapid hydraulic extraction under extreme pressure:\n\n1. Hydraulic Pressure & Water Temperature:\nA vibratory or rotary pump forces water heated to 90–96°C (195–205°F) into the group head at 9 atmospheres (bars) of pressure—roughly 130 psi, equivalent to 90 meters underwater.\n\n2. The Compacted Coffee Puck:\nThe barista tamps 18 grams of finely ground coffee into a portafilter basket. The compacted bed provides hydraulic resistance against the pressurized water.\n\n3. Solubles Dissolution & Emulsification:\nPressurized water dissolves water-soluble flavor compounds (caffeine, chlorogenic acids, lipids, melanoidins) and suspends fine insoluble particles. The intense pressure emulsifies insoluble coffee oils into a golden, carbon dioxide-rich foam called crema.\n\nIn 25 to 30 seconds, 18 grams of dry ground coffee yields 36 grams of rich liquid espresso with a total dissolved solids (TDS) concentration of 8 to 11%.'
            : 'Espresso extraction relies on hydraulic physics:\n\n1. Water at 90–96°C is pumped at 9 bars (130 psi) of pressure into the portafilter.\n2. The finely ground, tamped coffee puck creates hydraulic resistance.\n3. Soluble flavor compounds dissolve and insoluble oils emulsify into crema.\n\nIn 25–30 seconds, 18g of coffee yields 36g of espresso.',
          cta: 'What is your favorite coffee bean origin for pulling espresso?',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'Why Grinding Finer Causes Channeling and Sour Shots',
          hook: 'Why grinding your coffee finer can actually make your espresso taste more sour, not stronger:',
          body: isRev
            ? 'The universal advice for home baristas when a shot flows too fast is: "Grind finer."\n\nHowever, when you grind past the puck optimal density, puck resistance spikes. When 9 bars of pressurized water hits an overly fine coffee bed, it cannot permeate the bed uniformly.\n\nWater always follows the path of least resistance. It punches microscopic cracks through the puck—a defect called channeling.\n\nPressurized water rushes through these high-velocity micro-channels at blistering speed, severely over-extracting the bitter tannins along the crack while leaving 80% of the surrounding puck completely untouched and under-extracted.\n\nThe result? A shot that tastes simultaneously unpleasantly sour, hollow, and astringently bitter.\n\nInstead of blindly grinding finer, focus on even puck preparation: use a WDT needle tool to eliminate clumps and tamp level.'
            : 'When you grind too fine, the coffee puck creates excessive resistance.\n\nPressurized water punches micro-cracks (channeling) through the bed, rushing through fissures while leaving the rest dry.\n\nThe resulting shot tastes astringently sour and bitter simultaneously.\n\nEven distribution with a needle tool (WDT) matters far more than grinding to powder.',
          cta: 'Have you ever struggled with channeling when dialing in espresso?',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'Digital Refractometer Dial-In Case Study',
          hook: 'How measuring total dissolved solids (TDS) with a digital refractometer eliminated guesswork in a specialty cafe:',
          body: 'A specialty cafe struggled with shot consistency during the morning rush. Despite using calibrated scales, espresso flavor drifted from sweet to unpleasantly harsh.\n\nThe lead barista introduced a digital optical refractometer to measure Total Dissolved Solids (TDS) and calculate extraction yield:\n`Extraction Yield (%) = (Espresso Yield * TDS %) / Dry Dose`\n\nThey discovered that while dry dose (18.0g) and liquid output (36.0g) were identical, grinder burr heating over 45 minutes caused thermal expansion, shifting grind particle size distribution.\n\nTDS dropped from 10.0% (20% extraction yield, sweet and balanced) down to 7.5% (15% extraction yield, sour and underdeveloped).\n\nBy adjusting the grinder burrs two micro-notches coarser and calibrating to a 20% extraction yield window, flavor balance was restored across every shot.',
          cta: 'Mathematical measurements transform culinary craft into repeatable science.',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: '4-Step Barista Dial-In Protocol',
          hook: isRev
            ? 'A 4-step barista protocol to dial in any espresso coffee beans with mathematical repeatability:'
            : 'A 4-step protocol to dial in espresso coffee beans:',
          body: isRev
            ? '1. Lock Your Brew Ratio First\nEstablish a fixed dry-to-liquid ratio (e.g. 1:2 ratio: 18g ground coffee in portafilter to 36g liquid espresso in the cup). Keep this ratio constant.\n\n2. Calibrate Grind Size for Flow Rate\nAdjust grinder burrs until that 36g liquid yield flows in 25 to 30 seconds from the moment the pump activates.\n\n3. Optimize Puck Distribution (WDT)\nUse a 0.3mm needle Weiss Distribution Technique (WDT) tool to declump grounds in the portafilter basket, followed by a firm, level tamp.\n\n4. Fine-Tune Extraction by Taste\nIf the shot tastes sharp, grassy, or sour, it is under-extracted: grind slightly finer or extend yield to 1:2.2 (39g). If it tastes dry, astringent, or bitter, it is over-extracted: grind slightly coarser.'
            : '1. Lock Dose Ratio: Fix an 18g in / 36g out baseline (1:2 ratio).\n2. Target Flow Time: Adjust grind size until 36g extracts in 25–30 seconds.\n3. Puck Preparation: Declump grounds with needles and tamp level to prevent channeling.\n4. Calibrate by Taste: Sour = under-extracted (grind finer); Bitter/dry = over-extracted (grind coarser).',
          cta: 'Save this dial-in guide for your next weekend espresso session.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'The 18–22% Extraction Yield Chemistry Window',
          hook: 'The chemistry of espresso extraction: Why coffee compounds dissolve in strict sequential stages:',
          body: 'Roasted coffee bean mass consists of roughly 30% water-soluble compounds and 70% insoluble cellulose plant fiber.\n\nWhen pressurized hot water permeates the coffee puck, chemical compounds dissolve at different rates:\n\n• Stage 1 (0–10s): High-solubility fruit acids, salts, and free caffeine dissolve first. If you stop the shot here, it tastes aggressively sour.\n• Stage 2 (10–22s): Mid-solubility caramelized sugars, lipids, and aromatic aldehydes dissolve, providing body, sweetness, and complexity.\n• Stage 3 (22–30s+): Low-solubility bitter tannins, lignin, and astringent plant phenols begin dissolving.\n\nDecades of sensory and chemical research by the Specialty Coffee Association (SCA) confirm that the optimal balance lies between 18% and 22% total extraction yield.\n\nBelow 18% is under-extracted (sour and grassy); above 22% is over-extracted (ashy and bitter).',
          cta: 'Do you prefer lighter fruit-forward espresso roasts or traditional chocolatey roasts?',
        },
      ],
    };
  }

  // 13. Autonomous Multi-Agent AI Content Systems
  if (t.includes('autonomous') || t.includes('multi-agent') || t.includes('agentic')) {
    const isRev = isRevision || iteration > 1;
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Deterministic State Machine Graphs',
          hook: 'How autonomous multi-agent AI systems actually work: Moving beyond single-prompt chatbots:',
          body: isRev
            ? 'Single-prompt chat completions fail when asked to execute complex, multi-stage workflows.\n\nAutonomous multi-agent architectures resolve this by organizing specialized LLM agents into a deterministic state machine graph:\n\n1. Topic Analyzer: Analyzes user intent, extracts core subjects, and establishes explicit domain boundaries.\n2. Research Specialist: Gathers external ground-truth facts, documentation, and source citations without hallucinating statistics.\n3. Content Strategist: Formulates distinct narrative angles and audience empathy frameworks tailored to specific platform constraints.\n4. Writer Agent: Synthesizes research into platform-native formats while adhering to strict anti-filler rules.\n5. Critic Reviewer: Audits drafts against deterministic criteria, routing failing posts back for targeted revision loops.\n\nBy decoupling execution from evaluation, multi-agent pipelines deliver consistent, high-fidelity results.'
            : 'Production AI pipelines move beyond naive chat prompting:\n\n1. Topic Analyzer: Defines scope and forbids off-topic drift.\n2. Research Agent: Gathers verifiable domain facts and citations.\n3. Strategist Agent: Maps distinct editorial angles.\n4. Writer Agent: Generates content adhering to strict quality rules.\n5. Critic Agent: Evaluates drafts against programmatic rubric gates.',
          cta: 'Have you built or experimented with multi-agent state graphs?',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'Why More Agent Iterations Compound Hallucinations Without Gates',
          hook: 'Why looping an AI agent 5 times often makes the output worse, not better:',
          body: isRev
            ? 'A common misconception in agentic AI is that "more reflection loops always equal better output."\n\nIn reality, unconstrained multi-turn reflection often leads to conversational drift and compounding hallucinations. Without deterministic programmatic guardrails, the critic agent invents nitpicky or contradictory critiques, forcing the writer to introduce corporate filler.\n\nEffective agentic refinement requires:\n• Deterministic Regex and AST Checks: Programmatically reject banned filler phrases and malformed templates before LLM evaluation.\n• Selective Post-Level Revisions: If Post 1 passes and Post 2 fails, revise only Post 2 rather than regenerating the entire draft.\n• Hard Maximum Iterations: Bound execution cycles (e.g. 2–3 iterations) to prevent infinite loops and runaway token costs.\n\nAutonomous agents are only as good as the deterministic verification gates that bound them.'
            : 'Unconstrained reflection loops cause agents to hallucinate contradictory critique.\n\nEffective multi-agent systems rely on programmatic regex checks, selective post revisions, and bounded iteration limits.\n\nEvaluation rigor beats open-ended chat loops.',
          cta: 'How do you prevent agentic drift in multi-turn AI workflows?',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'Closed-Loop Self-Healing Test Migration',
          hook: 'How an autonomous multi-agent pipeline investigated and fixed a test suite failure without human intervention:',
          body: 'During an automated framework migration, an engineering team used an agentic pipeline to update 40 API endpoints.\n\nThe pipeline operated with direct workspace tool access:\n1. The researcher indexed AST symbol references across the repository.\n2. The writer modified function signatures to match the new schema.\n3. The test verifier executed vitest locally. When 3 integration tests failed with status 500, the agent captured the stack trace, located line 84 in the router, patched the null check, and re-ran the test suite.\n4. Static analysis passed, and the agent presented a verified, passing git diff to the human engineer for final review.\n\nThe entire migration was resolved in 8 minutes with full test verification.',
          cta: 'Closed-loop tool execution transforms AI from an autocomplete suggestion into an autonomous collaborator.',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: '4-Step Production Agent Architecture Blueprint',
          hook: isRev
            ? 'A 4-step architectural blueprint for building reliable multi-agent systems in production:'
            : 'A 4-step blueprint for building reliable multi-agent systems:',
          body: isRev
            ? '1. Define Strict Zod Schemas for Every Node\nNever pass raw unstructured strings between agents. Enforce strongly-typed JSON schemas at every transition edge to prevent schema hallucinations.\n\n2. Isolate Specialized Agent Personas\nKeep agent system prompts narrow and focused. A research agent should only gather facts; a critic should only evaluate against criteria.\n\n3. Implement Deterministic Verification Gates\nCombine fast rule-based linters (regex checks, keyword overlap, length bounds) with LLM semantic evaluation.\n\n4. Track Telemetry and State Transitions\nPersist full execution transcripts, token counts, and revision diffs to a database for auditability and observability.'
            : '1. Strict Type Schemas: Enforce typed JSON schemas at every node edge.\n2. Specialized Personas: Decouple research, writing, and auditing into separate nodes.\n3. Programmatic Gates: Filter filler and malformed patterns with regex before LLM grading.\n4. Full Telemetry: Record agent execution steps, drafts, and reviews in a database.',
          cta: 'Save this architectural blueprint for your next agentic AI system.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'Closed-Loop Tool Execution Economics',
          hook: 'The economic math behind closed-loop AI agents vs manual copy-paste chat:',
          body: 'Traditional developer interaction with AI chat models incurs severe context-switching overhead:\n\n• Traditional AI Chat:\n  - 3 to 5 manual prompt revisions\n  - Copying diffs into IDE\n  - Running tests manually\n  - Pasting error traces back into chat\n  - Context switching: 15–20 minutes per task\n\n• Closed-Loop Agentic Execution:\n  - Single specification prompt\n  - Autonomous file edits, test execution, and stack trace diagnosis\n  - Developer reviews verified diff\n  - Context switching: < 2 minutes\n\nThe real breakthrough in modern AI is not model size; it is integrating autonomous execution into closed feedback loops.',
          cta: 'How much developer time does your team lose to manual prompt copy-pasting?',
        },
      ],
    };
  }

  // 14. Jet Engine Thrust Reversal Systems & Aerodynamic Braking
  if (t.includes('thrust') || t.includes('reverser') || (t.includes('jet') && t.includes('engine'))) {
    const isRev = isRevision || iteration > 1;
    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Cold-Stream Bypass Redirection via Blocker Doors',
          hook: 'How commercial jet engines generate reverse thrust upon landing (without running backwards):',
          body: isRev
            ? 'Many passengers assume a jet engine physically spins backwards upon touchdown. In reality, a jet turbine cannot reverse rotation.\n\nOn modern high-bypass commercial turbofans (such as the CFM56 or GE90), reverse thrust redirects the cold bypass air:\n\n1. Translating Cowl Activation:\nUpon main gear compression, hydraulic or pneumatic actuators slide the outer engine nacelle sleeve rearward on tracks.\n\n2. Blocker Doors Deploy:\nHeavy mechanical blocker doors pivot inward across the bypass duct, completely sealing off the rearward exhaust path.\n\n3. Cascade Vanes Direct Airflow Forward:\nWith the rear duct blocked, the bypass fan air—which accounts for up to 80% of total engine thrust—is forced outward and forward through angled titanium cascade vanes.\n\nRather than propelling the aircraft forward, hundreds of kilograms of bypass air per second are redirected forward at a roughly 45-degree angle, producing powerful aerodynamic braking.'
            : 'Jet engines cannot spin backwards. On modern high-bypass turbofans, reverse thrust works by redirecting cold bypass airflow:\n\n1. Translating cowls slide rearward upon touchdown.\n2. Internal blocker doors seal off the rear exhaust duct.\n3. Fan bypass air (up to 80% of total engine mass flow) is forced forward through angled cascade vanes.\n\nRedirecting this massive volume of air forward generates substantial aerodynamic deceleration.',
          cta: 'Have you ever watched the engine cowls slide open upon landing?',
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'Why Wheel Brakes Stop the Plane, Not Reverse Thrust',
          hook: 'Why reverse thrust does NOT do the heavy lifting to stop an airliner—and why pilots must shut it off at 60 knots:',
          body: isRev
            ? 'It is a widespread belief that reverse thrust is what stops a 150-ton jetliner after touchdown.\n\nIn reality:\n• Carbon wheel brakes and wing ground spoilers provide over 75% of total stopping force on dry runways. Ground spoilers dump lift, slamming 100% of aircraft weight onto wheels to maximize tire grip.\n• Reverse thrust typically only produces 20% to 30% of rated forward thrust. Its primary purpose is to relieve thermal load on wheel brakes and prevent hydroplaning on contaminated, wet, or icy runways.\n• Crucially, pilots must throttle reverse thrust back to idle by 60 knots (70 mph). Below 60 knots, high-velocity redirected air forms ground vortices that suck runway gravel, sand, and debris directly into the engine intake, causing catastrophic Foreign Object Damage (FOD) and compressor stalls.\n\nWheel brakes bring the plane to a halt; reverse thrust merely assists during the high-speed rollout.'
            : 'Many believe reverse thrust is the primary stopping mechanism for landing airliners. In reality:\n\n• Carbon wheel brakes and ground spoilers provide over 75% of deceleration on dry runways.\n• Reverse thrust generates only 20–30% of forward thrust, mainly reducing brake wear and preventing hydroplaning on wet pavement.\n• Pilots must reduce reversers to idle by 60 knots to prevent runway debris from being sucked into the engine intake (FOD).\n\nReverse thrust assists at high speed, but wheel brakes do the real stopping.',
          cta: 'Did you know pilots must stow thrust reversers before slowing to taxi speed?',
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'Contaminated Runway Deceleration',
          hook: 'How aerodynamic reverse thrust prevented a runway excursion during a winter crosswind landing:',
          body: 'A Boeing 737 touched down on a snow-contaminated runway with poor braking action.\n\nThe moment tires touched down, dynamic hydroplaning occurred: a film of slush separated the rubber tires from the pavement, dropping the coefficient of friction by over 70%. The anti-skid system pulsed the brakes, but wheel braking was virtually ineffective.\n\nThe flight crew immediately pulled the reverse thrust levers to maximum detent:\n1. Translating cowls deployed within 1.5 seconds.\n2. Cold bypass fan air blasted forward, generating 25,000 pounds of reverse aerodynamic drag.\n3. Because aerodynamic reverse thrust relies purely on air mass and forward velocity—not ground friction—it rapidly decelerated the aircraft from 140 knots down to 80 knots.\n\nBy the time the jet reached 60 knots, wheel brakes regained mechanical grip, and the aircraft came to a safe stop 1,200 feet before the runway end.\n\nAerodynamic deceleration is the ultimate safety redundancy when surface friction vanishes.',
          cta: 'When pavement friction fails, aerodynamics saves the day.',
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: 'The 4-Step Cockpit Touchdown Sequence',
          hook: isRev
            ? 'The exact 4-step sequence pilots follow to deploy reverse thrust upon touchdown:'
            : 'The 4-step cockpit sequence for reverse thrust deployment upon touchdown:',
          body: isRev
            ? '1. Main Gear Compression & Ground Spoilers\nAs the main landing gear strikes the pavement, weight-on-wheels (squat) switches compress. Ground spoilers immediately deploy across the wings, destroying lift and holding the tires firmly against the tarmac.\n\n2. Unlock Reverse Thrust Interlocks\nForward thrust levers must be at idle. The pilot reaches for the piggyback reverse levers mounted on the throttles. Mechanical interlocks prevent reverse deployment until the translating cowls have fully traveled.\n\n3. Modulate Reverse Thrust Detent\nOnce the cowl transit lights illuminate green, pilots pull the reverse levers past the detent to command reverse thrust. The FADEC (Full Authority Digital Engine Control) spools the fan up while keeping core fuel flow within thermal limits.\n\n4. The 60-Knot Cutoff\nAs the aircraft decelerates through 60 to 70 knots, the pilot pushes the reverse levers back to the reverse idle detent to prevent FOD ingestion, before completely stowing the cowls prior to turning off the active runway.'
            : '1. Main Gear Touchdown: Weight-on-wheels switches trigger automatic ground spoiler deployment.\n2. Throttle Interlock Release: Throttle levers at idle allow reverse piggyback levers to be raised.\n3. Modulate Reverse Detent: Pull reversers to command fan acceleration once cowls are fully translated.\n4. 60-Knot Cutoff: Push reversers back to idle by 60 knots to avoid ingesting runway debris into the intake.',
          cta: 'Save this breakdown for your next flight or simulator session.',
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'The Deceleration Physics (P = F * v)',
          hook: 'The physics of reverse thrust: Why it does 80% of its work in the first 5 seconds of rollout:',
          body: 'Why do pilots deploy reverse thrust immediately upon main gear touchdown and stow it shortly after?\n\nThe answer lies in kinetic energy and power dissipation physics:\n`P = F * v`\n(Power dissipated = Thrust force * Aircraft velocity)\n\n• At touchdown (140 knots / 72 m/s), a given reverse thrust force dissipates kinetic energy at more than double the rate than it does at 70 knots (36 m/s).\n• Kinetic energy scales with the square of velocity (`E_k = 0.5 * m * v^2`). The first 30 knots of speed reduction (140 -> 110 knots) sheds far more total energy than the final 30 knots (30 -> 0 knots).\n\nBy delivering massive aerodynamic drag at peak forward velocity, reverse thrust absorbs millions of foot-pounds of kinetic energy before wheel brake carbon discs can overheat.\n\nTiming aerodynamic braking at maximum velocity maximizes safety and component longevity.',
          cta: 'Physics dictates cockpit procedures—especially when stopping a 70-ton machine at 150 mph.',
        },
      ],
    };
  }

  // 15. General Dynamic Fallback for Arbitrary User Topics (100% EXPLANATORY, ZERO FILLER, DYNAMICALLY POWERED BY RESEARCH)
  const isRev = isRevision || iteration > 1;

  if (research && research.summary) {
    const p1 = research.keyPoints?.[0] || `Understanding the fundamental mechanics of ${norm}`;
    const p2 = research.keyPoints?.[1] || `Key operational distinctions and governing principles in ${norm}`;
    const p3 = research.keyPoints?.[2] || `Practical methodologies and implementation guidelines for ${norm}`;
    const rawCaution = research.cautions?.[0] || '';
    const cleanCaution = rawCaution.replace(/^avoid\s+/i, '').replace(/superficial oversimplifications\.?/i, 'oversimplified assumptions');
    const caution = cleanCaution.length > 5 ? cleanCaution : `unverified assumptions regarding ${norm}`;
    const fact1 = research.facts?.[0]?.claim || `Verifiable empirical findings regarding ${norm}`;
    const fact2 = research.facts?.[1]?.claim || `Quantitative boundaries and trade-offs observed in ${norm}`;
    const example1 = research.relevantExamples?.[0] || `Real-world application of ${norm}`;
    const example2 = research.relevantExamples?.[1] || example1;

    return {
      posts: [
        {
          id: 'post_educational',
          category: 'Educational',
          angle: 'Foundational Principles & Mechanics',
          hook: `How ${norm} operates: Key principles and real-world mechanisms:`,
          body: isRev
            ? `${research.summary}\n\nKey governing factors to understand:\n• Core Principle: ${p1}\n• System Dynamics: ${p2}\n• Real-World Manifestation: ${example1}\n\nUnderstanding these underlying mechanics allows practitioners to make informed design decisions.`
            : `${research.summary}\n\nCore factors to understand:\n• Principle: ${p1}\n• Dynamics: ${p2}\n\nExamining these fundamentals explains how ${norm} operates in practice.`,
          cta: `How do these foundational concepts of ${norm} align with your experience?`,
        },
        {
          id: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          angle: 'Challenging Common Misconceptions',
          hook: `The common misconception about ${norm} and what the evidence actually shows:`,
          body: isRev
            ? `Standard explanations of ${norm} frequently rely on oversimplified assumptions that fail under real-world scrutiny.\n\nKey pitfall: Overlooking ${caution}.\n\nIn reality, empirical evidence demonstrates otherwise:\n• ${fact1}\n• Governing Constraint: ${fact2}\n\nEvaluating the actual physical or logical constraints prevents costly mistakes.`
            : `Standard explanations of ${norm} often oversimplify the governing constraints.\n\nKey pitfall to avoid: ${caution}.\n\nEmpirical reality: ${fact1}.\n\nAlways evaluate ${norm} against empirical facts rather than assumptions.`,
          cta: `Where have you seen standard advice about ${norm} fail?`,
        },
        {
          id: 'post_storytelling',
          category: 'Storytelling / Case Study',
          angle: 'Real-World Case Study Investigation',
          hook: `A real-world investigation into ${norm}: Resolving performance anomalies at the root cause:`,
          body: isRev
            ? `In a demanding operational environment involving ${norm}, practitioners encountered an unexpected performance challenge.\n\nInitial diagnostic assumptions focused on surface symptoms, but standard adjustments yielded no improvement.\n\nA systematic analysis of the underlying variables was conducted:\n• Practitioners verified initial baseline specifications and input tolerances.\n• Investigation revealed the root factor: ${fact1}.\n• By accounting for ${caution} and calibrating according to ${example1}, normal operation was achieved.\n\nThe lesson: Complex challenges are resolved by understanding governing domain facts rather than applying superficial patches.`
            : `In an operational setting involving ${norm}, practitioners faced an unexpected challenge.\n\nInvestigating the root cause revealed: ${fact1}.\n\nBy systematically addressing ${caution}, reliable operation was established.\n\nRoot-cause understanding is essential for resolving domain challenges in ${norm}.`,
          cta: `Have you encountered a similar challenge when working with ${norm}?`,
        },
        {
          id: 'post_practical',
          category: 'Practical / Step-by-Step',
          angle: 'Implementation Protocol & Best Practices',
          hook: isRev
            ? `A 4-step framework for analyzing and applying ${norm}:`
            : `A practical framework for understanding ${norm}:`,
          body: isRev
            ? `1. Verify Baseline Conditions\nEnsure initial parameters and operating environment meet verified requirements before proceeding.\n\n2. Calibrate Core Controls: ${p1}\nTune primary operational variables to operate within optimal tolerance ranges.\n\n3. Account for Edge Cases & Pitfalls\nDefensively guard against known failure modes: ${caution}.\n\n4. Validate with Real-World Benchmarks\nTest the configuration against empirical standards (${example2}) to ensure stability.`
            : `1. Verify Baseline Conditions: Ensure operating parameters meet initial specifications.\n2. Calibrate Core Controls: Align with ${p1}.\n3. Guard Against Edge Cases: Avoid ${caution}.\n4. Benchmark Results: Verify against ${example2}.`,
          cta: `Save this framework to deepen your practical understanding of ${norm}.`,
        },
        {
          id: 'post_insight',
          category: 'Insight-Driven',
          angle: 'Governing Trade-offs & Performance Bounds',
          hook: `The fundamental physical and operational bounds that govern ${norm}:`,
          body: isRev
            ? `Analyzing the performance boundaries of ${norm} reveals key governing trade-offs:\n\n• Primary Constraint: ${fact2}\n• Core Operational Balance: ${p2}\n• Known Vulnerability: ${caution}\n\nEvery practical implementation balances competing priorities. Understanding these trade-offs ensures robust long-term outcomes.`
            : `Every system balances core constraints. In ${norm}, key trade-offs include:\n\n• Constraint: ${fact2}\n• Operational Balance: ${p2}\n\nEffective practitioners understand these trade-offs when making design choices.`,
          cta: `Which of these governing factors is most critical in ${norm}?`,
        },
      ],
    };
  }

  // Fallback when research is not available: Clean, informative posts with zero banned phrases
  return {
    posts: [
      {
        id: 'post_educational',
        category: 'Educational',
        angle: 'Foundational Principles & Mechanics',
        hook: `How ${norm} operates: Core principles and physical mechanics explained:`,
        body: isRev
          ? `Understanding ${norm} begins with examining its governing principles and primary components.\n\nIn real-world applications, ${norm} operates through defined interactions where specific inputs produce measurable outcomes. Analyzing these relationships step-by-step clarifies how the system behaves under varied conditions.\n\nMastery comes from understanding these foundational principles rather than relying on superficial assumptions.`
          : `Understanding ${norm} begins with examining its governing principles and primary components.\n\nAnalyzing these relationships step-by-step clarifies how the system behaves under varied conditions.\n\nMastery comes from understanding these foundational principles.`,
        cta: `How do these foundational concepts of ${norm} align with your experience?`,
      },
      {
        id: 'post_contrarian',
        category: 'Contrarian / Question-Driven',
        angle: 'Challenging Common Misconceptions',
        hook: `The most common misconception about ${norm} and why it falls apart in practice:`,
        body: isRev
          ? `Most surface-level guides explain ${norm} using oversimplified rules of thumb that fail under scrutiny.\n\nThe conventional assumption is that ${norm} operates through simple linear cause-and-effect. In practice, non-obvious constraints and edge-case interactions dictate actual performance.\n\nBefore adopting standard advice, always evaluate the empirical trade-offs of ${norm} under real-world conditions.`
          : `Most surface-level guides explain ${norm} using oversimplified rules that fail under scrutiny.\n\nIn practice, non-obvious constraints dictate actual performance.\n\nAlways evaluate the empirical trade-offs of ${norm} under real-world conditions.`,
        cta: `Where have you seen standard advice about ${norm} fail?`,
      },
      {
        id: 'post_storytelling',
        category: 'Storytelling / Case Study',
        angle: 'Real-World Case Study Investigation',
        hook: `A real-world case investigation in ${norm}: How analyzing operational behavior resolved an anomaly:`,
        body: `In an operational setting involving ${norm}, practitioners encountered an unexpected challenge.\n\nInitially, operators assumed external factors were responsible. However, a systematic investigation traced the behavior step-by-step to an uncalibrated operating parameter.\n\nBy isolating the key variables and adjusting the configuration within proper tolerance windows, normal operation was restored.\n\nThe lesson: Systematic diagnostic tracing based on domain principles resolves complex challenges.`,
        cta: `Have you ever diagnosed a breakdown that turned out to be completely different from initial assumptions?`,
      },
      {
        id: 'post_practical',
        category: 'Practical / Step-by-Step',
        angle: 'Implementation Protocol & Best Practices',
        hook: isRev
          ? `A 4-step framework for analyzing and applying ${norm}:`
          : `A practical framework for understanding ${norm}:`,
        body: isRev
          ? `1. Verify Baseline Inputs\nConfirm that incoming specifications and initial conditions meet exact tolerances before proceeding.\n\n2. Calibrate Core Parameters\nTune the primary operating variables to run within their optimal efficiency window.\n\n3. Test Edge-Case Tolerances\nEvaluate behavior under stress and boundary conditions to observe stability.\n\n4. Establish Continuous Verification\nMonitor key metrics at regular intervals to detect parameter drift before failures occur.`
          : `1. Verify Baseline Inputs: Confirm that specifications meet required tolerances.\n2. Calibrate Parameters: Tune operating variables for optimal efficiency.\n3. Test Boundaries: Evaluate behavior under edge-case conditions.\n4. Monitor Metrics: Track performance to maintain ongoing stability.`,
        cta: `Save this framework to deepen your practical understanding of ${norm}.`,
      },
      {
        id: 'post_insight',
        category: 'Insight-Driven',
        angle: 'Governing Trade-offs & Performance Bounds',
        hook: `The fundamental physical and operational bounds that govern ${norm}:`,
        body: `Every implementation of ${norm} involves balancing core constraints and competing priorities:\n\n• Efficiency vs Redundancy: Streamlined setups minimize overhead but require tighter operating tolerances.\n• Precision vs Flexibility: High-precision configurations excel within narrow conditions but require recalibration when parameters drift.\n\nEffective practitioners understand the structural trade-offs of ${norm} and design for their specific operating requirements.`,
        cta: `Which of these trade-offs is most challenging to balance in your experience?`,
      },
    ],
  };
}

// =========================================================================
// 3. INSTAGRAM REEL SCRIPT MOCKS
// =========================================================================
export function getMockReelScript(
  topic: string,
  tone: string = 'Professional',
  iteration: number = 1,
  isRevision: boolean = false,
  research?: ResearchResult
): InstagramReelOutput {
  const t = topic.toLowerCase();
  const norm = normalizeTopic(topic);

  if (t.includes('webb') || t.includes('beryllium') || t.includes('telescope')) {
    return {
      title: 'JWST Optics: Why NASA Used Beryllium and 48 Grams of Gold',
      estimatedDuration: '60–90 seconds',
      targetDuration: '60–90 seconds',
      wordCount: 195,
      hook: 'Why did NASA spend $10 Billion building telescope mirrors out of toxic beryllium and gold instead of glass?',
      sections: [
        {
          timestamp: '0–5 sec',
          visual: 'Dramatic slow-motion zoom on the gleaming gold hexagonal primary mirror of JWST in space.',
          voiceover: 'Why did NASA spend 10 billion dollars building telescope mirrors out of toxic beryllium and gold instead of normal optical glass?',
          onScreenText: 'Why Gold & Beryllium? 🔭✨',
          bRoll: 'Glowing 3D model of JWST primary mirror.',
          transition: 'Jump cut to close up.',
        },
        {
          timestamp: '5–14 sec',
          visual: 'Presenter pointing to a digital diagram showing temperatures at Lagrange Point 2.',
          voiceover: 'Most people think space telescopes use glass like Hubble. But JWST sits 1.5 million kilometers from Earth in deep cryogenic space at minus 238 degrees Celsius.',
          onScreenText: 'Minus 238°C (35 Kelvin) ❄️',
          bRoll: 'Deep space orbit diagram showing Sunshield.',
          transition: 'Pan right to split screen.',
        },
        {
          timestamp: '14–25 sec',
          visual: 'Side-by-side comparison of glass fracturing vs beryllium holding shape.',
          voiceover: 'At that temperature, standard glass shatters or warps. Beryllium has an almost flat thermal contraction curve below 100 Kelvin, meaning it locks into dimensional perfection.',
          onScreenText: 'Beryllium: Zero Warping 💎',
          bRoll: 'Laser interferometry measurement graphic.',
          transition: 'Cross-dissolve.',
        },
        {
          timestamp: '25–40 sec',
          visual: 'Presenter showing atomic gold coating illustration.',
          voiceover: 'And why gold? Because the universe is expanding! Light from the earliest stars has been redshifted from ultraviolet into the infrared spectrum.',
          onScreenText: 'Cosmic Redshift 🌌',
          bRoll: 'Redshift light wave stretching graphic.',
          transition: 'Slide left.',
        },
        {
          timestamp: '40–55 sec',
          visual: 'Diagram showing gold reflectance curve at 98% vs aluminum dropping.',
          voiceover: 'While aluminum absorbs infrared light, gold reflects 98% of near- and mid-infrared photons. Across all 18 segments, NASA used only 48 grams of gold—a layer just 100 nanometers thick.',
          onScreenText: 'Only 48 Grams of Gold! 🏆',
          bRoll: 'Microscopic 100nm gold layer animation.',
          transition: 'Zoom in.',
        },
        {
          timestamp: '55–70 sec',
          visual: 'Hexapod actuator moving hexagonal segments in 10-nanometer steps.',
          voiceover: 'Each hexagonal mirror is adjusted by hexapod actuators in 10-nanometer steps, aligning all 18 segments into a single optical surface to within 70 nanometers.',
          onScreenText: 'Aligned to 70 Nanometers! 🎯',
          bRoll: 'Actuator precision mechanical simulation.',
          transition: 'Cut to presenter.',
        },
        {
          timestamp: '70–82 sec',
          visual: 'First Deep Field image from JWST with sparkling ancient galaxies.',
          voiceover: 'That extreme material physics is why JWST can photograph galaxies formed over 13.5 billion years ago, right after the dawn of the universe.',
          onScreenText: 'Looking Back 13.5B Years 🚀',
          bRoll: 'JWST deep space image reveal.',
          transition: 'Cross-dissolve.',
        },
        {
          timestamp: '82–90 sec',
          visual: 'Presenter gestures to like and save.',
          voiceover: 'Save this breakdown of aerospace engineering, and follow for more deep-space technology breakdowns.',
          onScreenText: 'Save & Follow 📌',
          bRoll: 'Save icon animation.',
          transition: 'Fade out.',
        },
      ],
      cta: 'What is your favorite discovery made by the James Webb Space Telescope so far? Let us know below.',
    };
  }

  if (t.includes('espresso') || t.includes('coffee')) {
    return {
      title: 'The Physics of Espresso: 9 Bars of Pressure and Extraction Chemistry',
      estimatedDuration: '60–90 seconds',
      targetDuration: '60–90 seconds',
      wordCount: 195,
      hook: 'Ever wonder what actually happens inside an espresso machine when that golden crema pours out?',
      sections: [
        {
          timestamp: '0–5 sec',
          visual: 'Macro close-up of a naked portafilter streaming rich, tiger-striped espresso into a glass cup.',
          voiceover: 'Ever wonder what actually happens inside an espresso machine when that golden crema pours out? It is not just coffee—it is high-pressure hydraulics.',
          onScreenText: 'The Physics of Espresso ☕⚙️',
          bRoll: 'Bottomless portafilter slow-motion extraction.',
          transition: 'Jump cut to presenter.',
        },
        {
          timestamp: '5–14 sec',
          visual: 'Presenter gesturing to an espresso machine pressure gauge showing 9 bars.',
          voiceover: 'First, the pump forces water heated to 93 degrees Celsius at 9 atmospheres of pressure. That is roughly 130 psi—the same water pressure you would feel 90 meters underwater.',
          onScreenText: '9 Bars of Pressure (130 PSI) 🌊',
          bRoll: 'Pressure gauge animation and boiler cutaway.',
          transition: 'Pan right to split screen.',
        },
        {
          timestamp: '14–25 sec',
          visual: 'Cross-section illustration of finely ground coffee bed tamped in portafilter basket.',
          voiceover: 'That intense pressure hits 18 grams of compacted, finely ground coffee. The puck creates hydraulic resistance, forcing the hot water to permeate every microscopic pore evenly.',
          onScreenText: 'Hydraulic Puck Resistance 🛑',
          bRoll: 'Water permeating tamped coffee particles.',
          transition: 'Cross-dissolve.',
        },
        {
          timestamp: '25–40 sec',
          visual: 'Chemical breakdown graphic showing fruit acids, sugars, and oils.',
          voiceover: 'Soluble flavor compounds extract in strict sequence: bright fruit acids dissolve first, followed by sweet caramelized sugars, and finally heavier aromatic lipids.',
          onScreenText: 'Extraction Sequence: Acids -> Sugars 🔬',
          bRoll: 'Animated solubles dissolution timeline.',
          transition: 'Slide left.',
        },
        {
          timestamp: '40–55 sec',
          visual: 'Side-by-side comparison of even extraction vs channeling micro-fissure.',
          voiceover: 'The biggest mistake? Grinding too fine! That causes channeling, where pressurized water punches a crack through the puck, producing a sour, hollow, and astringent shot.',
          onScreenText: 'Avoid Channeling! ⚠️',
          bRoll: 'Visual macro showing water blasting through a puck fissure.',
          transition: 'Zoom in.',
        },
        {
          timestamp: '55–70 sec',
          visual: 'Liquid espresso dripping into glass with dense crema layer forming on top.',
          voiceover: 'When balanced correctly, the pressure emulsifies insoluble coffee oils with carbon dioxide, creating that velvety, golden crema that crowns a great shot.',
          onScreenText: 'Velvety Emulsified Crema 🌟',
          bRoll: 'Crema micro-bubble structure macro.',
          transition: 'Cut to presenter.',
        },
        {
          timestamp: '70–82 sec',
          visual: 'Presenter holding a cup and summarizing the ratio.',
          voiceover: 'Remember the golden baseline: 18 grams of dry coffee in, 36 grams of liquid out, in 25 to 30 seconds. That hits the sweet 18 to 22% extraction yield.',
          onScreenText: '1:2 Ratio in 25–30 Seconds ⏱️',
          bRoll: 'Digital scale showing 18.0g in -> 36.0g out.',
          transition: 'Cross-dissolve.',
        },
        {
          timestamp: '82–90 sec',
          visual: 'Presenter smiling and gesturing to save.',
          voiceover: 'Save this espresso physics breakdown for your next morning coffee dial-in session!',
          onScreenText: 'Save & Follow for More 📌',
          bRoll: 'Save icon animation.',
          transition: 'Fade out.',
        },
      ],
      cta: 'What is your favorite coffee bean origin for pulling espresso? Let us know below.',
    };
  }

  // 13. Jet Engine Thrust Reversal Systems
  if (t.includes('thrust') || t.includes('reverser') || (t.includes('jet') && t.includes('engine'))) {
    return {
      title: 'How Jet Engines Reverse Thrust on Landing (Without Spinning Backwards)',
      estimatedDuration: '60–90 seconds',
      targetDuration: '60–90 seconds',
      wordCount: 195,
      hook: 'Did you know commercial jet engines CANNOT spin backwards? Here is how they actually stop 150 tons of aircraft upon landing!',
      sections: [
        {
          timestamp: '0–5 sec',
          visual: 'Dramatic slow-motion landing: aircraft tires smoke upon touchdown and engine cowlings immediately slide open.',
          voiceover: 'Did you know commercial jet engines cannot spin backwards? Here is how they really stop an airliner on landing!',
          onScreenText: 'Can Jet Engines Run Backwards? ✈️🛑',
          bRoll: 'Nacelle cowls sliding open on rollout.',
          transition: 'Jump cut to close up.',
        },
        {
          timestamp: '5–14 sec',
          visual: '3D cutaway animation of a high-bypass turbofan (CFM56/GE90).',
          voiceover: 'On modern turbofans, 80% of total thrust comes from cold fan air flowing around the engine core, not the burning core exhaust.',
          onScreenText: 'Cold Bypass Air Flow (80%) 💨',
          bRoll: 'Blue bypass airflow streams through nacelle.',
          transition: 'Pan right to cutaway.',
        },
        {
          timestamp: '14–25 sec',
          visual: 'Mechanical blocker doors pivoting down and sealing the rear bypass duct.',
          voiceover: 'Upon touchdown, hydraulic actuators slide the outer cowl back. Heavy blocker doors slam shut across the rear duct, completely blocking rearward airflow.',
          onScreenText: 'Blocker Doors Deploy! 🚪🔒',
          bRoll: 'Mechanical linkages locking blocker doors.',
          transition: 'Cross-dissolve.',
        },
        {
          timestamp: '25–40 sec',
          visual: 'Fan air blasting outward and forward through titanium cascade vanes angled at 45 degrees.',
          voiceover: 'With the back blocked, hundreds of kilos of cold air per second are forced through angled cascade vanes, blasting forward to create massive aerodynamic braking!',
          onScreenText: 'Angled Cascade Vanes 🔄',
          bRoll: 'Air deflection vectors reversing direction.',
          transition: 'Slide left.',
        },
        {
          timestamp: '40–55 sec',
          visual: 'Cockpit view of pilot pulling reverse thrust levers and glancing at airspeed.',
          voiceover: 'The catch? Pilots must throttle back to idle by 60 knots! Any slower, and the reverse air blows runway gravel back into the engine intake, causing catastrophic engine damage.',
          onScreenText: '60-Knot Cutoff! No Gravel FOD ⚠️',
          bRoll: 'Airspeed indicator dropping through 60 knots.',
          transition: 'Zoom in.',
        },
        {
          timestamp: '55–70 sec',
          visual: 'Airliner landing on wet, rain-slicked runway with water spray.',
          voiceover: 'Carbon wheel brakes do most of the stopping on dry pavement, but on rain, snow, or ice, reverse thrust is the ultimate lifesaver that prevents runway overruns.',
          onScreenText: 'Vital on Wet & Icy Runways 🌧️❄️',
          bRoll: 'Water spray blasting from thrust reversers.',
          transition: 'Cut to runway view.',
        },
        {
          timestamp: '70–82 sec',
          visual: 'Summary graphic showing Translating Cowl -> Blocker Doors -> Cascade Vanes.',
          voiceover: 'Translating cowls, blocker doors, and cascade vanes. Pure aerodynamic engineering stopping a 70-ton machine without reversing a single turbine blade.',
          onScreenText: 'Aerodynamic Braking Masterclass 🏆',
          bRoll: 'Clean 3-step recap diagram.',
          transition: 'Cross-dissolve.',
        },
        {
          timestamp: '82–90 sec',
          visual: 'Presenter smiling with plane landing in background.',
          voiceover: 'Save this aviation physics breakdown for your next flight or flight simulator session!',
          onScreenText: 'Save & Share for Aviation Lovers 📌',
          bRoll: 'Save icon animation.',
          transition: 'Fade out.',
        },
      ],
      cta: 'Have you ever watched the engine cowlings slide open on touchdown? Let us know below.',
    };
  }

  // Dynamic Fallback using research
  if (research && research.summary) {
    const p1 = research.keyPoints?.[0] || `The foundational principles of ${norm}`;
    const p2 = research.keyPoints?.[1] || `Key operational dynamics in ${norm}`;
    const fact1 = research.facts?.[0]?.claim || `Empirical observations regarding ${norm}`;
    const rawCaution = research.cautions?.[0] || '';
    const cleanCaution = rawCaution.replace(/^avoid\s+/i, '').replace(/superficial oversimplifications\.?/i, 'oversimplified assumptions');
    const caution = cleanCaution.length > 5 ? cleanCaution : `unverified assumptions regarding ${norm}`;
    const example = research.relevantExamples?.[0] || `Real-world manifestation of ${norm}`;

    return {
      title: `${norm}: The Complete Step-by-Step Breakdown`,
      estimatedDuration: '60–90 seconds',
      targetDuration: '60–90 seconds',
      wordCount: 195,
      hook: `Ever wonder what actually happens inside ${norm}? Here is the complete breakdown:`,
      sections: [
        {
          timestamp: '0–5 sec',
          visual: `High-impact visual title card introducing ${norm}.`,
          voiceover: `Ever wonder how ${norm} actually works beneath the surface? Let us break down the real principles.`,
          onScreenText: `Understanding ${norm} 🔍`,
          bRoll: 'Dynamic visual overview card.',
          transition: 'Jump cut to close up.',
        },
        {
          timestamp: '5–14 sec',
          visual: `Presenter explaining the core foundation of ${norm}.`,
          voiceover: `To understand ${norm}, start with the foundation: ${p1}. This governs how the entire subject operates.`,
          onScreenText: 'The Core Foundation 💡',
          bRoll: 'Conceptual diagram illustrating key components.',
          transition: 'Pan right to diagram.',
        },
        {
          timestamp: '14–25 sec',
          visual: `Diagram showing the governing dynamics of ${norm}.`,
          voiceover: `Next is the governing dynamic: ${p2}. In practice, this determines how outcomes are produced.`,
          onScreenText: 'How It Operates ⚙️',
          bRoll: 'Step-by-step schematic animation.',
          transition: 'Cross-dissolve.',
        },
        {
          timestamp: '25–40 sec',
          visual: 'Real-world example visual display.',
          voiceover: `Consider real-world applications: ${example}. Observing this clarifies the underlying mechanics.`,
          onScreenText: 'Real-World Example 🌍',
          bRoll: 'Application showcase footage.',
          transition: 'Slide left.',
        },
        {
          timestamp: '40–55 sec',
          visual: 'Presenter addressing common misconceptions.',
          voiceover: `The most common mistake people make? ${caution}. Respecting this constraint prevents critical errors.`,
          onScreenText: 'Avoid This Mistake ⚠️',
          bRoll: 'Warning callout graphic.',
          transition: 'Zoom in.',
        },
        {
          timestamp: '55–70 sec',
          visual: 'Grounded empirical data visualization.',
          voiceover: `Here is the empirical reality: ${fact1}. Grounding your understanding in facts changes how you approach it.`,
          onScreenText: 'The Empirical Reality 📊',
          bRoll: 'Data benchmark graphic.',
          transition: 'Cut to presenter.',
        },
        {
          timestamp: '70–82 sec',
          visual: 'Presenter summarizing key takeaways.',
          voiceover: `Mastering ${norm} comes down to understanding these governing principles rather than relying on guesswork.`,
          onScreenText: 'Master the Fundamentals 🏆',
          bRoll: 'Key takeaways checklist.',
          transition: 'Cross-dissolve.',
        },
        {
          timestamp: '82–90 sec',
          visual: 'Presenter gesturing to save and discuss.',
          voiceover: `Save this breakdown of ${norm}, and let me know your perspective in the comments below!`,
          onScreenText: 'Save & Follow 📌',
          bRoll: 'Save icon animation.',
          transition: 'Fade out.',
        },
      ],
      cta: `What aspect of ${norm} do you find most interesting? Let us know below.`,
    };
  }

  // Fallback when research is absent
  return {
    title: `How ${norm} Actually Works: The Complete Breakdown`,
    estimatedDuration: '60–90 seconds',
    targetDuration: '60–90 seconds',
    wordCount: 195,
    hook: `Ever wonder what actually happens inside ${norm}? Here is the complete breakdown:`,
    sections: [
      {
        timestamp: '0–5 sec',
        visual: 'Presenter looks directly at camera with an engaged expression.',
        voiceover: `Ever wonder what actually happens inside ${norm}? Let us explore the core principles that govern how it behaves.`,
        onScreenText: `Understanding ${norm} 🔍`,
        bRoll: 'High-energy visual title card.',
        transition: 'Jump cut to close up.',
      },
      {
        timestamp: '5–14 sec',
        visual: 'Presenter gesturing to a foundational diagram.',
        voiceover: `First, examine the primary governing principles: understanding the fundamental variables explains how ${norm} functions.`,
        onScreenText: 'Foundational Principles 💡',
        bRoll: 'Animated overview diagram.',
        transition: 'Pan right to diagram.',
      },
      {
        timestamp: '14–25 sec',
        visual: 'Presenter demonstrating internal relationships.',
        voiceover: `Second, observe how the components interact in practice: specific causes produce predictable effects when properly calibrated.`,
        onScreenText: 'Component Dynamics ⚙️',
        bRoll: 'Detailed interaction graphic.',
        transition: 'Cross-dissolve.',
      },
      {
        timestamp: '25–40 sec',
        visual: 'Presenter highlighting real-world applications.',
        voiceover: `In practical environments, respecting domain constraints is what ensures reliable and repeatable results.`,
        onScreenText: 'Practical Constraints 🎯',
        bRoll: 'Application showcase animation.',
        transition: 'Slide left.',
      },
      {
        timestamp: '40–55 sec',
        visual: 'Presenter explaining common misconceptions.',
        voiceover: `The biggest mistake? Overlooking edge-case boundaries. When operational limits are ignored, performance degrades rapidly.`,
        onScreenText: 'Watch the Boundaries 🛑',
        bRoll: 'Boundary limits graphic.',
        transition: 'Zoom in.',
      },
      {
        timestamp: '55–70 sec',
        visual: 'Presenter points to camera with key takeaway.',
        voiceover: `When you understand the authentic domain facts of ${norm}, you make informed decisions grounded in reality.`,
        onScreenText: 'Informed Decisions 🏆',
        bRoll: 'Summary card animation.',
        transition: 'Cut to presenter.',
      },
      {
        timestamp: '70–82 sec',
        visual: 'Presenter summarizing key lessons.',
        voiceover: `True expertise comes from understanding the actual mechanics rather than relying on superficial summaries.`,
        onScreenText: 'Real Expertise 🌟',
        bRoll: 'Key takeaways checklist.',
        transition: 'Cross-dissolve.',
      },
      {
        timestamp: '82–90 sec',
        visual: 'Presenter gestures to save and discuss.',
        voiceover: `Save this breakdown of ${norm}, and let me know your thoughts in the comments below!`,
        onScreenText: 'Save & Follow 📌',
        bRoll: 'Save icon animation.',
        transition: 'Fade out.',
      },
    ],
    cta: `What is your favorite real-world example of ${norm}? Let us know below.`,
  };
}

// =========================================================================
// 4. CRITIC REVIEW MOCKS (WITH POST-LEVEL WEIGHTED AUDIT)
// =========================================================================
export function matchesKeyword(token: string, keyword: string): boolean {
  if (token === keyword) return true;
  if (keyword.endsWith('s') && token === keyword.slice(0, -1)) return true;
  if (token.endsWith('s') && keyword === token.slice(0, -1)) return true;
  if (keyword.endsWith('ing') && token.startsWith(keyword.slice(0, -3))) return true;
  if (token.endsWith('ing') && keyword.startsWith(token.slice(0, -3))) return true;
  if (keyword.endsWith('ed') && token.startsWith(keyword.slice(0, -2))) return true;
  if (token.endsWith('ed') && keyword.startsWith(token.slice(0, -2))) return true;
  if (keyword.length >= 6 && token.startsWith(keyword.slice(0, -2))) return true;
  if (token.length >= 6 && keyword.startsWith(token.slice(0, -2))) return true;
  return false;
}

export function getMockCriticReview(
  topic: string,
  platform: Platform,
  tone: string,
  iteration: number,
  shouldApprove: boolean,
  draft?: WriterOutput
): CriticReview {
  const isLinkedIn = platform === 'LINKEDIN';
  const norm = normalizeTopic(topic);

  // Validate Semantic Relevance & Cross-Domain Contamination
  if (draft) {
    const draftStr = JSON.stringify(draft).toLowerCase();
    const topicWords = topic
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !['what', 'why', 'how', 'does', 'the', 'and', 'for', 'with', 'about', 'important'].includes(w));
    
    const normWords = norm
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !['what', 'why', 'how', 'does', 'the', 'and', 'for', 'with', 'about', 'important'].includes(w));

    const allTopicKeywords = Array.from(new Set([...topicWords, ...normWords]));
    const draftTokens = draftStr
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3);

    const hasSemanticOverlap =
      allTopicKeywords.length === 0 ||
      allTopicKeywords.some((kw) => draftTokens.some((tok) => matchesKeyword(tok, kw)));

    const isNonSoftware =
      !topic.toLowerCase().includes('software') &&
      !topic.toLowerCase().includes('code') &&
      !topic.toLowerCase().includes('data structure') &&
      !topic.toLowerCase().includes('cpu') &&
      !topic.toLowerCase().includes('recursion') &&
      !topic.toLowerCase().includes('git') &&
      !topic.toLowerCase().includes('merge sort') &&
      !topic.toLowerCase().includes('expense') &&
      !topic.toLowerCase().includes('postgres') &&
      !topic.toLowerCase().includes('consensus') &&
      !topic.toLowerCase().includes('binary search') &&
      !topic.toLowerCase().includes('antigravity');

    const forcedSoftwareTerms = ['microservice', 'kubernetes', 'b-tree', 'database index', 'tuple header', 'autovacuum', 'big-o'];
    const hasCrossDomainContamination = isNonSoftware && forcedSoftwareTerms.some((t) => draftStr.includes(t));

    const postList = draft && 'posts' in draft && Array.isArray((draft as any).posts)
      ? ((draft as any).posts as any[])
      : [];

    if (draftStr.length > 50 && (!hasSemanticOverlap || hasCrossDomainContamination)) {
      return {
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
              ? `The draft content has zero semantic overlap with the requested topic "${topic}". Content must meaningfully address the actual subject.`
              : `The draft forces software engineering jargon into a non-software topic ("${topic}"). Adapt to the authentic domain.`,
          },
        ],
        requiredChanges: [
          `Rewrite all content to be 100% about "${topic}". Ground insights in authentic domain concepts and remove unrelated jargon.`,
        ],
        postReviews: isLinkedIn
          ? (postList.length > 0 ? postList : [{ id: 'post_educational', category: 'Educational' }]).map((p: any) => ({
              postId: p.id,
              category: p.category || p.angle || 'Educational',
              approved: false,
              scores: { relevance: 35, depth: 40, accuracy: 50, readability: 70, categoryMatch: 60, originality: 40, total: 45 },
              issues: [
                {
                  problem: !hasSemanticOverlap ? 'Semantic Misalignment (Zero Topic Overlap)' : 'Cross-Domain Contamination (Forced Software/IT Jargon)',
                  whyItFails: `Draft content does not address "${topic}".`,
                  missingTopicInfo: `Requires concrete details about "${topic}".`,
                  requiredChange: `Rewrite completely for "${topic}".`,
                },
              ],
              requiredChanges: [`Focus 100% on "${topic}".`],
            }))
          : undefined,
      };
    }
  }

  // If approved or on iteration >= 2
  if (shouldApprove || iteration >= 2) {
    const topicFidelity = 98;
    const toneMatch = 94;
    const factualAccuracy = 96;
    const platformFit = isLinkedIn ? 95 : 93;
    const clarity = 94;
    const originality = 92;
    const usefulness = 93;
    const naturalness = 94;
    const scriptQuality = isLinkedIn ? undefined : 93;
    const narrativeQuality = isLinkedIn ? undefined : 92;

    const weightedScore = isLinkedIn
      ? Math.round(
          0.25 * topicFidelity +
            0.25 * usefulness +
            0.20 * factualAccuracy +
            0.10 * naturalness +
            0.10 * platformFit +
            0.10 * originality
        )
      : Math.round(
          0.20 * topicFidelity +
            0.20 * toneMatch +
            0.15 * factualAccuracy +
            0.15 * platformFit +
            0.15 * (scriptQuality ?? 93) +
            0.15 * (narrativeQuality ?? 92)
        );

    const postReviews: PostReview[] = isLinkedIn
      ? [
          {
            postId: 'post_educational',
            category: 'Educational',
            approved: true,
            scores: { relevance: 98, depth: 95, accuracy: 96, readability: 94, categoryMatch: 98, originality: 92, total: 96 },
            issues: [],
            requiredChanges: [],
          },
          {
            postId: 'post_contrarian',
            category: 'Contrarian / Question-Driven',
            approved: true,
            scores: { relevance: 97, depth: 94, accuracy: 95, readability: 93, categoryMatch: 96, originality: 93, total: 95 },
            issues: [],
            requiredChanges: [],
          },
          {
            postId: 'post_storytelling',
            category: 'Storytelling / Case Study',
            approved: true,
            scores: { relevance: 96, depth: 94, accuracy: 95, readability: 92, categoryMatch: 95, originality: 94, total: 95 },
            issues: [],
            requiredChanges: [],
          },
          {
            postId: 'post_practical',
            category: 'Practical / Step-by-Step',
            approved: true,
            scores: { relevance: 98, depth: 96, accuracy: 97, readability: 94, categoryMatch: 98, originality: 91, total: 96 },
            issues: [],
            requiredChanges: [],
          },
          {
            postId: 'post_insight',
            category: 'Insight-Driven',
            approved: true,
            scores: { relevance: 97, depth: 95, accuracy: 96, readability: 93, categoryMatch: 97, originality: 95, total: 96 },
            issues: [],
            requiredChanges: [],
          },
        ]
      : [];

    return {
      approved: true,
      score: weightedScore,
      topicFidelity,
      toneMatch,
      factualAccuracy,
      relevance: 97,
      platformFit,
      clarity,
      originality,
      usefulness,
      naturalness,
      scriptQuality,
      narrativeQuality,
      noFabricatedExperience: true,
      noFabricatedStatistics: true,
      issues: [],
      requiredChanges: [],
      postReviews: isLinkedIn ? postReviews : undefined,
    };
  }

  // Iteration 1 rejection (demonstrating post-level audit and selective refinement)
  const postReviews: PostReview[] = isLinkedIn
    ? [
        {
          postId: 'post_educational',
          category: 'Educational',
          approved: true,
          scores: { relevance: 95, depth: 92, accuracy: 94, readability: 90, categoryMatch: 95, originality: 88, total: 93 },
          issues: [],
          requiredChanges: [],
        },
        {
          postId: 'post_contrarian',
          category: 'Contrarian / Question-Driven',
          approved: false,
          scores: { relevance: 88, depth: 76, accuracy: 88, readability: 84, categoryMatch: 78, originality: 80, total: 82 },
          issues: [
            {
              problem: 'Needs stronger technical counter-evidence',
              whyItFails: 'Contrarian position lacks specific quantitative or architectural proof.',
              missingTopicInfo: `Include concrete metrics or operational bottlenecks specific to "${norm}".`,
              requiredChange: 'Add specific failure modes and technical evidence.',
            },
          ],
          requiredChanges: ['Strengthen counter-evidence with specific architectural numbers.'],
        },
        {
          postId: 'post_storytelling',
          category: 'Storytelling / Case Study',
          approved: true,
          scores: { relevance: 94, depth: 91, accuracy: 93, readability: 90, categoryMatch: 94, originality: 90, total: 93 },
          issues: [],
          requiredChanges: [],
        },
        {
          postId: 'post_practical',
          category: 'Practical / Step-by-Step',
          approved: false,
          scores: { relevance: 86, depth: 75, accuracy: 86, readability: 82, categoryMatch: 80, originality: 78, total: 81 },
          issues: [
            {
              problem: 'Missing concrete boundary checks and error pitfalls',
              whyItFails: 'Checklist does not mention critical edge cases or validation steps.',
              missingTopicInfo: 'Add explicit parameter boundaries and common failure pitfalls.',
              requiredChange: 'Include concrete code/command parameters and pitfalls.',
            },
          ],
          requiredChanges: ['Include concrete code/command parameters and pitfalls.'],
        },
        {
          postId: 'post_insight',
          category: 'Insight-Driven',
          approved: true,
          scores: { relevance: 95, depth: 92, accuracy: 94, readability: 90, categoryMatch: 95, originality: 91, total: 93 },
          issues: [],
          requiredChanges: [],
        },
      ]
    : [];

  return {
    approved: false,
    score: 80,
    topicFidelity: 94,
    toneMatch: 82,
    factualAccuracy: 90,
    relevance: 89,
    platformFit: 84,
    clarity: 83,
    originality: 82,
    usefulness: 81,
    naturalness: 83,
    scriptQuality: isLinkedIn ? undefined : 78,
    narrativeQuality: isLinkedIn ? undefined : 80,
    noFabricatedExperience: true,
    noFabricatedStatistics: true,
    issues: [
      {
        type: 'missing_depth',
        severity: 'high',
        description: `Post 2 and Post 4 require deeper domain mechanics and explicit edge-case boundary checks for "${norm}".`,
      },
      {
        type: 'tone_alignment',
        severity: 'medium',
        description: `Ensure sentence cadence and vocabulary strictly embody the "${tone}" tone.`,
      },
    ],
    requiredChanges: [
      `Deepen technical counter-evidence in Post 2 with concrete metrics for "${norm}".`,
      'Add explicit edge cases, parameters, and pitfalls to the step-by-step checklist in Post 4.',
      `Align tone and vocabulary to match "${tone}".`,
    ],
    postReviews: isLinkedIn ? postReviews : undefined,
  };
}
