const openaiMock = vi.fn((modelId: string) => ({
  modelId,
  provider: "openai",
}));
const anthropicMock = vi.fn((modelId: string) => ({
  modelId,
  provider: "anthropic",
}));
const googleMock = vi.fn((modelId: string) => ({
  modelId,
  provider: "google",
}));

vi.mock("@ai-sdk/openai", () => ({
  openai: openaiMock,
}));

vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: anthropicMock,
}));

vi.mock("@ai-sdk/google", () => ({
  google: googleMock,
}));

describe("lib/ai/provider", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.AI_DEFAULT_PROVIDER;
    delete process.env.OPENAI_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    delete process.env.GEMINI_API_KEY;
  });

  it("uses google gemini as default provider when none is provided", async () => {
    const { getModel } = await import("@/lib/ai/provider");
    const model = getModel();

    expect(model).toEqual({
      modelId: "gemini-1.5-flash",
      provider: "google",
    });
    expect(googleMock).toHaveBeenCalledWith("gemini-1.5-flash");
  });

  it("uses the configured default provider when provided via env", async () => {
    process.env.AI_DEFAULT_PROVIDER = "anthropic";

    const { getModel } = await import("@/lib/ai/provider");
    const model = getModel();

    expect(model).toEqual({
      modelId: "claude-sonnet-4-20250514",
      provider: "anthropic",
    });
    expect(anthropicMock).toHaveBeenCalledWith("claude-sonnet-4-20250514");
  });

  it("returns the requested provider model", async () => {
    const { getModel } = await import("@/lib/ai/provider");
    const model = getModel("google");

    expect(model).toEqual({
      modelId: "gemini-1.5-flash",
      provider: "google",
    });
    expect(googleMock).toHaveBeenCalledWith("gemini-1.5-flash");

    const openaiModel = getModel("openai");
    expect(openaiModel).toEqual({
      modelId: "gpt-4o",
      provider: "openai",
    });
    expect(openaiMock).toHaveBeenCalledWith("gpt-4o");
  });

  it("checks whether provider keys are configured", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "google-key";

    const { isProviderConfigured } = await import("@/lib/ai/provider");

    expect(isProviderConfigured("google")).toBe(true);
    expect(isProviderConfigured("openai")).toBe(false);
    expect(isProviderConfigured("anthropic")).toBe(false);

    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    process.env.GEMINI_API_KEY = "gemini-fallback-key";
    expect(isProviderConfigured("google")).toBe(true);
  });
});
