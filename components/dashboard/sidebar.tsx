import Link from "next/link";
import { LayoutDashboard, Mail, Rocket, Upload, WandSparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/templates", label: "Templates", icon: WandSparkles },
  { href: "/contacts", label: "Contacts", icon: Upload },
  { href: "/campaigns", label: "Campaigns", icon: Rocket },
  { href: "/logs", label: "Email Logs", icon: Mail }
];

export function DashboardSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 xl:block">
      <div className="sticky top-6 overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 px-6 py-7 text-slate-50 shadow-2xl backdrop-blur-xl group">
        <div className="absolute top-0 left-0 w-full h-32 bg-primary/10 rounded-b-full blur-3xl -ml-16 -mt-16 pointer-events-none transition duration-700 group-hover:bg-primary/20"></div>
        <div className="mb-10 relative z-10">
          <p className="text-xs uppercase tracking-widest text-primary">CampaignFlow</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight drop-shadow-md">Bulk email with a live runway.</h1>
        </div>

        <nav className="space-y-2 relative z-10">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-primary/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-10 rounded-3xl border border-white/5 bg-black/30 p-4 relative z-10 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-widest text-slate-500">Queue status</p>
          <p className="mt-2 text-sm text-slate-300">Redis-backed delivery ready when <code className="bg-white/10 px-1 rounded text-primary">REDIS_URL</code> is configured.</p>
        </div>
      </div>
    </aside>
  );
}
