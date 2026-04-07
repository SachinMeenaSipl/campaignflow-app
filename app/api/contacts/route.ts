import { NextResponse } from "next/server";

import { getContactLists, getContacts } from "@/lib/data";

export async function GET() {
  const [lists, contacts] = await Promise.all([getContactLists(), getContacts()]);
  return NextResponse.json({
    lists,
    contacts
  });
}
