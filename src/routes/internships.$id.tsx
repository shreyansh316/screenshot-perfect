import { createFileRoute, notFound } from "@tanstack/react-router";
import { OpportunityDetail, OpportunityNotFound } from "@/components/site/OpportunityDetail";
import { getOpportunity } from "@/lib/opportunities";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/internships/$id")({
  loader: ({ params }) => {
    const o = getOpportunity(params.id);
    if (!o || o.type !== "internship") throw notFound();
    return { o };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? pageMeta(`${loaderData.o.title} at ${loaderData.o.company.name}`, loaderData.o.summary)
      : [{ title: "Internship unavailable — Growvia" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => <OpportunityNotFound kind="internship" />,
  component: Page,
});

function Page() {
  const { o } = Route.useLoaderData();
  return <OpportunityDetail o={o} />;
}
