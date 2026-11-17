import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: pageMeta("Terms of service", "The terms that apply when you use Growvia.") }),
  component: () => <ComingSoon eyebrow="Legal" title="Terms of service" description="The terms that apply when you use Growvia." />,
});
