import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: pageMeta("Contact Growvia", "Questions, feedback or partnership ideas — we'd like to hear from you.") }),
  component: () => <ComingSoon eyebrow="Contact" title="Contact Growvia" description="Questions, feedback or partnership ideas — we'd like to hear from you." />,
});
