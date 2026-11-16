/**
 * Growvia demo opportunity catalogue.
 * Every company and listing here is fictional sample content, labelled "Demo listing" in the UI.
 * No salaries, deadlines or verification claims are made for real organisations.
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

const companies: Record<string, Company> = {
  fernhollow: { slug: "fernhollow", name: "Fernhollow Labs", industry: "Developer tools", size: "51–200", hq: "Bengaluru, India", about: "Fernhollow builds testing and observability tooling for small engineering teams." },
  brightmere: { slug: "brightmere", name: "Brightmere Health", industry: "Digital health", size: "201–500", hq: "London, UK", about: "Brightmere designs patient scheduling and follow-up software for community clinics." },
  kestrelway: { slug: "kestrelway", name: "Kestrelway Mobility", industry: "Urban mobility", size: "11–50", hq: "Berlin, Germany", about: "Kestrelway plans shared e-bike networks with city transport authorities." },
  quillstone: { slug: "quillstone", name: "Quillstone Media", industry: "Publishing", size: "51–200", hq: "Toronto, Canada", about: "Quillstone runs a network of independent newsletters on science and culture." },
  larkfield: { slug: "larkfield", name: "Larkfield Finance", industry: "Fintech", size: "201–500", hq: "Singapore", about: "Larkfield offers budgeting and savings tools for first-time earners." },
  tidecrest: { slug: "tidecrest", name: "Tidecrest Energy", industry: "Clean energy", size: "501–1000", hq: "Pune, India", about: "Tidecrest develops rooftop solar monitoring for residential societies." },
  orbitale: { slug: "orbitale", name: "Orbitale Commerce", industry: "E-commerce", size: "51–200", hq: "Dubai, UAE", about: "Orbitale helps regional brands launch and run online storefronts." },
  marrowbay: { slug: "marrowbay", name: "Marrowbay Studio", industry: "Design agency", size: "11–50", hq: "Mumbai, India", about: "Marrowbay is a brand and product design studio working with early-stage teams." },
  halvane: { slug: "halvane", name: "Halvane Analytics", industry: "Data consultancy", size: "51–200", hq: "Austin, USA", about: "Halvane helps non-profits measure programme outcomes with clear dashboards." },
  pinecrest: { slug: "pinecrest", name: "Pinecrest Civic Tech", industry: "Public sector tech", size: "11–50", hq: "Nairobi, Kenya", about: "Pinecrest builds open-source tools for local government service delivery." },
  sablewood: { slug: "sablewood", name: "Sablewood Retail", industry: "Retail", size: "1000+", hq: "Delhi, India", about: "Sablewood operates a chain of neighbourhood home-goods stores." },
  verdance: { slug: "verdance", name: "Verdance Agritech", industry: "Agriculture", size: "51–200", hq: "Nairobi, Kenya", about: "Verdance gives smallholder farmers weather and crop-price insights by SMS." },
};

interface CategoryTemplate {
  responsibilities: string[];
  eligibility: string[];
  context: string;
}

const templates: Record<Category, CategoryTemplate> = {
  "Software Engineering": {
    context: "You will join a small product squad and ship code that reaches real users within your first month.",
    responsibilities: ["Build and test features with guidance from a senior engineer", "Review pull requests and respond to feedback", "Write clear technical notes for the features you ship", "Fix bugs reported by the support team"],
    eligibility: ["Currently studying or recently graduated in computer science or a related field", "Comfortable with at least one programming language", "A project, repository or coursework you can talk through"],
  },
  "Data & Analytics": {
    context: "You will help turn messy operational data into reports that the team uses to make weekly decisions.",
    responsibilities: ["Clean and document datasets", "Build dashboards for internal teams", "Write short analysis memos with clear recommendations", "Validate data quality with stakeholders"],
    eligibility: ["Coursework or projects in statistics, economics, data science or similar", "Working knowledge of spreadsheets and basic SQL", "Curiosity about how numbers connect to decisions"],
  },
  Design: {
    context: "You will work alongside a product designer from early sketches to tested, shipped screens.",
    responsibilities: ["Create wireframes and high-fidelity screens", "Run lightweight usability sessions", "Maintain components in the design library", "Present design decisions to the team"],
    eligibility: ["A portfolio with two or more case studies (student work is welcome)", "Familiarity with Figma or a similar tool", "Interest in accessibility and inclusive design"],
  },
  Marketing: {
    context: "You will support campaigns end to end, from planning to measuring what worked.",
    responsibilities: ["Draft social and email content", "Track campaign performance weekly", "Research audiences and competitors", "Coordinate assets with design"],
    eligibility: ["Strong written communication", "Any marketing, communications or business coursework", "Comfort with basic analytics tools"],
  },
  Product: {
    context: "You will shadow product managers and own a small, well-scoped problem by the end of the programme.",
    responsibilities: ["Interview users and synthesise findings", "Write short product requirement documents", "Track feature adoption after launch", "Help prioritise the team backlog"],
    eligibility: ["Final-year student or recent graduate in any discipline", "Clear structured thinking and writing", "Interest in technology products"],
  },
  Finance: {
    context: "You will support the finance team with month-end processes and planning models.",
    responsibilities: ["Reconcile accounts and prepare schedules", "Update forecasting spreadsheets", "Prepare summaries for leadership reviews", "Document recurring processes"],
    eligibility: ["Studying commerce, finance, accounting or economics", "Confident with spreadsheets", "Attention to detail"],
  },
  Operations: {
    context: "You will help day-to-day operations run more smoothly and document what you improve.",
    responsibilities: ["Map current processes and find bottlenecks", "Coordinate between teams and vendors", "Maintain trackers and status reports", "Pilot small process improvements"],
    eligibility: ["Any degree background", "Organised and comfortable with spreadsheets", "Good at following up"],
  },
  "Content & Media": {
    context: "You will research, write and edit pieces that are published to a real readership.",
    responsibilities: ["Pitch and write articles or scripts", "Fact-check and edit drafts", "Repurpose content for social channels", "Track what readers engage with"],
    eligibility: ["Writing samples (class assignments or personal blog are fine)", "Interest in the subject area", "Ability to take editorial feedback"],
  },
  Research: {
    context: "You will support a research lead with literature reviews, fieldwork and analysis.",
    responsibilities: ["Summarise existing research", "Help design surveys and interviews", "Code and analyse qualitative data", "Contribute to the final report"],
    eligibility: ["Studying social sciences, public policy or a related field", "Careful reading and note-taking", "Basic familiarity with research methods"],
  },
  Sustainability: {
    context: "You will help measure and reduce the environmental footprint of the organisation's operations.",
    responsibilities: ["Collect and organise emissions data", "Research reporting frameworks", "Support supplier sustainability surveys", "Draft internal awareness materials"],
    eligibility: ["Studying environmental science, engineering or management", "Comfort with spreadsheets", "Genuine interest in climate action"],
  },
};

type Row = [id: string, title: string, company: keyof typeof companies, city: string, country: string, arrangement: Arrangement, schedule: Schedule, paid: boolean | null, months: number | null, category: Category, skills: string[], summary: string, postedDaysAgo: number];

const internshipRows: Row[] = [
  ["int-frontend-fernhollow", "Frontend Engineering Intern", "fernhollow", "Bengaluru", "India", "hybrid", "full-time", true, 6, "Software Engineering", ["React", "TypeScript", "CSS"], "Build interface components for a test-reporting dashboard used by small engineering teams.", 1],
  ["int-backend-pinecrest", "Backend Developer Intern", "pinecrest", "Nairobi", "Kenya", "remote", "part-time", true, 4, "Software Engineering", ["Node.js", "PostgreSQL", "APIs"], "Help extend an open-source service-request API used by local councils.", 3],
  ["int-mobile-larkfield", "Mobile App Intern", "larkfield", "Singapore", "Singapore", "onsite", "full-time", true, 3, "Software Engineering", ["Flutter", "Dart", "Testing"], "Work on onboarding flows in a budgeting app for first-time earners.", 6],
  ["int-qa-fernhollow", "Quality Engineering Intern", "fernhollow", "Remote", "India", "remote", "part-time", true, 3, "Software Engineering", ["Testing", "Python", "CI"], "Write automated tests and improve the reliability of release pipelines.", 9],
  ["int-data-halvane", "Data Analyst Intern", "halvane", "Austin", "USA", "hybrid", "full-time", true, 3, "Data & Analytics", ["SQL", "Excel", "Data visualisation"], "Build outcome dashboards for non-profit programme teams.", 2],
  ["int-data-verdance", "Agricultural Data Intern", "verdance", "Nairobi", "Kenya", "onsite", "full-time", true, 6, "Data & Analytics", ["Python", "Pandas", "Statistics"], "Analyse crop-price and rainfall data that powers SMS alerts for farmers.", 12],
  ["int-bi-sablewood", "Business Intelligence Intern", "sablewood", "Delhi", "India", "onsite", "full-time", true, 2, "Data & Analytics", ["Power BI", "SQL", "Excel"], "Create store-performance reports for regional managers.", 5],
  ["int-ml-tidecrest", "Machine Learning Intern", "tidecrest", "Pune", "India", "hybrid", "full-time", true, 6, "Data & Analytics", ["Python", "Machine learning", "Time series"], "Prototype models that flag under-performing rooftop solar panels.", 15],
  ["int-ux-marrowbay", "UX Design Intern", "marrowbay", "Mumbai", "India", "hybrid", "full-time", true, 3, "Design", ["Figma", "User research", "Prototyping"], "Design and test screens for early-stage product clients.", 1],
  ["int-product-design-brightmere", "Product Design Intern", "brightmere", "London", "UK", "hybrid", "full-time", true, 6, "Design", ["Figma", "Accessibility", "Design systems"], "Improve appointment booking flows for community clinic patients.", 8],
  ["int-graphic-quillstone", "Visual Design Intern", "quillstone", "Remote", "Canada", "remote", "part-time", false, 2, "Design", ["Illustration", "Layout", "Adobe Creative Suite"], "Create illustrations and layouts for weekly newsletters.", 20],
  ["int-brand-marrowbay", "Brand Design Intern", "marrowbay", "Mumbai", "India", "onsite", "part-time", false, 1, "Design", ["Branding", "Typography", "Figma"], "Support identity projects from moodboards to final guidelines.", 25],
  ["int-growth-orbitale", "Growth Marketing Intern", "orbitale", "Dubai", "UAE", "hybrid", "full-time", true, 3, "Marketing", ["SEO", "Email marketing", "Analytics"], "Run acquisition experiments for regional storefront brands.", 4],
  ["int-social-quillstone", "Social Media Intern", "quillstone", "Toronto", "Canada", "remote", "part-time", true, 4, "Marketing", ["Social media", "Copywriting", "Canva"], "Grow newsletter audiences through social channels.", 11],
  ["int-community-pinecrest", "Community Outreach Intern", "pinecrest", "Nairobi", "Kenya", "onsite", "part-time", false, 2, "Marketing", ["Public speaking", "Event planning", "Communication"], "Organise workshops introducing residents to digital council services.", 18],
  ["int-pm-larkfield", "Associate Product Manager Intern", "larkfield", "Singapore", "Singapore", "hybrid", "full-time", true, 6, "Product", ["Product thinking", "User interviews", "Analytics"], "Own a small savings-goal feature from discovery to launch.", 2],
  ["int-pm-kestrelway", "Product Operations Intern", "kestrelway", "Berlin", "Germany", "onsite", "full-time", true, 4, "Product", ["Operations", "SQL", "Documentation"], "Track e-bike fleet issues and turn them into product improvements.", 14],
  ["int-finance-larkfield", "Finance Intern", "larkfield", "Singapore", "Singapore", "onsite", "full-time", true, 3, "Finance", ["Excel", "Accounting", "Reporting"], "Support month-end close and investor reporting.", 7],
  ["int-fpa-tidecrest", "FP&A Intern", "tidecrest", "Pune", "India", "hybrid", "full-time", true, 6, "Finance", ["Financial modelling", "Excel", "Forecasting"], "Help build installation-cost forecasts for new regions.", 21],
  ["int-ops-sablewood", "Supply Chain Intern", "sablewood", "Delhi", "India", "onsite", "full-time", true, 3, "Operations", ["Logistics", "Excel", "Vendor management"], "Map stock flows between warehouses and stores.", 3],
  ["int-ops-kestrelway", "City Operations Intern", "kestrelway", "Berlin", "Germany", "onsite", "part-time", true, 3, "Operations", ["Field operations", "Coordination", "Reporting"], "Coordinate e-bike rebalancing with field teams.", 10],
  ["int-people-orbitale", "People Operations Intern", "orbitale", "Dubai", "UAE", "onsite", "full-time", null, 2, "Operations", ["Recruiting", "Onboarding", "Communication"], "Support hiring coordination and new-joiner onboarding.", 16],
  ["int-writer-quillstone", "Editorial Intern", "quillstone", "Toronto", "Canada", "remote", "part-time", true, 4, "Content & Media", ["Writing", "Editing", "Research"], "Research and write explainers for a science newsletter.", 2],
  ["int-video-marrowbay", "Video Content Intern", "marrowbay", "Mumbai", "India", "hybrid", "part-time", false, 2, "Content & Media", ["Video editing", "Storyboarding", "Premiere Pro"], "Edit short case-study videos for the studio's clients.", 13],
  ["int-techwriter-fernhollow", "Technical Writing Intern", "fernhollow", "Remote", "India", "remote", "part-time", true, 3, "Content & Media", ["Technical writing", "Markdown", "Developer docs"], "Write getting-started guides for developer tools.", 6],
  ["int-research-brightmere", "Health Research Intern", "brightmere", "London", "UK", "hybrid", "full-time", true, 6, "Research", ["Qualitative research", "Survey design", "Report writing"], "Study why patients miss follow-up appointments.", 4],
  ["int-policy-pinecrest", "Policy Research Intern", "pinecrest", "Remote", "Kenya", "remote", "part-time", false, 3, "Research", ["Policy analysis", "Writing", "Research"], "Review digital-service policies across East African cities.", 22],
  ["int-ux-research-halvane", "User Research Intern", "halvane", "Remote", "USA", "remote", "part-time", true, 3, "Research", ["Interviews", "Synthesis", "Miro"], "Interview programme managers about how they use data.", 9],
  ["int-sustain-tidecrest", "Sustainability Analyst Intern", "tidecrest", "Pune", "India", "onsite", "full-time", true, 6, "Sustainability", ["Carbon accounting", "Excel", "Research"], "Measure emissions avoided by residential solar installations.", 5],
  ["int-sustain-verdance", "Climate Resilience Intern", "verdance", "Nairobi", "Kenya", "hybrid", "full-time", null, 4, "Sustainability", ["Climate research", "GIS", "Community engagement"], "Document drought-adaptation practices with farmer groups.", 17],
  ["int-esg-sablewood", "ESG Reporting Intern", "sablewood", "Delhi", "India", "hybrid", "part-time", true, 3, "Sustainability", ["ESG", "Reporting", "Data collection"], "Gather supplier data for the annual sustainability report.", 27],
  ["int-fullstack-orbitale", "Full-Stack Developer Intern", "orbitale", "Remote", "UAE", "remote", "full-time", true, 6, "Software Engineering", ["React", "Node.js", "PostgreSQL"], "Ship storefront features used by regional brands.", 1],
];

const jobRows: Row[] = [
  ["job-junior-frontend-fernhollow", "Junior Frontend Engineer", "fernhollow", "Bengaluru", "India", "hybrid", "full-time", true, null, "Software Engineering", ["React", "TypeScript", "Testing"], "Own interface features in a developer-tools product.", 2],
  ["job-data-analyst-halvane", "Data Analyst", "halvane", "Remote", "USA", "remote", "full-time", true, null, "Data & Analytics", ["SQL", "Python", "Dashboards"], "Turn programme data into clear stories for non-profit partners.", 4],
  ["job-designer-brightmere", "Product Designer", "brightmere", "London", "UK", "hybrid", "full-time", true, null, "Design", ["Figma", "Research", "Accessibility"], "Design patient-facing scheduling experiences.", 6],
  ["job-marketing-orbitale", "Marketing Associate", "orbitale", "Dubai", "UAE", "onsite", "full-time", true, null, "Marketing", ["Campaigns", "Analytics", "Copywriting"], "Plan and run campaigns for storefront partners.", 3],
  ["job-ops-kestrelway", "Operations Associate", "kestrelway", "Berlin", "Germany", "onsite", "full-time", true, null, "Operations", ["Operations", "Excel", "Coordination"], "Keep the city e-bike network running reliably.", 8],
  ["job-content-quillstone", "Associate Editor", "quillstone", "Toronto", "Canada", "remote", "full-time", true, null, "Content & Media", ["Editing", "Writing", "CMS"], "Edit and publish newsletter issues on a weekly cadence.", 5],
  ["job-backend-pinecrest", "Backend Engineer", "pinecrest", "Nairobi", "Kenya", "remote", "full-time", true, null, "Software Engineering", ["Go", "PostgreSQL", "APIs"], "Build reliable services for civic platforms.", 1],
  ["job-finance-larkfield", "Financial Analyst", "larkfield", "Singapore", "Singapore", "hybrid", "full-time", true, null, "Finance", ["Modelling", "Excel", "Reporting"], "Support planning and unit-economics analysis.", 10],
  ["job-pm-larkfield", "Associate Product Manager", "larkfield", "Singapore", "Singapore", "hybrid", "full-time", true, null, "Product", ["Discovery", "Roadmapping", "Analytics"], "Lead discovery for savings features.", 7],
  ["job-sustain-tidecrest", "Sustainability Associate", "tidecrest", "Pune", "India", "hybrid", "full-time", true, null, "Sustainability", ["ESG", "Carbon accounting", "Reporting"], "Build the company's emissions reporting process.", 12],
  ["job-support-sablewood", "Customer Experience Specialist", "sablewood", "Delhi", "India", "onsite", "part-time", true, null, "Operations", ["Customer service", "CRM", "Communication"], "Resolve customer queries across store and online channels.", 9],
  ["job-research-brightmere", "Research Associate", "brightmere", "London", "UK", "hybrid", "full-time", true, null, "Research", ["Mixed methods", "Analysis", "Writing"], "Run studies that shape clinic-facing products.", 14],
];

const freelanceRows: Row[] = [
  ["fl-landing-page", "Landing page for a solar monitoring app", "tidecrest", "Remote", "India", "remote", "part-time", true, null, "Design", ["Figma", "Web design", "Copy layout"], "Design a single responsive landing page explaining the product to housing societies.", 2],
  ["fl-newsletter-template", "Email newsletter template build", "quillstone", "Remote", "Canada", "remote", "part-time", true, null, "Software Engineering", ["HTML email", "MJML", "Testing"], "Code a reusable, accessible newsletter template that renders well across email clients.", 3],
  ["fl-data-cleanup", "Survey data clean-up and summary", "halvane", "Remote", "USA", "remote", "part-time", true, null, "Data & Analytics", ["Excel", "Python", "Data cleaning"], "Clean a 4,000-row programme survey and produce a short summary of key results.", 5],
  ["fl-explainer-video", "60-second product explainer video", "larkfield", "Remote", "Singapore", "remote", "part-time", true, null, "Content & Media", ["Motion graphics", "After Effects", "Scriptwriting"], "Produce a short animated explainer for a new savings feature.", 1],
  ["fl-logo-refresh", "Logo refresh for a farmer SMS service", "verdance", "Remote", "Kenya", "remote", "part-time", true, null, "Design", ["Branding", "Illustrator", "Typography"], "Refresh a logo so it stays legible on low-resolution phone screens.", 8],
  ["fl-blog-series", "Four-part blog series on clinic scheduling", "brightmere", "Remote", "UK", "remote", "part-time", true, null, "Content & Media", ["Writing", "Health content", "SEO"], "Write four researched articles for clinic administrators.", 4],
  ["fl-shopify-setup", "Storefront setup for a home-goods brand", "orbitale", "Remote", "UAE", "remote", "part-time", true, null, "Software Engineering", ["E-commerce", "Theme customisation", "Product data"], "Configure a storefront, import 120 products and set up shipping rules.", 6],
  ["fl-translation", "Swahili translation of help articles", "pinecrest", "Remote", "Kenya", "remote", "part-time", true, null, "Content & Media", ["Translation", "Swahili", "Proofreading"], "Translate 15 short help-centre articles from English to Swahili.", 10],
  ["fl-dashboard", "Fleet utilisation dashboard", "kestrelway", "Remote", "Germany", "remote", "part-time", true, null, "Data & Analytics", ["Looker Studio", "SQL", "Data visualisation"], "Build a dashboard showing e-bike usage by neighbourhood and hour.", 12],
  ["fl-social-pack", "Social media template pack", "marrowbay", "Remote", "India", "remote", "part-time", true, null, "Marketing", ["Canva", "Social media", "Layout"], "Create 12 editable templates for a client's Instagram and LinkedIn.", 7],
];

const budgets: Record<string, { budget: Budget | null; length: string }> = {
  "fl-landing-page": { budget: { kind: "fixed", min: 300, max: 500, currency: "USD" }, length: "1–2 weeks" },
  "fl-newsletter-template": { budget: { kind: "fixed", min: 250, max: 400, currency: "USD" }, length: "1 week" },
  "fl-data-cleanup": { budget: { kind: "hourly", min: 15, max: 25, currency: "USD" }, length: "About 20 hours" },
  "fl-explainer-video": { budget: null, length: "2–3 weeks" },
  "fl-logo-refresh": { budget: { kind: "fixed", min: 150, max: 300, currency: "USD" }, length: "1 week" },
  "fl-blog-series": { budget: { kind: "fixed", min: 200, max: 350, currency: "GBP" }, length: "3 weeks" },
  "fl-shopify-setup": { budget: null, length: "2 weeks" },
  "fl-translation": { budget: { kind: "fixed", min: 120, max: 200, currency: "USD" }, length: "1 week" },
  "fl-dashboard": { budget: { kind: "hourly", min: 20, max: 35, currency: "EUR" }, length: "About 30 hours" },
  "fl-social-pack": { budget: { kind: "fixed", min: 8000, max: 15000, currency: "INR" }, length: "10 days" },
};

const levels: Record<string, Opportunity["experienceLevel"]> = {
  "job-junior-frontend-fernhollow": "Junior", "job-data-analyst-halvane": "Entry level", "job-designer-brightmere": "Mid level",
  "job-marketing-orbitale": "Entry level", "job-ops-kestrelway": "Entry level", "job-content-quillstone": "Junior",
  "job-backend-pinecrest": "Mid level", "job-finance-larkfield": "Junior", "job-pm-larkfield": "Entry level",
  "job-sustain-tidecrest": "Junior", "job-support-sablewood": "Entry level", "job-research-brightmere": "Junior",
};

function build(type: OpportunityType, row: Row): Opportunity {
  const [id, title, companyKey, city, country, arrangement, schedule, paid, months, category, skills, summary, postedDaysAgo] = row;
  const company = companies[companyKey]!;
  const t = templates[category];
  const base: Opportunity = {
    id, type, title, company, city, country, arrangement, schedule, paid, durationMonths: months, category, skills, summary,
    description: `${summary} ${t.context} ${company.name} is a ${company.industry.toLowerCase()} organisation based in ${company.hq}.`,
    responsibilities: t.responsibilities,
    eligibility: t.eligibility,
    postedDaysAgo,
  };
  if (type === "job") {
    const lvl = levels[id];
    if (lvl) base.experienceLevel = lvl;
  }
  if (type === "freelance") {
    const b = budgets[id];
    base.budget = b?.budget ?? null;
    if (b) base.projectLength = b.length;
    base.responsibilities = ["Agree scope and milestones before starting", "Share a first draft for feedback", "Deliver final files in the agreed format", "Hand over source files and short notes"];
    base.eligibility = ["Portfolio or samples relevant to the brief", "Clear communication in English", "Able to meet the stated project length"];
  }
  return base;
}

export const INTERNSHIPS: Opportunity[] = internshipRows.map((r) => build("internship", r));
export const JOBS: Opportunity[] = jobRows.map((r) => build("job", r));
export const FREELANCE: Opportunity[] = freelanceRows.map((r) => build("freelance", r));
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
