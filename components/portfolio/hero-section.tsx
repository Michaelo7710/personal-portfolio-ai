import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Mail,
  Sparkles,
  Zap,
} from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="about"
      aria-label="Profil dan Ringkasan Karir"
      className="relative overflow-hidden py-20 md:py-28 lg:py-32"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Availability Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>{siteConfig.author.availability}</span>
          </div>

          {/* Headline & Title */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-foreground">{siteConfig.author.name}</span>
            <span className="mt-2 block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400">
              {siteConfig.author.role}
            </span>
          </h1>

          {/* Recruiter 6s Value Proposition */}
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl md:leading-relaxed">
            Spesialis arsitektur sistem modern: membangun aplikasi mobile{" "}
            <span className="font-semibold text-foreground">
              Offline-First (React Native & SQLite)
            </span>
            , rekayasa web performa tinggi (Next.js 16), dan integrasi multimodal AI berstandar{" "}
            <span className="font-semibold text-foreground">
              Zero-Hallucination & STAR Metrics
            </span>
            .
          </p>

          {/* Quick Stats Grid for Recruiters */}
          <div className="mt-10 grid w-full grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            <div className="rounded-xl border border-border/60 bg-card/60 p-4 text-center shadow-sm backdrop-blur">
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="mt-1 text-xs text-muted-foreground">Offline-First Resilience</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-4 text-center shadow-sm backdrop-blur">
              <div className="text-2xl font-bold text-foreground">60 FPS</div>
              <div className="mt-1 text-xs text-muted-foreground">Native Smooth UI</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-4 text-center shadow-sm backdrop-blur">
              <div className="text-2xl font-bold text-foreground">WCAG 2.1</div>
              <div className="mt-1 text-xs text-muted-foreground">AA Accessibility</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-4 text-center shadow-sm backdrop-blur">
              <div className="text-2xl font-bold text-foreground">Zero</div>
              <div className="mt-1 text-xs text-muted-foreground">Hallucination AI</div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 min-w-[200px] gap-2 rounded-xl bg-emerald-600 px-6 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              <Link href="#portfolio">
                <Zap className="h-5 w-5" />
                Studi Kasus Proyek
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 min-w-[200px] gap-2 rounded-xl border-border px-6 text-base font-semibold hover:bg-accent"
            >
              <Link href="#ats-cv">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                Generate ATS CV
              </Link>
            </Button>
          </div>

          {/* Social Proof & Quick Links */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-border/40 pt-8 text-sm text-muted-foreground">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-foreground"
              aria-label="Kunjungi profil GitHub"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-foreground"
              aria-label="Kunjungi profil LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-2 transition-colors hover:text-foreground"
              aria-label="Kirim pesan langsung via halaman kontak"
            >
              <Mail className="h-4 w-4" />
              <span>Hubungi Langsung</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
