"use client";

import { useState, useMemo } from "react";
import { UserAvatar } from "@/components/common/UserAvatar";
import { WorkloadBar } from "@/components/common/WorkloadBar";
import type { EmployeeWithWorkload } from "@/types/managerTeam";

interface TeamRosterTableProps {
  employees: EmployeeWithWorkload[];
  onAssign?: (employee: EmployeeWithWorkload) => void;
}

export function TeamRosterTable({ employees, onAssign }: TeamRosterTableProps) {
  const [activeTab, setActiveTab] = useState("All Members");

  // Dynamically generate tabs based on unique departments in employees
  const tabs = useMemo(() => {
    const departments = Array.from(
      new Set(employees.map((e) => e.department).filter(Boolean))
    ).sort();
    return ["All Members", ...departments];
  }, [employees]);

  const filtered = activeTab === "All Members"
    ? employees
    : employees.filter((e) => e.department === activeTab);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] shadow-sm overflow-hidden">
      <div className="flex items-center gap-1 border-b border-gray-100 dark:border-[#334155] px-5 pt-4 pb-0">
        {tabs.map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 dark:text-[#94a3b8] hover:text-gray-700 dark:hover:text-white"
            }`}>
            {tab}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100 dark:border-[#334155] bg-gray-50 dark:bg-[#0f172a]">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Member</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Role</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Active Projects</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Workload</th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-[#334155]">
            {filtered.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-[#334155]/30 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={emp.name} src={emp.profilePhoto} className="h-9 w-9 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9]">{emp.name}</div>
                      <div className="text-xs text-gray-400 dark:text-[#64748b]">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600 dark:text-[#94a3b8]">{emp.role}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {(emp.projectDetails ?? emp.activeProjects.map(name => ({ name, status: 'ACTIVE' }))).slice(0, 3).map((proj) => {
                      const isOnHold = proj.status === 'ON_HOLD';
                      return (
                        <span key={proj.name} className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          isOnHold
                            ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                            : "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                        }`}>
                          {proj.name}
                        </span>
                      );
                    })}
                    {emp.activeProjects.length === 0 && <span className="text-xs text-gray-400 dark:text-[#64748b]">—</span>}
                  </div>
                </td>
                <td className="px-5 py-4 w-48"><WorkloadBar percent={emp.workloadPercent} /></td>
                <td className="px-5 py-4 text-right">
                  <button type="button" onClick={() => onAssign?.(emp)}
                    className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors">
                    Assign
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400 dark:text-[#64748b]">No members found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
