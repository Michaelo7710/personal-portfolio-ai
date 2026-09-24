import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";

export type AIProvider = "google" | "openai" | "anthropic";

const DEFAULT_PROVIDER: AIProvider =
  (process.env.AI_DEFAULT_PROVIDER as AIProvider) ?? "google";

const MODEL_MAP = {
  google: "gemini-1.5-flash",
  openai: "gpt-4o",
  anthropic: "claude-sonnet-4-20250514",
} as const;

export function getModel(provider: AIProvider = DEFAULT_PROVIDER) {
  switch (provider) {
    case "google":
      return google(MODEL_MAP.google);
    case "anthropic":
      return anthropic(MODEL_MAP.anthropic);
    case "openai":
    default:
      return openai(MODEL_MAP.openai);
  }
}

export function isProviderConfigured(provider: AIProvider): boolean {
  switch (provider) {
    case "google":
      return !!(
        process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
        process.env.GEMINI_API_KEY
      );
    case "openai":
      return !!process.env.OPENAI_API_KEY;
    case "anthropic":
      return !!process.env.ANTHROPIC_API_KEY;
  }
}

