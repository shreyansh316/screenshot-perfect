import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, ArrowDown, ArrowLeft, ArrowRight, Check, CloudOff, Download, Eye, Loader2, PencilLine } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScaledPreview } from "@/components/resume/ScaledPreview";
import { StepForm } from "@/components/resume/StepForms";
import { useResume, type SaveStatus } from "@/hooks/use-resume";
import { useSignInRedirect } from "@/lib/auth";
import {
  SECTION_LABELS, STEPS, TEMPLATES, errorsForStep, moveSection, resumeCompletion, stepForError, validateResume, type StepKey,
} from "@/lib/resume";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resume-builder/build")({
  ssr: false,
  head: () => ({ meta: pageMeta("Build your resume", "Fill in eight short steps, watch your resume take shape and download it as a PDF.") }),
  pendingComponent: () => <div className="container-page py-16"><div className="h-8 w-64 animate-pulse rounded bg-muted" /></div>,
  component: Builder,
});

function StatusLine({ status, savedAt, signedIn, onRetry }: { status: SaveStatus; savedAt: Date | null; signedIn: boolean; onRetry: () => void }) {
  const time = savedAt?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const content = (() => {
    switch (status) {
      case "loading": return <><Loader2 className="size-3.5 animate-spin" /> Loading your resume…</>;
      case "dirty": return <><PencilLine className="size-3.5" /> Unsaved changes</>;
      case "saving": return <><Loader2 className="size-3.5 animate-spin" /> Saving…</>;
      case "saved": return <><Check className="size-3.5 text-teal" /> Saved to your account{time ? ` at ${time}` : ""}</>;
      case "local": return <><CloudOff className="size-3.5" /> Saved on this device only</>;
      case "error":
        return (
          <span className="inline-flex items-center gap-1.5 text-destructive">
            <AlertCircle className="size-3.5" /> {signedIn ? "Couldn't save to your account." : "Couldn't save on this device."}
            <button type="button" onClick={onRetry} className="font-medium underline">Try again</button>
          </span>
        );
      default: return signedIn ? <>Changes save automatically</> : <>Changes save on this device</>;
    }
  })();
  return <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" role="status" aria-live="polite">{content}</p>;
}

function Builder() {
  const r = useResume();
  const signIn = useSignInRedirect();
  const [stepIdx, setStepIdx] = useState(0);
  const [showErrorsFor, setShowErrorsFor] = useState<Set<StepKey>>(new Set());
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [downloading, setDownloading] = useState(false);

  const step = STEPS[stepIdx]!;
  const allErrors = useMemo(() => validateResume(r.data), [r.data]);
  const visibleErrors = showErrorsFor.has(step.key) ? errorsForStep(allErrors, step.key) : {};
  const stepHasErrors = (k: StepKey) => showErrorsFor.has(k) && Object.keys(errorsForStep(allErrors, k)).length > 0;
  const completion = resumeCompletion(r.data);

  const goTo = (i: number) => {
    setStepIdx(i);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const next = () => {
    const errs = errorsForStep(allErrors, step.key);
    if (Object.keys(errs).length) {
      setShowErrorsFor((s) => new Set(s).add(step.key));
      toast.error("Please fix the highlighted fields before continuing.");
      return;
    }
    if (stepIdx < STEPS.length - 1) goTo(stepIdx + 1);
  };

  const download = async () => {
    const keys = Object.keys(allErrors);
    if (keys.length) {
      const steps = new Set(keys.map(stepForError));
      setShowErrorsFor((s) => new Set([...s, ...steps]));
      const first = STEPS.findIndex((s) => steps.has(s.key));
      goTo(first);
      setMobileView("edit");
      toast.error("Some details need fixing before you can download.", { description: `Check “${STEPS[first]!.title}”.` });
      return;
    }
    setDownloading(true);
    try {
      const { resumePdfBlob } = await import("@/components/resume/ResumePdf");
      const blob = await resumePdfBlob(r.data, r.template);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const name = r.data.personal.fullName.trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "resume";
      a.href = url;
      a.download = `${name}-resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      toast.success("Your PDF has downloaded");
    } catch (e) {
      console.error(e);
      toast.error("We couldn't create the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-background">
      <div className="border-b bg-surface">
        <div className="container-page flex flex-col gap-4 py-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Resume Builder</p>
            <h1 className="mt-1 text-2xl font-semibold text-navy md:text-3xl">Build your resume</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <StatusLine status={r.status} savedAt={r.savedAt} signedIn={r.signedIn} onRetry={() => void r.saveNow()} />
              {!r.signedIn && r.status !== "loading" && (
                <button type="button" onClick={() => signIn()} className="text-xs font-medium text-primary hover:underline">Sign in to save to your account</button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">{completion}% complete</span>
            <Button onClick={download} disabled={downloading || r.status === "loading"}>
              {downloading ? <Loader2 className="animate-spin" /> : <Download />} {downloading ? "Preparing PDF…" : "Download PDF"}
            </Button>
          </div>
        </div>
      </div>

      {r.deviceDraft && (
        <div className="container-page pt-4">
          <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-blue-soft px-4 py-3 text-sm" role="note">
            <p className="flex-1">You also have a draft saved on this device from before you signed in. Your account copy is shown.</p>
            <Button size="sm" variant="outline" onClick={r.useDeviceDraft}>Use the device draft instead</Button>
            <Button size="sm" variant="ghost" onClick={r.dismissDeviceDraft}>Discard device draft</Button>
          </div>
        </div>
      )}

      <div className="container-page pt-4 lg:hidden">
        <div className="grid grid-cols-2 rounded-md border bg-surface p-1" role="tablist" aria-label="Builder view">
          {(["edit", "preview"] as const).map((v) => (
            <button key={v} role="tab" aria-selected={mobileView === v} onClick={() => setMobileView(v)} className={cn("inline-flex items-center justify-center gap-1.5 rounded px-3 py-2 text-sm font-medium", mobileView === v ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
              {v === "edit" ? <><PencilLine className="size-4" /> Edit</> : <><Eye className="size-4" /> Preview</>}
            </button>
          ))}
        </div>
      </div>

      <div className="container-page grid gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:py-8">
        <div className={cn("min-w-0", mobileView === "preview" && "hidden lg:block")}>
          <nav aria-label="Resume steps">
            <ol className="flex flex-wrap gap-1.5">
              {STEPS.map((s, i) => (
                <li key={s.key} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === stepIdx ? "step" : undefined}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      i === stepIdx ? "border-primary bg-primary text-primary-foreground" : "bg-surface text-foreground/80 hover:border-primary/40",
                      stepHasErrors(s.key) && i !== stepIdx && "border-destructive text-destructive",
                    )}
                  >
                    <span className="tabular-nums">{i + 1}</span> {s.title}
                    {stepHasErrors(s.key) && <AlertCircle className="size-3" aria-label="has errors" />}
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <section className="mt-4 rounded-lg border bg-background p-5 md:p-6" aria-labelledby="step-title">
            <p className="text-xs font-medium text-muted-foreground">Step {stepIdx + 1} of {STEPS.length}</p>
            <h2 id="step-title" className="mt-1 text-xl font-semibold text-navy">{step.title}</h2>
            <div className="mt-5">
              {r.status === "loading" ? (
                <div className="grid gap-3">{[0, 1, 2].map((i) => <div key={i} className="h-9 animate-pulse rounded bg-muted" />)}</div>
              ) : (
                <StepForm step={step.key} data={r.data} update={r.update} errors={visibleErrors} />
              )}
            </div>
            <div className="mt-8 flex items-center justify-between gap-3 border-t pt-5">
              <Button variant="outline" onClick={() => goTo(stepIdx - 1)} disabled={stepIdx === 0}><ArrowLeft /> Back</Button>
              {stepIdx < STEPS.length - 1 ? (
                <Button onClick={next}>Next: {STEPS[stepIdx + 1]!.title} <ArrowRight /></Button>
              ) : (
                <Button onClick={download} disabled={downloading}><Download /> Download PDF</Button>
              )}
            </div>
          </section>
        </div>

        <aside className={cn("min-w-0", mobileView === "edit" && "hidden lg:block")} aria-label="Resume preview and layout">
          <div className="lg:sticky lg:top-20">
            <div className="grid gap-4 rounded-lg border bg-surface p-4">
              <fieldset>
                <legend className="text-sm font-semibold">Template</legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {TEMPLATES.map((t) => (
                    <label key={t.key} className={cn("cursor-pointer rounded-md border p-2.5 text-left text-xs transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring", r.template === t.key ? "border-primary bg-blue-soft" : "hover:border-primary/40")}>
                      <input type="radio" name="template" value={t.key} checked={r.template === t.key} onChange={() => r.setTemplate(t.key)} className="sr-only" />
                      <span className="block font-semibold text-foreground">{t.name}</span>
                      <span className="mt-0.5 block text-muted-foreground">{t.note}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <details className="group">
                <summary className="cursor-pointer text-sm font-semibold">Section order</summary>
                <ol className="mt-2 grid gap-1">
                  {r.data.sectionOrder.map((k, i) => (
                    <li key={k} className="flex items-center gap-2 rounded border bg-background px-2.5 py-1.5 text-sm">
                      <span className="w-5 text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                      <span className="flex-1">{SECTION_LABELS[k]}</span>
                      <Button type="button" size="icon" variant="ghost" className="size-7" disabled={i === 0} onClick={() => r.update((d) => ({ ...d, sectionOrder: moveSection(d.sectionOrder, k, -1) }))} aria-label={`Move ${SECTION_LABELS[k]} up`}><ArrowDown className="rotate-180" /></Button>
                      <Button type="button" size="icon" variant="ghost" className="size-7" disabled={i === r.data.sectionOrder.length - 1} onClick={() => r.update((d) => ({ ...d, sectionOrder: moveSection(d.sectionOrder, k, 1) }))} aria-label={`Move ${SECTION_LABELS[k]} down`}><ArrowDown /></Button>
                    </li>
                  ))}
                </ol>
                <p className="mt-2 text-xs text-muted-foreground">Empty sections are left out of your resume automatically.</p>
              </details>
            </div>
            <div className="mt-4">
              <ScaledPreview data={r.data} template={r.template} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              The PDF uses standard fonts so applicant tracking systems can read it. <Link to="/resume-builder" className="text-primary hover:underline">Resume tips</Link>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
