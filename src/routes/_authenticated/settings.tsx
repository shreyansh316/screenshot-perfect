import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: pageMeta("Settings", "Manage your account and notification preferences.") }),
  component: () => <ComingSoon eyebrow="Account" title="Settings" description="Manage your account and notification preferences." />,
});
