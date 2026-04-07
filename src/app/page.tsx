"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, getRole, getDashboardPath } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const role = getRole();
    if (token && role) {
      router.replace(getDashboardPath(role));
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
