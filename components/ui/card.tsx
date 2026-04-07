import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-slate-900/60 hover:border-white/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
  return (
    <h3
      className={cn("text-lg font-bold tracking-tight text-slate-100", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>) {
  return (
    <p className={cn("text-sm text-slate-400 font-medium", className)} {...props}>
      {children}
    </p>
  );
}
