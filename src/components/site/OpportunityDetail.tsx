import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, CalendarClock, CheckCircle2, Clock, MapPin, Users, Wallet, Briefcase, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CompanyMark, DemoBadge } from "./common";
import { OpportunityCard, SaveButton } from "./OpportunityCard";
import { supabase } from "@/integrations/supabase/client";
import { useApplications } from "@/hooks/use-account";
import { useAuth, useSignInRedirect } from "@/lib/auth";
import { addRecentlyViewed } from "@/lib/recent";
import {
  ALL_OPPORTUNITIES, arrangementLabel, budgetLabel, durationLabel, locationLabel, paidLabel, postedLabel, scheduleLabel, typeLabel, type Opportunity,
} from "@/lib/opportunities";

const backLinks = {
  internship: { to: "/internships", label: "All internships" },
  job: { to: "/jobs", label: "All jobs" },
  freelance: { to: "/freelancing", label: "All freelance projects" },
} as const;

function ApplyButton({ o }: { o: Opportunity }) {
  const { user } = useAuth();
  const signIn = useSignInRedirect();
  const apps = useApplications();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const existing = apps.data?.find((a) => a.opportunity_id === o.id);

  const apply = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("not-signed-in");
      const { error } = await supabase.from("applications").insert({
        user_id: user.id, opportunity_id: o.id, opportunity_type: o.type, cover_note: note.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      setOpen(false);
      setNote("");
      toast.success("Application tracked", { description: "You can follow it in My Applications." });
    },
    onError: () => toast.error("Couldn't submit your application. Please try again."),
  });

  if (existing) {
    return (
      <Button asChild size="lg" variant="subtle">
        <Link to="/applications"><CheckCircle2 /> Applied · view status</Link>
      </Button>
    );
  }

  return (
    <>
      <Button
        size="lg"
        onClick={() => {
          if (!user) {
            toast("Sign in to apply", { description: "You'll come straight back to this listing." });
            signIn();
            return;
          }
          setOpen(true);
        }}
      >
        {o.type === "freelance" ? "Send proposal" : "Apply through Growvia"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{o.type === "freelance" ? "Send a proposal" : "Apply"} — {o.title}</DialogTitle>
            <DialogDescription>
              This is a demo listing, so your application is tracked in your Growvia account but isn't sent to an employer.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              apply.mutate();
            }}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="cover">Short note <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Textarea id="cover" value={note} onChange={(e) => setNote(e.target.value.slice(0, 1000))} rows={5} placeholder="Why this role interests you, and one thing you'd bring to it." />
              <p className="text-right text-xs text-muted-foreground">{note.length}/1000</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={apply.isPending}>{apply.isPending ? "Submitting…" : "Submit application"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function OpportunityDetail({ o }: { o: Opportunity }) {
  useEffect(() => addRecentlyViewed(o.id), [o.id]);
  const back = backLinks[o.type];
  const related = ALL_OPPORTUNITIES.filter((x) => x.type === o.type && x.id !== o.id && (x.category === o.category || x.company.slug === o.company.slug)).slice(0, 3);

  const facts: { icon: typeof MapPin; label: string; value: string }[] = [
    { icon: MapPin, label: "Location", value: locationLabel(o) },
    { icon: Briefcase, label: "Work arrangement", value: `${arrangementLabel[o.arrangement]} · ${scheduleLabel[o.schedule]}` },
  ];
  if (o.type === "internship") facts.push({ icon: Clock, label: "Duration", value: durationLabel(o.durationMonths) ?? "Not stated" });
  if (o.type === "job" && o.experienceLevel) facts.push({ icon: Users, label: "Experience level", value: o.experienceLevel });
  if (o.type === "freelance") {
    facts.push({ icon: Wallet, label: "Budget", value: o.budget ? `${budgetLabel(o.budget)} (demo)` : "Not provided by client" });
    if (o.projectLength) facts.push({ icon: Clock, label: "Project length", value: o.projectLength });
  } else {
    facts.push({ icon: Wallet, label: "Compensation", value: `${paidLabel(o.paid)} · amount not verified` });
  }
  facts.push({ icon: CalendarClock, label: o.type === "freelance" ? "Deadline" : "Application deadline", value: "Not verified" });

  return (
    <div className="animate-page">
      <div className="border-b bg-surface">
        <div className="container-page py-8 md:py-10">
          <Link to={back.to} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> {back.label}
          </Link>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <CompanyMark name={o.company.name} className="size-14 text-base" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="blue">{typeLabel[o.type]}</Badge>
                  <Badge variant="muted">{o.category}</Badge>
                  <DemoBadge />
                </div>
                <h1 className="mt-2.5 text-2xl font-semibold text-navy md:text-[2rem] md:leading-tight">{o.title}</h1>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Building2 className="size-4" />{o.company.name}</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" />{locationLabel(o)}</span>
                  <span>{postedLabel(o.postedDaysAgo)}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2 md:shrink-0">
              <ApplyButton o={o} />
              <SaveButton o={o} variant="full" />
            </div>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-10">
          <section>
            <h2 className="text-lg font-semibold text-navy">About the {o.type === "freelance" ? "project" : "role"}</h2>
            <p className="mt-3 leading-relaxed text-foreground/85">{o.description}</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-navy">{o.type === "freelance" ? "Scope of work" : "What you'll do"}</h2>
            <ul className="mt-3 grid gap-2.5">
              {o.responsibilities.map((r) => (
                <li key={r} className="flex gap-3 leading-relaxed text-foreground/85">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-navy">Required skills</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {o.skills.map((s) => <li key={s}><Badge variant="outline" className="px-2.5 py-1 text-sm font-normal">{s}</Badge></li>)}
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-navy">{o.type === "freelance" ? "Who should apply" : "Eligibility"}</h2>
            <ul className="mt-3 grid gap-2.5">
              {o.eligibility.map((r) => (
                <li key={r} className="flex gap-3 leading-relaxed text-foreground/85">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </section>
          <div className="flex items-start gap-3 rounded-lg border bg-surface p-4 text-sm text-muted-foreground">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
            <p>This is sample content from a fictional organisation, shown so you can explore how Growvia works. Pay amounts and deadlines are not verified. Never pay a fee to apply for any opportunity.</p>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="surface-card p-5">
            <h2 className="text-sm font-semibold">Key details</h2>
            <dl className="mt-4 grid gap-4">
              {facts.map((f) => (
                <div key={f.label} className="flex gap-3">
                  <f.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-muted-foreground">{f.label}</dt>
                    <dd className="text-sm font-medium text-foreground">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
          <div className="surface-card p-5">
            <div className="flex items-center gap-3">
              <CompanyMark name={o.company.name} className="size-10" />
              <div>
                <h2 className="text-sm font-semibold">{o.company.name}</h2>
                <p className="text-xs text-muted-foreground">{o.company.industry} · {o.company.size} people</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{o.company.about}</p>
            <p className="mt-3 text-xs text-muted-foreground">Headquarters: {o.company.hq} · Fictional demo organisation</p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="container-page">
          <h2 className="text-lg font-semibold text-navy">Similar {o.type === "freelance" ? "projects" : o.type === "job" ? "jobs" : "internships"}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => <OpportunityCard key={r.id} o={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}

export function OpportunityNotFound({ kind }: { kind: "internship" | "job" | "freelance" }) {
  const back = backLinks[kind];
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-semibold text-navy">This listing isn't available</h1>
      <p className="mt-2 text-muted-foreground">It may have been removed or the link is incorrect.</p>
      <Button asChild className="mt-6"><Link to={back.to}>{back.label}</Link></Button>
    </div>
  );
}
