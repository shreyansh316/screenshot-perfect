import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHeader } from "@/components/site/common";
import { INTERVIEW_TOPICS } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/interview-prep")({
  head: () => ({ meta: pageMeta("Interview preparation", "Common interview questions with practical tips on how to answer them.") }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader eyebrow="Interview preparation" title="Practise the questions you'll actually be asked" description="Common questions, grouped by type, with a tip for each." />
      <div className="container-page grid gap-8 py-10">
        {INTERVIEW_TOPICS.map((t) => (
          <section key={t.title} className="surface-card p-6">
            <h2 className="text-lg font-semibold text-navy">{t.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.intro}</p>
            <Accordion type="multiple" className="mt-3">
              {t.questions.map((q) => (
                <AccordionItem key={q.q} value={q.q}>
                  <AccordionTrigger className="text-left text-sm">{q.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{q.tip}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </>
  );
}
