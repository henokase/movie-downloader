import type { ReactNode } from "react";

// Friendly full-width state for empty results and inline errors.
export default function EmptyState({
  icon,
  title,
  hint,
  action,
  tone = "muted",
}: {
  icon: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
  tone?: "muted" | "error" | "warn";
}) {
  const tones = {
    muted: "border-zinc-800 bg-zinc-900/50 text-zinc-400",
    error: "border-red-900/60 bg-red-950/40 text-red-200",
    warn: "border-amber-900/60 bg-amber-950/40 text-amber-200",
  } as const;
  const iconTones = {
    muted: "bg-zinc-800 text-zinc-400",
    error: "bg-red-900/60 text-red-300",
    warn: "bg-amber-900/60 text-amber-300",
  } as const;

  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-2xl border px-6 py-12 text-center ${tones[tone]}`}
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconTones[tone]}`}
      >
        {icon}
      </span>
      <p className="text-base font-semibold text-zinc-100">{title}</p>
      {hint && <p className="max-w-md text-sm leading-relaxed">{hint}</p>}
      {action}
    </div>
  );
}
