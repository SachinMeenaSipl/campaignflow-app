"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FileUploadZone() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/contacts/upload", {
      method: "POST",
      body: formData
    });

    const payload = (await response.json()) as { message?: string; imported?: number };

    if (!response.ok) {
      setMessage(payload.message ?? "Upload failed.");
      setLoading(false);
      return;
    }

    setMessage(`Imported ${payload.imported ?? 0} contacts successfully.`);
    router.push("/contacts");
    router.refresh();
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-6 rounded-[32px] border border-dashed border-amber-300 bg-white/90 p-8 shadow-soft"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">Upload list</p>
        <h3 className="text-3xl font-semibold tracking-tight text-slate-950">Drag in a CSV or XLSX list</h3>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Accepted shape: `name,email`. The parser normalizes headers and stores a contact list record plus each
          recipient row.
        </p>
      </div>

      <Input name="name" placeholder="List name" required />
      <Input name="file" type="file" accept=".csv,.xlsx" required />

      <div className="rounded-[28px] bg-slate-950 p-5 text-slate-50">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Example</p>
        <pre className="mt-3 overflow-x-auto text-sm leading-7 text-slate-200">name,email{"\n"}John,john@gmail.com{"\n"}Sam,sam@gmail.com</pre>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Importing..." : "Upload contacts"}
      </Button>

      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
    </form>
  );
}
