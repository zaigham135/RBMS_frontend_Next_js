"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
          <p className="text-gray-500 dark:text-gray-400">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = "/"}
            className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            Go to home
          </button>
        </div>
      </div>
    </div>
  );
}
