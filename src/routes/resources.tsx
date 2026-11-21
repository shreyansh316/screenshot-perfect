import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/site/common";
import { RESOURCES } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: pageMeta(
      "Learning resources",
      "A curated list of free learning resources from trusted publishers.",
    ),
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Skills & learning"
        title="Free resources worth your time"
        description="Curated from trusted publishers. Links open the provider's own site."
      />
      <ul className="container-page grid gap-3 py-10 md:grid-cols-2">
        {RESOURCES.map((r) => (
          <li key={r.url}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card card-hover flex items-start justify-between gap-4 p-5"
            >
              <span>
                <span className="block text-sm font-semibold">{r.title}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {r.provider} · {r.kind} · {r.topic}
                </span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
