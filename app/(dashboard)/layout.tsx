import Link from "next/link";
import { Bell, Search } from "lucide-react";

import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-6 sm:px-6 xl:px-8">
      <DashboardSidebar />

      <div className="min-w-0 flex-1 space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-slate-900/50 px-6 py-5 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Campaign operations</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-100">Control room</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-11 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-slate-400 transition-colors focus-within:border-primary/50 focus-within:bg-black/40">
              <Search className="h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search templates, contacts, campaigns..." 
                className="bg-transparent outline-none placeholder:text-slate-500 text-slate-200 w-56"
              />
            </div>
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-slate-400 transition hover:bg-white/5 hover:text-slate-200">
              <Bell className="h-4 w-4" />
            </button>
            <Link
              href="/campaigns/create"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] transition hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]"
            >
              Launch campaign
            </Link>
          </div>
        </header>

        {children}
      </div>
    </main>
  );
}
