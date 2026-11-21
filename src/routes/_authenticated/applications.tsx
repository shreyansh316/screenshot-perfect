import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/site/common";
import { useApplications } from "@/hooks/use-account";
import { detailPath, getOpportunity } from "@/lib/opportunities";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/applications")({
  head: () => ({
    meta: pageMeta("My applications", "Track the applications you've made through Growvia."),
  }),
  component: Page,
});

function Page() {
  const apps = useApplications();
  return (
    <>
      <PageHeader eyebrow="Your account" title="My applications" />
      <div className="container-page py-10">
        {apps.isLoading ? (
          <div className="h-32 animate-pulse rounded-lg bg-muted" />
        ) : apps.isError ? (
          <p className="text-sm text-destructive">
            We couldn't load your applications. Please refresh the page.
          </p>
        ) : !apps.data?.length ? (
          <EmptyState
            icon={ClipboardList}
            title="No applications yet"
            description="When you apply through Growvia, each application and its status appears here."
            action={
              <Button asChild>
                <Link to="/explore">Find opportunities</Link>
              </Button>
            }
          />
        ) : (
          <ul className="divide-y rounded-lg border bg-surface">
            {apps.data.map((a) => {
              const o = getOpportunity(a.opportunity_id);
              return (
                <li key={a.id} className="flex flex-wrap items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    {o ? (
                      <Link
                        to={detailPath(o)}
                        params={{ id: o.id }}
                        className="text-sm font-semibold hover:text-primary"
                      >
                        {o.title}
                      </Link>
                    ) : (
                      <p className="text-sm font-semibold">Listing no longer available</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {o?.company.name} · Applied {new Date(a.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="blue" className="capitalize">
                    {a.status}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
