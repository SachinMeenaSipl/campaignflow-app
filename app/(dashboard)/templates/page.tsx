import Link from "next/link";
import { format } from "date-fns";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getTemplates } from "@/lib/data";

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Email templates"
        title="Reusable campaign messaging"
        description="Store multiple drafts, support merge variables like `{{name}}`, and keep subject lines, previews, and HTML content ready for campaign launches."
        actions={
          <Link href="/templates/create">
            <Button>Create template</Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {templates.map((template) => (
          <Card key={template.id} className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription className="mt-2">{template.previewText}</CardDescription>
              </div>
              <Link href={`/templates/${template.id}`} className="text-sm font-semibold text-slate-950">
                Edit
              </Link>
            </div>

            <div className="rounded-[24px] bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">{template.subject}</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{template.htmlContent}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {template.variables.map((variable) => (
                <span key={variable} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                  {`{{${variable}}}`}
                </span>
              ))}
            </div>

            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Updated {format(new Date(template.updatedAt), "d MMM yyyy, HH:mm")}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
