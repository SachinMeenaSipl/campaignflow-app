import { PageHeader } from "@/components/dashboard/page-header";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { getContactLists, getTemplates } from "@/lib/data";

export default async function CreateCampaignPage() {
  const [templateRecords, listRecords] = await Promise.all([getTemplates(), getContactLists()]);
  const templates = templateRecords.map((template) => ({
    id: template.id,
    name: template.name
  }));

  const lists = listRecords.map((list) => ({
    id: list.id,
    name: list.name,
    count: list.contactCount
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Launch campaign"
        title="Create a bulk send"
        description="Pick a template, pick a contact list, and optionally schedule the send before it moves into the queue."
      />
      <CampaignForm templates={templates} lists={lists} />
    </div>
  );
}
