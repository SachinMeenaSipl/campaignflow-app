import { NextResponse } from "next/server";

import { getCampaignTemplateAndRecipients } from "@/lib/data";
import { renderTemplate } from "@/lib/mailer";
import { enqueueCampaign } from "@/lib/queue";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    campaignId?: string;
  };

  if (!body.campaignId) {
    return NextResponse.json({ message: "Campaign id is required." }, { status: 400 });
  }

  const result = await getCampaignTemplateAndRecipients(body.campaignId);
  const campaign = result?.campaign;
  const template = result?.template;
  const list = result?.list;

  if (!result || !campaign || !template || !list) {
    return NextResponse.json({ message: "Campaign, template, or list not found." }, { status: 404 });
  }

  const recipients = result.recipients.filter((contact) => contact.status === "active");

  const preview = recipients.slice(0, 3).map((recipient) => ({
    email: recipient.email,
    rendered: renderTemplate(template.htmlContent, {
      name: recipient.name,
      email: recipient.email,
      company: "CampaignFlow"
    })
  }));

  const queueMeta = await enqueueCampaign({
    campaignId: campaign.id,
    templateId: template.id,
    recipients: recipients.map((recipient) => ({
      name: recipient.name,
      email: recipient.email
    }))
  });

  return NextResponse.json({
    message: "Campaign queued for sending.",
    queued: recipients.length,
    queue: queueMeta,
    preview
  });
}
