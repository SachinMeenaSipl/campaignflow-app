import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-slate-900/30 p-6 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-end lg:justify-between relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl rounded-tl-none -mr-16 -mt-16 pointer-events-none transition duration-700 group-hover:bg-primary/20"></div>
      <div className="space-y-3 relative z-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">{title}</h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex items-center gap-3 relative z-10">{actions}</div> : null}
    </div>
  );
}
