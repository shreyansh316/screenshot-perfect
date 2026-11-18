/**
 * Growvia opportunity catalogue.
 * Only genuine, verified listings belong here. There are none yet, so every list is empty
 * and discovery pages show an honest empty state. Never add fictional sample listings.
 */

export type OpportunityType = "internship" | "job" | "freelance";
export type Arrangement = "remote" | "hybrid" | "onsite";
export type Schedule = "full-time" | "part-time";

export interface Company {
  slug: string;
  name: string;
  industry: string;
  size: string;
  hq: string;
  about: string;
}

export interface Budget {
  kind: "fixed" | "hourly";
  min: number;
  max: number;
  currency: "USD" | "INR" | "EUR" | "GBP";
}

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  company: Company;
  city: string;
  country: string;
  arrangement: Arrangement;
  schedule: Schedule;
  /** null = not stated by the listing */
  paid: boolean | null;
  durationMonths: number | null;
  category: Category;
  skills: string[];
  summary: string;
  description: string;
  responsibilities: string[];
  eligibility: string[];
  postedDaysAgo: number;
  experienceLevel?: "Entry level" | "Junior" | "Mid level";
  budget?: Budget | null;
  projectLength?: string;
}

export const CATEGORIES = [
  "Software Engineering",
  "Data & Analytics",
  "Design",
  "Marketing",
  "Product",
  "Finance",
  "Operations",
  "Content & Media",
  "Research",
  "Sustainability",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const INTERNSHIPS: Opportunity[] = [];
export const JOBS: Opportunity[] = [];
export const FREELANCE: Opportunity[] = [];
export const ALL_OPPORTUNITIES: Opportunity[] = [...INTERNSHIPS, ...JOBS, ...FREELANCE];

export function getOpportunity(id: string): Opportunity | undefined {
  return ALL_OPPORTUNITIES.find((o) => o.id === id);
}

export const LOCATIONS = Array.from(
  new Set(ALL_OPPORTUNITIES.filter((o) => o.city !== "Remote").map((o) => o.city)),
).sort();

// ---------- Filtering ----------

export type DurationBucket = "1-2" | "3-4" | "5+";
export type PaidFilter = "paid" | "unpaid";
export type SortKey = "relevance" | "newest";

export interface OpportunityFilters {
  q?: string | undefined;
  location?: string | undefined;
  arrangement?: Arrangement[] | undefined;
  paid?: PaidFilter | undefined;
  schedule?: Schedule[] | undefined;
  duration?: DurationBucket[] | undefined;
  category?: Category[] | undefined;
  type?: OpportunityType | undefined;
  sort?: SortKey | undefined;
}

export function inDuration(months: number | null, bucket: DurationBucket): boolean {
  if (months == null) return false;
  if (bucket === "1-2") return months <= 2;
  if (bucket === "3-4") return months >= 3 && months <= 4;
  return months >= 5;
}

/** Relevance score of a listing for a free-text query: title > skill > company > category/summary. */
export function relevance(o: Opportunity, q: string): number {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return 0;
  let score = 0;
  for (const term of terms) {
    let hit = 0;
    if (o.title.toLowerCase().includes(term)) hit = Math.max(hit, 5);
    if (o.skills.some((s) => s.toLowerCase().includes(term))) hit = Math.max(hit, 4);
    if (o.company.name.toLowerCase().includes(term)) hit = Math.max(hit, 3);
    if (o.category.toLowerCase().includes(term)) hit = Math.max(hit, 2);
    if (o.summary.toLowerCase().includes(term)) hit = Math.max(hit, 1);
    if (hit === 0) return 0; // every term must match somewhere
    score += hit;
  }
  return score;
}

export function filterOpportunities(list: Opportunity[], f: OpportunityFilters): Opportunity[] {
  const q = f.q?.trim() ?? "";
  const loc = f.location?.trim().toLowerCase() ?? "";
  const scored = list
    .filter((o) => !f.type || o.type === f.type)
    .filter((o) => {
      if (!loc) return true;
      if (loc === "remote") return o.arrangement === "remote";
      return o.city.toLowerCase().includes(loc) || o.country.toLowerCase().includes(loc);
    })
    .filter((o) => !f.arrangement?.length || f.arrangement.includes(o.arrangement))
    .filter((o) => !f.paid || (f.paid === "paid" ? o.paid === true : o.paid === false))
    .filter((o) => !f.schedule?.length || f.schedule.includes(o.schedule))
    .filter((o) => !f.duration?.length || f.duration.some((b) => inDuration(o.durationMonths, b)))
    .filter((o) => !f.category?.length || f.category.includes(o.category))
    .map((o) => ({ o, score: q ? relevance(o, q) : 0 }))
    .filter(({ score }) => !q || score > 0);

  const sort = f.sort ?? "relevance";
  scored.sort((a, b) => {
    if (sort === "relevance" && q && b.score !== a.score) return b.score - a.score;
    return a.o.postedDaysAgo - b.o.postedDaysAgo;
  });
  return scored.map((s) => s.o);
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  return { items: items.slice((current - 1) * perPage, current * perPage), page: current, totalPages };
}

// ---------- Formatting ----------

export const arrangementLabel: Record<Arrangement, string> = { remote: "Remote", hybrid: "Hybrid", onsite: "On-site" };
export const scheduleLabel: Record<Schedule, string> = { "full-time": "Full-time", "part-time": "Part-time" };
export const typeLabel: Record<OpportunityType, string> = { internship: "Internship", job: "Job", freelance: "Freelance" };

export function postedLabel(days: number): string {
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 7) return `Posted ${days} days ago`;
  const weeks = Math.floor(days / 7);
  return `Posted ${weeks} week${weeks > 1 ? "s" : ""} ago`;
}

export function durationLabel(months: number | null): string | null {
  if (months == null) return null;
  return `${months} month${months > 1 ? "s" : ""}`;
}

export function paidLabel(paid: boolean | null): string {
  if (paid === true) return "Paid";
  if (paid === false) return "Unpaid";
  return "Pay not stated";
}

export function budgetLabel(b: Budget | null | undefined): string {
  if (!b) return "Budget not provided";
  const fmt = new Intl.NumberFormat("en", { style: "currency", currency: b.currency, maximumFractionDigits: 0 });
  return `${fmt.format(b.min)}–${fmt.format(b.max)}${b.kind === "hourly" ? " / hour" : " fixed"}`;
}

export function locationLabel(o: Opportunity): string {
  return o.city === "Remote" ? `Remote · ${o.country}` : `${o.city}, ${o.country}`;
}

export function detailPath(o: Opportunity): "/internships/$id" | "/jobs/$id" | "/freelancing/$id" {
  return o.type === "internship" ? "/internships/$id" : o.type === "job" ? "/jobs/$id" : "/freelancing/$id";
}
