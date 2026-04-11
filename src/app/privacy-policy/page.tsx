import { AuthUtilityPage } from "@/components/auth/AuthUtilityPage";

export default function PrivacyPolicyPage() {
  return (
    <AuthUtilityPage
      title="Privacy Policy"
      description="A short overview of how this workspace handles account data."
      body={[
        "Authentication details are used only to verify access and route you to the correct role-based dashboard.",
        "Profile information such as your name, email, role, and optional photo may be stored to personalize your workspace experience.",
        "For project-specific compliance requirements, please refer to your organization’s internal policy documentation.",
      ]}
    />
  );
}
