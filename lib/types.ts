export type TemplateRecord = {
  id: string;
  userId: string;
  name: string;
  subject: string;
  htmlContent: string;
  previewText: string;
  variables: string[];
  updatedAt: string;
};

export type ContactListRecord = {
  id: string;
  userId: string;
  name: string;
  source: string;
  createdAt: string;
  contactCount: number;
};

export type ContactRecord = {
  id: string;
  userId: string;
  listId: string;
  name: string;
  email: string;
  status: "active" | "unsubscribed";
};

export type CampaignStatus = "draft" | "queued" | "scheduled" | "sending" | "completed";

export type CampaignRecord = {
  id: string;
  userId: string;
  templateId: string;
  contactListId: string;
  name: string;
  status: CampaignStatus;
  createdAt: string;
  scheduledAt?: string;
  sentCount: number;
  failedCount: number;
  openRate: number;
};

export type EmailLogStatus = "queued" | "sent" | "failed";

export type EmailLogRecord = {
  id: string;
  campaignId: string;
  email: string;
  recipientName: string;
  status: EmailLogStatus;
  opened: boolean;
  updatedAt: string;
  error?: string;
};

export type UserRecord = {
  id: string;
  email: string;
  password: string;
  name: string;
};

export type DashboardStats = {
  emailsSent: number;
  pendingCampaigns: number;
  activeTemplates: number;
  uploadedContacts: number;
};
