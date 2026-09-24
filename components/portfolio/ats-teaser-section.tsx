import { Badge } from "@/components/ui/badge";
import { AtsCvGenerator } from "@/components/portfolio/ats-cv-generator";
import {
  CheckCircle2,
  FileCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";

export function AtsTeaserSection() {
  return (
    <section
      id="ats-cv"
      aria-label="AI ATS-Friendly CV Generator Engine"
      className="border-t border-border/50 bg-gradient-to-b from-muted/30 to-background py-20 md:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/30 bg-card/80 p-8 sm:p-12 shadow-xl backdrop-blur">
          <div className="flex flex-col items-center text-center">
            <Badge
              variant="outline"
              className="mb-4 gap-1.5 border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Powered by Google Gemini Multimodal Vision
            </Badge>

            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Multimodal AI ATS-Friendly Resume Tailoring
            </h2>

            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Tempel teks lowongan kerja atau unggah tangkapan layar loker Anda. Sistem cerdas kami mencocokkan kualifikasi teknis riil saya ke format resume linear yang 100% lolos pemindaian mesin ATS.
            </p>

            {/* Feature Highlights Grid */}
            <div className="mt-8 grid w-full gap-4 text-left sm:grid-cols-3">
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <UploadCloud className="h-6 w-6 text-emerald-500 mb-2" />
                <h3 className="text-sm font-bold text-foreground">Input Multimodal</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Dukung paste teks deskripsi pekerjaan atau upload screenshot loker via Gemini Vision OCR.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <ShieldCheck className="h-6 w-6 text-emerald-500 mb-2" />
                <h3 className="text-sm font-bold text-foreground">Zero-Hallucination</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Data pengalaman dan pencapaian 100% berakar pada studi kasus portofolio nyata saya.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <FileCheck className="h-6 w-6 text-emerald-500 mb-2" />
                <h3 className="text-sm font-bold text-foreground">Format ATS Linear</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Struktur satu kolom bersih tanpa tabel atau grafik yang membingungkan parser ATS (PDF / Text).
                </p>
              </div>
            </div>

            {/* Multimodal AI Generator Card */}
            <div className="mt-10 w-full">
              <AtsCvGenerator />
            </div>

            <div className="mt-8 text-xs text-muted-foreground">
              ⚡ Terintegrasi dengan Google Gemini 1.5 Flash multimodal vision & sub-1s processing.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return <CheckCircle2 className={className} />;
}
