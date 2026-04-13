"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] p-6">
      <div className="max-w-md w-full rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-8 text-center space-y-6 shadow-sm">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950">
            <AlertTriangle className="h-7 w-7 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Page failed to load</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This page encountered an error. You can try refreshing or go back to the dashboard.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
