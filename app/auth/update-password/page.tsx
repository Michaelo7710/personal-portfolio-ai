import { UpdatePasswordForm } from "@/components/update-password-form";
import { getSupabasePublicConfig } from "@/lib/config/public-features";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Update Password — Mikail Nurwahid Portfolio",
  description: "Atur password baru untuk akun portfolio kamu.",
  path: "/auth/update-password",
  noIndex: true,
});

export default function Page() {
  const supabaseConfig = getSupabasePublicConfig();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm supabaseConfig={supabaseConfig} />
      </div>
    </div>
  );
}
