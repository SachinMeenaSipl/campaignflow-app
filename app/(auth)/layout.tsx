export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="surface-grid flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/70 bg-white/80 shadow-soft backdrop-blur">
        <div className="grid min-h-[720px] lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden bg-slate-950 px-10 py-12 text-slate-50 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">CampaignFlow</p>
              <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight">
                Plan every send on a single campaign runway.
              </h1>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <p className="text-sm leading-7 text-slate-200">
                Map the full timeline from April 7, 2026 to August 16, 2026, ship campaigns in controlled batches,
                and keep the queue, templates, and delivery logs in one place.
              </p>
            </div>
          </section>

          <section className="flex items-center justify-center p-6 sm:p-10">{children}</section>
        </div>
      </div>
    </main>
  );
}
