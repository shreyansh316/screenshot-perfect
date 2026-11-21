import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Clock, MapPin, Wallet, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompanyMark } from "./common";
import { useToggleSave } from "@/hooks/use-account";
import {
  arrangementLabel,
  budgetLabel,
  detailPath,
  durationLabel,
  locationLabel,
  paidLabel,
  postedLabel,
  scheduleLabel,
  type Opportunity,
} from "@/lib/opportunities";
import { cn } from "@/lib/utils";

export function SaveButton({
  o,
  variant = "icon",
  className,
}: {
  o: Opportunity;
  variant?: "icon" | "full";
  className?: string;
}) {
  const { toggle, isSaved } = useToggleSave();
  const saved = isSaved(o.id);
  const Icon = saved ? BookmarkCheck : Bookmark;
  if (variant === "full") {
    return (
      <Button
        variant="outline"
        size="lg"
        onClick={() => toggle(o)}
        aria-pressed={saved}
        className={className}
      >
        <Icon className={cn(saved && "text-primary")} />
        {saved ? "Saved" : "Save"}
      </Button>
    );
  }
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => toggle(o)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${o.title} from saved` : `Save ${o.title}`}
      className={cn("shrink-0", saved && "text-primary", className)}
    >
      <Icon className="size-[18px]" />
    </Button>
  );
}

export function OpportunityCard({ o, className }: { o: Opportunity; className?: string }) {
  const duration = durationLabel(o.durationMonths);
  return (
    <article className={cn("surface-card card-hover group relative flex flex-col p-5", className)}>
      <div className="flex items-start gap-3.5">
        <CompanyMark name={o.company.name} />
        <div className="min-w-0 flex-1">
          <h3 className="text-[0.9375rem] font-semibold leading-snug text-foreground">
            <Link
              to={detailPath(o)}
              params={{ id: o.id }}
              className="after:absolute after:inset-0 focus-visible:outline-none group-focus-within:underline"
            >
              <span className="relative">{o.title}</span>
            </Link>
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 className="size-3.5" aria-hidden="true" />
            {o.company.name}
          </p>
        </div>
        <SaveButton o={o} className="relative z-10 -mr-2 -mt-1" />
      </div>

      <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.8125rem] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Location</dt>
          <MapPin className="size-3.5" aria-hidden="true" />
          <dd>{locationLabel(o)}</dd>
        </div>
        {o.type === "freelance" ? (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Budget</dt>
            <Wallet className="size-3.5" aria-hidden="true" />
            <dd>{budgetLabel(o.budget)}</dd>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Pay</dt>
            <Wallet className="size-3.5" aria-hidden="true" />
            <dd>{paidLabel(o.paid)}</dd>
          </div>
        )}
        {duration && (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Duration</dt>
            <Clock className="size-3.5" aria-hidden="true" />
            <dd>{duration}</dd>
          </div>
        )}
        {o.projectLength && (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Project length</dt>
            <Clock className="size-3.5" aria-hidden="true" />
            <dd>{o.projectLength}</dd>
          </div>
        )}
      </dl>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground/80">{o.summary}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Skills">
        <li>
          <Badge variant="blue">{arrangementLabel[o.arrangement]}</Badge>
        </li>
        {o.type !== "freelance" && (
          <li>
            <Badge variant="muted">{scheduleLabel[o.schedule]}</Badge>
          </li>
        )}
        {o.skills.slice(0, 3).map((s) => (
          <li key={s}>
            <Badge variant="outline" className="font-normal text-muted-foreground">
              {s}
            </Badge>
          </li>
        ))}
      </ul>

      <div className="min-h-4 flex-1" />
      <div className="flex items-center justify-between gap-3 border-t pt-3.5 text-xs text-muted-foreground">
        <span>{postedLabel(o.postedDaysAgo)}</span>
        <div className="flex items-center gap-3">
          <span
            className="relative z-10 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            View details →
          </span>
        </div>
      </div>
    </article>
  );
}

export function OpportunityCardSkeleton() {
  return (
    <div className="surface-card p-5" aria-hidden="true">
      <div className="flex gap-3.5">
        <div className="size-11 animate-pulse rounded-md bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mt-5 h-3 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-3 w-full animate-pulse rounded bg-muted" />
      <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-muted" />
      <div className="mt-5 flex gap-2">
        <div className="h-5 w-16 animate-pulse rounded bg-muted" />
        <div className="h-5 w-20 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
