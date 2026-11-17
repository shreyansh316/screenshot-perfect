import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, BarChart3, Code2, Compass, FileText, Landmark, Leaf, Megaphone, Microscope, Newspaper, Palette, ShieldCheck, Workflow, Boxes, Lock, BadgeCheck, HandCoins, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroSearch } from "@/components/site/SearchBar";
import { OpportunityCard } from "@/components/site/OpportunityCard";
import { CompanyMark, DemoBadge, Reveal, SectionHeading } from "@/components/site/common";
import {
  ALL_OPPORTUNITIES, CATEGORIES, FREELANCE, INTERNSHIPS, JOBS, arrangementLabel, budgetLabel, locationLabel, postedLabel, type Category,
} from "@/lib/opportunities";
import { RESOURCES, ROADMAPS } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import heroImg from "@/assets/hero-mentorship.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta(
      "Growvia — Internships, jobs, freelance projects and resume builder",
      "Discover internships, jobs, freelance projects, and practical resources to move your career forward. From Potential to Opportunity.",
    ),
  }),
  component: Home,
});

const categoryIcons: Record<Category, typeof Code2> = {
  "Software Engineering": Code2, "Data & Analytics": BarChart3, Design: Palette, Marketing: Megaphone, Product: Boxes,
  Finance: Landmark, Operations: Workflow, "Content & Media": Newspaper, Research: Microscope, Sustainability: Leaf,
};

const popular = ["React", "Data analyst", "UX design", "Marketing", "Python"];

function Home() {
  const featured = [...INTERNSHIPS].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo).slice(0, 6);
  const latestJobs = [...JOBS].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo).slice(0, 5);
  const projects = [...FREELANCE].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-surface">
        <div className="container-page grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-20">
          <div className="animate-page">
            <p className="eyebrow">From Potential to Opportunity</p>
            <h1 className="mt-4 max-w-xl text-[2.25rem] font-semibold leading-[1.1] text-navy md:text-[3.25rem]">
              Your next opportunity starts here.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Discover internships, jobs, freelance projects, and practical resources to move your career forward.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/explore">Explore Opportunities <ArrowRight /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/resume-builder"><FileText /> Build Your Resume</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <img src={heroImg} alt="An intern talking through her work with a mentor at a desk" width={1200} height={1408} className="aspect-[5/5.2] w-full rounded-xl object-cover" />
            <div className="surface-card absolute -left-10 bottom-10 w-72 p-4 shadow-pop">
              <div className="flex items-center gap-3">
                <CompanyMark name={featured[0]!.company.name} className="size-9 text-xs" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{featured[0]!.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{featured[0]!.company.name}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="blue">{arrangementLabel[featured[0]!.arrangement]}</Badge>
                <DemoBadge />
              </div>
            </div>
          </div>
        </div>
        <div className="container-page pb-12 md:pb-16">
          <HeroSearch />
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Popular:</span>
            {popular.map((p) => (
              <Link key={p} to="/explore" search={{ q: p }} className="rounded-full border bg-surface px-3 py-1 text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary">
                {p}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16 md:py-20">
        <Reveal>
          <SectionHeading eyebrow="Browse by field" title="Opportunity categories" description="Ten fields, each with internships, early-career jobs and freelance work." />
        </Reveal>
        <Reveal delay={80}>
          <ul className="mt-8 grid border-l border-t sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((c) => {
              const Icon = categoryIcons[c];
              const n = ALL_OPPORTUNITIES.filter((o) => o.category === c).length;
              return (
                <li key={c} className="border-b border-r">
                  <Link to="/explore" search={{ category: [c] }} className="group flex h-full flex-col gap-6 bg-surface p-5 transition-colors hover:bg-blue-soft">
                    <Icon className="size-5 text-teal" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary">{c}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n} opening{n === 1 ? "" : "s"}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </section>

      {/* Featured internships */}
      <section className="border-y bg-surface py-16 md:py-20">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Internships"
              title="Featured internships"
              description="Recently added roles with real responsibilities and a named mentor team."
              action={<Button asChild variant="outline"><Link to="/internships">All internships <ArrowRight /></Link></Button>}
            />
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((o, i) => (
              <Reveal key={o.id} delay={i * 50}><OpportunityCard o={o} className="h-full" /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs + freelance: editorial two-column */}
      <section className="container-page grid gap-12 py-16 md:py-20 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <SectionHeading eyebrow="Jobs" title="Latest job opportunities" action={<Link to="/jobs" className="text-sm font-medium text-primary hover:underline">View all jobs →</Link>} />
          <ul className="mt-6 divide-y rounded-lg border bg-surface">
            {latestJobs.map((o) => (
              <li key={o.id}>
                <Link to="/jobs/$id" params={{ id: o.id }} className="group flex items-center gap-4 p-4 transition-colors hover:bg-muted/60">
                  <CompanyMark name={o.company.name} className="size-10 text-xs" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold group-hover:text-primary">{o.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{o.company.name} · {locationLabel(o)} · {o.experienceLevel}</p>
                  </div>
                  <span className="hidden text-xs text-muted-foreground sm:block">{postedLabel(o.postedDaysAgo)}</span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={80}>
          <SectionHeading eyebrow="Freelancing" title="Freelance projects" action={<Link to="/freelancing" className="text-sm font-medium text-primary hover:underline">View all →</Link>} />
          <ul className="mt-6 grid gap-3">
            {projects.map((o) => (
              <li key={o.id}>
                <Link to="/freelancing/$id" params={{ id: o.id }} className="surface-card card-hover block p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold">{o.title}</p>
                    <Badge variant="teal" className="shrink-0">{o.category}</Badge>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{budgetLabel(o.budget)} · {o.projectLength}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Roadmaps — navy band */}
      <section className="relative overflow-hidden bg-navy py-16 text-navy-foreground md:py-20">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-page relative">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow">Career roadmaps</p>
                <h2 className="mt-2 text-2xl font-semibold md:text-[1.75rem]">Know what to learn next, and in what order</h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-foreground/70">Step-by-step paths with realistic timeframes and a concrete milestone at every stage.</p>
              </div>
              <Button asChild variant="outline-light"><Link to="/roadmaps">See all roadmaps <ArrowRight /></Link></Button>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg bg-navy-foreground/10 md:grid-cols-3">
            {ROADMAPS.slice(0, 3).map((r, i) => (
              <Reveal key={r.slug} delay={i * 60} className="bg-navy p-6">
                <p className="text-xs text-navy-foreground/55">{r.category}</p>
                <h3 className="mt-1 text-lg font-semibold">{r.title}</h3>
                <ol className="mt-5 grid gap-3">
                  {r.stages.map((s, n) => (
                    <li key={s.title} className="flex items-baseline gap-3 text-sm">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full border border-teal/60 text-[0.6875rem] text-teal">{n + 1}</span>
                      <span className="text-navy-foreground/85">{s.title}</span>
                      <span className="ml-auto shrink-0 text-xs text-navy-foreground/50">{s.timeframe}</span>
                    </li>
                  ))}
                </ol>
                <Link to="/roadmaps" hash={r.slug} className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-teal hover:underline">
                  Open roadmap <ArrowRight className="size-3.5" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Resume builder */}
      <section className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Resume builder</p>
          <h2 className="mt-2 text-2xl font-semibold text-navy md:text-[2rem] md:leading-tight">A resume that's honest about where you are — and still stands out</h2>
          <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
            No work experience yet? Projects, coursework, volunteering and skills are real resume material. Growvia guides you through eight short steps with a live preview and exports a clean, text-based PDF.
          </p>
          <ul className="mt-6 grid gap-2.5 text-sm">
            {["Guided steps with examples for students", "Three clean templates, reorderable sections", "Live preview and properly formatted PDF download", "Autosaves to your account when signed in"].map((t) => (
              <li key={t} className="flex items-center gap-2.5"><Check className="size-4 text-teal" aria-hidden="true" />{t}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/resume-builder/build">Start building</Link></Button>
            <Button asChild size="lg" variant="ghost"><Link to="/resume-builder">How it works</Link></Button>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="relative mx-auto max-w-md">
            <div className="absolute -right-4 -top-4 h-full w-full rounded-lg border bg-blue-soft" aria-hidden="true" />
            <div className="surface-card relative p-7 shadow-pop" aria-hidden="true">
              <div className="border-b pb-4 text-center">
                <p className="text-lg font-semibold text-navy">Aanya Rao</p>
                <p className="text-xs text-muted-foreground">Computer Science student · Frontend developer</p>
                <p className="mt-1 text-[0.6875rem] text-muted-foreground">Pune, India · aanya.rao@example.com</p>
              </div>
              {[
                ["Education", "B.Tech Computer Science — Example Institute of Technology"],
                ["Projects", "Campus Events App — React, TypeScript · 600+ active users"],
                ["Skills", "React · TypeScript · SQL · Team leadership"],
              ].map(([h, t]) => (
                <div key={h} className="mt-4">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-primary">{h}</p>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/80">{t}</p>
                  <div className="mt-2 h-1.5 w-4/5 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Resources */}
      <section className="border-y bg-surface py-16 md:py-20">
        <div className="container-page">
          <Reveal>
            <SectionHeading eyebrow="Skills & learning" title="Free resources worth your time" description="A short, curated list from trusted publishers — no paywalls." action={<Button asChild variant="outline"><Link to="/resources">All resources <ArrowRight /></Link></Button>} />
          </Reveal>
          <ul className="mt-8 grid gap-x-10 md:grid-cols-2">
            {RESOURCES.slice(0, 6).map((r) => (
              <li key={r.url} className="border-b">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 py-4">
                  <span className="w-24 shrink-0 text-xs text-muted-foreground">{r.kind}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium group-hover:text-primary">{r.title}</span>
                    <span className="block text-xs text-muted-foreground">{r.provider} · {r.topic}</span>
                  </span>
                  <ArrowRight className="size-4 -rotate-45 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-16 md:py-20">
        <Reveal>
          <SectionHeading eyebrow="How Growvia works" title="Three steps, no guesswork" />
        </Reveal>
        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {[
            { icon: Compass, t: "Discover", d: "Search internships, jobs and projects. Filter by arrangement, pay, schedule and duration until the list fits your life." },
            { icon: FileText, t: "Prepare", d: "Build a focused resume, follow a roadmap for the skills you're missing, and practise common interview questions." },
            { icon: BadgeCheck, t: "Apply & track", d: "Save what interests you, apply through Growvia, and keep every application and status in one place." },
          ].map((s, i) => (
            <Reveal key={s.t} delay={i * 80}>
              <li className="relative list-none border-t-2 border-navy pt-6">
                <span className="absolute -top-3 left-0 bg-background pr-3 text-xs font-semibold text-muted-foreground">0{i + 1}</span>
                <s.icon className="size-5 text-teal" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-semibold text-navy">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Trust */}
      <section className="container-page">
        <Reveal>
          <div className="grid gap-8 rounded-xl border bg-surface p-8 md:grid-cols-[1fr_2fr] md:p-10">
            <div>
              <p className="eyebrow">Our commitments</p>
              <h2 className="mt-2 text-2xl font-semibold text-navy">Built to be trusted</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">We're early, and we'd rather be clear about that than overpromise.</p>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, t: "Honest listings", d: "Sample listings are clearly marked “Demo listing”. We never present unverified roles as verified." },
                { icon: HandCoins, t: "Never pay to apply", d: "Growvia is free for candidates. Legitimate employers don't charge application fees." },
                { icon: Lock, t: "Your data stays yours", d: "Your resume, saved items and applications are private to your account." },
                { icon: Leaf, t: "Browse without an account", d: "Search, read details and use the resume builder before you decide to sign up." },
              ].map((x) => (
                <li key={x.t} className="flex gap-3">
                  <x.icon className="mt-0.5 size-5 shrink-0 text-teal" aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-semibold">{x.t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{x.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
