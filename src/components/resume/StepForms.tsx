import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  LANGUAGE_LEVELS, emptyCertification, emptyEducation, emptyExperience, emptyLanguage, emptyProject,
  type Errors, type Experience, type ResumeData, type StepKey,
} from "@/lib/resume";
import { EntryList, Field, SelectField, TagInput } from "./fields";

type Update = (fn: (d: ResumeData) => ResumeData) => void;

export function StepForm({ step, data, update, errors }: { step: StepKey; data: ResumeData; update: Update; errors: Errors }) {
  const setPersonal = (k: keyof ResumeData["personal"]) => (v: string) => update((d) => ({ ...d, personal: { ...d.personal, [k]: v } }));
  const p = data.personal;

  switch (step) {
    case "personal":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required value={p.fullName} onChange={setPersonal("fullName")} error={errors["fullName"]} autoComplete="name" className="sm:col-span-2" />
          <Field label="Headline" value={p.headline} onChange={setPersonal("headline")} hint="One line, e.g. “Final-year commerce student” or “Junior data analyst”." className="sm:col-span-2" />
          <Field label="Email" required type="email" value={p.email} onChange={setPersonal("email")} error={errors["email"]} autoComplete="email" />
          <Field label="Phone" type="tel" value={p.phone} onChange={setPersonal("phone")} error={errors["phone"]} autoComplete="tel" />
          <Field label="City" value={p.city} onChange={setPersonal("city")} autoComplete="address-level2" />
          <Field label="Country" value={p.country} onChange={setPersonal("country")} autoComplete="country-name" />
        </div>
      );
    case "summary":
      return (
        <div className="grid gap-2">
          <Field
            label="Professional summary"
            multiline
            rows={6}
            value={data.summary}
            onChange={(v) => update((d) => ({ ...d, summary: v.slice(0, 1200) }))}
            hint="2–4 sentences: who you are, what you're good at, and what you're looking for. Students can lead with their studies and projects."
          />
          <p className="text-right text-xs text-muted-foreground" aria-live="polite">{data.summary.length} / 1200</p>
        </div>
      );
    case "education":
      return (
        <EntryList
          items={data.education}
          onChange={(education) => update((d) => ({ ...d, education }))}
          create={emptyEducation}
          addLabel="Add education"
          emptyText="Add your college, school or any formal course."
          title={(x, i) => x.institution || `Education ${i + 1}`}
          render={(x, i, patch) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Institution" required value={x.institution} onChange={(v) => patch({ institution: v })} error={errors[`education.${i}.institution`]} className="sm:col-span-2" />
              <Field label="Degree or qualification" value={x.degree} onChange={(v) => patch({ degree: v })} placeholder="B.Com, B.Tech, Class XII…" />
              <Field label="Field of study" value={x.field} onChange={(v) => patch({ field: v })} />
              <Field label="Start" type="month" value={x.start} onChange={(v) => patch({ start: v })} />
              <Field label="End (or expected)" type="month" value={x.end} onChange={(v) => patch({ end: v })} error={errors[`education.${i}.end`]} />
              <Field label="Details" multiline rows={3} value={x.description} onChange={(v) => patch({ description: v })} hint="Optional: grade, relevant coursework, honours." className="sm:col-span-2" />
            </div>
          )}
        />
      );
    case "experience":
      return (
        <div className="grid gap-3">
          <p className="text-sm text-muted-foreground">No work experience yet? That's fine — skip this step, or add internships and volunteering. Projects in the next step count too.</p>
          <EntryList
            items={data.experience}
            onChange={(experience) => update((d) => ({ ...d, experience }))}
            create={emptyExperience}
            addLabel="Add experience"
            emptyText="Nothing added. Leave it empty if you haven't worked yet."
            title={(x, i) => x.title || x.company || `Experience ${i + 1}`}
            render={(x, i, patch) => (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Role title" required value={x.title} onChange={(v) => patch({ title: v })} error={errors[`experience.${i}.title`]} />
                <Field label="Organisation" required value={x.company} onChange={(v) => patch({ company: v })} error={errors[`experience.${i}.company`]} />
                <SelectField
                  label="Type"
                  value={x.kind}
                  onChange={(v) => patch({ kind: v as Experience["kind"] })}
                  options={[["work", "Job"], ["internship", "Internship"], ["volunteer", "Volunteering"]]}
                  className="sm:col-span-2"
                />
                <Field label="Start" type="month" value={x.start} onChange={(v) => patch({ start: v })} />
                {!x.current && <Field label="End" type="month" value={x.end} onChange={(v) => patch({ end: v })} error={errors[`experience.${i}.end`]} />}
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Checkbox id={`cur-${x.id}`} checked={x.current} onCheckedChange={(c) => patch({ current: c === true, end: c === true ? "" : x.end })} />
                  <Label htmlFor={`cur-${x.id}`} className="text-sm font-normal">I currently do this</Label>
                </div>
                <Field label="What you did" multiline rows={4} value={x.responsibilities} onChange={(v) => patch({ responsibilities: v })} hint="One point per line. Start with a verb: “Built…”, “Organised…”." className="sm:col-span-2" />
                <Field label="Results or achievements" multiline rows={3} value={x.achievements} onChange={(v) => patch({ achievements: v })} hint="Optional. Only include results you can stand behind." className="sm:col-span-2" />
              </div>
            )}
          />
        </div>
      );
    case "projects":
      return (
        <EntryList
          items={data.projects}
          onChange={(projects) => update((d) => ({ ...d, projects }))}
          create={emptyProject}
          addLabel="Add project"
          emptyText="Coursework, hackathons, personal or freelance projects all count."
          title={(x, i) => x.name || `Project ${i + 1}`}
          render={(x, i, patch) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Project name" required value={x.name} onChange={(v) => patch({ name: v })} error={errors[`projects.${i}.name`]} />
              <Field label="Tools or technologies" value={x.technologies} onChange={(v) => patch({ technologies: v })} placeholder="Excel, Figma, Python…" />
              <Field label="Description" multiline rows={3} value={x.description} onChange={(v) => patch({ description: v })} className="sm:col-span-2" />
              <Field label="Link" value={x.url} onChange={(v) => patch({ url: v })} error={errors[`projects.${i}.url`]} placeholder="github.com/you/project" className="sm:col-span-2" />
            </div>
          )}
        />
      );
    case "skills":
      return (
        <div className="grid gap-6">
          <TagInput label="Technical skills" values={data.skills.technical} onChange={(technical) => update((d) => ({ ...d, skills: { ...d.skills, technical } }))} placeholder="e.g. Excel" hint="Press Enter or type a comma to add each skill." />
          <TagInput label="Professional skills" values={data.skills.professional} onChange={(professional) => update((d) => ({ ...d, skills: { ...d.skills, professional } }))} placeholder="e.g. Presenting" />
        </div>
      );
    case "certifications":
      return (
        <EntryList
          items={data.certifications}
          onChange={(certifications) => update((d) => ({ ...d, certifications }))}
          create={emptyCertification}
          addLabel="Add certification or achievement"
          emptyText="Courses, certificates, awards or competition results."
          title={(x, i) => x.name || `Item ${i + 1}`}
          render={(x, i, patch) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" required value={x.name} onChange={(v) => patch({ name: v })} error={errors[`certifications.${i}.name`]} className="sm:col-span-2" />
              <Field label="Issued by" value={x.issuer} onChange={(v) => patch({ issuer: v })} />
              <Field label="Date" type="month" value={x.date} onChange={(v) => patch({ date: v })} />
              <Field label="Credential link" value={x.link} onChange={(v) => patch({ link: v })} error={errors[`certifications.${i}.link`]} className="sm:col-span-2" />
            </div>
          )}
        />
      );
    case "additional":
      return (
        <div className="grid gap-8">
          <section className="grid gap-3">
            <h3 className="text-sm font-semibold text-navy">Languages</h3>
            <EntryList
              items={data.languages}
              onChange={(languages) => update((d) => ({ ...d, languages }))}
              create={emptyLanguage}
              addLabel="Add language"
              emptyText="Add the languages you can work in."
              title={(x, i) => x.name || `Language ${i + 1}`}
              render={(x, i, patch) => (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Language" required value={x.name} onChange={(v) => patch({ name: v })} error={errors[`languages.${i}.name`]} />
                  <SelectField label="Level" value={x.level} onChange={(v) => patch({ level: v })} options={[["", "Not stated"], ...LANGUAGE_LEVELS.map((l) => [l, l] as const)]} />
                </div>
              )}
            />
          </section>
          <section className="grid gap-4 sm:grid-cols-2">
            <h3 className="text-sm font-semibold text-navy sm:col-span-2">Links</h3>
            <Field label="Portfolio or website" value={p.portfolio} onChange={setPersonal("portfolio")} error={errors["portfolio"]} className="sm:col-span-2" />
            <Field label="LinkedIn" value={p.linkedin} onChange={setPersonal("linkedin")} error={errors["linkedin"]} />
            <Field label="GitHub" value={p.github} onChange={setPersonal("github")} error={errors["github"]} />
          </section>
          <Field
            label="Additional information"
            multiline
            rows={4}
            value={data.additional}
            onChange={(v) => update((d) => ({ ...d, additional: v.slice(0, 1500) }))}
            hint="Optional, one point per line: interests, availability, publications, anything else relevant."
          />
        </div>
      );
  }
}
