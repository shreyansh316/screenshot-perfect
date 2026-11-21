import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ShieldCheck,
  HeartHandshake,
  Compass,
  FileText,
  Map,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Reveal } from "@/components/site/common";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta(
      "About Growvia",
      "Growvia helps students, freshers, freelancers and professionals discover opportunities and grow their careers.",
    ),
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Mission"
        title="From Potential to Opportunity"
        description="Growvia exists to help early-career talent, students, and freelancers bridge the gap between their skills and real-world opportunities."
      />

      <div className="container-page py-12 md:py-16">
        {/* Core Narrative */}
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 text-foreground/90">
            <h2 className="text-2xl font-semibold text-navy">Why We Built Growvia</h2>
            <p className="leading-relaxed">
              Finding that first internship, entry-level role, or freelance gig is often obscured by
              cluttered job boards, expired postings, and paywalled tools. Early-career candidates
              with strong coursework, side projects, and ambition are frequently met with
              unrealistic multi-year experience requirements.
            </p>
            <p className="leading-relaxed">
              Growvia was created to provide a calm, structured alternative. We focus exclusively on
              verified roles, clear compensation and arrangement details, and tools that help
              candidates present their genuine capabilities with confidence.
            </p>

            <div className="mt-8 pt-4 border-t">
              <h3 className="text-xl font-semibold text-navy">Our Commitments to You</h3>
              <ul className="mt-4 grid gap-3.5">
                {[
                  {
                    title: "Free for all candidates",
                    desc: "You will never be asked to pay a fee to browse, search, apply, or download your resume on Growvia.",
                  },
                  {
                    title: "Verified opportunities only",
                    desc: "We verify listings before publishing. No ghost jobs, duplicate spam, or paid application schemes.",
                  },
                  {
                    title: "Skills-first evaluation",
                    desc: "Our career roadmaps and resume builder treat projects, skills, and coursework as legitimate, valuable experience.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 shrink-0 text-teal mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Pillars Sidebar */}
          <div className="space-y-4">
            <div className="surface-card p-6 border rounded-lg bg-surface">
              <div className="grid size-10 place-items-center rounded-md bg-blue-soft text-primary mb-3">
                <Compass className="size-5" />
              </div>
              <h3 className="font-semibold text-navy">Opportunity Discovery</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Filter internships, junior roles, and freelance projects by location, arrangement,
                and required skills.
              </p>
              <Link
                to="/explore"
                className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                Explore openings <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </div>

            <div className="surface-card p-6 border rounded-lg bg-surface">
              <div className="grid size-10 place-items-center rounded-md bg-teal-soft text-teal mb-3">
                <FileText className="size-5" />
              </div>
              <h3 className="font-semibold text-navy">ATS Resume Builder</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Build a text-based, ATS-friendly resume across three clean layouts and export it
                immediately as a PDF.
              </p>
              <Link
                to="/resume-builder"
                className="mt-4 inline-flex items-center text-sm font-medium text-teal hover:underline"
              >
                Open builder <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </div>

            <div className="surface-card p-6 border rounded-lg bg-surface">
              <div className="grid size-10 place-items-center rounded-md bg-navy text-navy-foreground mb-3">
                <Map className="size-5" />
              </div>
              <h3 className="font-semibold text-navy">Actionable Roadmaps</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Follow structured progression stages with real milestones for modern tech, design,
                and marketing paths.
              </p>
              <Link
                to="/roadmaps"
                className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                View roadmaps <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div className="mt-16 rounded-xl bg-navy p-8 text-navy-foreground md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold">Have questions or want to partner?</h3>
            <p className="mt-1 text-sm text-navy-foreground/75">
              We welcome candidate feedback, employer inquiries, and student organization
              partnerships.
            </p>
          </div>
          <Button asChild variant="outline-light" size="lg">
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
