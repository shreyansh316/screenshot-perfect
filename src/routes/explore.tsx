import { createFileRoute } from "@tanstack/react-router";
import { ListingExplorer } from "@/components/site/ListingExplorer";
import { PageHeader } from "@/components/site/common";
import { ALL_OPPORTUNITIES } from "@/lib/opportunities";
import { parseOpportunitySearch } from "@/lib/search";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/explore")({
  validateSearch: parseOpportunitySearch,
  head: () => ({ meta: pageMeta("Explore opportunities", "Search every internship, job and freelance project on Growvia in one place.") }),
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <>
      <PageHeader eyebrow="Explore" title="Every opportunity in one search" description="Internships, jobs and freelance projects together. Narrow by type, location and how you'd like to work." />
      <ListingExplorer
        items={ALL_OPPORTUNITIES}
        search={search}
        onChange={(next) => navigate({ search: next, replace: true, resetScroll: false })}
        filters={["type", "location", "arrangement", "schedule", "category"]}
        emptyTitle="No verified opportunities available right now."
        noun="opportunity"
        searchPlaceholder="Search roles, companies or skills"
      />
    </>
  );
}
