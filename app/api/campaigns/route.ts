import { NextResponse } from "next/server";

import {
  addEmailLogs,
  createCampaign,
  getCampaigns,
  getContactListById,
  getContactsByListId,
  getTemplateById
} from "@/lib/data";
import { enqueueCampaign } from "@/lib/queue";

export async function GET() {
  return NextResponse.json({ campaigns: await getCampaigns() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    templateId?: string;
    contactListId?: string;
    scheduledAt?: string;
  };

  if (!body.name || !body.templateId || !body.contactListId) {
    return NextResponse.json(
      { message: "Campaign name, template, and contact list are required." },
      { status: 400 }
    );
  }

  const [template, list, contactRecords] = await Promise.all([
    getTemplateById(body.templateId),
    getContactListById(body.contactListId),
    getContactsByListId(body.contactListId)
  ]);
  const recipients = contactRecords.filter((contact) => contact.status === "active");

  if (!template || !list) {
    return NextResponse.json({ message: "Template or contact list could not be found." }, { status: 404 });
  }

  const campaign = await createCampaign({
    name: body.name,
    templateId: body.templateId,
    contactListId: body.contactListId,
    scheduledAt: body.scheduledAt
  });

  const queueMeta = await enqueueCampaign({
    campaignId: campaign.id,
    templateId: template.id,
    recipients: recipients.map((recipient) => ({
      name: recipient.name,
      email: recipient.email
    }))
  });

  const logs = await addEmailLogs(
    campaign.id,
    recipients.map((recipient) => ({
      email: recipient.email,
      recipientName: recipient.name
    }))
  );

  return NextResponse.json(
    {
      message: "Campaign created.",
      campaign,
      queue: queueMeta,
      logsCreated: logs.length
    },
    { status: 201 }
  );
}
