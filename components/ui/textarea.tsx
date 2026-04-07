import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100",
        className
      )}
      {...props}
    />
  );
}
