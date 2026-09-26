export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavSection = {
  group: string;
  items: NavItem[];
};

export type NavGroup = {
  label: string;
  children: NavSection[];
};

export type NavEntry = NavItem | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

const exploreSections: NavSection[] = [
  {
    group: "Studi Kasus Proyek",
    items: [
      {
        label: "Wallet_App (Fintech)",
        href: "/#portfolio",
        description: "Aplikasi keuangan offline-first SQLite & Clean Architecture",
      },
      {
        label: "QuranApp (Digital Holy Book)",
        href: "/#portfolio",
        description: "Aplikasi mobile modern dengan Design System & Tajweed Engine",
      },
      {
        label: "Personal Portfolio AI",
        href: "/#portfolio",
        description: "Platform portofolio interaktif & generator CV linear ATS multimodal",
      },
    ],
  },
  {
    group: "Kapabilitas & Alat",
    items: [
      {
        label: "Core Skills Grid",
        href: "/#skills",
        description: "Matriks keahlian: Next.js, React Native, TypeScript, Gemini AI",
      },
      {
        label: "AI ATS CV Generator",
        href: "/#ats-cv",
        description: "Generator resume ramah ATS multimodal dengan grounding portofolio",
      },
      {
        label: "Komponen UI Showcase",
        href: "/docs/components",
        description: "Showcase 44 komponen antarmuka shadcn/ui WCAG 2.1 AA",
      },
    ],
  },
];

const updateSections: NavSection[] = [
  {
    group: "Konten & Update",
    items: [
      {
        label: "Blog",
        href: "/blog",
        description: "Artikel, tutorial, dan insight untuk developer",
      },
      {
        label: "Changelog",
        href: "/changelog",
        description: "Riwayat pembaruan produk dan starter kit",
      },
      {
        label: "Roadmap",
        href: "/roadmap",
        description: "Fitur yang sedang dibangun dan direncanakan",
      },
    ],
  },
  {
    group: "Transparansi & Support",
    items: [
      {
        label: "Open Startup",
        href: "/open",
        description: "Tampilkan metrik dan performa bisnis secara terbuka",
      },
      {
        label: "Status",
        href: "/status",
        description: "Halaman status layanan dan riwayat insiden",
      },
      {
        label: "Kontak",
        href: "/contact",
        description: "Hubungi tim untuk pertanyaan, demo, atau kerja sama",
      },
    ],
  },
  {
    group: "Perusahaan & Legal",
    items: [
      {
        label: "Tentang",
        href: "/about",
        description: "Cerita rekayasa, stack, dan profil Mikail Nurwahid",
      },
      {
        label: "Privasi",
        href: "/privacy",
        description: "Kebijakan privasi penggunaan produk dan data",
      },
      {
        label: "Syarat",
        href: "/terms",
        description: "Syarat dan ketentuan penggunaan layanan",
      },
    ],
  },
];

const authSections: NavSection[] = [
  {
    group: "Masuk & Daftar",
    items: [
      {
        label: "Masuk",
        href: "/auth/login",
        description: "Halaman login email, Google OAuth, dan Magic Link",
      },
      {
        label: "Daftar",
        href: "/auth/sign-up",
        description: "Template registrasi akun baru",
      },
      {
        label: "Daftar Berhasil",
        href: "/auth/sign-up-success",
        description: "Konfirmasi setelah pendaftaran berhasil dikirim",
      },
    ],
  },
  {
    group: "Verifikasi & Recovery",
    items: [
      {
        label: "Verifikasi Email",
        href: "/auth/verify-email",
        description: "Instruksi verifikasi email setelah registrasi",
      },
      {
        label: "Lupa Password",
        href: "/auth/forgot-password",
        description: "Minta link reset password",
      },
      {
        label: "Ubah Password",
        href: "/auth/update-password",
        description: "Halaman setel ulang password baru",
      },
      {
        label: "Auth Error",
        href: "/auth/error",
        description: "Tampilan fallback ketika proses auth gagal",
      },
    ],
  },
];

const workspaceSections: NavSection[] = [
  {
    group: "Workspace",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        description: "Ringkasan akun, aktivitas, dan penggunaan produk",
      },
      {
        label: "Pengaturan",
        href: "/dashboard/settings",
        description: "Kelola profil akun dan preferensi",
      },
      {
        label: "Component Showcase",
        href: "/dashboard/components",
        description: "Showcase antarmuka sistem dan primitives",
      },
    ],
  },
];

export const marketingNav: NavEntry[] = [
  {
    label: "Keahlian",
    href: "/#skills",
    description: "Matriks keahlian teknologi dan arsitektur sistem",
  },
  {
    label: "Portofolio",
    href: "/#portfolio",
    description: "Studi kasus rekayasa nyata dengan kerangka STAR",
  },
  {
    label: "AI ATS CV",
    href: "/#ats-cv",
    description: "Mesin penyesuaian resume ramah ATS multimodal",
  },
  {
    label: "Eksplorasi",
    children: exploreSections,
  },
  {
    label: "Kontak",
    href: "/contact",
    description: "Hubungi untuk peluang kerja atau kolaborasi teknis",
  },
];

export const dashboardNav: NavEntry[] = [
  {
    label: "Workspace",
    children: workspaceSections,
  },
  {
    label: "Eksplorasi",
    children: exploreSections,
  },
  {
    label: "Update",
    children: updateSections,
  },
  {
    label: "Akun",
    children: authSections,
  },
];
