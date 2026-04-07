import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <AuthForm mode="register" />
      <p className="text-sm text-muted-foreground">
        Already have access?{" "}
        <Link href="/login" className="font-semibold text-slate-950">
          Log in
        </Link>
      </p>
    </div>
  );
}
