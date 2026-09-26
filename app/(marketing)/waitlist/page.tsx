import { getFeatureAvailability } from "@/lib/config/features";
import { createMetadata } from "@/lib/seo";
import { WaitlistPageClient } from "./waitlist-page";

export const metadata = createMetadata({
  title: "Waitlist — Mikail Nurwahid Portfolio",
  description:
    "Daftar waitlist untuk mendapatkan early access dan pembaruan pertama.",
  path: "/waitlist",
});

export default function WaitlistPage() {
  const waitlistFeature = getFeatureAvailability("waitlist");

  return (
    <WaitlistPageClient
      notice={
        waitlistFeature.enabled
          ? null
          : {
              description: waitlistFeature.message,
              missingEnv: waitlistFeature.missingEnv,
              title: waitlistFeature.title,
              toggleEnv: waitlistFeature.toggleEnv,
            }
      }
    />
  );
}
