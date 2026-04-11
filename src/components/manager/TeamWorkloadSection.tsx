import Link from "next/link";
import { UserAvatar } from "@/components/common/UserAvatar";
import { WorkloadBar } from "@/components/common/WorkloadBar";
import type { EmployeeWithWorkload } from "@/types/managerTeam";

interface TeamWorkloadSectionProps {
  employees: EmployeeWithWorkload[];
}

export function TeamWorkloadSection({ employees }: TeamWorkloadSectionProps) {
  const sorted = [...employees].sort((a, b) => b.workloadPercent - a.workloadPercent);
  const displayed = sorted.slice(0, 5);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9]">Team Workload</h3>
        {employees.length > 5 && (
          <Link href="/manager/team" className="text-xs text-blue-600 hover:underline">View All</Link>
        )}
      </div>
      {displayed.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-[#64748b] text-center py-4">No team members found.</p>
      ) : (
        <div className="space-y-4">
          {displayed.map((emp) => (
            <div key={emp.id} className="flex items-center gap-3">
              <UserAvatar name={emp.name} src={emp.profilePhoto} className="h-8 w-8 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 dark:text-[#cbd5e1] truncate">{emp.name}</div>
                <WorkloadBar percent={emp.workloadPercent} showLabel={false} className="mt-1" />
              </div>
              <span className="text-xs font-semibold text-gray-600 dark:text-[#94a3b8] shrink-0">{emp.workloadPercent}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
