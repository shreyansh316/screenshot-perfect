import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/common";
import { ROADMAPS } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/roadmaps")({
  head: () => ({
    meta: pageMeta(
      "Career roadmaps",
      "Step-by-step career paths with realistic timeframes and a milestone at every stage.",
    ),
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Career roadmaps"
        title="Know what to learn next, and in what order"
        description="Each path has realistic timeframes and a concrete milestone at every stage."
      />
      <div className="container-page grid gap-6 py-10 md:grid-cols-2">
        {ROADMAPS.map((r) => (
          <section key={r.slug} id={r.slug} className="surface-card scroll-mt-24 p-6">
            <p className="text-xs text-muted-foreground">{r.category}</p>
            <h2 className="mt-1 text-xl font-semibold text-navy">{r.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{r.summary}</p>
            <ol className="mt-5 grid gap-4">
              {r.stages.map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-teal-soft text-xs font-semibold text-teal">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      {s.title}{" "}
                      <span className="font-normal text-muted-foreground">· {s.timeframe}</span>
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{s.focus}</p>
                    <p className="mt-1 text-xs text-foreground/70">Skills: {s.skills.join(", ")}</p>
                    <p className="mt-0.5 text-xs text-teal">Milestone: {s.milestone}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </>
  );
}
