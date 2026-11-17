import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: pageMeta("About Growvia", "Growvia helps students, freshers, freelancers and professionals discover opportunities and grow their careers.") }),
  component: () => <ComingSoon eyebrow="About" title="About Growvia" description="Growvia helps students, freshers, freelancers and professionals discover opportunities and grow their careers." />,
});
