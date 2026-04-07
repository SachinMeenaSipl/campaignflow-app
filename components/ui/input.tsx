import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100",
        className
      )}
      {...props}
    />
  );
}
