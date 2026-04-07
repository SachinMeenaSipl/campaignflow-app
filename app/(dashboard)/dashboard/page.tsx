import Link from "next/link";
import { Activity, FileText, MailCheck, Users } from "lucide-react";
import { format } from "date-fns";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getCampaigns, getDashboardStats, getRecentEmailLogs, getTemplates } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

import { StatsCard } from "./components/StatsCard";
import { Timeline } from "./components/Timeline";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const campaigns = (await getCampaigns()).slice(0, 4);
  const templates = (await getTemplates()).slice(0, 3);
  const recentLogs = await getRecentEmailLogs(5);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mission control"
        title="Timeline-driven campaign dashboard"
        description="Track the full 131-day runway, watch delivery performance, and move from template drafting to queued sends without leaving the dashboard."
        actions={
          <>
            <Link href="/contacts/upload">
              <Button variant="secondary">Upload contacts</Button>
            </Link>
            <Link href="/templates/create">
              <Button>Create template</Button>
            </Link>
          </>
        }
      />

      <Timeline />

      <section className="grid gap-6 xl:grid-cols-4">
        <StatsCard
          label="Emails sent"
          value={formatNumber(stats.emailsSent)}
          change="Across completed and active campaigns"
          icon={<MailCheck className="h-6 w-6" />}
        />
        <StatsCard
          label="Pending campaigns"
          value={formatNumber(stats.pendingCampaigns)}
          change="Draft, queued, scheduled, or actively sending"
          icon={<Activity className="h-6 w-6" />}
        />
        <StatsCard
          label="Active templates"
          value={formatNumber(stats.activeTemplates)}
          change="Ready to attach to a campaign"
          icon={<FileText className="h-6 w-6" />}
        />
        <StatsCard
          label="Contacts uploaded"
          value={formatNumber(stats.uploadedContacts)}
          change="Deduplicated recipients across all lists"
          icon={<Users className="h-6 w-6" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active campaigns</CardTitle>
              <CardDescription>Recent sends and scheduled runs tied to the global timeline.</CardDescription>
            </div>
            <Link href="/campaigns" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400 border-b border-white/5">
                <tr>
                  <th className="pb-3 font-medium">Campaign</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Sent</th>
                  <th className="pb-3 font-medium">Open rate</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign: any) => (
                  <tr key={campaign.id} className="border-b border-white/5 last:border-0 group hover:bg-white/5 transition-colors">
                    <td className="py-4 pl-2 rounded-l-lg">
                      <Link href={`/campaigns/${campaign.id}`} className="font-semibold text-slate-100 group-hover:text-primary transition-colors">
                        {campaign.name}
                      </Link>
                    </td>
                    <td className="py-4">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="py-4 text-slate-300">{formatNumber(campaign.sentCount)}</td>
                    <td className="py-4 text-slate-300 rounded-r-lg">{campaign.openRate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Templates in rotation</CardTitle>
                <CardDescription>Variables and subjects ready for bulk sends.</CardDescription>
              </div>
              <Link href="/templates" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                Manage
              </Link>
            </div>

            <div className="space-y-4">
              {templates.map((template: any) => (
                <div key={template.id} className="rounded-2xl border border-white/5 bg-black/20 p-4 hover:border-white/10 transition-colors">
                  <p className="font-semibold text-slate-100">{template.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{template.subject}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {template.variables.map((variable: any) => (
                      <span key={variable} className="rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-slate-300">
                        {`{{${variable}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-6">
            <div>
              <CardTitle>Email activity</CardTitle>
              <CardDescription>Most recent recipient-level delivery events.</CardDescription>
            </div>
            <div className="space-y-4">
              {recentLogs.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-black/20 p-4 hover:border-white/10 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-100">{log.recipientName}</p>
                    <p className="text-sm text-slate-400">{log.email}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={log.status} />
                    <p className="mt-2 text-xs text-slate-500">{format(new Date(log.updatedAt), "d MMM, HH:mm")}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
