import { notFound } from "next/navigation";
import { format } from "date-fns";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getCampaignById } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

export default async function CampaignDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await getCampaignById(id);

  if (!campaign) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Campaign detail"
        title={campaign.name}
        description="Track the send state, attached template, selected list, and recipient-level logs from one view."
      />

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="space-y-3">
          <CardTitle>Status</CardTitle>
          <StatusBadge status={campaign.status} />
          <CardDescription>Created {format(new Date(campaign.createdAt), "d MMM yyyy, HH:mm")}</CardDescription>
        </Card>
        <Card className="space-y-3">
          <CardTitle>Template</CardTitle>
          <p className="font-semibold text-slate-950">{campaign.template?.name ?? "Unknown template"}</p>
          <CardDescription>{campaign.template?.subject ?? "No subject"}</CardDescription>
        </Card>
        <Card className="space-y-3">
          <CardTitle>Audience</CardTitle>
          <p className="font-semibold text-slate-950">{campaign.list?.name ?? "Unknown list"}</p>
          <CardDescription>{campaign.list?.contactCount ?? 0} contacts in selected list</CardDescription>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-5">
          <div>
            <CardTitle>Delivery summary</CardTitle>
            <CardDescription>Top-level campaign metrics.</CardDescription>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sent</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{formatNumber(campaign.sentCount)}</p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Failed</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{formatNumber(campaign.failedCount)}</p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Open rate</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{campaign.openRate.toFixed(1)}%</p>
            </div>
          </div>
          {campaign.scheduledAt ? (
            <p className="text-sm text-muted-foreground">Scheduled for {format(new Date(campaign.scheduledAt), "d MMM yyyy, HH:mm")}</p>
          ) : null}
        </Card>

        <Card className="space-y-5">
          <div>
            <CardTitle>Email logs</CardTitle>
            <CardDescription>Recipient-level status records for this campaign.</CardDescription>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-3 font-medium">Recipient</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {campaign.logs.map((log) => (
                  <tr key={log.id} className="border-t border-slate-100">
                    <td className="py-4 font-semibold text-slate-950">{log.recipientName}</td>
                    <td className="py-4 text-slate-600">{log.email}</td>
                    <td className="py-4">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="py-4 text-slate-600">{format(new Date(log.updatedAt), "d MMM, HH:mm")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
