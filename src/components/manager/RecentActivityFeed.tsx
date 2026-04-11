"use client";

import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { UserAvatar } from "@/components/common/UserAvatar";
import { managerDashboardService } from "@/services/managerDashboardService";
import type { ManagerActivityEntry } from "@/types/managerDashboard";

interface RecentActivityFeedProps {
  activity: ManagerActivityEntry[];
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function ActivityRow({
  entry, onDelete, isDeleting,
}: {
  entry: ManagerActivityEntry;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 group">
      <UserAvatar name={entry.userName} src={entry.userPhoto} className="h-7 w-7 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-700 dark:text-[#cbd5e1] leading-relaxed">
          <span className="font-semibold text-gray-900 dark:text-[#f1f5f9]">{entry.userName}</span>{" "}
          {entry.action}{" "}
          {entry.entityName && (
            <span className="font-medium text-blue-600 dark:text-blue-400">{entry.entityName}</span>
          )}
        </p>
        <p className="text-[11px] text-gray-400 dark:text-[#64748b] mt-0.5">{relativeTime(entry.createdAt)}</p>
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(entry.id)}
          disabled={isDeleting}
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-300 dark:text-[#475569] hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Delete"
        >
          <Trash2 className={`h-3.5 w-3.5 ${isDeleting ? "animate-pulse" : ""}`} />
        </button>
      )}
    </div>
  );
}

export function RecentActivityFeed({ activity }: RecentActivityFeedProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleted, setDeleted] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState<Set<number>>(new Set());

  const visible = activity.filter((e) => !deleted.has(e.id));
  const preview = visible.slice(0, 5);
  const hasMore = visible.length > 5;

  const handleDelete = async (id: number) => {
    setDeleting((prev) => new Set(prev).add(id));
    try {
      await managerDashboardService.deleteActivity(id);
      setDeleted((prev) => new Set(prev).add(id));
    } finally {
      setDeleting((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9] mb-4">Recent Activity</h3>

        {visible.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-[#64748b] text-center py-4">No recent activity.</p>
        ) : (
          <>
            <div className="space-y-4">
              {preview.map((entry) => (
                <ActivityRow key={entry.id} entry={entry} />
              ))}
            </div>
            {hasMore && (
              <button type="button" onClick={() => setModalOpen(true)}
                className="mt-4 w-full text-center text-xs text-blue-600 dark:text-blue-400 hover:underline">
                View all ({visible.length})
              </button>
            )}
          </>
        )}
      </div>

      {/* All Activity Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setModalOpen(false)}>
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#1e293b] shadow-xl dark:shadow-black/40"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#334155]">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9]">All Activity</h2>
              <button type="button" onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#334155] text-gray-400 dark:text-[#64748b] hover:text-gray-600 dark:hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] px-5 py-4 space-y-4">
              {visible.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-[#64748b] text-center py-6">No activity.</p>
              ) : (
                visible.map((entry) => (
                  <ActivityRow key={entry.id} entry={entry} onDelete={handleDelete} isDeleting={deleting.has(entry.id)} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
