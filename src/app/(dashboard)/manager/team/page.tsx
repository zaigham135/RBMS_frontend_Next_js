"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { useUsers } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";

export default function ManagerTeamPage() {
  const { users, isLoading, fetchManagerEmployees } = useUsers();

  useEffect(() => { fetchManagerEmployees(); }, [fetchManagerEmployees]);

  return (
    <div>
      <PageHeader
        title="My Team"
        description="Employees assigned to your projects"
      />

      {isLoading ? (
        <TableSkeleton rows={5} cols={3} />
      ) : (
        <DataTable
          data={users}
          keyExtractor={(u) => u.id}
          emptyMessage="No team members found"
          columns={[
            { header: "Name", cell: (u) => <span className="font-medium">{u.name}</span> },
            { header: "Email", accessor: "email" },
            {
              header: "Status",
              cell: (u) => (
                <span className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                  u.status === "ACTIVE"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                )}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", u.status === "ACTIVE" ? "bg-green-500" : "bg-red-500")} />
                  {u.status}
                </span>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
