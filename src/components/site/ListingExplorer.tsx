import { useDeferredValue, useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, SearchX, SlidersHorizontal, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { OpportunityCard } from "./OpportunityCard";
import { DemoNotice, EmptyState } from "./common";
import {
  CATEGORIES, LOCATIONS, filterOpportunities, paginate, type Arrangement, type Category, type DurationBucket, type Opportunity, type Schedule,
} from "@/lib/opportunities";
import { activeFilterCount, type OpportunitySearch } from "@/lib/search";
import { cn } from "@/lib/utils";

export const PER_PAGE = 9;

type FilterKey = "location" | "arrangement" | "paid" | "schedule" | "duration" | "category" | "type";

interface Props {
  items: Opportunity[];
  search: OpportunitySearch;
  onChange: (next: OpportunitySearch) => void;
  filters: FilterKey[];
  noun: string;
  searchPlaceholder: string;
}

function toggle<T>(arr: T[] | undefined, v: T): T[] | undefined {
  const cur = arr ?? [];
  const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
  return next.length ? next : undefined;
}

function clean(s: OpportunitySearch): OpportunitySearch {
  const out: OpportunitySearch = {};
  for (const [k, v] of Object.entries(s) as [keyof OpportunitySearch, unknown][]) {
    if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) continue;
    (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b py-5 first:pt-0 last:border-0">
      <legend className="mb-3 text-[0.8125rem] font-semibold text-foreground">{title}</legend>
      <div className="grid gap-2.5">{children}</div>
    </fieldset>
  );
}

function Check({ id, label, checked, onChange, count }: { id: string; label: string; checked: boolean; onChange: () => void; count?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal text-foreground/85">
        {label}
        {count !== undefined && <span className="text-xs tabular-nums text-muted-foreground">{count}</span>}
      </Label>
    </div>
  );
}

function FilterPanel({ items, search, set, filters }: { items: Opportunity[]; search: OpportunitySearch; set: (patch: Partial<OpportunitySearch>) => void; filters: FilterKey[] }) {
  const countBy = <K extends keyof Opportunity>(key: K, val: Opportunity[K]) => items.filter((o) => o[key] === val).length;
  return (
    <div>
      {filters.includes("type") && (
        <Group title="Opportunity type">
          {(["internship", "job", "freelance"] as const).map((t) => (
            <div key={t} className="flex items-center gap-2.5">
              <input type="radio" id={`type-${t}`} name="type" checked={search.type === t} onChange={() => set({ type: t })} className="size-4 accent-primary" />
              <Label htmlFor={`type-${t}`} className="flex flex-1 cursor-pointer justify-between text-sm font-normal">
                {t === "internship" ? "Internships" : t === "job" ? "Jobs" : "Freelance projects"}
                <span className="text-xs tabular-nums text-muted-foreground">{countBy("type", t)}</span>
              </Label>
            </div>
          ))}
          <div className="flex items-center gap-2.5">
            <input type="radio" id="type-all" name="type" checked={!search.type} onChange={() => set({ type: undefined })} className="size-4 accent-primary" />
            <Label htmlFor="type-all" className="cursor-pointer text-sm font-normal">All types</Label>
          </div>
        </Group>
      )}
      {filters.includes("location") && (
        <Group title="Location">
          <Label htmlFor="filter-location" className="sr-only">Location</Label>
          <select
            id="filter-location"
            value={search.location ?? ""}
            onChange={(e) => set({ location: e.target.value || undefined })}
            className="h-9 w-full cursor-pointer rounded-md border border-input bg-surface px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Any location</option>
            <option value="Remote">Remote only</option>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </Group>
      )}
      {filters.includes("arrangement") && (
        <Group title="Work arrangement">
          {(["remote", "hybrid", "onsite"] as Arrangement[]).map((a) => (
            <Check key={a} id={`arr-${a}`} label={a === "onsite" ? "On-site" : a[0]!.toUpperCase() + a.slice(1)} checked={!!search.arrangement?.includes(a)} onChange={() => set({ arrangement: toggle(search.arrangement, a) })} count={countBy("arrangement", a)} />
          ))}
        </Group>
      )}
      {filters.includes("paid") && (
        <Group title="Pay">
          {([["", "Any"], ["paid", "Paid"], ["unpaid", "Unpaid"]] as const).map(([v, l]) => (
            <div key={v || "any"} className="flex items-center gap-2.5">
              <input type="radio" id={`paid-${v || "any"}`} name="paid" checked={(search.paid ?? "") === v} onChange={() => set({ paid: v || undefined })} className="size-4 accent-primary" />
              <Label htmlFor={`paid-${v || "any"}`} className="cursor-pointer text-sm font-normal">{l}</Label>
            </div>
          ))}
        </Group>
      )}
      {filters.includes("schedule") && (
        <Group title="Schedule">
          {(["full-time", "part-time"] as Schedule[]).map((s) => (
            <Check key={s} id={`sch-${s}`} label={s === "full-time" ? "Full-time" : "Part-time"} checked={!!search.schedule?.includes(s)} onChange={() => set({ schedule: toggle(search.schedule, s) })} count={countBy("schedule", s)} />
          ))}
        </Group>
      )}
      {filters.includes("duration") && (
        <Group title="Duration">
          {([["1-2", "1–2 months"], ["3-4", "3–4 months"], ["5+", "5 months or more"]] as [DurationBucket, string][]).map(([d, l]) => (
            <Check key={d} id={`dur-${d}`} label={l} checked={!!search.duration?.includes(d)} onChange={() => set({ duration: toggle(search.duration, d) })} />
          ))}
        </Group>
      )}
      {filters.includes("category") && (
        <Group title="Category">
          {CATEGORIES.filter((c) => items.some((o) => o.category === c)).map((c: Category) => (
            <Check key={c} id={`cat-${c}`} label={c} checked={!!search.category?.includes(c)} onChange={() => set({ category: toggle(search.category, c) })} count={countBy("category", c)} />
          ))}
        </Group>
      )}
    </div>
  );
}

export function ListingExplorer({ items, search, onChange, filters, noun, searchPlaceholder }: Props) {
  const [q, setQ] = useState(search.q ?? "");
  useEffect(() => setQ(search.q ?? ""), [search.q]);

  // Debounce free-text search into the URL
  useEffect(() => {
    const t = setTimeout(() => {
      if ((search.q ?? "") !== q.trim()) onChange(clean({ ...search, q: q.trim() || undefined, page: undefined }));
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const set = (patch: Partial<OpportunitySearch>) => onChange(clean({ ...search, ...patch, page: undefined }));
  const deferred = useDeferredValue(search);
  const stale = deferred !== search;
  const results = useMemo(() => filterOpportunities(items, deferred), [items, deferred]);
  const { items: pageItems, page, totalPages } = paginate(results, deferred.page ?? 1, PER_PAGE);
  const active = activeFilterCount(search) + (search.type && filters.includes("type") ? 1 : 0);

  const clearAll = () => {
    setQ("");
    onChange({});
  };
  const goPage = (p: number) => {
    onChange(clean({ ...search, page: p > 1 ? p : undefined }));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container-page py-8 md:py-10">
      <DemoNotice className="mb-6" />
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-24">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Filters</h2>
              {active > 0 && (
                <button onClick={clearAll} className="text-xs font-medium text-primary hover:underline">Clear all ({active})</button>
              )}
            </div>
            <FilterPanel items={items} search={search} set={set} filters={filters} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="h-11 bg-surface pl-9 text-[0.9375rem]"
              />
            </div>
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-11 flex-1 lg:hidden">
                    <SlidersHorizontal /> Filters {active > 0 && <span className="rounded bg-primary px-1.5 text-xs text-primary-foreground">{active}</span>}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
                  <SheetHeader className="px-0">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-2">
                    <FilterPanel items={items} search={search} set={set} filters={filters} />
                  </div>
                  {active > 0 && <Button variant="outline" className="mt-4 w-full" onClick={clearAll}>Clear all filters</Button>}
                </SheetContent>
              </Sheet>
              <Label htmlFor="sort" className="sr-only">Sort by</Label>
              <select
                id="sort"
                value={search.sort ?? "relevance"}
                onChange={(e) => set({ sort: e.target.value === "newest" ? "newest" : undefined })}
                className="h-11 flex-1 cursor-pointer rounded-md border border-input bg-surface px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none"
              >
                <option value="relevance">Sort: Most relevant</option>
                <option value="newest">Sort: Newest</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <span className="font-medium text-foreground">{results.length}</span> {noun}{results.length === 1 ? "" : "s"}
              {search.q ? <> matching “{search.q}”</> : null}
            </p>
            {active > 0 && (
              <button onClick={clearAll} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline lg:hidden">
                <X className="size-3.5" /> Clear filters
              </button>
            )}
          </div>

          <div className={cn("mt-4 transition-opacity", stale && "opacity-60")}>
            {pageItems.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title={`No ${noun}s match these filters`}
                description="Try a broader search term, remove a filter, or check back soon as new listings are added."
                action={<Button variant="outline" onClick={clearAll}>Clear search and filters</Button>}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {pageItems.map((o, i) => (
                  <OpportunityCard key={o.id} o={o} className="animate-page" />
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-1">
              <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => goPage(page - 1)} aria-label="Previous page">
                <ChevronLeft /> Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button key={p} variant={p === page ? "default" : "ghost"} size="sm" className="w-9" onClick={() => goPage(p)} aria-current={p === page ? "page" : undefined} aria-label={`Page ${p}`}>
                  {p}
                </Button>
              ))}
              <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => goPage(page + 1)} aria-label="Next page">
                Next <ChevronRight />
              </Button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
