import { useId, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
  hint?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
  autoComplete?: string;
}

export function Field({ label, value, onChange, error, hint, required, type = "text", placeholder, multiline, rows = 4, className, autoComplete }: FieldProps) {
  const id = useId();
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    value,
    placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    "aria-required": required || undefined,
    className: cn("bg-surface", error && "border-destructive focus-visible:ring-destructive"),
  };
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive" aria-hidden="true"> *</span>}
      </Label>
      {multiline ? (
        <Textarea {...common} rows={rows} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input {...common} type={type} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <p id={`${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p id={`${id}-err`} className="text-xs font-medium text-destructive" role="alert">{error}</p>}
    </div>
  );
}

export function SelectField({ label, value, onChange, options, className }: { label: string; value: string; onChange: (v: string) => void; options: readonly (readonly [string, string])[]; className?: string }) {
  const id = useId();
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="h-9 rounded-md border border-input bg-surface px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}

/** A list of repeatable entries (education, projects…) with add, delete and reorder. */
export function EntryList<T extends { id: string }>({
  items, onChange, create, render, title, addLabel, emptyText,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  create: () => T;
  render: (item: T, index: number, patch: (p: Partial<T>) => void) => ReactNode;
  title: (item: T, index: number) => string;
  addLabel: string;
  emptyText: string;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  };
  return (
    <div className="grid gap-4">
      {items.length === 0 && <p className="rounded-md border border-dashed bg-surface px-4 py-6 text-center text-sm text-muted-foreground">{emptyText}</p>}
      {items.map((item, i) => (
        <fieldset key={item.id} className="rounded-lg border bg-surface p-4">
          <div className="mb-3 flex items-center gap-2">
            <legend className="min-w-0 flex-1 truncate text-sm font-semibold">{title(item, i)}</legend>
            <Button type="button" size="icon" variant="ghost" className="size-8" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${title(item, i)} up`}><ArrowUp /></Button>
            <Button type="button" size="icon" variant="ghost" className="size-8" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move ${title(item, i)} down`}><ArrowDown /></Button>
            {confirmId === item.id ? (
              <span className="flex items-center gap-1">
                <Button type="button" size="sm" variant="destructive" onClick={() => { onChange(items.filter((x) => x.id !== item.id)); setConfirmId(null); }}>Delete</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setConfirmId(null)}>Keep</Button>
              </span>
            ) : (
              <Button type="button" size="icon" variant="ghost" className="size-8 text-destructive hover:text-destructive" onClick={() => setConfirmId(item.id)} aria-label={`Delete ${title(item, i)}`}><Trash2 /></Button>
            )}
          </div>
          {render(item, i, (p) => onChange(items.map((x) => (x.id === item.id ? { ...x, ...p } : x))))}
        </fieldset>
      ))}
      <Button type="button" variant="outline" className="justify-self-start" onClick={() => onChange([...items, create()])}>
        <Plus /> {addLabel}
      </Button>
    </div>
  );
}

/** Type a skill and press Enter or comma to add it. */
export function TagInput({ label, values, onChange, placeholder, hint }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string; hint?: string }) {
  const id = useId();
  const [draft, setDraft] = useState("");
  const add = (raw: string) => {
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    const next = [...values];
    for (const p of parts) if (!next.some((v) => v.toLowerCase() === p.toLowerCase())) next.push(p.slice(0, 60));
    onChange(next);
    setDraft("");
  };
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      {values.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label={`${label} added`}>
          {values.map((v) => (
            <li key={v} className="inline-flex items-center gap-1 rounded-full border bg-blue-soft px-2.5 py-1 text-xs text-primary">
              {v}
              <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="rounded-full p-0.5 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Remove ${v}`}>
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          placeholder={placeholder}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="bg-surface"
          onChange={(e) => {
            const v = e.target.value;
            if (v.includes(",")) add(v);
            else setDraft(v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (draft.trim()) add(draft);
            } else if (e.key === "Backspace" && !draft && values.length) {
              onChange(values.slice(0, -1));
            }
          }}
          onBlur={() => draft.trim() && add(draft)}
        />
        <Button type="button" variant="outline" onClick={() => draft.trim() && add(draft)}>Add</Button>
      </div>
      {hint && <p id={`${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
