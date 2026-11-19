import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Download, LayoutTemplate, ListOrdered, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/common";
import { STEPS, TEMPLATES } from "@/lib/resume";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/resume-builder/")({
  head: () => ({ meta: pageMeta("Resume Builder", "A guided, eight-step resume builder with live preview, three templates and a text-based PDF download.") }),
  component: Page,
});

const tips = [
  "Keep it to one page if you have under five years of experience.",
  "Start each point with an action verb and say what changed because of your work.",
  "Projects, coursework and volunteering are real experience — include them.",
  "Use the same words the listing uses for skills you genuinely have.",
  "Only include numbers and results you can explain in an interview.",
];

function Page() {
  return (
    <>
      <PageHeader eyebrow="Resume Builder" title="Build a clear, honest resume in eight short steps" description="Type once, see it laid out live, switch templates any time and download a text-based PDF that applicant tracking systems can read.">
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg"><Link to="/resume-builder/build">Start building <ArrowRight /></Link></Button>
        </div>
      </PageHeader>

      <section className="container-page grid gap-12 py-12 md:py-16 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="text-xl font-semibold text-navy">The eight steps</h2>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <li key={s.key} className="flex items-center gap-3 rounded-lg border bg-surface p-3.5 text-sm">
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-teal/50 text-xs font-semibold text-teal">{i + 1}</span>
                {s.title}
              </li>
            ))}
          </ol>
          <h2 className="mt-12 text-xl font-semibold text-navy">What you get</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {[
              { icon: LayoutTemplate, t: "Three templates", d: TEMPLATES.map((t) => t.name).join(", ") + " — switch any time without retyping." },
              { icon: ListOrdered, t: "Your order", d: "Move sections up or down, and reorder entries within each section." },
              { icon: Save, t: "Saving", d: "Signed in, your resume saves to your account. Signed out, it stays on this device." },
              { icon: Download, t: "Real PDF", d: "Selectable text, clickable links and automatic page breaks." },
            ].map((x) => (
              <li key={x.t} className="flex gap-3">
                <x.icon className="mt-0.5 size-5 shrink-0 text-teal" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-semibold">{x.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{x.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <aside className="h-fit rounded-xl border bg-surface p-6">
          <h2 className="text-lg font-semibold text-navy">Five resume tips</h2>
          <ul className="mt-4 grid gap-3 text-sm">
            {tips.map((t) => (
              <li key={t} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />{t}</li>
            ))}
          </ul>
          <Button asChild className="mt-6 w-full"><Link to="/resume-builder/build">Open the builder</Link></Button>
        </aside>
      </section>
    </>
  );
}
