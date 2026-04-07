import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { TemplateEditor } from "@/components/EmailEditor/template-editor";
import { getTemplateById } from "@/lib/data";

export default async function TemplateDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = await getTemplateById(id);

  if (!template) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Template detail"
        title={template.name}
        description="Refine HTML content, update the preview text, and keep merge variables accurate before launch."
      />
      <TemplateEditor
        templateId={template.id}
        initialName={template.name}
        initialSubject={template.subject}
        initialHtml={template.htmlContent}
        initialPreviewText={template.previewText}
      />
    </div>
  );
}
