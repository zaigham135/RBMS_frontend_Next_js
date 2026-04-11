import { AuthUtilityPage } from "@/components/auth/AuthUtilityPage";

export default function HelpCenterPage() {
  return (
    <AuthUtilityPage
      title="Help Center"
      description="Quick guidance for getting back into your workspace."
      body={[
        "Use your organization email and password to sign in, or continue with Google if your account supports it.",
        "If you cannot access the platform, contact your administrator or support team and mention the role-based dashboard you were trying to reach.",
        "For issues related to permissions, assignments, or missing workspace data, request a role audit from your administrator.",
      ]}
    />
  );
}
