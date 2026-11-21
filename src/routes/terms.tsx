import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/common";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: pageMeta(
      "Terms of Service — Growvia",
      "Read the terms and conditions for using Growvia's opportunity discovery, career roadmaps, and resume builder.",
    ),
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description="Last updated: November 2026. Please review these terms before using Growvia."
      />

      <div className="container-page py-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-10 text-foreground/90">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-navy">1. Acceptance of Terms</h2>
            <p className="leading-relaxed text-sm text-muted-foreground">
              By accessing or using Growvia (&quot;the Service&quot;), you agree to be bound by
              these Terms of Service. If you disagree with any part of these terms, you may not
              access the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-navy">
              2. Free for Candidates &amp; Fairness Policy
            </h2>
            <p className="leading-relaxed text-sm text-muted-foreground">
              Growvia is completely free for students, graduates, and job candidates. You will never
              be charged to discover listings, create ATS resumes, or apply for verified roles.
              Furthermore, we maintain a strict rule:{" "}
              <em>
                no listing on Growvia may require candidates to pay an application fee, training
                bond, or upfront payment
              </em>
              . If you ever encounter an opportunity requiring payment, report it to us immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-navy">3. User Accounts &amp; Conduct</h2>
            <p className="leading-relaxed text-sm text-muted-foreground">
              When creating an account on Growvia, you agree to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Provide accurate, genuine, and current information.</li>
              <li>
                Represent your qualifications, education, and work history truthfully in your
                profile and resumes.
              </li>
              <li>
                Maintain the confidentiality of your login credentials and accept responsibility for
                account activities.
              </li>
              <li>
                Refrain from attempting to scrape, reverse-engineer, or disrupt the platform
                infrastructure.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-navy">
              4. Opportunities and External Employers
            </h2>
            <p className="leading-relaxed text-sm text-muted-foreground">
              We vet and verify opportunities before publication. However, actual employment
              relationships, offers, interviews, and contracts exist solely between you and the
              respective employer or client. Growvia is not an employment agency or party to any
              contract agreed between candidates and third-party employers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-navy">
              5. Intellectual Property &amp; User Content
            </h2>
            <p className="leading-relaxed text-sm text-muted-foreground">
              You retain all ownership rights to the resume content, personal projects, and
              portfolio links you create and upload. Growvia retains all rights, title, and interest
              in and to the platform design, codebase, logos, and roadmaps.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-navy">6. Termination</h2>
            <p className="leading-relaxed text-sm text-muted-foreground">
              We reserve the right to suspend or terminate accounts that violate these terms, submit
              fraudulent or malicious applications, or engage in abusive behavior on the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-navy">7. Updates to These Terms</h2>
            <p className="leading-relaxed text-sm text-muted-foreground">
              We may update these terms from time to time. Continued use of Growvia following any
              changes indicates your acceptance of the updated terms.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
