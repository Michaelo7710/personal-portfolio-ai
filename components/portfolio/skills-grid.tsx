import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BrainCircuit,
  CheckCircle,
  Cpu,
  Layers,
  Smartphone,
} from "lucide-react";

type SkillCategory = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  skills: { name: string; highlight?: boolean }[];
  principles: string[];
};

const skillCategories: SkillCategory[] = [
  {
    id: "mobile-offline",
    title: "Mobile & Offline-First Engineering",
    icon: Smartphone,
    tagline: "Aplikasi mobile tangguh yang beroperasi 100% tanpa internet dengan persistensi data lokal.",
    skills: [
      { name: "React Native", highlight: true },
      { name: "Expo Bare / Managed", highlight: true },
      { name: "SQLite & Local Storage", highlight: true },
      { name: "Clean Architecture (DDD)" },
      { name: "Offline Sync Queue" },
      { name: "Zustand & Context API" },
      { name: "Screen Capture Guard" },
    ],
    principles: [
      "Zero-crash saat koneksi terputus dengan caching lokal",
      "Perlindungan data sensitif keuangan (UU PDP & Masking)",
      "Struktur kode 3-tier: Data, Domain, Presentation",
    ],
  },
  {
    id: "frontend-design",
    title: "Frontend & Design System Architecture",
    icon: Layers,
    tagline: "Antarmuka web ultra-responsif, aksesibilitas inklusif, dan konsistensi token semantik.",
    skills: [
      { name: "Next.js 16 (App Router)", highlight: true },
      { name: "TypeScript Strict", highlight: true },
      { name: "Tailwind CSS & 8pt Grid", highlight: true },
      { name: "shadcn/ui (44 Primitives)" },
      { name: "WCAG 2.1 AA Compliance" },
      { name: "Server-Driven UI (SDUI)" },
      { name: "F-Pattern Scan UX" },
    ],
    principles: [
      "Kontras warna rasio ≥ 4.5:1 dan touch target ≥ 48px",
      "Server Components default untuk optimasi Core Web Vitals",
      "Konsistensi semantik tanpa hardcoded pixel styling",
    ],
  },
  {
    id: "backend-systems",
    title: "Backend & Systems Infrastructure",
    icon: Cpu,
    tagline: "Layanan server terisolasi, autentikasi aman, dan pembatasan laju trafik terdistribusi.",
    skills: [
      { name: "Node.js & Next API Routes", highlight: true },
      { name: "Supabase SSR & PostgreSQL", highlight: true },
      { name: "JWT Claims & Role Gates" },
      { name: "Persistent Rate Limiting" },
      { name: "Idempotency Architecture" },
      { name: "Zero-Trust Security Baseline" },
      { name: "Docker Containerization" },
    ],
    principles: [
      "Pencegahan race condition pada transaksi moneter",
      "Rate-limiting protektif terhadap serangan brute-force",
      "Kepatuhan 12-Factor App dan isolasi dependensi",
    ],
  },
  {
    id: "ai-qa",
    title: "Applied Generative AI & Automated QA",
    icon: BrainCircuit,
    tagline: "Integrasi model AI beralasan tinggi dengan jaminan kualitas kode terverifikasi otomatis.",
    skills: [
      { name: "Google Gemini 1.5 Flash/Pro", highlight: true },
      { name: "Vercel AI SDK Core", highlight: true },
      { name: "Multimodal Vision OCR" },
      { name: "Zero-Hallucination Grounding" },
      { name: "Vitest & Jest Automation", highlight: true },
      { name: "Playwright E2E" },
      { name: "GitHub Actions CI/CD" },
    ],
    principles: [
      "Grounding data riil: AI dilarang mengarang kualifikasi pelamar",
      "100% test passing quality gates sebelum rilis produksi",
      "Pemeriksaan tipe statis otomatis tanpa kompromi",
    ],
  },
];

export function SkillsGridSection() {
  return (
    <section
      id="skills"
      aria-label="Matriks Keahlian Teknis dan Standar Rekayasa"
      className="border-t border-border/50 bg-muted/20 py-20 md:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-3 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            Core Technical Competencies
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Keahlian Rekayasa & Standar Sistem
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Setiap lini keahlian diasah melalui proyek produksi nyata dengan komitmen tanpa kompromi pada keandalan, performa, dan keamanan.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {skillCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className="group relative overflow-hidden border-border/70 bg-card/70 transition-all duration-200 hover:border-emerald-500/50 hover:shadow-md"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        {category.title}
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {category.tagline}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-2">
                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                          skill.highlight
                            ? "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30 font-semibold"
                            : "bg-secondary text-secondary-foreground border border-border/50"
                        }`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>

                  {/* Real-World Guarantees / Principles */}
                  <div className="border-t border-border/50 pt-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Standar Bukti Rekayasa
                    </div>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      {category.principles.map((principle, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span>{principle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
