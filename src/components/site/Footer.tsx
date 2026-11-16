import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const cols: { title: string; links: { to: string; label: string }[] }[] = [
  { title: "Opportunities", links: [
    { to: "/explore", label: "Explore all" }, { to: "/internships", label: "Internships" }, { to: "/jobs", label: "Jobs" }, { to: "/freelancing", label: "Freelance projects" },
  ] },
  { title: "Grow", links: [
    { to: "/resume-builder", label: "Resume Builder" }, { to: "/roadmaps", label: "Career roadmaps" }, { to: "/resources", label: "Learning resources" }, { to: "/interview-prep", label: "Interview preparation" },
  ] },
  { title: "Company", links: [
    { to: "/about", label: "About Growvia" }, { to: "/contact", label: "Contact" }, { to: "/privacy", label: "Privacy policy" }, { to: "/terms", label: "Terms of service" },
  ] },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-navy text-navy-foreground">
      <div className="container-page grid gap-12 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo tone="light" />
          <p className="mt-4 text-sm leading-relaxed text-navy-foreground/70">
            From Potential to Opportunity. Discover openings, build a resume you're proud of, and plan your next step.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-navy-foreground/55">{c.title}</h2>
            <ul className="mt-4 grid gap-2.5">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-underline text-sm text-navy-foreground/85 hover:text-navy-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-navy-foreground/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-navy-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Growvia. All rights reserved.</p>
          <p>Listings marked “Demo listing” are sample content from fictional organisations.</p>
        </div>
      </div>
    </footer>
  );
}
