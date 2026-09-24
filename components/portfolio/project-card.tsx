import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseStudyDialog } from "@/components/portfolio/case-study-dialog";
import {
  getAllCaseStudies,
  staticCaseStudiesFallback,
  type ProjectCaseStudyMeta,
} from "@/lib/portfolio";

export type Project = ProjectCaseStudyMeta;
export const projectsCatalog: Project[] = staticCaseStudiesFallback;

export function ProjectsSection() {
  const projects = getAllCaseStudies();

  return (
    <section
      id="portfolio"
      aria-label="Studi Kasus Portofolio Proyek Rekayasa Riil"
      className="py-20 md:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-3 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            Proven Engineering Feats
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Studi Kasus Proyek Unggulan (STAR)
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Bukan sekadar tampilan mock-up; seluruh studi kasus ini mencerminkan sistem produksi nyata dengan metrik terukur dan keputusan arsitektur teruji.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col justify-between overflow-hidden border-border/70 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg"
            >
              <div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {project.category}
                    </span>
                    {project.featuredBadge && (
                      <Badge variant="secondary" className="text-[10px] font-semibold">
                        {project.featuredBadge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-2 text-2xl font-bold text-foreground">
                    {project.title}
                  </CardTitle>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    {project.tagline}
                  </p>
                </CardHeader>

                <CardContent className="space-y-5 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>

                  {/* Impact Metrics Banner */}
                  <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/50 p-3 text-center border border-border/50">
                    {project.metrics.map((metric, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-xs font-bold text-foreground truncate">
                          {metric.value}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5 truncate">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* STAR Quick Insight */}
                  <div className="rounded-xl border border-border/40 bg-background/50 p-3.5 text-xs text-muted-foreground space-y-1.5">
                    <div>
                      <strong className="text-foreground">S / T: </strong>
                      {project.starSummary.situation}
                    </div>
                    <div>
                      <strong className="text-foreground">Architecture: </strong>
                      {project.starSummary.architecture}
                    </div>
                    <div>
                      <strong className="text-emerald-600 dark:text-emerald-400">Impact: </strong>
                      {project.starSummary.impact}
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </div>

              <CardFooter className="border-t border-border/50 pt-4">
                <CaseStudyDialog project={project} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
