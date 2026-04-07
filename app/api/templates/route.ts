import { NextResponse } from "next/server";

import { createTemplate, getTemplates } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ templates: await getTemplates() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    subject?: string;
    htmlContent?: string;
    previewText?: string;
  };

  if (!body.name || !body.subject || !body.htmlContent) {
    return NextResponse.json({ message: "Name, subject, and content are required." }, { status: 400 });
  }

  const template = await createTemplate({
    name: body.name,
    subject: body.subject,
    htmlContent: body.htmlContent,
    previewText: body.previewText ?? ""
  });

  return NextResponse.json({ message: "Template created.", template }, { status: 201 });
}
