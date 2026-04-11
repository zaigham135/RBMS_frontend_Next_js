"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { AuthRedirectCard, getWorkspaceLabel } from "@/components/auth/AuthRedirectCard";

export default function OAuthSuccessPage() {
  const searchParams = useSearchParams();
  const { completeOAuthLogin } = useAuth();
  const workspaceLabel = getWorkspaceLabel(searchParams.get("role"));

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      toast.error(error);
      window.location.href = "/login";
      return;
    }

    try {
      completeOAuthLogin(searchParams);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google authentication failed.");
      window.location.href = "/login";
    }
  }, [completeOAuthLogin, searchParams]);

  return (
    <AuthRedirectCard
      fullscreen
      title="Redirecting..."
      statusTitle="Authentication Successful"
      statusSubtitle={`Routing to ${workspaceLabel}...`}
    />
  );
}
