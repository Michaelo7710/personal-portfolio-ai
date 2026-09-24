import { HeroSection } from "@/components/portfolio/hero-section";
import { SkillsGridSection } from "@/components/portfolio/skills-grid";
import { ProjectsSection } from "@/components/portfolio/project-card";
import { AtsTeaserSection } from "@/components/portfolio/ats-teaser-section";
import { ContactCtaSection } from "@/components/portfolio/contact-cta-section";
import { siteConfig } from "@/config/site";
import { createMetadata, toJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: `${siteConfig.name} — ${siteConfig.author.role}`,
  description: siteConfig.description,
  path: "/",
});

const personalProfileStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: siteConfig.title,
    url: siteConfig.url,
    mainEntity: {
      "@type": "Person",
      name: siteConfig.author.name,
      jobTitle: siteConfig.author.role,
      description: siteConfig.author.bio,
      url: siteConfig.url,
      sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
      knowsAbout: siteConfig.skills,
    },
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(personalProfileStructuredData) }}
      />
      <main className="flex flex-col">
        <HeroSection />
        <SkillsGridSection />
        <ProjectsSection />
        <AtsTeaserSection />
        <ContactCtaSection />
      </main>
    </>
  );
}
