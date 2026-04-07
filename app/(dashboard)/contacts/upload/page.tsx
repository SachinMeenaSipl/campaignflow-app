import { PageHeader } from "@/components/dashboard/page-header";
import { FileUploadZone } from "@/components/FileUpload/file-upload-zone";

export default function UploadContactsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Import contacts"
        title="Upload a CSV or XLSX file"
        description="The route handler parses your file, stores a list record, and materializes individual contacts for campaign selection."
      />
      <FileUploadZone />
    </div>
  );
}
