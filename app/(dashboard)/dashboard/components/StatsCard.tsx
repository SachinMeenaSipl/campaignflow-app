import type { ReactNode } from "react";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";

type StatsCardProps = {
  label: string;
  value: string;
  change: string;
  icon: ReactNode;
};

export function StatsCard({ label, value, change, icon }: StatsCardProps) {
  return (
    <Card className="space-y-4 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition duration-500"></div>
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
          <CardTitle className="mt-2 text-4xl">{value}</CardTitle>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[inset_0_0_12px_rgba(124,58,237,0.2)]">{icon}</div>
      </div>
      <CardDescription className="relative z-10">{change}</CardDescription>
    </Card>
  );
}
