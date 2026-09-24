"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  CheckCircle2,
  Copy,
  Download,
  FileText,
  ImageIcon,
  Loader2,
  Printer,
  RotateCcw,
  Sparkles,
  Trash2,
  UploadCloud,
  Zap,
} from "lucide-react";
import type { AtsCvGenerationResult } from "@/lib/ai/ats-prompt";

const SAMPLE_JOB_OFFERS = {
  mobile: {
    title: "Senior Mobile Engineer (React Native & Offline-First)",
    description: `We are looking for a Senior Mobile Engineer with deep experience in React Native, TypeScript, and Offline-First SQLite architectures.
Requirements:
- Strong experience with Clean Architecture and state management.
- Proven track record handling flaky network connections and financial transaction security.
- Experience with native module bridging, UI/UX WCAG accessibility, and rigorous automated testing.
- Passion for zero-crash production standards and robust error handling.`,
  },
  ai: {
    title: "Lead AI Systems & Fullstack Engineer (Next.js & Gemini)",
    description: `Seeking an experienced Fullstack & AI Systems Engineer to build high-performance web applications integrated with Multimodal Generative AI.
Requirements:
- Advanced proficiency in Next.js 16 (App Router), React 19, and TypeScript.
- Hands-on integration with Google Gemini Multimodal Vision API & Vercel AI SDK.
- Strong architectural focus on Zero-Hallucination outputs and sub-100ms response latencies.
- Experience in automated testing (Vitest), CI/CD, and persistent rate limiting.`,
  },
  fullstack: {
    title: "Principal Fullstack Software Architect",
    description: `Our team needs a Principal Fullstack Architect to guide frontend, mobile, and backend service integrity.
Key Responsibilities:
- Champion Clean Architecture, Domain-Driven Design (DDD), and automated testing.
- Oversee regulatory compliance (UU PDP) and secure data sanitization across layers.
- Build lightweight web modules (< 40KB) maintaining 60 FPS performance without bulky external runtime dependencies.`,
  },
};

export function AtsCvGenerator() {
  const [jobDescription, setJobDescription] = React.useState("");
  const [targetRole, setTargetRole] = React.useState("");
  const [imageBase64, setImageBase64] = React.useState<string | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [imageName, setImageName] = React.useState<string | null>(null);

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationStep, setGenerationStep] = React.useState("");
  const [result, setResult] = React.useState<AtsCvGenerationResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Hanya berkas gambar (PNG, JPG, WebP) yang didukung.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 4 MB.");
      return;
    }

    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setImageBase64(base64String);
      setImagePreview(base64String);
      toast.success(`Screenshot loker "${file.name}" siap dianalisis.`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageBase64(null);
    setImagePreview(null);
    setImageName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectSample = (key: keyof typeof SAMPLE_JOB_OFFERS) => {
    const sample = SAMPLE_JOB_OFFERS[key];
    setJobDescription(sample.description);
    setTargetRole(sample.title);
    setError(null);
    toast.info(`Contoh loker "${sample.title}" dimuat.`);
  };

  const handleGenerate = async () => {
    if (!jobDescription.trim() && !imageBase64) {
      setError("Mohon masukkan teks deskripsi pekerjaan atau unggah screenshot loker.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationStep("Memindai kebutuhan loker & kualifikasi teknis...");

    try {
      setTimeout(() => {
        setGenerationStep("Mencocokkan keyword ke data riil STAR portofolio...");
      }, 700);

      setTimeout(() => {
        setGenerationStep("Menyusun resume linear berstandar ATS (Workday/Greenhouse)...");
      }, 1400);

      const response = await fetch("/api/ai/cv-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription: jobDescription.trim(),
          targetRole: targetRole.trim(),
          imageBase64: imageBase64 || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghasilkan resume ATS.");
      }

      setResult(data);
      toast.success("Resume ATS linear berhasil dirumuskan!");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  const handleCopy = () => {
    if (!result?.markdown) return;
    navigator.clipboard.writeText(result.markdown);
    toast.success("Resume disalin ke clipboard!");
  };

  const handleDownload = (type: "md" | "txt") => {
    if (!result?.markdown) return;
    const blob = new Blob([result.markdown], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CV-Muhammad-Luthfi-ATS.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Berkas resume (.${type}) berhasil diunduh.`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {!result ? (
        <Card className="border-emerald-500/40 bg-card/95 shadow-xl">
          <CardHeader className="text-left pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-3 w-3 mr-1.5" />
                Multimodal Input Engine
              </Badge>
              <span className="text-xs text-muted-foreground">
                Zero-Hallucination • ATS Compatible
              </span>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold mt-2">
              Sesuaikan Resume Anda dengan Loker Impian
            </CardTitle>
            <CardDescription className="text-sm">
              Tempel deskripsi lowongan kerja atau unggah screenshot poster loker untuk menghasilkan resume linear berstandar ATS secara instan.
            </CardDescription>

            {/* Quick Sample Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground mr-1">
                Contoh Cepat:
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSelectSample("mobile")}
                className="text-xs h-7 hover:bg-emerald-500/10 hover:text-emerald-600"
              >
                Mobile Engineer
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSelectSample("ai")}
                className="text-xs h-7 hover:bg-emerald-500/10 hover:text-emerald-600"
              >
                AI & Fullstack
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSelectSample("fullstack")}
                className="text-xs h-7 hover:bg-emerald-500/10 hover:text-emerald-600"
              >
                Principal Architect
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div>
              <label htmlFor="target-role" className="block text-xs font-medium text-foreground mb-1">
                Posisi / Judul Loker yang Dituju (Opsional)
              </label>
              <Input
                id="target-role"
                placeholder="Contoh: Senior React Native Developer / Lead Fullstack Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="text-sm"
              />
            </div>

            <div>
              <label htmlFor="job-description" className="block text-xs font-medium text-foreground mb-1">
                Teks Deskripsi Pekerjaan (Job Description)
              </label>
              <Textarea
                id="job-description"
                placeholder="Tempel rincian tanggung jawab, kualifikasi, atau tech stack dari postingan loker di sini..."
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="text-sm leading-relaxed"
              />
            </div>

            {/* Image OCR Upload Area */}
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-foreground">
                      Upload Screenshot Loker (Gemini Vision OCR)
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      PNG, JPG, WebP hingga 4MB. Ekstraksi otomatis teks kualifikasi.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="ats-image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-1.5 text-xs"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    Pilih Gambar
                  </Button>
                </div>
              </div>

              {imagePreview && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-card p-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Pratinjau Screenshot Loker"
                      className="h-10 w-10 rounded object-cover border border-border/50"
                    />
                    <span className="text-xs font-medium text-foreground truncate max-w-[200px] sm:max-w-xs">
                      {imageName}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <Button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerate}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shadow-md"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{generationStep || "Sedang memproses..."}</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Generate ATS-Tailored CV (Gemini AI)</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Resume Preview Result View */
        <Card className="border-emerald-500/50 bg-card shadow-2xl overflow-hidden text-left">
          <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  ATS Match Score: {result.atsScore}%
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {result.provider === "google" ? "⚡ Powered by Gemini" : "🔒 Zero-Hallucination Engine"}
                </Badge>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Sesuaikan Loker Lain
              </Button>
            </div>

            <CardTitle className="text-xl sm:text-2xl font-bold mt-2 text-foreground">
              {result.targetRole}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground">
              Resume berformat linear satu kolom tanpa ornamen visual perusak parser ATS.
            </CardDescription>

            {/* Matched Keywords Pill Row */}
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground mr-1">
                Kata Kunci Tertanam:
              </span>
              {result.matchedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300"
                >
                  {kw}
                </span>
              ))}
            </div>
          </CardHeader>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-muted/40 border-b border-border/60">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="h-8 gap-1.5 text-xs"
              >
                <Copy className="h-3.5 w-3.5" />
                Salin Teks
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleDownload("md")}
                className="h-8 gap-1.5 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Unduh .MD
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleDownload("txt")}
                className="h-8 gap-1.5 text-xs"
              >
                <FileText className="h-3.5 w-3.5" />
                Unduh .TXT
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handlePrint}
                className="h-8 gap-1.5 text-xs"
              >
                <Printer className="h-3.5 w-3.5" />
                Cetak / PDF
              </Button>
            </div>

            <span className="text-[11px] text-muted-foreground">
              100% Linear Text Layout
            </span>
          </div>

          {/* Printable / Preview Area */}
          <ScrollArea className="h-[520px] p-6 sm:p-8 bg-background">
            <div className="max-w-3xl mx-auto font-mono text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed select-text">
              {result.markdown}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
