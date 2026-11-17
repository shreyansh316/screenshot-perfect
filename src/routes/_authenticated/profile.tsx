import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: pageMeta("Your profile", "Manage your skills, links and freelancer profile.") }),
  component: () => <ComingSoon eyebrow="Account" title="Your profile" description="Manage your skills, links and freelancer profile." />,
});
