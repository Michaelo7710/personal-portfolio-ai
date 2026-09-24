"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProjectCaseStudyMeta } from "@/lib/portfolio";
import {
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface CaseStudyDialogProps {
  project: ProjectCaseStudyMeta;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CaseStudyDialog({
  project,
  trigger,
  open,
  onOpenChange,
}: CaseStudyDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full gap-2 text-sm font-semibold hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            Eksplorasi Studi Kasus
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-3xl sm:max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden border-border/80 bg-background shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/60 text-left bg-muted/20">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold"
            >
              {project.category}
            </Badge>
            {project.featuredBadge && (
              <Badge variant="secondary" className="font-medium text-xs">
                {project.featuredBadge}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              STAR Case Study
            </span>
          </div>

          <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground mt-1">
            {project.tagline}
          </DialogDescription>

          {/* Quick Metrics Bar */}
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4 rounded-xl bg-card border border-border/60 p-3 shadow-xs">
            {project.metrics.map((metric, i) => (
              <div key={i} className="text-center">
                <div className="text-sm sm:text-base font-bold text-foreground">
                  {metric.value}
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <Tabs defaultValue="star" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="star" className="gap-2">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                Kerangka STAR & Kontribusi
              </TabsTrigger>
              <TabsTrigger value="architecture" className="gap-2">
                <Cpu className="h-4 w-4 text-blue-500" />
                Arsitektur & Tech Stack
              </TabsTrigger>
            </TabsList>

            <TabsContent value="star" className="space-y-6 mt-0">
              {/* Situation */}
              <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-foreground font-semibold">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    S
                  </span>
                  <span>Situation — Konteks Industri & Titik Masalah Hulu</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                  {project.star.situation}
                </p>
              </div>

              {/* Task */}
              <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-foreground font-semibold">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
                    T
                  </span>
                  <span>Task & Mandat Rekayasa Arsitektur</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                  {project.star.task}
                </p>
              </div>

              {/* Action */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-300 font-semibold">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                    A
                  </span>
                  <span>Action — Kontribusi Rekayasa Nyata (My Real Engineering Contribution)</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed pl-8">
                  {project.star.action}
                </p>
              </div>

              {/* Result */}
              <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-foreground font-semibold">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
                    R
                  </span>
                  <span>Results & Dampak Kuantitatif Terukur</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                  {project.star.result}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="architecture" className="space-y-6 mt-0">
              {/* Tech Stack Grid */}
              <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3 text-foreground font-semibold">
                  <Layers className="h-5 w-5 text-emerald-500" />
                  <span>Teknologi & Fondasi Rekayasa</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Architecture Summary */}
              <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-foreground font-semibold">
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                  <span>Prinsip Keandalan & Proteksi Downside</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.starSummary.architecture}
                </p>
              </div>

              {/* Impact Card */}
              <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-foreground font-semibold">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <span>Ringkasan Dampak & Efisiensi Sistem</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.starSummary.impact}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <div className="p-4 border-t border-border/60 bg-muted/20 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {project.techStack.slice(0, 3).join(" • ")}
          </span>
          <Button
            variant="default"
            size="sm"
            onClick={() => setDialogOpen?.(false)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          >
            Tutup Studi Kasus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
