import { CalendarClock, Flag, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { getMilestones, getTimelineBreakdown, getTimelineMetrics } from "@/lib/timeline";
import { formatPercent } from "@/lib/utils";

export function Timeline() {
  const metrics = getTimelineMetrics();
  const breakdown = getTimelineBreakdown();
  const milestones = getMilestones();

  return (
    <Card className="overflow-hidden p-0 relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
      <div className="grid gap-8 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8 relative z-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Global timeline</p>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h3 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">
                  {metrics.startLabel} to {metrics.endLabel}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Total duration: 4 months + 9 days across a 131-day execution window. Today sits on day{" "}
                  {metrics.currentDay}.
                </p>
              </div>
              <div className="rounded-2xl bg-black/40 border border-white/5 px-5 py-4 text-white backdrop-blur-md shadow-inner">
                <p className="text-xs uppercase tracking-widest text-slate-400">Completed</p>
                <p className="mt-2 text-3xl font-bold text-primary">{formatPercent(metrics.progress)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm font-medium text-slate-500">
              <span>Day 1</span>
              <span>Day {metrics.totalDays}</span>
            </div>
            <div className="relative h-6 rounded-full bg-slate-900/80 p-1 shadow-inner border border-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-primary via-indigo-500 to-cyan-400 shadow-[0_0_15px_rgba(124,58,237,0.5)]" style={{ width: `${metrics.progress}%` }} />

              {milestones.map((milestone) => (
                <div
                  key={milestone.label}
                  className="absolute top-1/2 h-8 w-0.5 -translate-y-1/2 bg-white/20 shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                  style={{ left: `${(milestone.day / metrics.totalDays) * 100}%` }}
                />
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 transition hover:bg-slate-900/60">
                <div className="flex items-center gap-3 text-primary">
                  <CalendarClock className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-widest">Current day</p>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-100">{metrics.currentDay}</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 transition hover:bg-slate-900/60">
                <div className="flex items-center gap-3 text-indigo-400">
                  <TrendingUp className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-widest">Live progress</p>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-100">{formatPercent(metrics.progress)}</p>
              </div>
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 transition hover:bg-cyan-500/20">
                <div className="flex items-center gap-3 text-cyan-400">
                  <Flag className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-widest">Today</p>
                </div>
                <p className="mt-3 text-2xl font-bold text-cyan-50">{metrics.todayLabel}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-black/30 border border-white/5 p-6 text-slate-100 backdrop-blur-md">
            <p className="text-xs uppercase tracking-widest text-slate-400">Month-by-month days</p>
            <div className="mt-5 space-y-4">
              {breakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-white/10 pb-4 text-sm last:border-none last:pb-0">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="font-semibold text-slate-100">{item.days} days</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md hover:bg-slate-900/60 transition">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Milestones</p>
            <div className="mt-5 space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone.label} className="flex items-center justify-between gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-slate-100">{milestone.label}</p>
                    <p className="text-slate-400">{milestone.date}</p>
                  </div>
                  <span className="rounded-full bg-primary/20 border border-primary/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary shadow-[0_0_10px_rgba(124,58,237,0.1)]">
                    Day {milestone.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
