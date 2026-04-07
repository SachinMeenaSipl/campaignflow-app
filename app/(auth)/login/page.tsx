import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <AuthForm mode="login" />
      <p className="text-sm text-muted-foreground">
        Need an account?{" "}
        <Link href="/register" className="font-semibold text-slate-950">
          Create one
        </Link>
      </p>
    </div>
  );
}
