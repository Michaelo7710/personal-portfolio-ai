import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ProjectMetric = {
  label: string;
  value: string;
};

export type StarSummary = {
  situation: string;
  architecture: string;
  impact: string;
};

export type StarFramework = {
  situation: string;
  task: string;
  action: string;
  result: string;
};

export type ProjectCaseStudyMeta = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description?: string;
  category: string;
  featuredBadge?: string;
  date: string;
  published?: boolean;
  techStack: string[];
  metrics: ProjectMetric[];
  starSummary: StarSummary;
  star: StarFramework;
  readingTime?: number;
  demoUrl?: string;
  githubUrl?: string;
};

export type ProjectCaseStudy = {
  meta: ProjectCaseStudyMeta;
  content: string;
};

const PORTFOLIO_DIR = path.join(process.cwd(), "content/portfolio");

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export const staticCaseStudiesFallback: ProjectCaseStudyMeta[] = [
  {
    id: "wallet-app",
    slug: "wallet-app",
    title: "GreenPay E-Wallet",
    tagline: "Aplikasi Dompet Digital Offline-First & Resi Finansial Kanonikal",
    description:
      "Arsitektur finansial 3-tier berstandar Clean Architecture dengan perlindungan screen capture, masking data sensitif UU PDP, eliminasi race condition saldo, dan resi resmi server.",
    category: "Fintech & Mobile Architecture",
    featuredBadge: "Flagship Production System",
    date: "2026-09-20",
    published: true,
    githubUrl: "https://github.com/Michaelo7710/greenpay-showcase",
    techStack: [
      "React Native",
      "TypeScript",
      "Clean Architecture",
      "SQLite",
      "Jest (34 Suites / 313 Tests)",
    ],
    metrics: [
      { label: "Ketahanan Jaringan", value: "100% Offline-First" },
      { label: "Cakupan Tes", value: "313 Tests Pass" },
      { label: "UI Guard", value: "0 Raw Alert" },
    ],
    starSummary: {
      situation:
        "Aplikasi dompet digital membutuhkan perlindungan transaksi moneter tanpa toleransi kegagalan saldo atau kebocoran data pengguna saat offline.",
      architecture:
        "Sentralisasi Unified Feedback Service, perlindungan Screen Capture Guard di root level, sanitasi data rekening (UU PDP), dan sinkronisasi resi kanonikal.",
      impact:
        "100% bebas dari crash dialog mentah, 0 race condition transaksi, dan lolos uji regresi otomatis 34 test suite beruntun.",
    },
    star: {
      situation:
        "Pada ekosistem fintech modern di Indonesia, stabilitas koneksi internet seluler di lapangan kerap mengalami fluktuasi tajam (spotty coverage). Ketika pengguna melakukan transaksi transfer dana atau pembayaran QRIS di area minim sinyal, kegagalan penanganan jaringan dapat mengakibatkan double-spending, saldo gantung, atau crash mendadak akibat unhandled promise rejection. Selain itu, terdapat regulasi ketat perlindungan privasi finansial (UU PDP No. 27/2022) dan pencegahan pencurian kredensial melalui aplikasi perekam layar jahat.",
      task:
        "Membangun sistem dompet digital kelas produksi dengan 3-Tier Clean Architecture yang menjamin ketahanan mutlak transaksi offline-first, mengeliminasi race condition saldo secara deterministik, menerapkan sanitasi data sensitif di seluruh layer presentasi, serta mencegah kebocoran informasi melalui screen capture.",
      action:
        "1. Mengimplementasikan Screen Capture Guard di root level aplikasi untuk memblokir rekaman layar dan screenshot pada layar pembayaran serta detail kartu/rekening. 2. Membangun Sanitasi Data Otomatis berstandar UU PDP yang memask nomor telepon dan rekening (e.g. 0812-****-8899) pada seluruh tampilan UI dan event logging. 3. Menerapkan Transaction Lock Engine dengan UUIDv4 Idempotency Key dan antrean mutasi lokal SQLite untuk mengunci saldo secara atomik. 4. Merancang Canonical Digital Receipt Engine dengan hash verifikasi server dan sinkronisasi background otomatis saat koneksi internet pulih. 5. Menyentralisasi Unified Feedback Service untuk menghapus seluruh dialog Alert.alert mentah dan menggantinya dengan bottom-sheet informatif yang ramah screen reader.",
      result:
        "Sistem berhasil mencapai 100% ketahanan offline-first tanpa satu pun insiden race condition atau saldo gantung. Seluruh modul dilindungi oleh 34 test suites (313 unit & integration tests) dengan status passing 100%. Tidak ada kebocoran data sensitif pada log sistem, dan pengalaman pengguna tetap konsisten pada 60 FPS.",
    },
  },
  {
    id: "quran-app",
    slug: "quran-app",
    title: "QuranApp (Digital Mushaf)",
    tagline: "Aplikasi Al-Qur'an Digital Modern dengan Tajweed Engine",
    description:
      "Antarmuka bacaan suci modern dengan sistem token warna hukum tajwid, tipografi arab resolusi tinggi, indexing pencarian ayat kilat, dan navigasi ramah lansia.",
    category: "Mobile Design System & Cultural Tech",
    featuredBadge: "Accessibility Masterpiece",
    date: "2026-09-21",
    published: true,
    techStack: [
      "React Native",
      "Design System",
      "Offline Quran DB",
      "WCAG 2.1 AA",
      "Audio Streamer",
    ],
    metrics: [
      { label: "Aksesibilitas", value: "WCAG 2.1 AA" },
      { label: "Ketersediaan Konten", value: "114 Surah Offline" },
      { label: "Latensi Layar", value: "< 50ms Switch" },
    ],
    starSummary: {
      situation:
        "Teks mushaf digital sering kali sulit dibaca pada layar kecil atau memiliki kontras rendah yang melelahkan mata saat dibaca dalam waktu lama.",
      architecture:
        "Penerapan skala tipografi modular 1.25, sistem token warna tajwid berdaya kontras tinggi, dan caching ayat lokal terindeks.",
      impact:
        "Membaca nyaman tanpa eye-strain, pembacaan audio tajwid mulus, dan 100% surah dapat diakses tanpa koneksi internet.",
    },
    star: {
      situation:
        "Banyak aplikasi Al-Qur'an digital di pasar mengalami kelemahan tipografi serius: teks Arab beresolusi rendah yang pecah di layar resolusi tinggi, aturan warna tajwid yang tidak memenuhi kontras visual sehingga melelahkan mata pembaca lansia (eye strain), serta latensi navigasi tinggi ketika berpindah antar surah panjang karena query database yang lambat dan unoptimized list rendering.",
      task:
        "Mendesain dan merekayasa aplikasi Mushaf Digital yang menjunjung tinggi standar tipografi suci, kepatuhan aksesibilitas WCAG 2.1 AA untuk rasio kontras warna hukum tajwid, indexing database offline instan (< 50ms surah switch), serta integrasi audio streaming qari yang tersinkronisasi per ayat.",
      action:
        "1. Merancang Token Warna Semantik Tajwid dengan rasio kontras minimal 4.5:1 terhadap background terang maupun gelap untuk hukum Ikhfa, Idgham, Iqlab, Qalqalah, dan Ghunnah. 2. Membangun Tipografi Modular Skala 1.25 dengan dynamic font resizing yang menjaga keterbacaan harakat dan tanda waqaf tanpa terpotong (zero clipping). 3. Mengimplementasikan Mesin Indeks Database Offline (SQLite) teroptimasi dengan tabel Surah, Ayah, dan Juz yang diprapetakan ke memory cache. 4. Membangun Background Audio Streamer modular dengan listener posisi playback dan highlight ayat otomatis yang sinkron secara real-time.",
      result:
        "Aplikasi berhasil mencapai sertifikasi internal kepatuhan WCAG 2.1 AA. Seluruh 114 surah (6.236 ayat) tersimpan dan dapat diakses 100% offline dengan waktu muat surah di bawah 50 milidetik. Uji keterbacaan menunjukkan peningkatan kenyamanan membaca jangka panjang tanpa kelelahan mata.",
    },
  },
  {
    id: "edu-sim",
    slug: "edu-sim",
    title: "Sensei Edu-Sim Suite",
    tagline: "Simulator Sains & Aljabar Satu File HTML Mandiri 60 FPS",
    description:
      "Laboratorium simulasi aljabar dan kalkulus mandiri (single-file HTML, zero CDN) dengan parser matematika aman tanpa eval, kontrol pan/zoom tak terbatas, dan kuis diagnostik HOTS.",
    category: "Interactive Web & STEM Engine",
    featuredBadge: "Pure Canvas & Math Engine",
    date: "2026-09-22",
    published: true,
    techStack: [
      "HTML5 Canvas 2D",
      "Zero-Eval Math Parser",
      "Adaptive Grid",
      "Socratic HOTS Engine",
      "Single-File HTML",
    ],
    metrics: [
      { label: "Ukuran Berkas", value: "< 40 KB" },
      { label: "Frame Rate", value: "60 FPS Canvas" },
      { label: "Dependensi", value: "0 External CDN" },
    ],
    starSummary: {
      situation:
        "Media pembelajaran interaktif umumnya berat, memerlukan server backend rumit, dan tersendat di komputer sekolah dengan spesifikasi terbatas.",
      architecture:
        "Recursive Descent Math Parser mandiri (zero eval), sistem kanvas adaptif dengan infinite pan/zoom, dan state engine terisolasi dalam satu berkas HTML.",
      impact:
        "Berjalan mulus 60 FPS di laptop sekolah RAM ≤ 8GB, portabel tanpa instalasi, dan 100% lulus 12 pintu audit statis QA.",
    },
    star: {
      situation:
        "Penyampaian konsep sains dan matematika abstrak (seperti fungsi kuadrat, gelombang sinus, dan gravitasi) sering kali gagal karena buku pelajaran bersifat statis. Di sisi lain, simulator berbasis web yang ada di pasaran umumnya menggunakan library pihak ketiga yang sangat besar (> 5MB), memerlukan koneksi internet stabil ke CDN eksternal, atau memakai Java applet kuno yang tidak lagi didukung peramban modern. Komputer laboratorium sekolah dengan spesifikasi rendah (RAM ≤ 8GB) sering kali mengalami tab browser crash.",
      task:
        "Membangun arsitektur media simulasi edukasi interaktif mandiri yang terbungkus utuh dalam SATU file .html (< 40KB), tanpa dependensi CDN eksternal, berjalan konsisten pada 60 FPS di perangkat berspesifikasi minim, mengeksekusi rumus matematika dengan parser aman tanpa fungsi berbahaya eval(), serta dilengkapi evaluasi pedagogis Sokratik HOTS.",
      action:
        "1. Merancang Zero-Eval Recursive Descent Math Parser mandiri yang memecah string fungsi (e.g., 'sin(2*x) + 0.5*x^2') menjadi token dan Abstract Syntax Tree (AST) secara aman tanpa kerentanan XSS. 2. Membangun Engine Visual Canvas 2D murni berbasis requestAnimationFrame dengan sistem transformasi koordinat layar-ke-matematis, infinite pan, smooth mouse-wheel zoom, dan adaptive grid intervaling. 3. Mengintegrasikan Modul Pedagogi Sokratik HOTS yang menyajikan kuis diagnostik interaktif dengan analisis distraktor mendalam (menjelaskan secara jernih mengapa pilihan salah keliru dan meluruskan miskonsepsi hulu). 4. Menerapkan strategi isolasi state FSM satu file dengan CSS modern tanpa build step eksternal.",
      result:
        "Simulator berhasil dikemas dalam berkas tunggal berukuran hanya 38KB, dapat dijalankan secara instan cukup dengan double-click pada browser apa pun tanpa instalasi atau koneksi internet. Frame rate rendering stabil di 60 FPS dengan konsumsi RAM di bawah 30MB, dan 100% lulus 12 gerbang audit statis QA.",
    },
  },
];

export function getAllCaseStudies(): ProjectCaseStudyMeta[] {
  if (!fs.existsSync(PORTFOLIO_DIR)) {
    return staticCaseStudiesFallback;
  }

  try {
    const files = fs
      .readdirSync(PORTFOLIO_DIR)
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

    if (files.length === 0) {
      return staticCaseStudiesFallback;
    }

    const studies = files
      .map((filename) => {
        const filePath = path.join(PORTFOLIO_DIR, filename);
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(raw);
        const frontmatter = data as Partial<ProjectCaseStudyMeta>;

        if (frontmatter.published === false) return null;

        const slug = frontmatter.slug || filename.replace(/\.(mdx|md)$/, "");
        const fallback = staticCaseStudiesFallback.find((item) => item.slug === slug);

        return {
          id: frontmatter.id || slug,
          slug,
          title: frontmatter.title || fallback?.title || "Studi Kasus Proyek",
          tagline: frontmatter.tagline || fallback?.tagline || "",
          description: frontmatter.description || fallback?.description || "",
          category: frontmatter.category || fallback?.category || "Rekayasa Perangkat Lunak",
          featuredBadge: frontmatter.featuredBadge || fallback?.featuredBadge,
          date: frontmatter.date || fallback?.date || new Date().toISOString().split("T")[0],
          published: true,
          techStack: frontmatter.techStack || fallback?.techStack || [],
          metrics: frontmatter.metrics || fallback?.metrics || [],
          starSummary: frontmatter.starSummary || fallback?.starSummary || {
            situation: "",
            architecture: "",
            impact: "",
          },
          star: frontmatter.star || fallback?.star || {
            situation: "",
            task: "",
            action: "",
            result: "",
          },
          readingTime: estimateReadingTime(content),
          demoUrl: frontmatter.demoUrl || fallback?.demoUrl,
          githubUrl: frontmatter.githubUrl || fallback?.githubUrl,
        } as ProjectCaseStudyMeta;
      })
      .filter(Boolean) as ProjectCaseStudyMeta[];

    return studies.length > 0 ? studies : staticCaseStudiesFallback;
  } catch {
    return staticCaseStudiesFallback;
  }
}

export function getCaseStudyBySlug(slug: string): ProjectCaseStudy | null {
  if (fs.existsSync(PORTFOLIO_DIR)) {
    try {
      const files = fs
        .readdirSync(PORTFOLIO_DIR)
        .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

      for (const filename of files) {
        const filePath = path.join(PORTFOLIO_DIR, filename);
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(raw);
        const frontmatter = data as Partial<ProjectCaseStudyMeta>;
        const fileSlug = frontmatter.slug || filename.replace(/\.(mdx|md)$/, "");

        if (fileSlug === slug) {
          const fallback = staticCaseStudiesFallback.find((item) => item.slug === slug);
          const meta: ProjectCaseStudyMeta = {
            id: frontmatter.id || slug,
            slug,
            title: frontmatter.title || fallback?.title || "Studi Kasus",
            tagline: frontmatter.tagline || fallback?.tagline || "",
            description: frontmatter.description || fallback?.description || "",
            category: frontmatter.category || fallback?.category || "Rekayasa Perangkat Lunak",
            featuredBadge: frontmatter.featuredBadge || fallback?.featuredBadge,
            date: frontmatter.date || fallback?.date || "2026-09-24",
            published: frontmatter.published !== false,
            techStack: frontmatter.techStack || fallback?.techStack || [],
            metrics: frontmatter.metrics || fallback?.metrics || [],
            starSummary: frontmatter.starSummary || fallback?.starSummary || {
              situation: "",
              architecture: "",
              impact: "",
            },
            star: frontmatter.star || fallback?.star || {
              situation: "",
              task: "",
              action: "",
              result: "",
            },
            readingTime: estimateReadingTime(content),
            demoUrl: frontmatter.demoUrl || fallback?.demoUrl,
            githubUrl: frontmatter.githubUrl || fallback?.githubUrl,
          };

          return {
            meta,
            content,
          };
        }
      }
    } catch {
      // Fallback below
    }
  }

  const fallback = staticCaseStudiesFallback.find((item) => item.slug === slug);
  if (!fallback) return null;

  return {
    meta: fallback,
    content: `# ${fallback.title}\n\n${fallback.tagline}`,
  };
}
