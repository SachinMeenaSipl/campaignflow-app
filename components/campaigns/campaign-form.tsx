"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CampaignFormProps = {
  templates: Array<{ id: string; name: string }>;
  lists: Array<{ id: string; name: string; count: number }>;
};

export function CampaignForm({ templates, lists }: CampaignFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const body = {
      name: formData.get("name"),
      templateId: formData.get("templateId"),
      contactListId: formData.get("contactListId"),
      scheduledAt: formData.get("scheduledAt") || undefined
    };

    const response = await fetch("/api/campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const payload = (await response.json()) as { campaign?: { id: string }; message?: string };

    if (!response.ok) {
      setMessage(payload.message ?? "Unable to create campaign.");
      setLoading(false);
      return;
    }

    router.push(payload.campaign ? `/campaigns/${payload.campaign.id}` : "/campaigns");
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <div className="space-y-4 rounded-[32px] border border-white/70 bg-white p-6 shadow-soft">
        <Input name="name" placeholder="Campaign name" required />

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="templateId">
            Template
          </label>
          <select
            id="templateId"
            name="templateId"
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            required
          >
            <option value="">Select a template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="contactListId">
            Contact list
          </label>
          <select
            id="contactListId"
            name="contactListId"
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            required
          >
            <option value="">Choose a list</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name} ({list.count} contacts)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="scheduledAt">
            Schedule time (optional)
          </label>
          <Input id="scheduledAt" name="scheduledAt" type="datetime-local" />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create campaign"}
        </Button>

        {message ? <p className="text-sm text-rose-700">{message}</p> : null}
      </div>

      <div className="space-y-6">
        <div className="rounded-[32px] border border-white/70 bg-slate-950 p-6 text-slate-50 shadow-soft">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Delivery flow</p>
          <ol className="mt-4 space-y-4 text-sm leading-7 text-slate-200">
            <li>1. Create campaign record with selected template and list.</li>
            <li>2. Queue recipients into BullMQ when `REDIS_URL` exists.</li>
            <li>3. Fall back to mock queue metadata in local MVP mode.</li>
            <li>4. Capture per-recipient status inside `EmailLog` records.</li>
          </ol>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">Scale guardrails</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            <li>Retry strategy is prepared in the queue wrapper.</li>
            <li>Mailer utility swaps to Resend automatically when env vars are present.</li>
            <li>Route handlers keep the shape ready for Prisma persistence.</li>
          </ul>
        </div>
      </div>
    </form>
  );
}
