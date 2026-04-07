import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  default: "bg-slate-900 border border-slate-700 text-slate-300 shadow-[0_0_10px_rgba(255,255,255,0.05)]",
  success: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
  warning: "bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
  danger: "bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-[0_0_10px_rgba(225,29,72,0.1)]"
};

export function Badge({
  children,
  className,
  tone = "default",
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLSpanElement>> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
