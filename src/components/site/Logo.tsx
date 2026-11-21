import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8", className)}>
      <rect width="32" height="32" rx="7" className="fill-navy" />
      <path
        d="M8 21.5 13.5 16l4 4L24 12.5"
        fill="none"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-teal"
      />
      <path
        d="M19.5 12.5H24V17"
        fill="none"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-navy-foreground"
      />
    </svg>
  );
}

export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <Link
      to="/"
      className={cn("inline-flex items-center gap-2.5 rounded-md", className)}
      aria-label="Growvia home"
    >
      <LogoMark />
      <span
        className={cn(
          "text-[1.0625rem] font-semibold tracking-tight",
          tone === "light" ? "text-navy-foreground" : "text-navy",
        )}
      >
        Growvia
      </span>
    </Link>
  );
}
