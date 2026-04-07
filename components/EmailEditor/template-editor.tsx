"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type TemplateEditorProps = {
  templateId?: string;
  initialName?: string;
  initialSubject?: string;
  initialHtml?: string;
  initialPreviewText?: string;
};

export function TemplateEditor({
  templateId,
  initialName = "",
  initialSubject = "",
  initialHtml = "Hi {{name}},\n\nWe are excited to offer you a faster way to launch campaigns.\n\nThanks,\nTeam",
  initialPreviewText = ""
}: TemplateEditorProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [htmlContent, setHtmlContent] = useState(initialHtml);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const body = {
      name: formData.get("name"),
      subject: formData.get("subject"),
      previewText: formData.get("previewText"),
      htmlContent
    };

    const response = await fetch(templateId ? `/api/templates/${templateId}` : "/api/templates", {
      method: templateId ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const payload = (await response.json()) as { message?: string; template?: { id: string } };

    if (!response.ok) {
      setMessage(payload.message ?? "Unable to save template.");
      setLoading(false);
      return;
    }

    setMessage(templateId ? "Template updated." : "Template created.");

    if (!templateId && payload.template?.id) {
      router.push(`/templates/${payload.template.id}`);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  const variables = Array.from(new Set(Array.from(htmlContent.matchAll(/{{\s*([\w.]+)\s*}}/g)).map((match) => match[1])));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <form action={handleSubmit} className="space-y-4 rounded-[32px] border border-white/70 bg-white p-6 shadow-soft">
        <Input name="name" defaultValue={initialName} placeholder="Template name" required />
        <Input name="subject" defaultValue={initialSubject} placeholder="Email subject line" required />
        <Textarea
          name="previewText"
          defaultValue={initialPreviewText}
          placeholder="Short preview text shown before the email opens"
          className="min-h-[96px]"
        />
        <Textarea
          name="htmlContent"
          value={htmlContent}
          onChange={(event) => setHtmlContent(event.target.value)}
          placeholder="Compose HTML or plain text with {{variables}}"
          className="min-h-[340px] font-mono"
        />

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : templateId ? "Update template" : "Save template"}
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              setHtmlContent((current) =>
                `${current}\n\nP.S. Reply if you want us to reserve a slot for {{company}}.`
              )
            }
          >
            Insert CTA
          </Button>
        </div>

        {message ? <p className="text-sm text-slate-700">{message}</p> : null}
      </form>

      <div className="space-y-6">
        <div className="rounded-[32px] border border-white/70 bg-slate-950 p-6 text-slate-50 shadow-soft">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Preview</p>
          <div className="mt-4 rounded-[24px] bg-white p-6 text-slate-900">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Rendered email</p>
            <div className="mt-4 whitespace-pre-wrap text-sm leading-7">{htmlContent}</div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">Variables detected</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {variables.length > 0 ? (
              variables.map((variable) => (
                <span
                  key={variable}
                  className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800"
                >
                  {`{{${variable}}}`}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Add placeholders like <code>{"{{name}}"}</code> or <code>{"{{email}}"}</code>.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
