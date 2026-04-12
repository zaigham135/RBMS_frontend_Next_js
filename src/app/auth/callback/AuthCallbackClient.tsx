"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { AuthRedirectCard, getWorkspaceLabel } from "@/components/auth/AuthRedirectCard";

export function AuthCallbackClient() {
  const params = useSearchParams();
  const { completeOAuthLogin } = useAuth();
  const workspaceLabel = getWorkspaceLabel(params.get("role"));

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
    <AuthRedirectCard
      fullscreen
      title="Redirecting..."
      statusTitle="Authentication Successful"
      statusSubtitle={`Routing to ${workspaceLabel}...`}
    />
  );
}
