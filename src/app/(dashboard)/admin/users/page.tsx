"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { UserTable } from "@/components/users/UserTable";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { useUsers } from "@/hooks/useUsers";
import type { Role, UserStatus } from "@/types/user";

export default function AdminUsersPage() {
  const { users, isLoading, fetchAllUsers, updateUserRole, updateUserStatus } = useUsers();

  useEffect(() => { fetchAllUsers(); }, [fetchAllUsers]);

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage system users — update roles and activation status"
      />

      {isLoading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : (
        <UserTable
          users={users}
          onRoleChange={(id, role: Role) => updateUserRole(id, role)}
          onStatusToggle={(id, status: UserStatus) => updateUserStatus(id, status)}
        />
      )}
    </div>
  );
}
