import Link from "next/link";
import { format } from "date-fns";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getContactLists, getContacts } from "@/lib/data";

export default async function ContactsPage() {
  const [lists, contacts] = await Promise.all([getContactLists(), getContacts()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Contact lists"
        title="Audience uploads and hygiene"
        description="Upload CSV or XLSX lists, store normalized contacts, and keep unsubscribed recipients out of future sends."
        actions={
          <Link href="/contacts/upload">
            <Button>Upload file</Button>
          </Link>
        }
      />

      <section className="grid gap-6 lg:grid-cols-2">
        {lists.map((list) => (
          <Card key={list.id} className="space-y-3">
            <CardTitle>{list.name}</CardTitle>
            <CardDescription>{list.source}</CardDescription>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{list.contactCount} contacts</span>
              <span>{format(new Date(list.createdAt), "d MMM yyyy")}</span>
            </div>
          </Card>
        ))}
      </section>

      <Card className="space-y-5">
        <div>
          <CardTitle>Recent contacts</CardTitle>
          <CardDescription>Records parsed from uploaded lists.</CardDescription>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">List</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => {
                const list = lists.find((entry) => entry.id === contact.listId);
                return (
                  <tr key={contact.id} className="border-t border-slate-100">
                    <td className="py-4 font-semibold text-slate-950">{contact.name}</td>
                    <td className="py-4 text-slate-600">{contact.email}</td>
                    <td className="py-4 text-slate-600">{list?.name ?? "Unknown"}</td>
                    <td className="py-4">
                      <StatusBadge status={contact.status} />
                    </td>
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
