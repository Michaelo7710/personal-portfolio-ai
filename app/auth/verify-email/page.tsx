import { getSupabasePublicConfig } from "@/lib/config/public-features";
import { createMetadata } from "@/lib/seo";
import { VerifyEmailClient } from "./verify-email-client";

export const metadata = createMetadata({
  title: "Verifikasi Email — Mikail Nurwahid Portfolio",
  description: "Periksa inbox kamu untuk menyelesaikan verifikasi akun portfolio.",
  path: "/auth/verify-email",
  noIndex: true,
});

export default function VerifyEmailPage() {
  return <VerifyEmailClient supabaseConfig={getSupabasePublicConfig()} />;
}
