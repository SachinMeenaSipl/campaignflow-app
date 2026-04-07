import { NextResponse } from "next/server";

import { parseContactFile } from "@/lib/csvParser";
import { createContactList } from "@/lib/data";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const name = formData.get("name");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "A CSV or XLSX file is required." }, { status: 400 });
  }

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ message: "List name is required." }, { status: 400 });
  }

  try {
    const rows = await parseContactFile(file);
    const dedupedRows = rows.filter(
      (row, index, collection) => collection.findIndex((candidate) => candidate.email === row.email) === index
    );
    const list = await createContactList(name, file.name, dedupedRows);

    return NextResponse.json({
      message: "Contacts uploaded.",
      list,
      imported: dedupedRows.length
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to parse file.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
