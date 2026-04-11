"use client";

import { Check, Loader2, SquareStack } from "lucide-react";

type AuthRedirectCardProps = {
  title?: string;
  statusTitle: string;
  statusSubtitle: string;
  tone?: "success" | "progress";
  fullscreen?: boolean;
  overlay?: boolean;
};

const shellClassName = "flex items-center justify-center bg-[#f5f7fb] px-4";

export function getWorkspaceLabel(role: string | null) {
  const normalizedRole = role?.toUpperCase();

  if (normalizedRole === "ADMIN" || normalizedRole === "ROLE_ADMIN") {
    return "Admin Workspace";
  }

  if (normalizedRole === "MANAGER" || normalizedRole === "ROLE_MANAGER") {
    return "Manager Workspace";
  }

  return "Employee Workspace";
}

export function AuthRedirectCard({
  title = "Redirecting...",
  statusTitle,
  statusSubtitle,
  tone = "success",
  fullscreen = false,
  overlay = false,
}: AuthRedirectCardProps) {
  const content = (
    <div
      role="status"
      className="w-full max-w-[390px] rounded-[24px] border border-[#e7edf6] bg-white px-8 py-7 shadow-[0_24px_70px_rgba(15,23,42,0.09)]"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#4c8cff] text-white shadow-[0_16px_30px_rgba(76,140,255,0.36)]">
        <SquareStack className="h-6 w-6" />
      </div>

      <h1 className="mt-5 text-center text-[28px] font-semibold tracking-[-0.05em] text-[#101828]">
        {title}
      </h1>

      <div className="mt-5 flex justify-center">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full ${
            tone === "success" ? "bg-[#ecfdf3] text-[#22c55e]" : "bg-[#eef4ff] text-[#4c8cff]"
          }`}
        >
          {tone === "success" ? (
            <Check className="h-[18px] w-[18px]" strokeWidth={3} />
          ) : (
            <Loader2 className="h-[18px] w-[18px] animate-spin" strokeWidth={2.5} />
          )}
        </div>
      </div>

      <div className="mt-5 rounded-[14px] border border-[#dbe8ff] bg-[#eef5ff] px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-[10px] bg-white text-[#3b82f6] shadow-[0_8px_16px_rgba(76,140,255,0.12)]">
            <SquareStack className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#0f172a]">{statusTitle}</p>
            <p className="mt-1 text-[11px] leading-5 text-[#64748b]">{statusSubtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5f7fb]/86 px-4 backdrop-blur-[6px]">
        {content}
      </div>
    );
  }

  if (fullscreen) {
    return <div className={`${shellClassName} min-h-screen`}>{content}</div>;
  }

  return <div className={shellClassName}>{content}</div>;
}
