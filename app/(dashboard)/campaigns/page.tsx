import Link from "next/link";
import { format } from "date-fns";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getCampaigns, getContactLists, getTemplates } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

export default async function CampaignsPage() {
  const [campaigns, templates, lists] = await Promise.all([getCampaigns(), getTemplates(), getContactLists()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Campaign management"
        title="Plan and monitor every send"
        description="Attach templates to lists, schedule deliveries, and keep the queue status visible from draft through completion."
        actions={
          <Link href="/campaigns/create">
            <Button>Create campaign</Button>
          </Link>
        }
      />

      <Card className="space-y-5">
        <div>
          <CardTitle>Campaign table</CardTitle>
          <CardDescription>Operational view of list, template, schedule, and delivery outcomes.</CardDescription>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3 font-medium">Campaign</th>
                <th className="pb-3 font-medium">Template</th>
                <th className="pb-3 font-medium">List</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Sent</th>
                <th className="pb-3 font-medium">Open rate</th>
                <th className="pb-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => {
                const template = templates.find((entry) => entry.id === campaign.templateId);
                const list = lists.find((entry) => entry.id === campaign.contactListId);

                return (
                  <tr key={campaign.id} className="border-t border-slate-100">
                    <td className="py-4">
                      <Link href={`/campaigns/${campaign.id}`} className="font-semibold text-slate-950">
                        {campaign.name}
                      </Link>
                    </td>
                    <td className="py-4 text-slate-600">{template?.name ?? "Unknown"}</td>
                    <td className="py-4 text-slate-600">{list?.name ?? "Unknown"}</td>
                    <td className="py-4">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="py-4 text-slate-600">{formatNumber(campaign.sentCount)}</td>
                    <td className="py-4 text-slate-600">{campaign.openRate.toFixed(1)}%</td>
                    <td className="py-4 text-slate-600">{format(new Date(campaign.createdAt), "d MMM yyyy")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
