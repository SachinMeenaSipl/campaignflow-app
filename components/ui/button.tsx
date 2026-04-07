import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]",
  secondary:
    "border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:border-white/20",
  ghost: "text-slate-200 hover:bg-white/5",
  danger: "bg-danger text-white shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:bg-rose-600"
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
