import { describe, it, expect } from "vitest";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/portfolio";
import {
  buildAtsCvPrompt,
  generateDeterministicAtsCv,
  CANDIDATE_GROUND_TRUTH,
} from "@/lib/ai/ats-prompt";

describe("tests/portfolio-cv (End-to-End ATS & MDX Verification Suite)", () => {
  // ==========================================
  // 1. HAPPY PATH: MDX & STAR PARSING INTEGRITY
  // ==========================================
  describe("Happy Path: Portfolio MDX & STAR Case Studies", () => {
    it("parses all verified flagship projects with valid metadata and non-zero reading times", () => {
      const caseStudies = getAllCaseStudies();
      expect(caseStudies.length).toBeGreaterThanOrEqual(3);

      const slugs = caseStudies.map((c) => c.slug);
      expect(slugs).toContain("wallet-app");
      expect(slugs).toContain("quran-app");
      expect(slugs).toContain("personal-portfolio-ai");

      for (const study of caseStudies) {
        expect(study.title.length).toBeGreaterThan(3);
        expect(study.tagline.length).toBeGreaterThan(5);
        expect(study.description?.length).toBeGreaterThan(10);
        expect(study.category.length).toBeGreaterThan(3);
        expect(study.techStack.length).toBeGreaterThanOrEqual(4);
        expect(study.metrics.length).toBeGreaterThanOrEqual(3);
        expect(study.readingTime).toBeGreaterThanOrEqual(1);

        // Verify STAR Summary
        expect(study.starSummary.situation.length).toBeGreaterThan(15);
        expect(study.starSummary.architecture.length).toBeGreaterThan(15);
        expect(study.starSummary.impact.length).toBeGreaterThan(15);

        // Verify In-Depth STAR
        expect(study.star.situation.length).toBeGreaterThan(30);
        expect(study.star.task.length).toBeGreaterThan(30);
        expect(study.star.action.length).toBeGreaterThan(30);
        expect(study.star.result.length).toBeGreaterThan(30);
      }
    });

    it("verifies GreenPay E-Wallet STAR content and UU PDP financial compliance", () => {
      const wallet = getCaseStudyBySlug("wallet-app");
      expect(wallet).not.toBeNull();
      expect(wallet?.meta.title).toBe("GreenPay E-Wallet");
      expect(wallet?.meta.techStack).toContain("Clean Architecture");
      expect(wallet?.meta.techStack).toContain("SQLite");
      expect(wallet?.content).toContain("UU Pelindungan Data Pribadi (UU PDP No. 27/2022)");
      expect(wallet?.content).toContain("Screen Capture Guard");
      expect(wallet?.meta.metrics.some((m) => m.value.includes("313 Tests Pass"))).toBe(true);
    });

    it("verifies QuranApp STAR content and WCAG 2.1 AA accessibility tokens", () => {
      const quran = getCaseStudyBySlug("quran-app");
      expect(quran).not.toBeNull();
      expect(quran?.meta.title).toBe("QuranApp (Digital Mushaf)");
      expect(quran?.content).toContain("WCAG 2.1 AA");
      expect(quran?.content).toContain("114 surah");
      expect(quran?.meta.metrics.some((m) => m.value.includes("WCAG 2.1 AA"))).toBe(true);
    });

    it("verifies Personal Portfolio AI case study Next.js 16 & Gemini Vision OCR", () => {
      const portfolio = getCaseStudyBySlug("personal-portfolio-ai");
      expect(portfolio).not.toBeNull();
      expect(portfolio?.meta.title).toBe("Personal Portfolio & Multimodal ATS-CV Engine");
      expect(portfolio?.content).toContain("Gemini");
      expect(portfolio?.meta.techStack).toContain("Next.js 16");
      expect(portfolio?.meta.metrics.some((m) => m.value.includes("123 Tests"))).toBe(true);
    });
  });

  // ==========================================
  // 2. ATS LINTING & ZERO-HALLUCINATION VERIFICATION
  // ==========================================
  describe("ATS Format Linting & Zero-Hallucination Guard", () => {
    it("enforces strict linear single-column layout without tables or visual clutter", () => {
      const rolesToTest = [
        "Software Engineer Fullstack Mobile App",
        "Frontend & Mobile Systems Engineer",
        "Full-Stack Mobile & AI Systems Engineer",
      ];

      for (const role of rolesToTest) {
        const result = generateDeterministicAtsCv({
          jobDescription: `Looking for a ${role} with TypeScript and Clean Architecture experience.`,
          targetRole: role,
        });

        // 1. Zero-Table Rule: ATS parsers break on table delimiters
        expect(result.markdown).not.toMatch(/\|(?:\s*-+\s*\|)+/); // No markdown tables
        expect(result.markdown).not.toContain("<table");

        // 2. Zero-Image / Emoji Clutter Rule
        expect(result.markdown).not.toMatch(/!\[.*?\]\(.*?\)/); // No markdown images
        expect(result.markdown).not.toContain("<img");

        // 3. Strict Heading Hierarchy
        expect(result.markdown).toContain(`# ${CANDIDATE_GROUND_TRUTH.name}`);
        expect(result.markdown).toContain("## PROFESSIONAL SUMMARY");
        expect(result.markdown).toContain("## CORE TECHNICAL COMPETENCIES");
        expect(result.markdown).toContain("## FEATURED SYSTEMS & PRODUCTION PROJECTS");
        expect(result.markdown).toContain("## EDUCATION & CREDENTIALS");

        // 4. Bullets present
        expect(result.projects.length).toBeGreaterThanOrEqual(3);
        expect(result.projects[0].bullets.length).toBeGreaterThan(0);

        // 5. ATS Score within optimal range
        expect(result.atsScore).toBeGreaterThanOrEqual(85);
        expect(result.atsScore).toBeLessThanOrEqual(99);
      }
    });

    it("guarantees Zero-Hallucination: references only real verified projects and skills", () => {
      const result = generateDeterministicAtsCv({
        jobDescription: "Hiring engineer familiar with high-scale distributed systems.",
      });

      // Must contain real projects
      expect(result.markdown).toContain("GreenPay E-Wallet");
      expect(result.markdown).toContain("QuranApp (Digital Mushaf)");
      expect(result.markdown).toContain("Personal Portfolio & Multimodal ATS-CV Engine");

      // Must not hallucinate fictitious big-tech companies as candidate employers
      expect(result.markdown).not.toContain("Ex-Google");
      expect(result.markdown).not.toContain("Ex-Meta");
      expect(result.markdown).not.toContain("Ex-Netflix");
      expect(result.markdown).not.toContain("Fortune 500 VP");
    });
  });

  // ==========================================
  // 3. NEGATIVE PATHS & EDGE CASES
  // ==========================================
  describe("Negative Paths & Edge Cases", () => {
    it("handles empty or blank job descriptions gracefully without crashing", () => {
      const promptResult = buildAtsCvPrompt({});
      expect(promptResult.systemPrompt).toBeTruthy();
      expect(promptResult.userPrompt).toContain("Software Engineer Fullstack Mobile App");

      const cvResult = generateDeterministicAtsCv({});
      expect(cvResult.targetRole).toBeTruthy();
      expect(cvResult.markdown.length).toBeGreaterThan(500);
      expect(cvResult.matchedKeywords.length).toBeGreaterThan(0);
    });

    it("sanitizes HTML tags or malicious injection strings in job descriptions", () => {
      const maliciousInput = "<script>alert('xss')</script><table border='1'><tr><td>Injection</td></tr></table>";
      const cvResult = generateDeterministicAtsCv({
        jobDescription: maliciousInput,
        targetRole: "Security Engineer",
      });

      expect(cvResult.markdown).not.toContain("<script>");
      expect(cvResult.markdown).not.toContain("<table");
      expect(cvResult.markdown).toContain(`# ${CANDIDATE_GROUND_TRUTH.name}`);
    });

    it("returns null for nonexistent case study slugs", () => {
      expect(getCaseStudyBySlug("nonexistent-slug-xyz")).toBeNull();
      expect(getCaseStudyBySlug("")).toBeNull();
      expect(getCaseStudyBySlug("../../../etc/passwd")).toBeNull();
    });
  });
});
