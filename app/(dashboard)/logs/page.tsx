import { format } from "date-fns";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getEmailLogs } from "@/lib/data";

export default async function LogsPage() {
  const logs = await getEmailLogs();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Email logs"
        title="Recipient-level delivery tracking"
        description="Inspect queued, sent, and failed messages with timestamps so campaign outcomes stay auditable."
      />

      <Card className="space-y-5">
        <div>
          <CardTitle>Logs table</CardTitle>
          <CardDescription>Every row can later be backed by your persistent `EmailLog` table in Prisma.</CardDescription>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3 font-medium">Recipient</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Opened</th>
                <th className="pb-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-slate-100">
                  <td className="py-4 font-semibold text-slate-950">{log.recipientName}</td>
                  <td className="py-4 text-slate-600">{log.email}</td>
                  <td className="py-4">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="py-4 text-slate-600">{log.opened ? "Yes" : "No"}</td>
                  <td className="py-4 text-slate-600">{format(new Date(log.updatedAt), "d MMM yyyy, HH:mm")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
