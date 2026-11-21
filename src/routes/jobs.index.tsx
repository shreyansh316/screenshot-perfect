import { createFileRoute } from "@tanstack/react-router";
import { ListingExplorer } from "@/components/site/ListingExplorer";
import { PageHeader } from "@/components/site/common";
import { JOBS } from "@/lib/opportunities";
import { parseOpportunitySearch } from "@/lib/search";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/jobs/")({
  validateSearch: parseOpportunitySearch,
  head: () => ({
    meta: pageMeta(
      "Jobs",
      "Entry-level and junior jobs for freshers and early-career professionals, filterable by location and arrangement.",
    ),
  }),
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <>
      <PageHeader
        eyebrow="Jobs"
        title="Early-career jobs, clearly described"
        description="Roles for freshers and early-career professionals, with the work arrangement and experience level stated up front."
      />
      <ListingExplorer
        items={JOBS}
        search={search}
        onChange={(next) => navigate({ search: next, replace: true, resetScroll: false })}
        filters={["location", "arrangement", "schedule", "category"]}
        emptyTitle="No verified jobs available right now."
        noun="job"
        searchPlaceholder="Search by title, company or skill"
      />
    </>
  );
}
