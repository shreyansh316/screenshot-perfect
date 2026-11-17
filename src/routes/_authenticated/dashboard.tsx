import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: pageMeta("Your dashboard", "Your saved opportunities, applications and resume progress in one place.") }),
  component: () => <ComingSoon eyebrow="Dashboard" title="Your dashboard" description="Your saved opportunities, applications and resume progress in one place." />,
});
