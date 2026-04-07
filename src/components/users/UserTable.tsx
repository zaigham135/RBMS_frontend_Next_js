"use client";

import { memo } from "react";
import { DataTable } from "@/components/common/DataTable";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { User, Role, UserStatus } from "@/types/user";

interface UserTableProps {
  users: User[];
  onRoleChange: (userId: number, role: Role) => void;
  onStatusToggle: (userId: number, status: UserStatus) => void;
}

export const UserTable = memo(function UserTable({ users, onRoleChange, onStatusToggle }: UserTableProps) {
  return (
    <DataTable
      data={users}
      keyExtractor={(u) => u.id}
      emptyMessage="No users found"
      columns={[
        {
          header: "Name",
          cell: (u) => (
            <div className="flex items-center gap-3">
              <UserAvatar name={u.name} src={u.profilePhoto} className="h-9 w-9" />
              <span className="font-medium">{u.name}</span>
            </div>
          ),
        },
        { header: "Email", accessor: "email" },
        {
          header: "Role",
          cell: (u) => (
            <Select value={u.role} onValueChange={(v) => onRoleChange(u.id, v as Role)}>
              <SelectTrigger className="h-8 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="EMPLOYEE">Employee</SelectItem>
              </SelectContent>
            </Select>
          ),
        },
        {
          header: "Status",
          cell: (u) => (
            <span className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
              u.status === "ACTIVE"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            )}>
              {u.status}
            </span>
          ),
        },
        { header: "Created", cell: (u) => formatDate(u.createdAt) },
        {
          header: "Actions",
          cell: (u) => (
            <Button
              size="sm"
              variant={u.status === "ACTIVE" ? "outline" : "default"}
              className={u.status === "ACTIVE" ? "border-red-200 text-red-600 hover:bg-red-50" : ""}
              onClick={() => onStatusToggle(u.id, u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
            >
              {u.status === "ACTIVE" ? "Deactivate" : "Activate"}
            </Button>
          ),
        },
      ]}
    />
  );
});
