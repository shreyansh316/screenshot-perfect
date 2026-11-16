export type SectionKey = "summary" | "experience" | "education" | "projects" | "skills" | "certifications";
export type TemplateKey = "classic" | "modern" | "compact";

export interface Personal {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  portfolio: string;
  linkedin: string;
  github: string;
}
export interface Education { id: string; institution: string; degree: string; field: string; start: string; end: string; description: string }
export interface Experience { id: string; kind: "work" | "internship" | "volunteer"; title: string; company: string; start: string; end: string; current: boolean; responsibilities: string; achievements: string }
export interface Project { id: string; name: string; description: string; technologies: string; url: string }
export interface Certification { id: string; name: string; issuer: string; date: string; link: string }

export interface ResumeData {
  personal: Personal;
  summary: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: { technical: string[]; professional: string[] };
  certifications: Certification[];
  sectionOrder: SectionKey[];
}

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications & achievements",
};

export const DEFAULT_ORDER: SectionKey[] = ["summary", "education", "experience", "projects", "skills", "certifications"];

export const TEMPLATES: { key: TemplateKey; name: string; note: string }[] = [
  { key: "classic", name: "Classic", note: "Serif-free, centred header, works for any field" },
  { key: "modern", name: "Modern", note: "Navy accent rule and left-aligned header" },
  { key: "compact", name: "Compact", note: "Tighter spacing to fit more on one page" },
];

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function emptyResume(): ResumeData {
  return {
    personal: { fullName: "", headline: "", email: "", phone: "", city: "", country: "", portfolio: "", linkedin: "", github: "" },
    summary: "",
    education: [],
    experience: [],
    projects: [],
    skills: { technical: [], professional: [] },
    certifications: [],
    sectionOrder: [...DEFAULT_ORDER],
  };
}

export const emptyEducation = (): Education => ({ id: uid(), institution: "", degree: "", field: "", start: "", end: "", description: "" });
export const emptyExperience = (): Experience => ({ id: uid(), kind: "work", title: "", company: "", start: "", end: "", current: false, responsibilities: "", achievements: "" });
export const emptyProject = (): Project => ({ id: uid(), name: "", description: "", technologies: "", url: "" });
export const emptyCertification = (): Certification => ({ id: uid(), name: "", issuer: "", date: "", link: "" });

/** Merge unknown stored JSON into a valid ResumeData (tolerates older/partial drafts). */
export function normalizeResume(raw: unknown): ResumeData {
  const base = emptyResume();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<ResumeData>;
  const order = Array.isArray(r.sectionOrder)
    ? r.sectionOrder.filter((k): k is SectionKey => DEFAULT_ORDER.includes(k as SectionKey))
    : [];
  for (const k of DEFAULT_ORDER) if (!order.includes(k)) order.push(k);
  return {
    personal: { ...base.personal, ...(r.personal ?? {}) },
    summary: typeof r.summary === "string" ? r.summary : "",
    education: Array.isArray(r.education) ? r.education.map((e) => ({ ...emptyEducation(), ...e })) : [],
    experience: Array.isArray(r.experience) ? r.experience.map((e) => ({ ...emptyExperience(), ...e })) : [],
    projects: Array.isArray(r.projects) ? r.projects.map((e) => ({ ...emptyProject(), ...e })) : [],
    skills: {
      technical: Array.isArray(r.skills?.technical) ? r.skills.technical : [],
      professional: Array.isArray(r.skills?.professional) ? r.skills.professional : [],
    },
    certifications: Array.isArray(r.certifications) ? r.certifications.map((e) => ({ ...emptyCertification(), ...e })) : [],
    sectionOrder: order,
  };
}

// ---------- Validation ----------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function isValidEmail(v: string): boolean {
  return EMAIL_RE.test(v.trim());
}
export function isValidUrl(v: string): boolean {
  const s = v.trim();
  if (!s) return true;
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
    return u.hostname.includes(".");
  } catch {
    return false;
  }
}
export function isValidPhone(v: string): boolean {
  const s = v.trim();
  if (!s) return true;
  return /^\+?[\d\s().-]{7,20}$/.test(s);
}
/** Dates are "YYYY-MM" strings; end must not be before start. */
export function isValidRange(start: string, end: string): boolean {
  if (!start || !end) return true;
  return end >= start;
}

export type Errors = Record<string, string>;

export function validatePersonal(p: Personal): Errors {
  const e: Errors = {};
  if (!p.fullName.trim()) e["fullName"] = "Enter your full name.";
  if (!p.email.trim()) e["email"] = "Enter an email address employers can reach.";
  else if (!isValidEmail(p.email)) e["email"] = "That email doesn't look right.";
  if (!isValidPhone(p.phone)) e["phone"] = "Use digits, spaces and an optional + only.";
  for (const k of ["portfolio", "linkedin", "github"] as const) {
    if (!isValidUrl(p[k])) e[k] = "Enter a valid web address.";
  }
  return e;
}

export function validateResume(r: ResumeData): Errors {
  const e: Errors = { ...validatePersonal(r.personal) };
  r.education.forEach((ed, i) => {
    if (!ed.institution.trim()) e[`education.${i}.institution`] = "Add the institution name.";
    if (!isValidRange(ed.start, ed.end)) e[`education.${i}.end`] = "End date is before the start date.";
  });
  r.experience.forEach((ex, i) => {
    if (!ex.title.trim()) e[`experience.${i}.title`] = "Add a role title.";
    if (!ex.company.trim()) e[`experience.${i}.company`] = "Add the organisation.";
    if (!ex.current && !isValidRange(ex.start, ex.end)) e[`experience.${i}.end`] = "End date is before the start date.";
  });
  r.projects.forEach((p, i) => {
    if (!p.name.trim()) e[`projects.${i}.name`] = "Add a project name.";
    if (!isValidUrl(p.url)) e[`projects.${i}.url`] = "Enter a valid web address.";
  });
  r.certifications.forEach((c, i) => {
    if (!c.name.trim()) e[`certifications.${i}.name`] = "Add the certification name.";
    if (!isValidUrl(c.link)) e[`certifications.${i}.link`] = "Enter a valid web address.";
  });
  return e;
}

/** Percentage of core resume parts completed (0–100). Experience is optional for students: projects count instead. */
export function resumeCompletion(r: ResumeData): number {
  const p = r.personal;
  const checks = [
    !!p.fullName.trim(),
    isValidEmail(p.email),
    !!p.headline.trim(),
    !!(p.city.trim() || p.country.trim()),
    r.summary.trim().length >= 60,
    r.education.length > 0,
    r.experience.length > 0 || r.projects.length > 0,
    r.skills.technical.length + r.skills.professional.length >= 3,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function formatMonth(v: string): string {
  if (!v) return "";
  const [y, m] = v.split("-");
  if (!y || !m) return v;
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en", { month: "short", year: "numeric" });
}

export function dateRange(start: string, end: string, current = false): string {
  const s = formatMonth(start);
  const e = current ? "Present" : formatMonth(end);
  if (s && e) return `${s} – ${e}`;
  return s || e;
}

export function displayUrl(u: string): string {
  return u.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

export function bulletLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.replace(/^[\s•\-*]+/, "").trim())
    .filter(Boolean);
}

export function moveSection(order: SectionKey[], key: SectionKey, dir: -1 | 1): SectionKey[] {
  const i = order.indexOf(key);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= order.length) return order;
  const next = [...order];
  [next[i], next[j]] = [next[j]!, next[i]!];
  return next;
}

/** A filled-in example for students without work experience. */
export function studentExample(): ResumeData {
  return {
    personal: { fullName: "Aanya Rao", headline: "Computer Science student · Frontend developer", email: "aanya.rao@example.com", phone: "+91 98765 43210", city: "Pune", country: "India", portfolio: "aanyarao.dev", linkedin: "linkedin.com/in/example", github: "github.com/example" },
    summary: "Third-year computer science student who builds accessible web interfaces. Led a four-person team to ship a campus events app used by 600+ students, and enjoys turning messy requirements into simple, tested features.",
    education: [{ id: uid(), institution: "Example Institute of Technology", degree: "B.Tech", field: "Computer Science", start: "2023-08", end: "2027-05", description: "Relevant coursework: Data Structures, Databases, Human–Computer Interaction. CGPA 8.6/10." }],
    experience: [{ id: uid(), kind: "volunteer", title: "Web Volunteer", company: "Campus Coding Club", start: "2024-07", end: "", current: true, responsibilities: "Maintain the club website and event registration form\nRun monthly beginner workshops on HTML and CSS", achievements: "Cut registration drop-off by redesigning the sign-up form" }],
    projects: [
      { id: uid(), name: "Campus Events App", description: "Responsive web app for discovering and RSVPing to college events; 600+ active users in the first semester.", technologies: "React, TypeScript, Firebase", url: "github.com/example/events" },
      { id: uid(), name: "Library Seat Finder", description: "Hackathon project showing live seat availability using a simple sensor feed.", technologies: "Python, Flask, Chart.js", url: "" },
    ],
    skills: { technical: ["React", "TypeScript", "HTML & CSS", "Git", "SQL"], professional: ["Team leadership", "Technical writing", "Public speaking"] },
    certifications: [{ id: uid(), name: "Responsive Web Design", issuer: "Online course provider", date: "2024-03", link: "" }],
    sectionOrder: ["summary", "education", "projects", "experience", "skills", "certifications"],
  };
}
