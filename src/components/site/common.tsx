import { useEffect, useRef, useState, type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b bg-surface", className)}>
      <div className="container-page py-10 md:py-14">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold text-navy md:text-[2.5rem] md:leading-[1.15]">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}
    >
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 text-2xl font-semibold text-navy md:text-[1.75rem]">{title}</h2>
        {description && (
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg border border-dashed bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      <span className="grid size-11 place-items-center rounded-full bg-blue-soft text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function CompanyMark({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  // Deterministic tint so each company keeps the same mark
  const tints = [
    "bg-blue-soft text-primary",
    "bg-teal-soft text-teal",
    "bg-navy text-navy-foreground",
    "bg-muted text-navy",
    "bg-warning-soft text-warning",
  ];
  const idx = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % tints.length;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-md text-sm font-semibold",
        tints[idx],
        className,
      )}
    >
      {initials}
    </span>
  );
}

/** Fades content in when it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      data-visible={visible}
      className={cn("reveal", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number;
  label: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div
        className="h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="animate-grow h-full rounded-full bg-teal transition-[width] duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
