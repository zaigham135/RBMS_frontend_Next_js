"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const params = useSearchParams();
  const { completeOAuthLogin } = useAuth();

  useEffect(() => {
    const error = params.get("error");

    if (error) {
      toast.error(error);
      window.location.href = "/login";
      return;
    }

    try {
      completeOAuthLogin(params);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google authentication failed.");
      window.location.href = "/login";
    }
  }, [completeOAuthLogin, params]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <ClipboardList className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Completing sign-in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;re finishing your Google login and redirecting you now.
        </p>
        <div className="mx-auto mt-6 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    </div>
  );
}
