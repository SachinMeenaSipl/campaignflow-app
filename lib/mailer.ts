import { Resend } from "resend";

type MailPayload = {
  to: string;
  subject: string;
  html: string;
};

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export function renderTemplate(html: string, variables: Record<string, string>) {
  return html.replace(/{{\s*([\w.]+)\s*}}/g, (_, key: string) => variables[key] ?? "");
}

export async function sendEmail({ to, subject, html }: MailPayload) {
  if (!resend || !process.env.EMAIL_FROM) {
    return {
      provider: "mock",
      accepted: true,
      id: crypto.randomUUID(),
      to,
      subject,
      preview: html
    };
  }

  const response = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html
  });

  return {
    provider: "resend",
    accepted: !response.error,
    id: response.data?.id,
    to,
    subject
  };
}
