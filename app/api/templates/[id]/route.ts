import { NextResponse } from "next/server";

import { getTemplateById, updateTemplate } from "@/lib/data";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;
  const template = await getTemplateById(id);

  if (!template) {
    return NextResponse.json({ message: "Template not found." }, { status: 404 });
  }

  return NextResponse.json({ template });
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;
  const body = (await request.json()) as {
    name?: string;
    subject?: string;
    htmlContent?: string;
    previewText?: string;
  };

  const template = await updateTemplate(id, body);

  if (!template) {
    return NextResponse.json({ message: "Template not found." }, { status: 404 });
  }

  return NextResponse.json({ message: "Template updated.", template });
}
