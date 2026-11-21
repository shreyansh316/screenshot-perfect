import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/common";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: pageMeta(
      "Privacy Policy — Growvia",
      "Learn how Growvia protects and respects your privacy and personal candidate data.",
    ),
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated: November 2026. How Growvia collects, protects, and handles your information."
      />

      <div className="container-page py-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-10 text-foreground/90">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-navy">1. Our Commitment to Your Privacy</h2>
            <p className="leading-relaxed text-sm text-muted-foreground">
              At Growvia (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we believe in
              transparent, candidate-first career tools. We collect only the information necessary
              to provide you with verified opportunity discovery, resume building, and application
              tracking services. We do not sell your personal data or your resume to advertisers or
              third-party data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-navy">2. Information We Collect</h2>
            <p className="leading-relaxed text-sm text-muted-foreground">
              Depending on how you interact with Growvia, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Account Information:</strong> When you create an
                account, we collect your email address and name. When signing in via Google, we
                receive your email and verified name from Google OAuth.
              </li>
              <li>
                <strong className="text-foreground">Resume Data:</strong> When using the Resume
                Builder, the details you enter (education, projects, work experience, skills) are
                stored locally in your browser and synced to your secure user account if signed in.
              </li>
              <li>
                <strong className="text-foreground">Activity &amp; Tracking:</strong> Records of
                opportunities you bookmark, applications you submit or track through our platform,
                and notes you add to them.
              </li>
              <li>
                <strong className="text-foreground">Contact Inquiries:</strong> Name, email address,
                topic, and message content submitted through our contact form.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-navy">3. How Your Information Is Used</h2>
            <p className="leading-relaxed text-sm text-muted-foreground">
              We use your information exclusively to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Provide and maintain your Growvia account, authentication, and security.</li>
              <li>
                Enable you to build, customize, preview, and download your resumes in PDF format.
              </li>
              <li>
                Display your saved listings and tracked application statuses in your candidate
                dashboard.
              </li>
              <li>Respond to your support requests, inquiries, and feedback.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-navy">
              4. Data Storage, Security &amp; Retention
            </h2>
            <p className="leading-relaxed text-sm text-muted-foreground">
              Your account data is stored with encrypted connections in our database. We retain your
              resume and application bookmarks for as long as your account is active. You may edit
              or delete your resume details and saved opportunities directly from the application at
              any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-navy">5. Cookies and Local Storage</h2>
            <p className="leading-relaxed text-sm text-muted-foreground">
              Growvia uses essential local storage and session tokens to preserve your login state
              and to let you draft resumes on your device even before signing in. We do not use
              third-party tracking cookies or advertising pixels.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-navy">6. Contact Us Regarding Privacy</h2>
            <p className="leading-relaxed text-sm text-muted-foreground">
              If you have any questions about this Privacy Policy or wish to request data deletion,
              please reach out via our contact page.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
