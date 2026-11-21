import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bookmark,
  ClipboardList,
  FileText,
  User,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Map,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader, EmptyState } from "@/components/site/common";
import { OpportunityCard } from "@/components/site/OpportunityCard";
import { useApplications, useProfile, useSaved, profileCompletion } from "@/hooks/use-account";
import { useResume } from "@/hooks/use-resume";
import { useAuth, displayName } from "@/lib/auth";
import { detailPath, getOpportunity, type Opportunity } from "@/lib/opportunities";
import { resumeCompletion } from "@/lib/resume";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: pageMeta(
      "Candidate Dashboard — Growvia",
      "Your saved opportunities, applications, resume progress, and profile in one place.",
    ),
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const name = displayName(user);
  const saved = useSaved();
  const apps = useApplications();
  const profile = useProfile();
  const resume = useResume();

  const savedCount = saved.data?.length ?? 0;
  const appsCount = apps.data?.length ?? 0;
  const profScore = profileCompletion(profile.data);
  const resumeScore = resumeCompletion(resume.data);

  const savedOpportunities = (saved.data ?? [])
    .map((s) => getOpportunity(s.opportunity_id))
    .filter((o): o is Opportunity => Boolean(o));

  return (
    <>
      <PageHeader
        eyebrow="Candidate Dashboard"
        title={`Welcome back, ${name}`}
        description="Track your opportunities, resume progress, and application pipeline from one central workspace."
      />

      <div className="container-page py-10 space-y-10">
        {/* Metric Overview Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Saved Opportunities */}
          <div className="surface-card p-5 border rounded-xl bg-surface flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Saved Opportunities
              </span>
              <span className="grid size-8 place-items-center rounded-md bg-blue-soft text-primary">
                <Bookmark className="size-4" />
              </span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-semibold text-navy">{savedCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Bookmarked listings</p>
            </div>
            <Link
              to="/saved"
              className="mt-4 pt-3 border-t text-xs font-medium text-primary hover:underline inline-flex items-center"
            >
              View saved <ArrowRight className="ml-1 size-3" />
            </Link>
          </div>

          {/* Card 2: Applications Tracked */}
          <div className="surface-card p-5 border rounded-xl bg-surface flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Applications
              </span>
              <span className="grid size-8 place-items-center rounded-md bg-teal-soft text-teal">
                <ClipboardList className="size-4" />
              </span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-semibold text-navy">{appsCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Active submissions</p>
            </div>
            <Link
              to="/applications"
              className="mt-4 pt-3 border-t text-xs font-medium text-teal hover:underline inline-flex items-center"
            >
              View pipeline <ArrowRight className="ml-1 size-3" />
            </Link>
          </div>

          {/* Card 3: Resume Completion */}
          <div className="surface-card p-5 border rounded-xl bg-surface flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Resume Builder
              </span>
              <span className="grid size-8 place-items-center rounded-md bg-navy text-navy-foreground">
                <FileText className="size-4" />
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-semibold text-navy">{resumeScore}%</p>
                <span className="text-xs capitalize text-muted-foreground">
                  {resume.template} layout
                </span>
              </div>
              <Progress value={resumeScore} className="h-1.5 mt-2" />
            </div>
            <Link
              to="/resume-builder/build"
              className="mt-4 pt-3 border-t text-xs font-medium text-primary hover:underline inline-flex items-center"
            >
              Edit resume <ArrowRight className="ml-1 size-3" />
            </Link>
          </div>

          {/* Card 4: Profile Strength */}
          <div className="surface-card p-5 border rounded-xl bg-surface flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Candidate Profile
              </span>
              <span className="grid size-8 place-items-center rounded-md bg-muted text-foreground">
                <User className="size-4" />
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-semibold text-navy">{profScore}%</p>
                <span className="text-xs text-muted-foreground">
                  {profScore === 100 ? "Complete" : "In progress"}
                </span>
              </div>
              <Progress value={profScore} className="h-1.5 mt-2" />
            </div>
            <Link
              to="/profile"
              className="mt-4 pt-3 border-t text-xs font-medium text-primary hover:underline inline-flex items-center"
            >
              Update profile <ArrowRight className="ml-1 size-3" />
            </Link>
          </div>
        </div>

        {/* Two-Column Detail Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Applications Pipeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">Application Pipeline</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/applications">View all</Link>
              </Button>
            </div>

            {apps.isLoading ? (
              <div className="h-40 rounded-lg bg-muted animate-pulse" />
            ) : apps.isError ? (
              <p className="text-sm text-destructive">Failed to load applications.</p>
            ) : appsCount === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No applications tracked yet"
                description="When you apply to verified roles on Growvia, their status updates will appear here."
                action={
                  <Button asChild size="sm">
                    <Link to="/explore">Find Opportunities</Link>
                  </Button>
                }
              />
            ) : (
              <div className="rounded-xl border bg-surface divide-y">
                {apps.data?.slice(0, 5).map((a) => {
                  const o = getOpportunity(a.opportunity_id);
                  return (
                    <div key={a.id} className="p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {o ? (
                          <Link
                            to={detailPath(o)}
                            params={{ id: o.id }}
                            className="text-sm font-semibold hover:text-primary truncate block"
                          >
                            {o.title}
                          </Link>
                        ) : (
                          <p className="text-sm font-semibold truncate">
                            Listing no longer available
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {o?.company.name ?? "Verified Partner"} · Applied{" "}
                          {new Date(a.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="blue" className="capitalize shrink-0">
                        {a.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Saved Opportunities */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">Recently Saved</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/saved">View all ({savedCount})</Link>
              </Button>
            </div>

            {saved.isLoading ? (
              <div className="h-40 rounded-lg bg-muted animate-pulse" />
            ) : saved.isError ? (
              <p className="text-sm text-destructive">Failed to load saved items.</p>
            ) : savedOpportunities.length === 0 ? (
              <EmptyState
                icon={Bookmark}
                title="No saved opportunities"
                description="Bookmark internships and jobs you are interested in to review them later."
                action={
                  <Button asChild size="sm" variant="outline">
                    <Link to="/explore">Explore Listings</Link>
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-3">
                {savedOpportunities.slice(0, 2).map((o) => (
                  <OpportunityCard key={o.id} o={o} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Tools & Career Navigation */}
        <div className="border-t pt-8">
          <h2 className="text-lg font-semibold text-navy mb-4">Quick Career Tools</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              to="/resume-builder/build"
              className="surface-card p-5 border rounded-xl bg-surface card-hover block group"
            >
              <div className="grid size-9 place-items-center rounded-md bg-teal-soft text-teal mb-3">
                <FileText className="size-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                Edit Resume
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Customize your ATS-ready resume and download fresh PDFs.
              </p>
            </Link>

            <Link
              to="/roadmaps"
              className="surface-card p-5 border rounded-xl bg-surface card-hover block group"
            >
              <div className="grid size-9 place-items-center rounded-md bg-blue-soft text-primary mb-3">
                <Map className="size-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                Career Roadmaps
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Follow structured milestones for software, design, and product roles.
              </p>
            </Link>

            <Link
              to="/interview-prep"
              className="surface-card p-5 border rounded-xl bg-surface card-hover block group"
            >
              <div className="grid size-9 place-items-center rounded-md bg-navy text-navy-foreground mb-3">
                <Sparkles className="size-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                Interview Prep
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Review real interview questions and practice structured answers.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
