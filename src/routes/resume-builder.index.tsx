import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/resume-builder/")({
  head: () => ({ meta: pageMeta("Resume Builder", "A guided, eight-step resume builder with live preview and PDF export.") }),
  component: () => <ComingSoon eyebrow="Resume Builder" title="Resume Builder" description="A guided, eight-step resume builder with live preview and PDF export." />,
});
