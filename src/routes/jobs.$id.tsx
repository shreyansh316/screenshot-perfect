import { createFileRoute, notFound } from "@tanstack/react-router";
import { OpportunityDetail, OpportunityNotFound } from "@/components/site/OpportunityDetail";
import { getOpportunity } from "@/lib/opportunities";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/jobs/$id")({
  loader: ({ params }) => {
    const o = getOpportunity(params.id);
    if (!o || o.type !== "job") throw notFound();
    return { o };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? pageMeta(`${loaderData.o.title} at ${loaderData.o.company.name}`, loaderData.o.summary)
      : [{ title: "Job unavailable — Growvia" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => <OpportunityNotFound kind="job" />,
  component: Page,
});

function Page() {
  const { o } = Route.useLoaderData();
  return <OpportunityDetail o={o} />;
}
