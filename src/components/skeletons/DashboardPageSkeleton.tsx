/**
 * Generic page-level skeleton used by loading.tsx files across all dashboard routes.
 * Renders a topbar skeleton + configurable content area skeleton.
 */

interface DashboardPageSkeletonProps {
  /** "table" | "cards" | "dashboard" | "form" */
  variant?: "table" | "cards" | "dashboard" | "form";
  bg?: string;
}

function TopbarSkeleton() {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#334155] bg-white dark:bg-[#1e293b] px-6 py-4">
      <div className="space-y-2">
        <div className="h-5 w-36 rounded-full bg-gray-100 dark:bg-[#334155]" />
        <div className="h-3 w-52 rounded-full bg-gray-100 dark:bg-[#334155]" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-9 w-52 rounded-xl bg-gray-100 dark:bg-[#334155]" />
        <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-[#334155]" />
        <div className="h-9 w-32 rounded-xl bg-gray-100 dark:bg-[#334155]" />
      </div>
    </div>
  );
}

function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid gap-4 grid-cols-2 lg:grid-cols-${count}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-100 dark:border-[#334155] bg-white dark:bg-[#1e293b] p-5">
          <div className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-[#334155]" />
          <div className="mt-4 h-3 w-24 rounded-full bg-gray-100 dark:bg-[#334155]" />
          <div className="mt-2 h-7 w-16 rounded-full bg-gray-100 dark:bg-[#334155]" />
          <div className="mt-2 h-3 w-28 rounded-full bg-gray-100 dark:bg-[#334155]" />
        </div>
      ))}
    </div>
  );
}

function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-[#334155] bg-white dark:bg-[#1e293b] overflow-hidden">
      {/* header row */}
      <div className="flex items-center gap-4 border-b border-gray-100 dark:border-[#334155] px-5 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 flex-1 rounded-full bg-gray-100 dark:bg-[#334155]" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-gray-50 dark:border-[#334155] px-5 py-4 last:border-0">
          <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-[#334155] shrink-0" />
          {Array.from({ length: cols - 1 }).map((_, j) => (
            <div key={j} className="h-3 flex-1 rounded-full bg-gray-100 dark:bg-[#334155]" />
          ))}
        </div>
      ))}
    </div>
  );
}

function DashboardContentSkeleton() {
  return (
    <div className="space-y-6">
      {/* welcome row */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-40 rounded-full bg-gray-100 dark:bg-[#334155]" />
        <div className="h-9 w-36 rounded-xl bg-gray-100 dark:bg-[#334155]" />
      </div>
      <StatCardsSkeleton count={4} />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 dark:border-[#334155] bg-white dark:bg-[#1e293b] p-5 h-48" />
          <div className="rounded-2xl border border-gray-100 dark:border-[#334155] bg-white dark:bg-[#1e293b] p-5 h-56" />
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 dark:border-[#334155] bg-white dark:bg-[#1e293b] p-5 h-36" />
          <div className="rounded-2xl border border-gray-100 dark:border-[#334155] bg-white dark:bg-[#1e293b] p-5 h-48" />
          <div className="rounded-2xl border border-gray-100 dark:border-[#334155] bg-white dark:bg-[#1e293b] p-5 h-40" />
        </div>
      </div>
    </div>
  );
}

function CardsContentSkeleton() {
  return (
    <div className="space-y-6">
      <StatCardsSkeleton count={4} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 dark:border-[#334155] bg-white dark:bg-[#1e293b] p-5 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-[#334155]" />
            <div className="h-4 w-3/4 rounded-full bg-gray-100 dark:bg-[#334155]" />
            <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-[#334155]" />
            <div className="h-3 w-2/3 rounded-full bg-gray-100 dark:bg-[#334155]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FormContentSkeleton() {
  return (
    <div className="max-w-2xl space-y-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-24 rounded-full bg-gray-100 dark:bg-[#334155]" />
          <div className="h-10 w-full rounded-xl bg-gray-100 dark:bg-[#334155]" />
        </div>
      ))}
      <div className="h-10 w-32 rounded-xl bg-gray-100 dark:bg-[#334155]" />
    </div>
  );
}

export function DashboardPageSkeleton({
  variant = "table",
  bg = "bg-[#f8fafc] dark:bg-[#0f172a]",
}: DashboardPageSkeletonProps) {
  return (
    <div className={`min-h-full ${bg} animate-pulse`}>
      <TopbarSkeleton />
      <div className="p-6">
        {variant === "dashboard" && <DashboardContentSkeleton />}
        {variant === "cards" && <CardsContentSkeleton />}
        {variant === "form" && <FormContentSkeleton />}
        {variant === "table" && (
          <div className="space-y-4">
            {/* controls bar */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-28 rounded-xl bg-gray-100 dark:bg-[#334155]" />
              <div className="h-9 w-28 rounded-xl bg-gray-100 dark:bg-[#334155]" />
              <div className="ml-auto flex gap-2">
                <div className="h-9 w-20 rounded-xl bg-gray-100 dark:bg-[#334155]" />
                <div className="h-9 w-20 rounded-xl bg-gray-100 dark:bg-[#334155]" />
                <div className="h-9 w-28 rounded-xl bg-gray-100 dark:bg-[#334155]" />
              </div>
            </div>
            <TableSkeleton rows={7} cols={5} />
          </div>
        )}
      </div>
    </div>
  );
}
