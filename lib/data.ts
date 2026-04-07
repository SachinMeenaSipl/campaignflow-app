import {
  CampaignStatus as PrismaCampaignStatus,
  ContactStatus as PrismaContactStatus,
  EmailLogStatus as PrismaEmailLogStatus,
  Prisma
} from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/db";
import type {
  CampaignRecord,
  ContactListRecord,
  ContactRecord,
  DashboardStats,
  EmailLogRecord,
  TemplateRecord,
  UserRecord
} from "@/lib/types";

const DEMO_USER_ID = "user_demo";
const DEMO_USER_EMAIL = process.env.DEMO_USER_EMAIL;
const DEMO_PASSWORD = process.env.DEMO_USER_PASSWORD;

declare global {
  // eslint-disable-next-line no-var
  var campaignFlowSeedPromise: Promise<void> | undefined;
}

const templateSeed = [
  {
    id: "tpl_product-launch",
    name: "Product launch blast",
    subject: "A faster path for {{company}} starts today",
    htmlContent:
      "<p>Hi {{name}},</p><p>We are excited to invite you to CampaignFlow. Your rollout plan is now ready for {{company}}.</p><p>Thanks,<br/>Team</p>",
    previewText: "Launch email with dynamic company and recipient placeholders.",
    variables: ["name", "email", "company"],
    updatedAt: new Date("2026-04-05T10:00:00.000Z")
  },
  {
    id: "tpl_follow-up",
    name: "Warm lead follow-up",
    subject: "{{name}}, your team can still join the August wave",
    htmlContent:
      "<p>Hi {{name}},</p><p>We saved a slot for your team. If you would like to resume the conversation, reply here and we will line everything up.</p><p>Regards,<br/>Growth Team</p>",
    previewText: "Follow-up note for leads that opened but did not convert.",
    variables: ["name", "email"],
    updatedAt: new Date("2026-04-06T07:45:00.000Z")
  },
  {
    id: "tpl_newsletter",
    name: "Monthly narrative update",
    subject: "{{name}}, here is what shipped this month",
    htmlContent:
      "<p>Hello {{name}},</p><p>We shipped a cleaner queue monitor, better contact hygiene, and simpler campaign logs.</p><p>See you next month,<br/>CampaignFlow</p>",
    previewText: "Editorial-style update for retained audiences.",
    variables: ["name", "email"],
    updatedAt: new Date("2026-04-07T06:10:00.000Z")
  }
] as const;

const contactListSeed = [
  {
    id: "list_april_wave",
    name: "April launch prospects",
    source: "april-launch.csv",
    createdAt: new Date("2026-04-07T08:00:00.000Z")
  },
  {
    id: "list_founders",
    name: "Founder circle",
    source: "founder-network.xlsx",
    createdAt: new Date("2026-04-06T14:30:00.000Z")
  }
] as const;

const contactSeed = [
  { id: "contact_1", listId: "list_april_wave", name: "John Carter", email: "john@gmail.com", status: PrismaContactStatus.ACTIVE },
  { id: "contact_2", listId: "list_april_wave", name: "Sam Rivera", email: "sam@gmail.com", status: PrismaContactStatus.ACTIVE },
  { id: "contact_3", listId: "list_april_wave", name: "Ava Lee", email: "ava@gmail.com", status: PrismaContactStatus.ACTIVE },
  { id: "contact_4", listId: "list_april_wave", name: "Marcus Bell", email: "marcus@gmail.com", status: PrismaContactStatus.ACTIVE },
  { id: "contact_5", listId: "list_founders", name: "Ella Ford", email: "ella@gmail.com", status: PrismaContactStatus.ACTIVE },
  { id: "contact_6", listId: "list_founders", name: "Chris Nolan", email: "chris@gmail.com", status: PrismaContactStatus.ACTIVE },
  { id: "contact_7", listId: "list_founders", name: "Dina Hart", email: "dina@gmail.com", status: PrismaContactStatus.UNSUBSCRIBED }
] as const;

const campaignSeed = [
  {
    id: "camp_april_ignite",
    templateId: "tpl_product-launch",
    contactListId: "list_april_wave",
    name: "April ignite batch",
    status: PrismaCampaignStatus.SENDING,
    createdAt: new Date("2026-04-07T09:00:00.000Z"),
    scheduledAt: null,
    sentCount: 2980,
    failedCount: 23,
    openRate: 48.2
  },
  {
    id: "camp_founder_nurture",
    templateId: "tpl_follow-up",
    contactListId: "list_founders",
    name: "Founder nurture sequence",
    status: PrismaCampaignStatus.SCHEDULED,
    createdAt: new Date("2026-04-06T18:00:00.000Z"),
    scheduledAt: new Date("2026-04-12T10:30:00.000Z"),
    sentCount: 0,
    failedCount: 0,
    openRate: 0
  },
  {
    id: "camp_monthly_update",
    templateId: "tpl_newsletter",
    contactListId: "list_april_wave",
    name: "Monthly update",
    status: PrismaCampaignStatus.COMPLETED,
    createdAt: new Date("2026-04-01T08:30:00.000Z"),
    scheduledAt: null,
    sentCount: 1460,
    failedCount: 8,
    openRate: 61.4
  }
] as const;

const emailLogSeed = [
  {
    id: "log_1",
    campaignId: "camp_april_ignite",
    email: "john@gmail.com",
    recipientName: "John Carter",
    status: PrismaEmailLogStatus.SENT,
    opened: true,
    error: null,
    updatedAt: new Date("2026-04-07T10:03:00.000Z")
  },
  {
    id: "log_2",
    campaignId: "camp_april_ignite",
    email: "sam@gmail.com",
    recipientName: "Sam Rivera",
    status: PrismaEmailLogStatus.FAILED,
    opened: false,
    updatedAt: new Date("2026-04-07T10:05:00.000Z"),
    error: "Mailbox unavailable"
  },
  {
    id: "log_3",
    campaignId: "camp_monthly_update",
    email: "ella@gmail.com",
    recipientName: "Ella Ford",
    status: PrismaEmailLogStatus.SENT,
    opened: true,
    error: null,
    updatedAt: new Date("2026-04-01T08:44:00.000Z")
  },
  {
    id: "log_4",
    campaignId: "camp_founder_nurture",
    email: "chris@gmail.com",
    recipientName: "Chris Nolan",
    status: PrismaEmailLogStatus.QUEUED,
    opened: false,
    error: null,
    updatedAt: new Date("2026-04-06T18:00:00.000Z")
  }
] as const;

type TemplateWithMeta = {
  id: string;
  userId: string;
  name: string;
  subject: string;
  htmlContent: string;
  previewText: string | null;
  variables: string[];
  updatedAt: Date;
};

type ContactListWithCount = {
  id: string;
  userId: string;
  name: string;
  source: string;
  createdAt: Date;
  _count: {
    contacts: number;
  };
};

type ContactWithList = {
  id: string;
  userId: string;
  listId: string;
  name: string;
  email: string;
  status: PrismaContactStatus;
  list?: {
    id: string;
    name: string;
  };
};

type CampaignWithRelations = {
  id: string;
  userId: string;
  templateId: string;
  contactListId: string;
  name: string;
  status: PrismaCampaignStatus;
  createdAt: Date;
  scheduledAt: Date | null;
  sentCount: number;
  failedCount: number;
  openRate: number;
  template?: TemplateWithMeta;
  contactList?: ContactListWithCount;
  emailLogs?: Array<{
    id: string;
    campaignId: string;
    email: string;
    recipientName: string;
    status: PrismaEmailLogStatus;
    opened: boolean;
    error: string | null;
    updatedAt: Date;
  }>;
};

type EmailLogWithCampaign = {
  id: string;
  campaignId: string;
  email: string;
  recipientName: string;
  status: PrismaEmailLogStatus;
  opened: boolean;
  error: string | null;
  updatedAt: Date;
  campaign?: {
    id: string;
    name: string;
  };
};

function extractVariables(htmlContent: string) {
  return Array.from(
    new Set(Array.from(htmlContent.matchAll(/{{\s*([\w.]+)\s*}}/g)).map((match) => match[1]))
  );
}

function serializeTemplate(template: TemplateWithMeta): TemplateRecord {
  return {
    id: template.id,
    userId: template.userId,
    name: template.name,
    subject: template.subject,
    htmlContent: template.htmlContent,
    previewText: template.previewText ?? "",
    variables: template.variables,
    updatedAt: template.updatedAt.toISOString()
  };
}

function serializeContactList(list: ContactListWithCount): ContactListRecord {
  return {
    id: list.id,
    userId: list.userId,
    name: list.name,
    source: list.source,
    createdAt: list.createdAt.toISOString(),
    contactCount: list._count.contacts
  };
}

function serializeContact(contact: ContactWithList): ContactRecord {
  return {
    id: contact.id,
    userId: contact.userId,
    listId: contact.listId,
    name: contact.name,
    email: contact.email,
    status: contact.status.toLowerCase() as ContactRecord["status"]
  };
}

function serializeCampaign(campaign: CampaignWithRelations): CampaignRecord {
  return {
    id: campaign.id,
    userId: campaign.userId,
    templateId: campaign.templateId,
    contactListId: campaign.contactListId,
    name: campaign.name,
    status: campaign.status.toLowerCase() as CampaignRecord["status"],
    createdAt: campaign.createdAt.toISOString(),
    scheduledAt: campaign.scheduledAt?.toISOString(),
    sentCount: campaign.sentCount,
    failedCount: campaign.failedCount,
    openRate: campaign.openRate
  };
}

function serializeEmailLog(log: EmailLogWithCampaign): EmailLogRecord {
  return {
    id: log.id,
    campaignId: log.campaignId,
    email: log.email,
    recipientName: log.recipientName,
    status: log.status.toLowerCase() as EmailLogRecord["status"],
    opened: log.opened,
    updatedAt: log.updatedAt.toISOString(),
    error: log.error ?? undefined
  };
}

async function seedDemoDataInner() {
  if (!DEMO_USER_EMAIL || !DEMO_PASSWORD) {
    throw new Error("Missing DEMO_USER_EMAIL or DEMO_USER_PASSWORD in .env.");
  }

  await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: {
      email: DEMO_USER_EMAIL,
      name: "Demo Operator",
      passwordHash: DEMO_PASSWORD
    },
    create: {
      id: DEMO_USER_ID,
      email: DEMO_USER_EMAIL,
      name: "Demo Operator",
      passwordHash: DEMO_PASSWORD
    }
  });

  for (const template of templateSeed) {
    await prisma.template.upsert({
      where: { id: template.id },
      update: {
        name: template.name,
        subject: template.subject,
        htmlContent: template.htmlContent,
        previewText: template.previewText,
        variables: [...template.variables],
        updatedAt: template.updatedAt
      },
      create: {
        id: template.id,
        userId: DEMO_USER_ID,
        name: template.name,
        subject: template.subject,
        htmlContent: template.htmlContent,
        previewText: template.previewText,
        variables: [...template.variables],
        createdAt: template.updatedAt,
        updatedAt: template.updatedAt
      }
    });
  }

  for (const list of contactListSeed) {
    await prisma.contactList.upsert({
      where: { id: list.id },
      update: {
        name: list.name,
        source: list.source,
        createdAt: list.createdAt
      },
      create: {
        id: list.id,
        userId: DEMO_USER_ID,
        name: list.name,
        source: list.source,
        createdAt: list.createdAt
      }
    });
  }

  for (const contact of contactSeed) {
    await prisma.contact.upsert({
      where: { id: contact.id },
      update: {
        listId: contact.listId,
        name: contact.name,
        email: contact.email,
        status: contact.status
      },
      create: {
        id: contact.id,
        userId: DEMO_USER_ID,
        listId: contact.listId,
        name: contact.name,
        email: contact.email,
        status: contact.status
      }
    });
  }

  for (const campaign of campaignSeed) {
    await prisma.campaign.upsert({
      where: { id: campaign.id },
      update: {
        templateId: campaign.templateId,
        contactListId: campaign.contactListId,
        name: campaign.name,
        status: campaign.status,
        createdAt: campaign.createdAt,
        scheduledAt: campaign.scheduledAt ?? null,
        sentCount: campaign.sentCount,
        failedCount: campaign.failedCount,
        openRate: campaign.openRate
      },
      create: {
        id: campaign.id,
        userId: DEMO_USER_ID,
        templateId: campaign.templateId,
        contactListId: campaign.contactListId,
        name: campaign.name,
        status: campaign.status,
        createdAt: campaign.createdAt,
        scheduledAt: campaign.scheduledAt ?? null,
        sentCount: campaign.sentCount,
        failedCount: campaign.failedCount,
        openRate: campaign.openRate
      }
    });
  }

  for (const log of emailLogSeed) {
    await prisma.emailLog.upsert({
      where: { id: log.id },
      update: {
        campaignId: log.campaignId,
        email: log.email,
        recipientName: log.recipientName,
        status: log.status,
        opened: log.opened,
        error: log.error ?? null,
        updatedAt: log.updatedAt
      },
      create: {
        id: log.id,
        campaignId: log.campaignId,
        email: log.email,
        recipientName: log.recipientName,
        status: log.status,
        opened: log.opened,
        error: log.error ?? null,
        createdAt: log.updatedAt,
        updatedAt: log.updatedAt
      }
    });
  }
}

export async function ensureDemoData() {
  if (!globalThis.campaignFlowSeedPromise) {
    globalThis.campaignFlowSeedPromise = seedDemoDataInner().catch((error) => {
      globalThis.campaignFlowSeedPromise = undefined;
      throw error;
    });
  }

  await globalThis.campaignFlowSeedPromise;
}

export async function getAppUser() {
  await ensureDemoData();

  const user = await prisma.user.findUnique({
    where: { id: DEMO_USER_ID }
  });

  if (!user) {
    throw new Error("Demo workspace user not found.");
  }

  return user;
}

export async function getCurrentUserId() {
  const user = await getAppUser();
  return user.id;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  noStore();
  const userId = await getCurrentUserId();

  const [campaignAggregate, pendingCampaigns, activeTemplates, uploadedContacts] = await prisma.$transaction([
    prisma.campaign.aggregate({
      where: { userId },
      _sum: {
        sentCount: true
      }
    }),
    prisma.campaign.count({
      where: {
        userId,
        status: {
          in: [
            PrismaCampaignStatus.DRAFT,
            PrismaCampaignStatus.QUEUED,
            PrismaCampaignStatus.SCHEDULED,
            PrismaCampaignStatus.SENDING
          ]
        }
      }
    }),
    prisma.template.count({
      where: { userId }
    }),
    prisma.contact.count({
      where: { userId }
    })
  ]);

  return {
    emailsSent: campaignAggregate._sum.sentCount ?? 0,
    pendingCampaigns,
    activeTemplates,
    uploadedContacts
  };
}

export async function getTemplates() {
  noStore();
  const userId = await getCurrentUserId();
  const templates = await prisma.template.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });

  return templates.map((template) => serializeTemplate(template as TemplateWithMeta));
}

export async function getTemplateById(templateId: string) {
  noStore();
  const userId = await getCurrentUserId();
  const template = await prisma.template.findFirst({
    where: {
      id: templateId,
      userId
    }
  });

  return template ? serializeTemplate(template as TemplateWithMeta) : null;
}

export async function createTemplate(input: Pick<TemplateRecord, "name" | "subject" | "htmlContent" | "previewText">) {
  const userId = await getCurrentUserId();
  const template = await prisma.template.create({
    data: {
      userId,
      name: input.name,
      subject: input.subject,
      htmlContent: input.htmlContent,
      previewText: input.previewText,
      variables: extractVariables(input.htmlContent)
    }
  });

  return serializeTemplate(template as TemplateWithMeta);
}

export async function updateTemplate(
  templateId: string,
  input: Partial<Pick<TemplateRecord, "name" | "subject" | "htmlContent" | "previewText">>
) {
  const userId = await getCurrentUserId();
  const template = await prisma.template.findFirst({
    where: {
      id: templateId,
      userId
    }
  });

  if (!template) {
    return null;
  }

  const htmlContent = input.htmlContent ?? template.htmlContent;
  const updated = await prisma.template.update({
    where: { id: templateId },
    data: {
      name: input.name,
      subject: input.subject,
      htmlContent,
      previewText: input.previewText,
      variables: extractVariables(htmlContent)
    }
  });

  return serializeTemplate(updated as TemplateWithMeta);
}

export async function getContactLists() {
  noStore();
  const userId = await getCurrentUserId();
  const lists = await prisma.contactList.findMany({
    where: { userId },
    include: {
      _count: {
        select: {
          contacts: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return lists.map((list) => serializeContactList(list as ContactListWithCount));
}

export async function getContactListById(listId: string) {
  noStore();
  const userId = await getCurrentUserId();
  const list = await prisma.contactList.findFirst({
    where: {
      id: listId,
      userId
    },
    include: {
      _count: {
        select: {
          contacts: true
        }
      }
    }
  });

  return list ? serializeContactList(list as ContactListWithCount) : null;
}

export async function getContacts() {
  noStore();
  const userId = await getCurrentUserId();
  const contacts = await prisma.contact.findMany({
    where: { userId },
    include: {
      list: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return contacts.map((contact) => serializeContact(contact as ContactWithList));
}

export async function getContactsByListId(listId: string) {
  const userId = await getCurrentUserId();
  const contacts = await prisma.contact.findMany({
    where: {
      userId,
      listId
    },
    orderBy: { createdAt: "asc" }
  });

  return contacts.map((contact) => serializeContact(contact as ContactWithList));
}

export async function createContactList(name: string, source: string, rows: Array<{ name: string; email: string }>) {
  const userId = await getCurrentUserId();

  const list = await prisma.contactList.create({
    data: {
      userId,
      name,
      source,
      contacts: {
        create: rows.map((row) => ({
          userId,
          name: row.name,
          email: row.email,
          status: PrismaContactStatus.ACTIVE
        }))
      }
    },
    include: {
      _count: {
        select: {
          contacts: true
        }
      }
    }
  });

  return serializeContactList(list as ContactListWithCount);
}

export async function getCampaigns() {
  noStore();
  const userId = await getCurrentUserId();
  const campaigns = await prisma.campaign.findMany({
    where: { userId },
    include: {
      template: true,
      contactList: {
        include: {
          _count: {
            select: {
              contacts: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return campaigns.map((campaign) => serializeCampaign(campaign as CampaignWithRelations));
}

export async function getCampaignById(campaignId: string) {
  noStore();
  const userId = await getCurrentUserId();
  const campaign = await prisma.campaign.findFirst({
    where: {
      id: campaignId,
      userId
    },
    include: {
      template: true,
      contactList: {
        include: {
          _count: {
            select: {
              contacts: true
            }
          }
        }
      },
      emailLogs: {
        orderBy: { updatedAt: "desc" }
      }
    }
  });

  if (!campaign) {
    return null;
  }

  return {
    ...serializeCampaign(campaign as CampaignWithRelations),
    template: campaign.template ? serializeTemplate(campaign.template as TemplateWithMeta) : undefined,
    list: campaign.contactList ? serializeContactList(campaign.contactList as ContactListWithCount) : undefined,
    logs: campaign.emailLogs.map((log) => serializeEmailLog(log as EmailLogWithCampaign))
  };
}

export async function createCampaign(input: {
  name: string;
  templateId: string;
  contactListId: string;
  scheduledAt?: string;
}) {
  const userId = await getCurrentUserId();
  const campaign = await prisma.campaign.create({
    data: {
      userId,
      name: input.name,
      templateId: input.templateId,
      contactListId: input.contactListId,
      status: input.scheduledAt ? PrismaCampaignStatus.SCHEDULED : PrismaCampaignStatus.QUEUED,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null
    }
  });

  return serializeCampaign(campaign as CampaignWithRelations);
}

export async function addEmailLogs(
  campaignId: string,
  recipients: Array<{ email: string; recipientName: string; status?: EmailLogRecord["status"] }>
) {
  if (recipients.length === 0) {
    return [] as EmailLogRecord[];
  }

  await prisma.emailLog.createMany({
    data: recipients.map((recipient) => ({
      campaignId,
      email: recipient.email,
      recipientName: recipient.recipientName,
      status: (recipient.status ?? "queued").toUpperCase() as PrismaEmailLogStatus
    }))
  });

  const createdLogs = await prisma.emailLog.findMany({
    where: {
      campaignId
    },
    orderBy: { createdAt: "desc" },
    take: recipients.length
  });

  return createdLogs.map((log) => serializeEmailLog(log as EmailLogWithCampaign));
}

export async function getEmailLogs() {
  noStore();
  const userId = await getCurrentUserId();
  const logs = await prisma.emailLog.findMany({
    where: {
      campaign: {
        userId
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return logs.map((log) => serializeEmailLog(log as EmailLogWithCampaign));
}

export async function getRecentEmailLogs(limit = 10) {
  noStore();
  const userId = await getCurrentUserId();
  const logs = await prisma.emailLog.findMany({
    where: {
      campaign: {
        userId
      }
    },
    orderBy: { updatedAt: "desc" },
    take: limit
  });

  return logs.map((log) => serializeEmailLog(log as EmailLogWithCampaign));
}

export async function getUserByEmail(email: string) {
  await ensureDemoData();
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    return null;
  }

  const normalized: UserRecord = {
    id: user.id,
    email: user.email,
    password: user.passwordHash,
    name: user.name ?? ""
  };

  return normalized;
}

export async function createUser(input: Pick<UserRecord, "email" | "name" | "password">) {
  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      name: input.name,
      passwordHash: input.password
    }
  });

  return {
    id: user.id,
    email: user.email,
    password: user.passwordHash,
    name: user.name ?? ""
  } satisfies UserRecord;
}

export async function getCampaignTemplateAndRecipients(campaignId: string) {
  const userId = await getCurrentUserId();
  const campaign = await prisma.campaign.findFirst({
    where: {
      id: campaignId,
      userId
    },
    include: {
      template: true,
      contactList: {
        include: {
          contacts: {
            where: {
              status: PrismaContactStatus.ACTIVE
            },
            orderBy: { createdAt: "asc" }
          },
          _count: {
            select: {
              contacts: true
            }
          }
        }
      }
    }
  });

  if (!campaign) {
    return null;
  }

  return {
    campaign: serializeCampaign(campaign as CampaignWithRelations),
    template: serializeTemplate(campaign.template as TemplateWithMeta),
    list: serializeContactList(campaign.contactList as ContactListWithCount),
    recipients: campaign.contactList.contacts.map((contact) => serializeContact(contact as ContactWithList))
  };
}

export async function updateCampaignCounts(
  campaignId: string,
  counts: {
    sentCount?: number;
    failedCount?: number;
    openRate?: number;
    status?: CampaignRecord["status"];
  }
) {
  const data: Prisma.CampaignUpdateInput = {};

  if (typeof counts.sentCount === "number") {
    data.sentCount = counts.sentCount;
  }

  if (typeof counts.failedCount === "number") {
    data.failedCount = counts.failedCount;
  }

  if (typeof counts.openRate === "number") {
    data.openRate = counts.openRate;
  }

  if (counts.status) {
    data.status = counts.status.toUpperCase() as PrismaCampaignStatus;
  }

  await prisma.campaign.update({
    where: { id: campaignId },
    data
  });
}
