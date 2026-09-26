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
  Code2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileCode,
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
import { siteConfig } from "@/config/site";

const SAMPLE_JOB_OFFERS = {
  mobile: {
    title: "Software Engineer Fullstack Mobile App (React Native & Offline-First)",
    description: `We are looking for a Software Engineer with hands-on capabilities in React Native, TypeScript, and Offline-First SQLite architectures.
Requirements:
- Solid understanding of Clean Architecture, repository pattern, and state management.
- Experience building resilient mobile applications handling flaky network connections.
- Familiarity with native module bridging, UI/UX WCAG 2.1 AA accessibility, and automated testing (Jest).
- Ability to leverage modern AI tools to accelerate code quality and zero-crash production standards.`,
  },
  ai: {
    title: "Fullstack Mobile & AI Systems Engineer (Next.js & Gemini)",
    description: `Seeking an adaptable Fullstack & AI Systems Engineer to build high-performance mobile and web applications integrated with Multimodal Generative AI.
Requirements:
- Advanced proficiency in Next.js 16 (App Router), React 19, and TypeScript.
- Hands-on integration with Google Gemini Multimodal Vision API & Vercel AI SDK.
- Strong architectural focus on Zero-Hallucination outputs and sub-100ms response latencies.
- Experience in automated testing (Vitest), CI/CD pipelines, and disciplined software engineering.`,
  },
  fullstack: {
    title: "Fullstack Mobile Software Engineer (Clean Architecture)",
    description: `Our team needs a Fullstack Mobile Software Engineer to implement mobile and backend service integrity.
Key Responsibilities:
- Champion Clean Architecture, Domain-Driven Design (DDD), and automated testing.
- Oversee regulatory compliance (UU PDP) and secure data sanitization across layers.
- Build lightweight, high-performance mobile and web modules with offline-first local persistence.`,
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
  const [viewMode, setViewMode] = React.useState<"document" | "markdown">("document");

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
      setViewMode("document");
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
    a.download = `CV-${siteConfig.author.name.replace(/\s+/g, "-")}-ATS.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Berkas resume (.${type}) berhasil diunduh.`);
  };

  const handleDownloadHtml = () => {
    if (!result?.html) return;
    const blob = new Blob([result.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CV-${siteConfig.author.name.replace(/\s+/g, "-")}-ATS.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Berkas mandiri CV ATS (.html) berhasil diunduh.");
  };

  /**
   * Isolated iframe print to ensure 100% pure A4 output without any web UI chrome.
   */
  const handlePrint = () => {
    if (!result?.html) {
      window.print();
      return;
    }

    try {
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        window.print();
        return;
      }

      doc.open();
      doc.write(result.html);
      doc.close();

      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1000);
      }, 350);
    } catch {
      window.print();
    }
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
                Fullstack & AI
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSelectSample("fullstack")}
                className="text-xs h-7 hover:bg-emerald-500/10 hover:text-emerald-600"
              >
                Clean Architecture
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
                placeholder="Contoh: Software Engineer Fullstack Mobile App / React Native Developer"
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
                      PNG, JPG, WebP hingga 4MB. Ekstraksi otomatis kualifikasi teknis.
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

              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="inline-flex rounded-lg border border-border/60 p-0.5 bg-muted/30">
                  <Button
                    type="button"
                    variant={viewMode === "document" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("document")}
                    className="h-7 text-xs gap-1 px-2.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Dokumen A4
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === "markdown" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("markdown")}
                    className="h-7 text-xs gap-1 px-2.5"
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    Markdown
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              </div>
            </div>

            <CardTitle className="text-xl sm:text-2xl font-bold mt-2 text-foreground">
              {result.candidate.roleHeadline || result.targetRole}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground">
              Resume berformat linear 1-kolom berstandar A4 tanpa ornamen visual perusak parser ATS.
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
                onClick={handlePrint}
                className="h-8 gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <Printer className="h-3.5 w-3.5" />
                Cetak / Simpan PDF
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleDownloadHtml}
                className="h-8 gap-1.5 text-xs"
              >
                <FileCode className="h-3.5 w-3.5" />
                Unduh .HTML
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
                onClick={handleCopy}
                className="h-8 gap-1.5 text-xs"
              >
                <Copy className="h-3.5 w-3.5" />
                Salin Teks
              </Button>
            </div>

            <span className="text-[11px] text-muted-foreground font-mono">
              100% Linear Single-Column
            </span>
          </div>

          {/* Main Content Area */}
          {viewMode === "document" ? (
            /* Live A4 Document Preview matching cv-ats.html styling */
            <ScrollArea className="h-[620px] p-4 sm:p-8 bg-slate-100 dark:bg-slate-950">
              <div className="bg-white text-slate-900 border border-slate-200/80 shadow-md rounded p-6 sm:p-10 max-w-[800px] mx-auto text-left leading-normal selection:bg-blue-100 selection:text-blue-900">
                
                {/* 1. Header & Contact Info */}
                <header className="border-b-2 border-slate-900 pb-2.5 mb-3.5">
                  <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900 mb-1">
                    {result.candidate.name}
                  </h1>
                  <div className="text-sm font-semibold text-blue-600 mb-1.5">
                    {result.candidate.roleHeadline}
                  </div>
                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                    <span>📍 {result.candidate.location}</span>
                    <span>•</span>
                    <span>
                      📞 <a href={`tel:${result.candidate.phone}`} className="hover:underline">{result.candidate.phone}</a>
                    </span>
                    <span>•</span>
                    <span>
                      ✉️ <a href={`mailto:${result.candidate.email}`} className="hover:underline">{result.candidate.email}</a>
                    </span>
                    <span>•</span>
                    <span>
                      💻 <a href={result.candidate.github} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium inline-flex items-center gap-0.5">
                        {result.candidate.github.replace("https://", "")}
                        <ExternalLink className="h-2.5 w-2.5 inline" />
                      </a>
                    </span>
                  </div>
                </header>

                {/* 2. Professional Summary */}
                <section className="mb-3.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    RINGKASAN PROFESIONAL
                  </h2>
                  <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed text-justify">
                    {result.professionalSummary}
                  </p>
                </section>

                {/* 3. Technical Skills */}
                <section className="mb-3.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    KEAHLIAN TEKNIS
                  </h2>
                  <div className="space-y-1 text-xs sm:text-[13px] leading-relaxed">
                    <div>
                      <span className="font-bold text-slate-900 inline-block min-w-[145px]">
                        Mobile Engineering:
                      </span>
                      <span className="text-slate-700">
                        {result.technicalSkills.mobileEngineering}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 inline-block min-w-[145px]">
                        Backend & Systems:
                      </span>
                      <span className="text-slate-700">
                        {result.technicalSkills.backendSystems}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 inline-block min-w-[145px]">
                        Security & Compliance:
                      </span>
                      <span className="text-slate-700">
                        {result.technicalSkills.securityCompliance}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 inline-block min-w-[145px]">
                        Testing & QA:
                      </span>
                      <span className="text-slate-700">
                        {result.technicalSkills.testingQa}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 inline-block min-w-[145px]">
                        DevOps & Tooling:
                      </span>
                      <span className="text-slate-700">
                        {result.technicalSkills.devopsTooling}
                      </span>
                    </div>
                  </div>
                </section>

                {/* 4. Featured Production Projects */}
                <section className="mb-3.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    PENGALAMAN REKAYASA SISTEM & PROYEK UTAMA
                  </h2>
                  <div className="space-y-3">
                    {result.projects.map((proj, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            {proj.title}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                            {proj.period}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-600 flex flex-wrap items-center gap-1.5">
                          <span>{proj.roleSubtitle}</span>
                          <span>|</span>
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            <span>{proj.githubUrl.replace("https://", "")}</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-xs sm:text-[13px] text-slate-700 leading-relaxed pt-0.5">
                          {proj.bullets.map((bullet, bIdx) => (
                            <li key={bIdx}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 5. Achievements & Contributions */}
                <section className="mb-3.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    PENCAPAIAN TEKNIS & KONTRIBUSI
                  </h2>
                  <ul className="list-disc pl-4 space-y-1 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                    {result.achievements.map((ach, aIdx) => (
                      <li key={aIdx}>{ach}</li>
                    ))}
                  </ul>
                </section>

                {/* 6. Education */}
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    RIWAYAT PENDIDIKAN & SPESIALISASI
                  </h2>
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        Sarjana Ilmu Komputer / Rekayasa Perangkat Lunak Equivalent
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        2020 – 2024
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                      Fokus Spesialisasi Berkelanjutan: Clean Architecture, Offline-First Mobile Systems, AI-Augmented Software Engineering, dan Pengamanan Finansial (UU PDP).
                    </p>
                  </div>
                </section>

              </div>
            </ScrollArea>
          ) : (
            /* Raw Markdown View */
            <ScrollArea className="h-[620px] p-6 sm:p-8 bg-background">
              <div className="max-w-3xl mx-auto font-mono text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed select-text">
                {result.markdown}
              </div>
            </ScrollArea>
          )}
        </Card>
      )}
    </div>
  );
}
