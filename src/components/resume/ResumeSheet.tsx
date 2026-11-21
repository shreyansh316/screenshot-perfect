import { forwardRef } from "react";
import {
  SECTION_LABELS,
  bulletLines,
  dateRange,
  displayUrl,
  type ResumeData,
  type SectionKey,
  type TemplateKey,
} from "@/lib/resume";
import { cn } from "@/lib/utils";

const styles: Record<
  TemplateKey,
  {
    root: string;
    header: string;
    name: string;
    headline: string;
    contact: string;
    h2: string;
    section: string;
    item: string;
  }
> = {
  classic: {
    root: "px-[56px] py-[52px] text-[10.5pt] leading-[1.45]",
    header: "text-center pb-4 border-b border-foreground/20",
    name: "text-[22pt] font-semibold tracking-tight text-navy",
    headline: "mt-1 text-[11pt] text-foreground/75",
    contact: "mt-2 flex flex-wrap justify-center gap-x-2 text-[9pt] text-foreground/70",
    h2: "text-[9.5pt] font-semibold uppercase tracking-[0.12em] text-navy border-b border-foreground/15 pb-1",
    section: "mt-5",
    item: "mt-3",
  },
  modern: {
    root: "px-[56px] py-[52px] text-[10.5pt] leading-[1.45]",
    header: "pb-4 border-b-[3px] border-teal",
    name: "text-[24pt] font-semibold tracking-tight text-navy",
    headline: "mt-0.5 text-[11pt] font-medium text-primary",
    contact: "mt-2 flex flex-wrap gap-x-2 text-[9pt] text-foreground/70",
    h2: "text-[10.5pt] font-semibold text-navy flex items-center gap-2 before:h-[2px] before:w-4 before:bg-teal before:content-['']",
    section: "mt-5",
    item: "mt-2.5",
  },
  compact: {
    root: "px-[44px] py-[40px] text-[9.5pt] leading-[1.38]",
    header: "flex flex-wrap items-end justify-between gap-2 pb-2.5 border-b border-foreground/25",
    name: "text-[18pt] font-semibold tracking-tight text-navy",
    headline: "text-[10pt] text-foreground/75",
    contact: "flex flex-wrap gap-x-2 text-[8.5pt] text-foreground/70 w-full",
    h2: "text-[9pt] font-semibold uppercase tracking-[0.1em] text-primary",
    section: "mt-3.5",
    item: "mt-1.5",
  },
};

function Bullets({ text }: { text: string }) {
  const lines = bulletLines(text);
  if (!lines.length) return null;
  return (
    <ul className="mt-1 list-disc pl-[1.1em] marker:text-foreground/50">
      {lines.map((l, i) => (
        <li key={i}>{l}</li>
      ))}
    </ul>
  );
}

type S = (typeof styles)[TemplateKey];

function Section({ k, d, s }: { k: SectionKey; d: ResumeData; s: S }) {
  const heading = <h2 className={s.h2}>{SECTION_LABELS[k]}</h2>;
  switch (k) {
    case "summary":
      return d.summary.trim() ? (
        <section className={s.section}>
          {heading}
          <p className="mt-1.5 whitespace-pre-line">{d.summary.trim()}</p>
        </section>
      ) : null;
    case "experience":
      return d.experience.length ? (
        <section className={s.section}>
          {heading}
          {d.experience.map((x) => (
            <div key={x.id} className={s.item}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p>
                  <span className="font-semibold">{x.title || "Role"}</span>
                  {x.company && <> · {x.company}</>}
                  {x.kind === "volunteer" && (
                    <span className="text-foreground/60"> (Volunteer)</span>
                  )}
                  {x.kind === "internship" && (
                    <span className="text-foreground/60"> (Internship)</span>
                  )}
                </p>
                <p className="text-[0.9em] text-foreground/65">
                  {dateRange(x.start, x.end, x.current)}
                </p>
              </div>
              <Bullets text={x.responsibilities} />
              <Bullets text={x.achievements} />
            </div>
          ))}
        </section>
      ) : null;
    case "education":
      return d.education.length ? (
        <section className={s.section}>
          {heading}
          {d.education.map((x) => (
            <div key={x.id} className={s.item}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p>
                  <span className="font-semibold">
                    {[x.degree, x.field].filter(Boolean).join(", ") || "Qualification"}
                  </span>
                  {x.institution && <> · {x.institution}</>}
                </p>
                <p className="text-[0.9em] text-foreground/65">{dateRange(x.start, x.end)}</p>
              </div>
              {x.description.trim() && (
                <p className="mt-0.5 text-foreground/80">{x.description.trim()}</p>
              )}
            </div>
          ))}
        </section>
      ) : null;
    case "projects":
      return d.projects.length ? (
        <section className={s.section}>
          {heading}
          {d.projects.map((x) => (
            <div key={x.id} className={s.item}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p>
                  <span className="font-semibold">{x.name || "Project"}</span>
                  {x.technologies && (
                    <span className="text-foreground/65"> · {x.technologies}</span>
                  )}
                </p>
                {x.url && <p className="text-[0.9em] text-primary">{displayUrl(x.url)}</p>}
              </div>
              {x.description.trim() && (
                <p className="mt-0.5 text-foreground/80">{x.description.trim()}</p>
              )}
            </div>
          ))}
        </section>
      ) : null;
    case "skills": {
      const { technical, professional } = d.skills;
      if (!technical.length && !professional.length) return null;
      return (
        <section className={s.section}>
          {heading}
          <div className="mt-1.5 grid gap-0.5">
            {technical.length > 0 && (
              <p>
                <span className="font-semibold">Technical: </span>
                {technical.join(", ")}
              </p>
            )}
            {professional.length > 0 && (
              <p>
                <span className="font-semibold">Professional: </span>
                {professional.join(", ")}
              </p>
            )}
          </div>
        </section>
      );
    }
    case "certifications":
      return d.certifications.length ? (
        <section className={s.section}>
          {heading}
          {d.certifications.map((x) => (
            <div
              key={x.id}
              className={cn(s.item, "flex flex-wrap items-baseline justify-between gap-x-3")}
            >
              <p>
                <span className="font-semibold">{x.name || "Certification"}</span>
                {x.issuer && <> · {x.issuer}</>}
                {x.link && <span className="text-primary"> · {displayUrl(x.link)}</span>}
              </p>
              <p className="text-[0.9em] text-foreground/65">{dateRange(x.date, "")}</p>
            </div>
          ))}
        </section>
      ) : null;
    case "languages":
      return d.languages.length ? (
        <section className={s.section}>
          {heading}
          <p className="mt-1.5">
            {d.languages
              .map((l) => [l.name, l.level && `(${l.level})`].filter(Boolean).join(" "))
              .join(", ")}
          </p>
        </section>
      ) : null;
    case "additional":
      return d.additional.trim() ? (
        <section className={s.section}>
          {heading}
          <Bullets text={d.additional} />
        </section>
      ) : null;
  }
}

export const ResumeSheet = forwardRef<
  HTMLDivElement,
  { data: ResumeData; template: TemplateKey; className?: string; id?: string }
>(function ResumeSheet({ data, template, className, id }, ref) {
  const s = styles[template];
  const p = data.personal;
  const contact = [
    [p.city, p.country].filter(Boolean).join(", "),
    p.email,
    p.phone,
    p.portfolio && displayUrl(p.portfolio),
    p.linkedin && displayUrl(p.linkedin),
    p.github && displayUrl(p.github),
  ].filter(Boolean) as string[];
  const empty =
    !p.fullName &&
    !data.summary &&
    !data.education.length &&
    !data.experience.length &&
    !data.projects.length;

  return (
    <div
      ref={ref}
      id={id}
      className={cn("w-[794px] min-h-[1123px] bg-surface text-foreground", s.root, className)}
    >
      <header className={s.header}>
        <div>
          <p className={s.name}>
            {p.fullName || <span className="text-foreground/30">Your name</span>}
          </p>
          {p.headline && <p className={s.headline}>{p.headline}</p>}
        </div>
        {contact.length > 0 && (
          <p className={s.contact}>
            {contact.map((c, i) => (
              <span key={i}>
                {i > 0 && <span className="mr-2 text-foreground/35">|</span>}
                {c}
              </span>
            ))}
          </p>
        )}
      </header>
      {empty ? (
        <p className="mt-16 text-center text-[11pt] text-foreground/40">
          Start filling in the steps — your resume builds itself here as you type.
        </p>
      ) : (
        data.sectionOrder.map((k) => <Section key={k} k={k} d={data} s={s} />)
      )}
    </div>
  );
});
