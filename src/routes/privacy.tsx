import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: pageMeta("Privacy policy", "How Growvia handles your personal information.") }),
  component: () => <ComingSoon eyebrow="Legal" title="Privacy policy" description="How Growvia handles your personal information." />,
});
