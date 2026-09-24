import { describe, it, expect } from "vitest";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/portfolio";

describe("lib/portfolio", () => {
  it("returns all active case studies with complete STAR framework and metrics", () => {
    const studies = getAllCaseStudies();

    expect(studies.length).toBeGreaterThanOrEqual(3);

    const slugs = studies.map((s) => s.slug);
    expect(slugs).toContain("wallet-app");
    expect(slugs).toContain("quran-app");
    expect(slugs).toContain("edu-sim");

    for (const study of studies) {
      expect(study.id).toBeTruthy();
      expect(study.title).toBeTruthy();
      expect(study.tagline).toBeTruthy();
      expect(study.category).toBeTruthy();
      expect(study.techStack.length).toBeGreaterThan(0);
      expect(study.metrics.length).toBeGreaterThanOrEqual(3);

      // Verify STAR Summary
      expect(study.starSummary.situation).toBeTruthy();
      expect(study.starSummary.architecture).toBeTruthy();
      expect(study.starSummary.impact).toBeTruthy();

      // Verify Deep STAR Framework
      expect(study.star.situation).toBeTruthy();
      expect(study.star.task).toBeTruthy();
      expect(study.star.action).toBeTruthy();
      expect(study.star.result).toBeTruthy();
    }
  });

  it("retrieves a specific case study by slug with full markdown content", () => {
    const result = getCaseStudyBySlug("wallet-app");

    expect(result).not.toBeNull();
    expect(result?.meta.slug).toBe("wallet-app");
    expect(result?.meta.title).toBe("GreenPay E-Wallet");
    expect(result?.content).toContain("GreenPay E-Wallet");
    expect(result?.content).toContain("Clean Architecture");
    expect(result?.meta.metrics.some((m) => m.value.includes("Offline-First"))).toBe(true);
  });

  it("retrieves quran-app and edu-sim case studies correctly", () => {
    const quran = getCaseStudyBySlug("quran-app");
    expect(quran).not.toBeNull();
    expect(quran?.meta.title).toBe("QuranApp (Digital Mushaf)");
    expect(quran?.content).toContain("WCAG 2.1 AA");

    const eduSim = getCaseStudyBySlug("edu-sim");
    expect(eduSim).not.toBeNull();
    expect(eduSim?.meta.title).toBe("Sensei Edu-Sim Suite");
    expect(eduSim?.content).toContain("Zero-Eval");
  });

  it("returns null when querying a nonexistent slug", () => {
    const missing = getCaseStudyBySlug("nonexistent-project-xyz");
    expect(missing).toBeNull();
  });
});
