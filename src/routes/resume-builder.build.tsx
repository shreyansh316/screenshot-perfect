import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/resume-builder/build")({
  head: () => ({ meta: pageMeta("Build your resume", "Fill in each step and watch your resume take shape.") }),
  component: () => <ComingSoon eyebrow="Resume Builder" title="Build your resume" description="Fill in each step and watch your resume take shape." />,
});
