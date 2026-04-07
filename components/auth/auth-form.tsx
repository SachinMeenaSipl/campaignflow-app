"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const body = Object.fromEntries(formData.entries());
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(payload.message ?? "Request failed.");
      setLoading(false);
      return;
    }

    setMessage(mode === "login" ? "Signed in. Redirecting to dashboard..." : "Account created. Redirecting...");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">
          {mode === "login" ? "Welcome back" : "Create workspace"}
        </p>
        <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
          {mode === "login" ? "Log in to CampaignFlow" : "Start building your campaign timeline"}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {mode === "login"
            ? "Use the credentials configured in `.env`, or wire this to your auth provider."
            : "This MVP uses lightweight API-backed forms so you can extend into a full auth system."}
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4 rounded-[28px] border border-border bg-white p-6">
        {mode === "register" ? <Input name="name" placeholder="Full name" required /> : null}
        <Input
          name="email"
          type="email"
          placeholder="Email address"
          required
        />
        <Input
          name="password"
          type="password"
          placeholder={mode === "login" ? "Password" : "Create a password"}
          required
        />
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Working..." : mode === "login" ? "Log in" : "Create account"}
        </Button>
        <p className="text-sm text-muted-foreground">
          {mode === "login"
            ? "The seeded demo user is read from `.env`, so secrets do not live in the UI or source code."
            : "Replace this with NextAuth, Clerk, or your preferred JWT/session flow when productionizing."}
        </p>
        {message ? <p className="text-sm text-slate-700">{message}</p> : null}
      </form>
    </div>
  );
}
