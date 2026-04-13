"use client";

import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Briefcase, Calendar, Mail, Shield, User, Settings, LogOut, Camera } from "lucide-react";
import { UserAvatar } from "@/components/common/UserAvatar";
import { ProfilePhotoUploader } from "@/components/common/ProfilePhotoUploader";
import { ImageCropModal } from "@/components/common/ImageCropModal";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/userService";
import { getDashboardPath } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import type { User } from "@/types/user";

const ROLE_COLORS: Record<string, string> = {
  ADMIN:    "bg-purple-100 text-purple-700",
  MANAGER:  "bg-blue-100 text-blue-700",
  EMPLOYEE: "bg-green-100 text-green-700",
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN:    "Administrator",
  MANAGER:  "Project Manager",
  EMPLOYEE: "Team Member",
};

function fmtRole(r?: string | null) {
  return ROLE_LABELS[r ?? ""] ?? (r ?? "User");
}

interface ProfilePageProps {
  topBar: React.ReactNode;
}

export function ProfilePage({ topBar }: ProfilePageProps) {
  const { name, profilePhoto, role, email, userId, uploadProfilePhoto, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    userService.getProfile()
      .then(res => setProfile((res as any)?.data ?? res))
      .catch(() => setProfile(null))
      .finally(() => setIsLoading(false));
  }, []);

  const active = profile ?? {
    id: Number(userId ?? 0),
    name: name ?? "User",
    email: email ?? "",
    role: role ?? "EMPLOYEE",
    status: "ACTIVE",
    profilePhoto: profilePhoto ?? undefined,
    createdAt: new Date().toISOString(),
  };

  const handleUpload = async (file: File) => {
    const next = await uploadProfilePhoto(file);
    setProfile(p => p ? { ...p, profilePhoto: next } : p);
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropDone = async (croppedFile: File) => {
    setCropSrc(null);
    await handleUpload(croppedFile);
  };

  const dashPath = getDashboardPath(role ?? "EMPLOYEE");

  return (
    <div className="min-h-full bg-[#f8fafc] dark:bg-[#0f172a]">
      {topBar}

      <div className="p-6 max-w-4xl mx-auto space-y-5">

        {/* ── Profile header card ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] shadow-sm overflow-hidden">
          {/* Cover gradient */}
          <div className="h-28 bg-gradient-to-r from-blue-600 to-blue-400" />

          <div className="px-6 pb-6">
            {/* Avatar + upload */}
            <div className="flex items-end justify-between -mt-12 mb-4">
              <div className="relative">
                {isLoading ? (
                  <div className="h-20 w-20 rounded-full bg-gray-200 ring-4 ring-white animate-pulse" />
                ) : (
                  <div className="relative h-20 w-20">
                    <UserAvatar
                      name={active.name}
                      src={active.profilePhoto}
                      className="h-20 w-20 ring-4 ring-white text-2xl"
                    />
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCameraChange}
                    />
                  </div>
                )}
              </div>
              <Link
                href={dashPath}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-6 w-48 rounded bg-gray-100" />
                <div className="h-4 w-32 rounded bg-gray-100" />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-[#f1f5f9]">{active.name}</h2>
                <p className="text-sm text-gray-500 dark:text-[#94a3b8] mt-0.5">{active.email}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ROLE_COLORS[active.role] ?? "bg-gray-100 text-gray-600"}`}>
                    {fmtRole(active.role)}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${active.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {active.status}
                  </span>
                  {active.role !== "ADMIN" && active.designation && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 dark:bg-purple-950 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300">
                      <Briefcase className="h-3 w-3" />
                      {active.designation}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Details grid ────────────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: <User className="h-4 w-4 text-blue-600" />, label: "Full Name",    value: active.name,              bg: "bg-blue-50" },
            { icon: <Mail className="h-4 w-4 text-purple-600" />, label: "Email",      value: active.email,             bg: "bg-purple-50" },
            { icon: <Shield className="h-4 w-4 text-amber-600" />, label: "Role",      value: fmtRole(active.role),     bg: "bg-amber-50" },
            { icon: <Calendar className="h-4 w-4 text-green-600" />, label: "Member Since", value: formatDate(active.createdAt), bg: "bg-green-50" },
            ...(active.role !== "ADMIN" ? [
              { icon: <Briefcase className="h-4 w-4 text-purple-600" />, label: "Designation", value: active.designation ?? "Not assigned", bg: "bg-purple-50" },
            ] : []),
          ].map(item => (
            <div key={item.label} className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bg}`}>
                  {item.icon}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#64748b]">{item.label}</span>
              </div>
              <div className={`text-base font-semibold break-all ${
                item.label === "Designation" && item.value === "Not assigned"
                  ? "text-gray-400 dark:text-[#475569] italic"
                  : "text-gray-900 dark:text-[#f1f5f9]"
              }`}>{item.value || "—"}</div>
            </div>
          ))}
        </div>

        {/* ── Account status card ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9] mb-4">Account Status</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl bg-green-50 p-3">
              <BadgeCheck className="h-5 w-5 text-green-600 shrink-0" />
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <div className="text-sm font-semibold text-gray-900">{active.status}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-3">
              <Shield className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <div className="text-xs text-gray-500">Access Level</div>
                <div className="text-sm font-semibold text-gray-900">{fmtRole(active.role)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-purple-50 p-3">
              <Mail className="h-5 w-5 text-purple-600 shrink-0" />
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-sm font-semibold text-gray-900 truncate">{active.email || "—"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick actions ────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9] mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href={dashPath}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-4 w-4 text-gray-500" /> Dashboard
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Crop modal */}
    {cropSrc && (
      <ImageCropModal
        imageSrc={cropSrc}
        onCropDone={handleCropDone}
        onCancel={() => setCropSrc(null)}
      />
    )}
  );
}
