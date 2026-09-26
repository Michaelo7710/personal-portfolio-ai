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
    expect(projectSlugs).toContain("personal-portfolio-ai");
  });

  it("builds ATS prompt enforcing strict linear single-column format rules", () => {
    const { systemPrompt, userPrompt } = buildAtsCvPrompt({
      jobDescription: "React Native & Mobile Systems Engineer with Clean Architecture experience",
      targetRole: "Software Engineer Fullstack Mobile App",
    });

    expect(systemPrompt).toContain("ZERO HALLUCINATION");
    expect(systemPrompt).toContain("CANDIDATE AUTHENTIC POSITIONING");
    expect(userPrompt).toContain("Software Engineer Fullstack Mobile App");
    expect(userPrompt).toContain("GreenPay E-Wallet");
    expect(userPrompt).toContain("QuranApp");
    expect(userPrompt).toContain("Personal Portfolio");
  });

  it("generates deterministic ATS CV with matched keywords and quantified STAR bullets", () => {
    const result = generateDeterministicAtsCv({
      jobDescription: "Looking for an engineer skilled in React Native, Clean Architecture, and Offline-First SQLite",
      targetRole: "Software Engineer Fullstack Mobile App",
    });

    expect(result.targetRole).toBe("Software Engineer Fullstack Mobile App");
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
    expect(result.markdown).toContain("Personal Portfolio");
    expect(result.markdown).toContain("454 automated unit & integration tests");
    expect(result.markdown).toContain("WCAG 2.1 AA");
    expect(result.html).toContain("<!DOCTYPE html>");
    expect(result.projects[0].githubUrl).toContain("github.com/Michaelo7710");
  });
});
