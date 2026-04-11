"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, CalendarDays, Compass, LifeBuoy, Mail, ShieldCheck, UserCircle2 } from "lucide-react";
import { ActionButton, NexusPageIntro, NexusTopbar, Panel, Pill } from "@/components/common/NexusUI";
import { ProfilePhotoUploader } from "@/components/common/ProfilePhotoUploader";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/userService";
import { getDashboardPath } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types/user";

const formatRoleLabel = (value?: string | null) => {
  if (!value) return "Workspace User";
  return value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

export function WorkspaceInfoPage({
  title,
  description,
  type,
}: {
  title: string;
  description: string;
  type: "help" | "account";
}) {
  const { name, profilePhoto, role, email, userId, uploadProfilePhoto } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(type === "account");

  const icon = type === "help" ? <LifeBuoy className="h-7 w-7 text-[#1557d6]" /> : <UserCircle2 className="h-7 w-7 text-[#1557d6]" />;
  const fallbackProfile = useMemo<User | null>(() => {
    if (type !== "account" || !role) return null;

    return {
      id: Number(userId ?? 0),
      name: name ?? "Workspace User",
      email: email ?? "Not available",
      role,
      status: "ACTIVE",
      profilePhoto: profilePhoto ?? undefined,
      createdAt: new Date().toISOString(),
    };
  }, [email, name, profilePhoto, role, type, userId]);
  const activeProfile = profile ?? fallbackProfile;

  useEffect(() => {
    if (type !== "account") return;

    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const response = await userService.getProfile();
        setProfile(response.data);
      } catch {
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [type]);

  const handleProfileUpload = async (file: File) => {
    const nextPhoto = await uploadProfilePhoto(file);
    setProfile((current) => current ? { ...current, profilePhoto: nextPhoto } : current);
  };

  const accountDescription = activeProfile
    ? `${formatRoleLabel(activeProfile.role)} account with ${activeProfile.status.toLowerCase()} workspace access.`
    : "Review your account details and keep your workspace profile current.";

  return (
    <div className="min-h-full bg-[#f7fbff]">
      <NexusTopbar
        title={role === "EMPLOYEE" ? "Employee Workspace" : "Executive Nexus"}
        searchPlaceholder={type === "help" ? "Search help articles..." : "Search account settings..."}
        userName={name}
        userRole={formatRoleLabel(role)}
        userPhoto={profilePhoto}
      />

      <div className="space-y-8 px-6 py-8 lg:px-8 lg:py-10">
        <NexusPageIntro
          title={type === "account" ? "Profile Details" : title}
          description={type === "account" ? "Review your profile information, workspace access, and member details." : description}
          actions={type === "account" && role ? (
            <ActionButton href={getDashboardPath(role)}>
              Open Dashboard
            </ActionButton>
          ) : undefined}
        />

        {type === "account" ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
            <Panel className="p-7 lg:p-8">
              {isLoading ? (
                <div className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-full bg-[#edf2f7]" />
                    <div className="space-y-3">
                      <div className="h-6 w-48 rounded-full bg-[#edf2f7]" />
                      <div className="h-4 w-36 rounded-full bg-[#edf2f7]" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="rounded-[22px] border border-[#edf2f7] p-5">
                        <div className="h-4 w-24 rounded-full bg-[#edf2f7]" />
                        <div className="mt-4 h-5 w-36 rounded-full bg-[#edf2f7]" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <ProfilePhotoUploader
                        name={activeProfile?.name}
                        profilePhoto={activeProfile?.profilePhoto}
                        onUpload={handleProfileUpload}
                      />
                      <h3 className="mt-6 text-[30px] font-bold tracking-[-0.05em] text-[#1f2937]">
                        {activeProfile?.name ?? name ?? "Workspace User"}
                      </h3>
                      <p className="mt-2 break-all text-[16px] text-[#556274]">{activeProfile?.email ?? email ?? "No email available"}</p>
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Pill className="bg-[#eef4ff] text-[#1557d6]">{formatRoleLabel(activeProfile?.role)}</Pill>
                        <Pill className={activeProfile?.status === "ACTIVE" ? "bg-[#ecfdf3] text-[#15803d]" : "bg-[#fff1f2] text-[#be123c]"}>
                          {activeProfile?.status ?? "Unknown"}
                        </Pill>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-[#e4edf6] bg-[#f8fbff] px-5 py-4">
                      <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">Workspace Access</div>
                      <div className="mt-3 break-words text-[16px] font-semibold text-[#1f2937]">{accountDescription}</div>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Full Name", value: activeProfile?.name ?? "Not available" },
                      { label: "Email Address", value: activeProfile?.email ?? "Not available" },
                      { label: "Role", value: formatRoleLabel(activeProfile?.role) },
                      { label: "Member Since", value: formatDate(activeProfile?.createdAt) },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[22px] border border-[#edf2f7] bg-white p-5">
                        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">{item.label}</div>
                        <div className="mt-3 break-all text-[18px] font-semibold text-[#1f2937]">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Panel>

            <div className="space-y-6">
              <Panel className="bg-[linear-gradient(135deg,#ffffff_0%,#eef5ff_100%)] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#eef4ff] text-[#1557d6]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-[24px] font-bold tracking-[-0.04em] text-[#1f2937]">Account Status</h3>
                <p className="mt-3 text-[15px] leading-8 text-[#556274]">
                  Your workspace session is active and ready for daily project operations.
                </p>
                <div className="mt-6 space-y-3 text-[15px] text-[#475467]">
                  <div className="flex items-center gap-3">
                    <BadgeCheck className="h-4 w-4 text-[#16a34a]" />
                    <span>Status: {activeProfile?.status ?? "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-[#1557d6]" />
                    <span className="break-all">{activeProfile?.email ?? email ?? "No email available"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 text-[#7c3aed]" />
                    <span>Joined {formatDate(activeProfile?.createdAt)}</span>
                  </div>
                </div>
              </Panel>

              <Panel className="p-6">
                <h3 className="text-[22px] font-bold tracking-[-0.03em] text-[#1f2937]">Quick Access</h3>
                <div className="mt-5 space-y-3">
                  {role ? (
                    <ActionButton href={getDashboardPath(role)} className="w-full justify-between">
                      Open Dashboard
                      <Compass className="h-4 w-4" />
                    </ActionButton>
                  ) : null}
                  <ActionButton href={role === "ADMIN" ? "/admin/help-center" : role === "MANAGER" ? "/manager/help-center" : "/employee/help-center"} className="w-full justify-between">
                    Help Center
                    <LifeBuoy className="h-4 w-4" />
                  </ActionButton>
                </div>
              </Panel>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-3">
            <Panel className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#eef4ff]">{icon}</div>
              <h3 className="mt-6 text-[22px] font-bold tracking-[-0.03em] text-[#1f2937]">
                {type === "help" ? "Get Support Fast" : "Profile Overview"}
              </h3>
              <p className="mt-3 text-[15px] leading-8 text-[#556274]">
                {type === "help"
                  ? "Browse workspace guidance, contact support, and keep your team moving."
                  : "Review your account details and keep your workspace profile current."}
              </p>
            </Panel>

            <Panel className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#eef4ff]">
                <Compass className="h-7 w-7 text-[#1557d6]" />
              </div>
              <h3 className="mt-6 text-[22px] font-bold tracking-[-0.03em] text-[#1f2937]">
                {type === "help" ? "Suggested Next Steps" : "Workspace Access"}
              </h3>
              <ul className="mt-4 space-y-3 text-[15px] text-[#556274]">
                <li>{type === "help" ? "Review project and task dashboards for current blockers." : `Role: ${role ?? "Workspace"}`}</li>
                <li>{type === "help" ? "Use the Export controls to share current views." : `Email: ${email ?? "Not available"}`}</li>
                <li>{type === "help" ? "Reach out to your admin for permission changes." : "Profile photo updates remain available from the sidebar."}</li>
              </ul>
            </Panel>

            <Panel className="bg-[#edf4fa] p-6">
              <h3 className="text-[22px] font-bold tracking-[-0.03em] text-[#1f2937]">
                {type === "help" ? "Need direct assistance?" : "Account status"}
              </h3>
              <p className="mt-3 text-[15px] leading-8 text-[#556274]">
                {type === "help"
                  ? "For urgent workspace issues, contact your platform administrator or review the support links from your current role dashboard."
                  : "Your workspace session and role permissions are active. Use the sidebar sign out action when you are done."}
              </p>
            </Panel>
          </div>
        )}
      </div>
    </div>
  );
}
