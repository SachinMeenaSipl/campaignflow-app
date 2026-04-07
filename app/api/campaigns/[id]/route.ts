import { NextResponse } from "next/server";

import { getCampaignById } from "@/lib/data";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;
  const campaign = await getCampaignById(id);

  if (!campaign) {
    return NextResponse.json({ message: "Campaign not found." }, { status: 404 });
  }

  return NextResponse.json({ campaign });
}
