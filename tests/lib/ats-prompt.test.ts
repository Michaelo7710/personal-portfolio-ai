import { describe, it, expect } from "vitest";
import {
  buildAtsCvPrompt,
  generateDeterministicAtsCv,
  CANDIDATE_GROUND_TRUTH,
} from "@/lib/ai/ats-prompt";

describe("lib/ai/ats-prompt", () => {
  it("provides comprehensive candidate ground truth data without hallucination", () => {
    expect(CANDIDATE_GROUND_TRUTH.name).toBeTruthy();
    expect(CANDIDATE_GROUND_TRUTH.email).toBeTruthy();
    expect(CANDIDATE_GROUND_TRUTH.skills.length).toBeGreaterThan(5);
    expect(CANDIDATE_GROUND_TRUTH.projects.length).toBeGreaterThanOrEqual(3);

    const projectSlugs = CANDIDATE_GROUND_TRUTH.projects.map((p) => p.slug);
    expect(projectSlugs).toContain("wallet-app");
    expect(projectSlugs).toContain("quran-app");
    expect(projectSlugs).toContain("edu-sim");
  });

  it("builds ATS prompt enforcing strict linear single-column format rules", () => {
    const { systemPrompt, userPrompt } = buildAtsCvPrompt({
      jobDescription: "Senior React Native & Mobile Systems Engineer with Clean Architecture experience",
      targetRole: "Senior Mobile Engineer",
    });

    expect(systemPrompt).toContain("ZERO HALLUCINATION");
    expect(systemPrompt).toContain("LINEAR SINGLE-COLUMN LAYOUT");
    expect(userPrompt).toContain("Senior Mobile Engineer");
    expect(userPrompt).toContain("GreenPay E-Wallet");
    expect(userPrompt).toContain("QuranApp");
    expect(userPrompt).toContain("Sensei Edu-Sim Suite");
  });

  it("generates deterministic ATS CV with matched keywords and quantified STAR bullets", () => {
    const result = generateDeterministicAtsCv({
      jobDescription: "Looking for an expert in React Native, Clean Architecture, and Offline-First SQLite",
      targetRole: "Lead Mobile Architect",
    });

    expect(result.targetRole).toBe("Lead Mobile Architect");
    expect(result.atsScore).toBeGreaterThanOrEqual(85);
    expect(result.matchedKeywords).toContain("React Native");
    expect(result.matchedKeywords).toContain("Clean Architecture");
    expect(result.matchedKeywords).toContain("Offline-First");
    expect(result.matchedKeywords).toContain("SQLite");

    expect(result.markdown).toContain(`# ${CANDIDATE_GROUND_TRUTH.name}`);
    expect(result.markdown).toContain("## PROFESSIONAL SUMMARY");
    expect(result.markdown).toContain("## CORE TECHNICAL COMPETENCIES");
    expect(result.markdown).toContain("GreenPay E-Wallet");
    expect(result.markdown).toContain("QuranApp");
    expect(result.markdown).toContain("Sensei Edu-Sim Suite");
    expect(result.markdown).toContain("454 automated unit & integration tests");
    expect(result.markdown).toContain("WCAG 2.1 AA");
    expect(result.markdown).toContain("60 FPS");
  });
});
