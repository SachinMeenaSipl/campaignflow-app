import Papa from "papaparse";
import * as XLSX from "xlsx";

export type ParsedContactRow = {
  name: string;
  email: string;
};

function normalizeRows(
  rows: Array<Record<string, string | number | undefined>>
): ParsedContactRow[] {
  return rows
    .map((row) => ({
      name: String(row.name ?? row.Name ?? "").trim(),
      email: String(row.email ?? row.Email ?? "").trim().toLowerCase()
    }))
    .filter((row) => row.name && row.email);
}

export async function parseContactFile(file: File) {
  if (file.name.endsWith(".csv")) {
    const text = await file.text();
    const parsed = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true
    });

    return normalizeRows(parsed.data);
  }

  if (file.name.endsWith(".xlsx")) {
    const bytes = await file.arrayBuffer();
    const workbook = XLSX.read(bytes, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
      defval: ""
    });

    return normalizeRows(json);
  }

  throw new Error("Unsupported file type. Upload a .csv or .xlsx file.");
}
