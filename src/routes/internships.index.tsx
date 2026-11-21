import { createFileRoute } from "@tanstack/react-router";
import { ListingExplorer } from "@/components/site/ListingExplorer";
import { PageHeader } from "@/components/site/common";
import { INTERNSHIPS } from "@/lib/opportunities";
import { parseOpportunitySearch } from "@/lib/search";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/internships/")({
  validateSearch: parseOpportunitySearch,
  head: () => ({
    meta: pageMeta(
      "Internships",
      "Search and filter internships by skill, location, work arrangement, pay, schedule and duration.",
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
        eyebrow="Internships"
        title="Find an internship that teaches you something real"
        description="Filter by how and where you want to work. Save the ones you like and apply when you're ready."
      />
      <ListingExplorer
        items={INTERNSHIPS}
        search={search}
        onChange={(next) => navigate({ search: next, replace: true, resetScroll: false })}
        filters={["location", "arrangement", "paid", "schedule", "duration", "category"]}
        emptyTitle="No verified internships available right now."
        noun="internship"
        searchPlaceholder="Search by title, company or skill"
      />
    </>
  );
}
