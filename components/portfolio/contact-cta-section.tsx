import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Linkedin, MessageSquare } from "lucide-react";

export function ContactCtaSection() {
  return (
    <section
      id="contact"
      aria-label="Kontak dan Diskusi Peluang Kerja"
      className="border-t border-border/50 bg-background py-20 md:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Tertarik Membicarakan Kolaborasi atau Peluang Baru?
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Saya selalu terbuka untuk berdiskusi seputar peran senior engineer, arsitektur sistem skala besar, atau eksplorasi ide produk inovatif.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 gap-2 rounded-xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              <Link href="/contact">
                <MessageSquare className="h-5 w-5" />
                Kirim Pesan via Formulir
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 gap-2 rounded-xl border-border px-6 font-semibold hover:bg-accent"
            >
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5 text-emerald-500" />
                Terhubung di LinkedIn
              </a>
            </Button>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            Lokasi: <span className="font-semibold text-foreground">{siteConfig.author.location}</span> • Ketersediaan: <span className="font-semibold text-emerald-600 dark:text-emerald-400">Aktif & Terbuka</span>
          </div>
        </div>
      </div>
    </section>
  );
}
