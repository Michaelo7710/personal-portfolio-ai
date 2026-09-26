import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getModel, isProviderConfigured } from "@/lib/ai/provider";
import {
  applyRateLimitHeaders,
  createRateLimitResponse,
  getClientIp,
  takeRateLimit,
} from "@/lib/rate-limit";
import {
  buildAtsCvPrompt,
  generateDeterministicAtsCv,
  parseLlmStructuredCv,
  type AtsCvGenerationResult,
} from "@/lib/ai/ats-prompt";

const cvGenerateSchema = z.object({
  jobDescription: z.string().optional(),
  imageBase64: z.string().optional(),
  targetRole: z.string().optional(),
});

const ATS_CV_RATE_LIMIT = {
  namespace: "ai-ats-cv",
  limit: 10,
  windowMs: 15 * 60 * 1000, // 10 requests per 15 mins
};

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimit = await takeRateLimit({
    key: clientIp,
    ...ATS_CV_RATE_LIMIT,
  });

  if (!rateLimit.allowed) {
    return createRateLimitResponse(
      rateLimit,
      "Terlalu banyak permintaan penyesuaian CV. Silakan coba lagi dalam beberapa menit."
    );
  }

  try {
    const rawBody = await request.json().catch(() => ({}));
    const parseResult = cvGenerateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return applyRateLimitHeaders(
        NextResponse.json(
          {
            error: "Format data tidak valid.",
            details: parseResult.error.flatten(),
          },
          { status: 400 }
        ),
        rateLimit
      );
    }

    const { jobDescription, imageBase64, targetRole } = parseResult.data;
    const hasJobText = typeof jobDescription === "string" && jobDescription.trim().length >= 10;
    const hasImage = typeof imageBase64 === "string" && imageBase64.length > 50;

    if (!hasJobText && !hasImage) {
      return applyRateLimitHeaders(
        NextResponse.json(
          {
            error:
              "Mohon sertakan teks deskripsi pekerjaan (minimal 10 karakter) atau unggah screenshot loker.",
          },
          { status: 400 }
        ),
        rateLimit
      );
    }

    // Attempt Gemini 1.5 Flash Multimodal Vision & Reasoning if configured
    if (isProviderConfigured("google")) {
      try {
        const { systemPrompt, userPrompt } = buildAtsCvPrompt({
          jobDescription,
          targetRole,
        });

        const userContent: Array<
          | { type: "text"; text: string }
          | { type: "image"; image: string | URL }
        > = [{ type: "text", text: userPrompt }];

        if (hasImage) {
          userContent.push({
            type: "image",
            image: imageBase64,
          });
        }

        const model = getModel("google");
        const aiResponse = await generateText({
          model,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: userContent,
            },
          ],
        });

        if (aiResponse.text && aiResponse.text.trim().length > 20) {
          const fallbackReference = generateDeterministicAtsCv({
            jobDescription,
            targetRole,
          });

          const structuredResult = parseLlmStructuredCv(
            aiResponse.text,
            fallbackReference
          );

          return applyRateLimitHeaders(
            NextResponse.json({
              success: true,
              ...structuredResult,
            }),
            rateLimit
          );
        }
      } catch (geminiError) {
        console.warn(
          "Gemini API invocation encountered an issue, transitioning to deterministic ATS generator:",
          geminiError
        );
      }
    }

    // High-impact Deterministic Zero-Hallucination Generator
    const deterministicResult = generateDeterministicAtsCv({
      jobDescription,
      targetRole,
    });

    return applyRateLimitHeaders(
      NextResponse.json({
        success: true,
        ...deterministicResult,
      }),
      rateLimit
    );
  } catch (error) {
    console.error("Critical error in /api/ai/cv-generate:", error);
    return applyRateLimitHeaders(
      NextResponse.json(
        {
          error: "Terjadi kesalahan internal saat memproses penyesuaian CV.",
        },
        { status: 500 }
      ),
      rateLimit
    );
  }
}
