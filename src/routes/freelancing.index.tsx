import { createFileRoute } from "@tanstack/react-router";
import { ListingExplorer } from "@/components/site/ListingExplorer";
import { PageHeader } from "@/components/site/common";
import { FREELANCE } from "@/lib/opportunities";
import { parseOpportunitySearch } from "@/lib/search";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/freelancing/")({
  validateSearch: parseOpportunitySearch,
  head: () => ({ meta: pageMeta("Freelance projects", "Short, well-scoped freelance projects in design, development, writing and data.") }),
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <>
      <PageHeader eyebrow="Freelancing" title="Well-scoped freelance projects" description="Short projects with clear deliverables." />
      <ListingExplorer
        items={FREELANCE}
        search={search}
        onChange={(next) => navigate({ search: next, replace: true, resetScroll: false })}
        filters={["category"]}
        emptyTitle="No freelance projects available right now."
        noun="project"
        searchPlaceholder="Search projects by skill or keyword"
      />
    </>
  );
}
