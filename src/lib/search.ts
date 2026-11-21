import {
  CATEGORIES,
  type Arrangement,
  type Category,
  type DurationBucket,
  type OpportunityType,
  type PaidFilter,
  type Schedule,
  type SortKey,
} from "./opportunities";

export interface OpportunitySearch {
  q?: string | undefined;
  location?: string | undefined;
  type?: OpportunityType | undefined;
  arrangement?: Arrangement[] | undefined;
  paid?: PaidFilter | undefined;
  schedule?: Schedule[] | undefined;
  duration?: DurationBucket[] | undefined;
  category?: Category[] | undefined;
  sort?: SortKey | undefined;
  page?: number | undefined;
}

function str(v: unknown): string | undefined {
  if (typeof v === "number") return String(v);
  return typeof v === "string" && v.trim() ? v.trim().slice(0, 80) : undefined;
}
function list<T extends string>(v: unknown, allowed: readonly T[]): T[] | undefined {
  const arr = Array.isArray(v) ? v : typeof v === "string" ? v.split(",") : [];
  const out = arr.filter(
    (x): x is T => typeof x === "string" && (allowed as readonly string[]).includes(x),
  );
  return out.length ? Array.from(new Set(out)) : undefined;
}
function one<T extends string>(v: unknown, allowed: readonly T[]): T | undefined {
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
}

/** Parses untrusted URL search into typed filters, dropping anything invalid. */
export function parseOpportunitySearch(raw: Record<string, unknown>): OpportunitySearch {
  const out: OpportunitySearch = {};
  const q = str(raw["q"]);
  if (q) out.q = q;
  const location = str(raw["location"]);
  if (location) out.location = location;
  const type = one(raw["type"], ["internship", "job", "freelance"] as const);
  if (type) out.type = type;
  const arrangement = list(raw["arrangement"], ["remote", "hybrid", "onsite"] as const);
  if (arrangement) out.arrangement = arrangement;
  const paid = one(raw["paid"], ["paid", "unpaid"] as const);
  if (paid) out.paid = paid;
  const schedule = list(raw["schedule"], ["full-time", "part-time"] as const);
  if (schedule) out.schedule = schedule;
  const duration = list(raw["duration"], ["1-2", "3-4", "5+"] as const);
  if (duration) out.duration = duration;
  const category = list(raw["category"], CATEGORIES);
  if (category) out.category = category;
  const sort = one(raw["sort"], ["relevance", "newest"] as const);
  if (sort) out.sort = sort;
  const page = Number(raw["page"]);
  if (Number.isInteger(page) && page > 1 && page < 1000) out.page = page;
  return out;
}

export function activeFilterCount(s: OpportunitySearch): number {
  return (
    (s.location ? 1 : 0) +
    (s.arrangement?.length ?? 0) +
    (s.paid ? 1 : 0) +
    (s.schedule?.length ?? 0) +
    (s.duration?.length ?? 0) +
    (s.category?.length ?? 0)
  );
}
