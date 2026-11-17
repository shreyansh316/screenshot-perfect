import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/site/common";
import { OpportunityCard, OpportunityCardSkeleton } from "@/components/site/OpportunityCard";
import { useSaved } from "@/hooks/use-account";
import { getOpportunity, type Opportunity } from "@/lib/opportunities";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/saved")({
  head: () => ({ meta: pageMeta("Saved opportunities", "Internships, jobs and projects you've saved on Growvia.") }),
  component: Page,
});

function Page() {
  const saved = useSaved();
  const items = (saved.data ?? []).map((r) => getOpportunity(r.opportunity_id)).filter((o): o is Opportunity => !!o);
  return (
    <>
      <PageHeader eyebrow="Your account" title="Saved opportunities" />
      <div className="container-page py-10">
        {saved.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <OpportunityCardSkeleton key={i} />)}</div>
        ) : saved.isError ? (
          <p className="text-sm text-destructive">We couldn't load your saved list. Please refresh the page.</p>
        ) : items.length === 0 ? (
          <EmptyState icon={Bookmark} title="Nothing saved yet" description="Use the bookmark on any listing to keep it here for later." action={<Button asChild><Link to="/internships">Browse internships</Link></Button>} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{items.map((o) => <OpportunityCard key={o.id} o={o} />)}</div>
        )}
      </div>
    </>
  );
}
