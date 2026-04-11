"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AuthUtilityPage({
  title,
  description,
  body,
}: {
  title: string;
  description: string;
  body: string[];
}) {
  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[980px] items-center justify-center">
        <div className="w-full rounded-[28px] border border-[#d7dfeb] bg-white p-8 shadow-[0_18px_50px_rgba(16,24,40,0.08)] lg:p-12">
          <Link href="/login" className="inline-flex items-center gap-2 text-[14px] font-medium text-[#2f66ff] hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          <h1 className="mt-8 text-[34px] font-semibold tracking-[-0.05em] text-[#101828]">{title}</h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-8 text-[#64748b]">{description}</p>

          <div className="mt-8 space-y-4">
            {body.map((paragraph) => (
              <p key={paragraph} className="text-[15px] leading-8 text-[#475467]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
