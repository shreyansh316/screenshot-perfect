import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, Search, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOCATIONS, type OpportunityType } from "@/lib/opportunities";
import { cn } from "@/lib/utils";

export function HeroSearch({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<"" | OpportunityType>("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const search = {
      ...(q.trim() ? { q: q.trim() } : {}),
      ...(location ? { location } : {}),
    };
    if (type === "internship") navigate({ to: "/internships", search });
    else if (type === "job") navigate({ to: "/jobs", search });
    else if (type === "freelance") navigate({ to: "/freelancing", search });
    else navigate({ to: "/explore", search });
  };

  const field = "flex items-center gap-2.5 px-4 py-3 md:py-0";
  const control =
    "w-full min-w-0 bg-transparent text-[0.9375rem] text-foreground placeholder:text-muted-foreground focus:outline-none";

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn(
        "surface-card grid divide-y p-1.5 shadow-pop md:h-16 md:grid-cols-[1.5fr_1fr_1fr_auto] md:divide-x md:divide-y-0",
        className,
      )}
    >
      <label className={field}>
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Role, company or skill</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Role, company or skill"
          className={control}
        />
      </label>
      <label className={field}>
        <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Location</span>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={cn(control, "cursor-pointer")}
        >
          <option value="">Any location</option>
          <option value="Remote">Remote</option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <label className={field}>
        <Layers className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Opportunity type</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "" | OpportunityType)}
          className={cn(control, "cursor-pointer")}
        >
          <option value="">All types</option>
          <option value="internship">Internships</option>
          <option value="job">Jobs</option>
          <option value="freelance">Freelance</option>
        </select>
      </label>
      <div className="p-1.5 md:p-0 md:pl-1.5">
        <Button type="submit" size="lg" className="h-12 w-full md:h-full md:px-7">
          Search
        </Button>
      </div>
    </form>
  );
}
