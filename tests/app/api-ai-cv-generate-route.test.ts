import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { resetRateLimitStore } from "@/lib/rate-limit";

const isProviderConfiguredMock = vi.fn();
const getModelMock = vi.fn();
const generateTextMock = vi.fn();

vi.mock("@/lib/ai/provider", () => ({
  isProviderConfigured: isProviderConfiguredMock,
  getModel: getModelMock,
}));

vi.mock("ai", () => ({
  generateText: generateTextMock,
}));

describe("app/api/ai/cv-generate/route", () => {
  beforeEach(() => {
    resetRateLimitStore();
    isProviderConfiguredMock.mockReset();
    getModelMock.mockReset();
    generateTextMock.mockReset();
    isProviderConfiguredMock.mockReturnValue(false); // Default to deterministic fallback
  });

  afterEach(() => {
    resetRateLimitStore();
  });

  it("returns 400 when neither jobDescription nor imageBase64 is provided", async () => {
    const { POST } = await import("@/app/api/ai/cv-generate/route");
    const response = await POST(
      new Request("http://localhost/api/ai/cv-generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      }) as never
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("Mohon sertakan teks deskripsi pekerjaan");
  });

  it("returns 400 when jobDescription is too short and no image provided", async () => {
    const { POST } = await import("@/app/api/ai/cv-generate/route");
    const response = await POST(
      new Request("http://localhost/api/ai/cv-generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jobDescription: "short" }),
      }) as never
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("minimal 10 karakter");
  });

  it("successfully generates linear ATS CV with valid job description via deterministic generator", async () => {
    const { POST } = await import("@/app/api/ai/cv-generate/route");
    const response = await POST(
      new Request("http://localhost/api/ai/cv-generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jobDescription: "We are hiring a Senior React Native Mobile Engineer with Offline-First and Clean Architecture.",
          targetRole: "Senior React Native Engineer",
        }),
      }) as never
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.targetRole).toBe("Senior React Native Engineer");
    expect(body.markdown).toContain("Mikail Nurwahid");
    expect(body.markdown).toContain("GreenPay E-Wallet");
    expect(body.atsScore).toBeGreaterThanOrEqual(85);
    expect(response.headers.get("X-RateLimit-Limit")).toBe("10");
  });

  it("successfully generates ATS CV when base64 image is supplied", async () => {
    const { POST } = await import("@/app/api/ai/cv-generate/route");
    const sampleImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    const response = await POST(
      new Request("http://localhost/api/ai/cv-generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          imageBase64: sampleImage,
          targetRole: "Fullstack AI Engineer",
        }),
      }) as never
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.markdown).toContain("Mikail Nurwahid");
  });

  it("invokes Gemini Multimodal Vision when Google provider is configured", async () => {
    isProviderConfiguredMock.mockReturnValue(true);
    getModelMock.mockReturnValue({ modelId: "gemini-1.5-flash" });
    generateTextMock.mockResolvedValue({
      text: "# Mikail Nurwahid\n**Junior Full-Stack Mobile & Systems Engineer**\n\n## PROFESSIONAL SUMMARY\nTailored by Gemini 1.5 Flash Vision.\n\n## FEATURED SYSTEMS\n* GreenPay E-Wallet",
    });

    const { POST } = await import("@/app/api/ai/cv-generate/route");
    const response = await POST(
      new Request("http://localhost/api/ai/cv-generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jobDescription: "Staff AI Engineer to architect multimodal applications with Next.js and Google Gemini.",
          targetRole: "Staff AI Engineer",
        }),
      }) as never
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.provider).toBe("google");
    expect(body.markdown).toContain("Tailored by Gemini 1.5 Flash Vision");
    expect(generateTextMock).toHaveBeenCalledTimes(1);
  });
});
