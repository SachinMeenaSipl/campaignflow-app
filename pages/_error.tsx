import type { NextPageContext } from "next";

type ErrorPageProps = {
  statusCode?: number;
};

function ErrorPage({ statusCode }: ErrorPageProps) {
  return (
    <main className="surface-grid flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl rounded-[32px] border border-white/70 bg-white/90 p-10 text-center shadow-soft backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">CampaignFlow</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          {statusCode ? `Error ${statusCode}` : "Unexpected error"}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          The request could not be completed. Refresh the page or return to the dashboard.
        </p>
      </div>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;
  return { statusCode };
};

export default ErrorPage;
