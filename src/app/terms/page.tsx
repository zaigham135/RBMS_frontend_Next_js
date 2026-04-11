import { AuthUtilityPage } from "@/components/auth/AuthUtilityPage";

export default function TermsPage() {
  return (
    <AuthUtilityPage
      title="Terms of Service"
      description="This workspace is intended for authenticated organizational use."
      body={[
        "Access is limited to authorized users and is subject to your organization’s internal usage policies.",
        "Users are responsible for keeping their credentials secure and for reporting any suspicious activity immediately.",
        "Use of the platform may be monitored for operational, security, and compliance purposes.",
      ]}
    />
  );
}
