import { PageHeader } from "@/components/dashboard/page-header";
import { TemplateEditor } from "@/components/EmailEditor/template-editor";

export default function CreateTemplatePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Create template"
        title="Draft a reusable email"
        description="Use merge tags, add a subject line, and save the content so it can be attached to campaigns on the timeline."
      />
      <TemplateEditor />
    </div>
  );
}
