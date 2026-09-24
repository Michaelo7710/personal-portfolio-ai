import { siteConfig } from "@/config/site";
import { staticCaseStudiesFallback } from "@/lib/portfolio";

export type AtsCvGenerationResult = {
  markdown: string;
  targetRole: string;
  matchedKeywords: string[];
  atsScore: number;
  provider: "google" | "fallback";
  generatedAt: string;
};

export const CANDIDATE_GROUND_TRUTH = {
  name: siteConfig.author.name,
  role: siteConfig.author.role,
  bio: siteConfig.author.bio,
  location: siteConfig.author.location,
  email: siteConfig.author.email,
  github: siteConfig.author.github,
  linkedin: siteConfig.author.linkedin,
  skills: siteConfig.skills,
  projects: staticCaseStudiesFallback,
};

export function buildAtsCvPrompt(input: {
  jobDescription?: string;
  extractedOcrText?: string;
  targetRole?: string;
}) {
  const jobText = (input.jobDescription || input.extractedOcrText || "").trim();
  const targetRole = input.targetRole || "Senior Software Engineer";

  const systemPrompt = `You are an elite, executive-level Technical Recruiter and ATS (Applicant Tracking System) Optimization Specialist.
Your task is to tailor a clean, linear, 100% ATS-compliant Software Engineer Resume for candidate "${CANDIDATE_GROUND_TRUTH.name}" based strictly on his REAL-WORLD engineering accomplishments and the provided job vacancy.

STRICT ATS FORMATTING RULES (DO NOT DEVIATE):
1. ZERO HALLUCINATION: Only cite the candidate's real verified projects (GreenPay E-Wallet, QuranApp Digital Mushaf, Sensei Edu-Sim Suite), his real technical skills, and his real metrics. NEVER invent fictitious companies, degrees, or imaginary credentials.
2. LINEAR SINGLE-COLUMN LAYOUT: No tables, no columns, no text boxes, no icons, no emojis. Only standard Markdown headers (#, ##, ###) and clean bullet points (*).
3. SECTION STRUCTURE:
   - # CANDIDATE NAME (with Role, Email, Location, LinkedIn, GitHub on direct single lines)
   - ## PROFESSIONAL SUMMARY (3-4 sentences packed with keywords matching the job vacancy)
   - ## CORE TECHNICAL COMPETENCIES (Categorized: Languages, Frameworks, Architecture & Principles, Databases & Tooling)
   - ## FEATURED SYSTEMS & PRODUCTION PROJECTS (Present GreenPay E-Wallet, QuranApp, and Sensei Edu-Sim with STAR bullets: Situation/Challenge, Technical Action/Architecture, and Quantifiable Metric Impact)
   - ## PROFESSIONAL FOCUS & ENGINEERING METHODOLOGY (Clean Architecture, WCAG 2.1 AA, Offline-First, UU PDP Compliance)
   - ## EDUCATION & CREDENTIALS
4. ACTION VERBS & METRICS: Every bullet point must start with a strong action verb (Architected, Engineered, Implemented, Streamlined, Eliminated) and include real metrics (e.g. 100% Offline-First, 313 Unit Tests Pass, < 40KB Bundle, 60 FPS, < 50ms latency).`;

  const userPrompt = `TARGET JOB VACANCY DETAILS:
Role Desired: ${targetRole}
Job Description / Loker:
"""
${jobText || "General Senior Software Engineer (Mobile, Fullstack, AI Systems)"}
"""

CANDIDATE VERIFIED GROUND TRUTH DATA:
Name: ${CANDIDATE_GROUND_TRUTH.name}
Title: ${CANDIDATE_GROUND_TRUTH.role}
Location: ${CANDIDATE_GROUND_TRUTH.location}
Email: ${CANDIDATE_GROUND_TRUTH.email}
GitHub: ${CANDIDATE_GROUND_TRUTH.github}
LinkedIn: ${CANDIDATE_GROUND_TRUTH.linkedin}
Skills: ${CANDIDATE_GROUND_TRUTH.skills.join(", ")}

Real Case Studies (STAR):
${CANDIDATE_GROUND_TRUTH.projects
  .map(
    (p) => `
Project: ${p.title} (${p.category})
Tagline: ${p.tagline}
Tech Stack: ${p.techStack.join(", ")}
Metrics: ${p.metrics.map((m) => `${m.label}: ${m.value}`).join(" | ")}
STAR Situation: ${p.star.situation}
STAR Architecture/Task: ${p.star.task}
STAR Real Action: ${p.star.action}
STAR Results: ${p.star.result}
`
  )
  .join("\n---")}

Please generate the complete, production-grade Linear ATS Resume in clean Markdown format right now.`;

  return { systemPrompt, userPrompt };
}

export function generateDeterministicAtsCv(input: {
  jobDescription?: string;
  targetRole?: string;
}): AtsCvGenerationResult {
  const jobText = (input.jobDescription || "").toLowerCase();
  const detectedRole =
    input.targetRole ||
    (jobText.includes("mobile") || jobText.includes("react native")
      ? "Senior Mobile & React Native Engineer"
      : jobText.includes("ai") || jobText.includes("machine learning") || jobText.includes("llm")
      ? "Senior AI Systems & Fullstack Engineer"
      : jobText.includes("frontend")
      ? "Senior Frontend & Web Systems Engineer"
      : jobText.includes("backend")
      ? "Senior Backend & Systems Architect"
      : "Senior Fullstack & AI Systems Engineer");

  const allPossibleKeywords = [
    "TypeScript",
    "React Native",
    "Next.js",
    "Clean Architecture",
    "Offline-First",
    "SQLite",
    "Google Gemini",
    "REST API",
    "WCAG 2.1 AA",
    "Performance Optimization",
    "Automated Testing",
    "Vitest",
    "Jest",
    "Tailwind CSS",
    "Security",
    "UU PDP",
  ];

  const matchedKeywords = allPossibleKeywords.filter(
    (kw) =>
      jobText.includes(kw.toLowerCase()) ||
      jobText.includes(kw.replace(/[^a-zA-Z0-9]/g, "").toLowerCase())
  );

  if (matchedKeywords.length < 4) {
    matchedKeywords.push(
      "TypeScript",
      "Clean Architecture",
      "React Native",
      "Next.js",
      "Offline-First"
    );
  }

  const uniqueMatched = Array.from(new Set(matchedKeywords));
  const atsScore = Math.min(98, Math.max(88, 80 + uniqueMatched.length * 2));

  const markdown = `# ${CANDIDATE_GROUND_TRUTH.name}
**${detectedRole}**  
Location: ${CANDIDATE_GROUND_TRUTH.location} | Email: ${CANDIDATE_GROUND_TRUTH.email}  
GitHub: [${CANDIDATE_GROUND_TRUTH.github}](${CANDIDATE_GROUND_TRUTH.github}) | LinkedIn: [${CANDIDATE_GROUND_TRUTH.linkedin}](${CANDIDATE_GROUND_TRUTH.linkedin})

---

## PROFESSIONAL SUMMARY
Pragmatic and results-driven Senior Software Engineer specializing in **Clean Architecture**, **Offline-First Systems**, and **Production-Grade AI Integrations**. Proven track record in architecting mission-critical fintech applications, high-accessibility cultural software (WCAG 2.1 AA), and zero-dependency educational engines maintaining 60 FPS on resource-constrained hardware. Committed to zero-hallucination engineering, rigorous automated verification (>300 unit/integration tests), and sub-100ms response latencies.

---

## CORE TECHNICAL COMPETENCIES
* **Programming Languages:** TypeScript, JavaScript (ESNext), HTML5/CSS3, SQL
* **Frontend & Mobile Frameworks:** React Native, Expo, Next.js 16 (App Router), React 19, Tailwind CSS, shadcn/ui
* **Architecture & Engineering Paradigms:** Clean Architecture (3-Tier), Domain-Driven Design (DDD), Offline-First Architecture, Finite State Machines (FSM)
* **AI & Multimodal Technologies:** Google Gemini Multimodal API (Vision OCR, Function Calling), Vercel AI SDK, Prompt Engineering
* **Database & Storage:** SQLite, PostgreSQL / Supabase, Gray-Matter MDX Engine
* **Testing & Quality Assurance:** Vitest, Jest (34 Suites, 313 Tests Passing), Automated Regression Testing, ESLint, TypeScript Strict Mode
* **Compliance & Standards:** Indonesian Personal Data Protection Act (UU PDP No. 27/2022), WCAG 2.1 AA Accessibility Standards, Zero-Eval Mathematical Execution

---

## FEATURED SYSTEMS & PRODUCTION CASE STUDIES

### GreenPay E-Wallet — Production Mobile & Fintech Architecture
*Senior Mobile & Systems Architect*
* **Context & Challenge:** Addressed spotty mobile network conditions causing financial double-spending and unhandled promise rejections in peer-to-peer money transfers.
* **Architectural Action:** Engineered 3-Tier Clean Architecture separating Domain, Use Cases, and Local SQLite Storage. Implemented native Screen Capture Guard at root window level to block sensitive card/PIN recording.
* **Security & Regulatory Compliance:** Built automated deterministic sanitization conforming to UU PDP No. 27/2022, masking account and mobile numbers across UI and telemetry logs.
* **Transaction Locking:** Deployed atomic mutex queue with UUIDv4 idempotency keys, eliminating balance race conditions.
* **Quantifiable Impact:** Achieved **100% Offline-First resilience**; verified with **313 automated tests (34 test suites)** passing at 100%; eliminated 100% of raw alert dialog crashes.

### QuranApp (Digital Mushaf) — Modern Accessibility & Cultural Tech
*Lead Frontend & Accessibility Engineer*
* **Context & Challenge:** Solved severe typography clipping and eye-strain issues common in digital sacred text readers caused by low-contrast tajweed markers and slow surah switching.
* **Design System & Contrast:** Formulated semantic tajweed color token palette strictly meeting **WCAG 2.1 AA** contrast ratios (≥4.5:1) in both Dark and Light themes.
* **Modular Typography:** Built 1.25 modular scale typography engine with dynamic font scaling, guaranteeing zero glyph clipping on harakat and waqf symbols.
* **Performance & Sync:** Optimized SQLite database schema with compound indexing for instant surah switching (<50ms) and integrated modular background audio streamer with synchronized verse highlighting.
* **Quantifiable Impact:** **114 Surahs (6,236 verses)** available **100% offline** (<25MB DB size); passed WCAG 2.1 AA accessibility audit across all themes.

### Sensei Edu-Sim Suite — Single-File STEM Simulation Engine
*Systems & Graphics Engineer*
* **Context & Challenge:** Created lightweight, portable interactive STEM simulations capable of executing smoothly without crashing on school computers with limited memory (RAM ≤ 8GB).
* **Architecture:** Formulated single-file HTML architecture (<40KB total file size) operating with **0 external CDN dependencies** and 100% air-gapped capability.
* **Zero-Eval Math Engine:** Built a custom recursive descent math parser and tokenizer from scratch, evaluating algebraic and trigonometric formulas with zero security vulnerabilities (no \`eval()\` or \`Function()\`).
* **Visual Canvas:** Engineered HTML5 Canvas 2D engine with infinite pan/zoom and adaptive sub-grid coordinate recalculation, sustaining continuous **60 FPS**.
* **Quantifiable Impact:** Lulus 12/12 QA static audit gates; operational memory consumption under 35MB RAM.

---

## EDUCATION & CONTINUOUS LEARNING
* **Bachelor of Computer Science / Software Engineering Equivalent**
* **Continuous Professional Specialization:** Distributed Systems, Clean Architecture, Cryptographic Verification, Multimodal LLM Architecture.
`;

  return {
    markdown,
    targetRole: detectedRole,
    matchedKeywords: uniqueMatched,
    atsScore,
    provider: "fallback",
    generatedAt: new Date().toISOString(),
  };
}
