"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useUsers } from "@/hooks/useUsers";
import type { Designation, Role, UserStatus } from "@/types/user";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { UserAvatar } from "@/components/common/UserAvatar";
import { FilterBar } from "@/components/common/FilterBar";
import { ActionButton, Panel, PaginationDisplay, StatCard } from "@/components/common/NexusUI";
import { designationService } from "@/services/designationService";
import {
  Bell, Briefcase, Check, ChevronDown, Download,
  Hourglass, Moon, Plus, Search, ShieldCheck, Sun, Trash2, UserPlus, UsersRound, X,
} from "lucide-react";
import { downloadTextFile } from "@/lib/download";
import { toast } from "sonner";
import Link from "next/link";

const PAGE_SIZE = 10;

const ROLE_STYLES: Record<string, string> = {
  ADMIN:    "bg-[#f5f1ff] text-[#7c3aed]",
  MANAGER:  "bg-[#eef4ff] text-[#1557d6]",
  EMPLOYEE: "bg-[#f1f5f9] text-[#475467]",
};

const ROLE_OPTIONS: { value: Role; label: string; color: string }[] = [
  { value: "ADMIN",    label: "Admin",    color: "text-[#7c3aed]" },
  { value: "MANAGER",  label: "Manager",  color: "text-[#1557d6]" },
  { value: "EMPLOYEE", label: "Employee", color: "text-[#475467]" },
];

// ── Role dropdown ─────────────────────────────────────────────────────────────
function RoleDropdown({ userId, currentRole, onUpdate }: {
  userId: number; currentRole: Role; onUpdate: (id: number, role: Role) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const current = ROLE_OPTIONS.find(r => r.value === currentRole);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(v => !v)}
        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all min-w-[110px] ${
          open ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
               : "border-[#d6e2ef] bg-white text-[#1f2937] hover:border-blue-300 dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#f1f5f9]"
        }`}>
        <span className={`flex-1 text-left ${current?.color}`}>{current?.label ?? currentRole}</span>
        <ChevronDown className={`h-3.5 w-3.5 opacity-40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-40 rounded-2xl border border-gray-100 bg-white py-1.5 shadow-xl dark:bg-[#1e293b] dark:border-[#334155] dark:shadow-black/40 animate-in fade-in-0 zoom-in-95 duration-100">
          {ROLE_OPTIONS.map(opt => {
            const isSel = currentRole === opt.value;
            return (
              <button key={opt.value} type="button" onClick={() => { onUpdate(userId, opt.value); setOpen(false); }}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-colors ${
                  isSel ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-50 dark:text-[#94a3b8] dark:hover:bg-[#334155] dark:hover:text-white"
                }`}>
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${isSel ? "border-blue-500 bg-blue-500" : "border-gray-300 dark:border-[#475569]"}`}>
                  {isSel && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                </span>
                <span className={opt.color}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Designation dropdown ──────────────────────────────────────────────────────
function DesignationDropdown({ userId, current, designations, onUpdate }: {
  userId: number; current: string | null | undefined;
  designations: Designation[]; onUpdate: (userId: number, d: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(v => !v)}
        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all min-w-[130px] ${
          open ? "border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950 dark:text-purple-300"
               : current
                 ? "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
                 : "border-gray-200 bg-gray-50 text-gray-400 dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#64748b]"
        }`}>
        <Briefcase className="h-3 w-3 shrink-0 opacity-60" />
        <span className="flex-1 text-left truncate">{current ?? "No designation"}</span>
        <ChevronDown className={`h-3 w-3 opacity-40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-2xl border border-gray-100 bg-white py-1.5 shadow-xl dark:bg-[#1e293b] dark:border-[#334155] dark:shadow-black/40 animate-in fade-in-0 zoom-in-95 duration-100">
          <button type="button" onClick={() => { onUpdate(userId, null); setOpen(false); }}
            className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-colors ${
              !current ? "bg-gray-50 text-gray-900 dark:bg-[#334155] dark:text-white"
                       : "text-gray-500 hover:bg-gray-50 dark:text-[#94a3b8] dark:hover:bg-[#334155]"
            }`}>
            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${!current ? "border-purple-500 bg-purple-500" : "border-gray-300 dark:border-[#475569]"}`}>
              {!current && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
            </span>
            None
          </button>
          {designations.length > 0 && <div className="my-1 border-t border-gray-50 dark:border-[#334155]" />}
          {designations.map(d => {
            const isSel = current === d.name;
            return (
              <button key={d.id} type="button" onClick={() => { onUpdate(userId, d.name); setOpen(false); }}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-colors ${
                  isSel ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                        : "text-gray-700 hover:bg-gray-50 dark:text-[#94a3b8] dark:hover:bg-[#334155] dark:hover:text-white"
                }`}>
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${isSel ? "border-purple-500 bg-purple-500" : "border-gray-300 dark:border-[#475569]"}`}>
                  {isSel && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                </span>
                <span className="truncate">{d.name}</span>
                {d.applicableRole && (
                  <span className="ml-auto text-[10px] text-gray-400 dark:text-[#475569]">{d.applicableRole}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Manage Designations Panel ─────────────────────────────────────────────────
function ManageDesignationsPanel({ designations, onRefresh }: {
  designations: Designation[]; onRefresh: () => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await designationService.create(name.trim(), role || undefined);
      toast.success(`Designation "${name.trim()}" created`);
      setName(""); setRole("");
      onRefresh();
    } catch { toast.error("Failed to create designation"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (d: Designation) => {
    try {
      await designationService.delete(d.id);
      toast.success(`"${d.name}" deleted`);
      onRefresh();
    } catch { toast.error("Failed to delete designation"); }
  };

  return (
    <Panel className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-4 w-4 text-purple-500" />
        <h3 className="text-sm font-semibold text-[#1f2937] dark:text-[#f1f5f9]">Manage Designations</h3>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-2 mb-4">
        <div className="flex-1 min-w-[140px]">
          <label className="text-[11px] font-medium text-gray-500 dark:text-[#64748b] mb-1 block">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Tech Lead"
            className="w-full rounded-xl border border-gray-200 bg-white dark:border-[#334155] dark:bg-[#0f172a] dark:text-[#f1f5f9] px-3 py-2 text-xs outline-none focus:border-purple-400 dark:focus:border-purple-600 transition-colors"
          />
        </div>
        <div className="min-w-[120px]">
          <label className="text-[11px] font-medium text-gray-500 dark:text-[#64748b] mb-1 block">For Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white dark:border-[#334155] dark:bg-[#0f172a] dark:text-[#f1f5f9] px-3 py-2 text-xs outline-none focus:border-purple-400 dark:focus:border-purple-600 transition-colors"
          >
            <option value="">Any</option>
            <option value="MANAGER">Manager</option>
            <option value="EMPLOYEE">Employee</option>
          </select>
        </div>
        <button type="submit" disabled={saving || !name.trim()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </form>

      {/* List */}
      {designations.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-[#475569] text-center py-3">No designations yet.</p>
      ) : (
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {designations.map(d => (
            <div key={d.id} className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-[#334155] bg-gray-50 dark:bg-[#0f172a] px-3 py-2">
              <div>
                <span className="text-xs font-medium text-gray-800 dark:text-[#f1f5f9]">{d.name}</span>
                {d.applicableRole && (
                  <span className="ml-2 text-[10px] text-gray-400 dark:text-[#475569]">{d.applicableRole}</span>
                )}
              </div>
              <button type="button" onClick={() => handleDelete(d)}
                className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const { name, profilePhoto, userId } = useAuth();
  const { isDark, toggle } = useTheme(userId ?? undefined);
  const { users, isLoading, fetchAllUsers, updateUserRole, updateUserStatus } = useUsers();

  const [page, setPage]               = useState(0);
  const [search, setSearch]           = useState("");
  const [roleFilter, setRoleFilter]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [showDesignationPanel, setShowDesignationPanel] = useState(false);

  useEffect(() => { fetchAllUsers(); }, [fetchAllUsers]);

  const loadDesignations = useCallback(() => {
    designationService.getAll()
      .then(res => setDesignations(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  useEffect(() => { loadDesignations(); }, [loadDesignations]);

  const handleAssignDesignation = async (userId: number, designation: string | null) => {
    try {
      await designationService.assignToUser(userId, designation);
      toast.success(designation ? `Designation set to "${designation}"` : "Designation cleared");
      fetchAllUsers();
    } catch { toast.error("Failed to update designation"); }
  };

  const filtered = useMemo(() => users.filter((u) => {
    const matchSearch = !search
      || u.name.toLowerCase().includes(search.toLowerCase())
      || u.email.toLowerCase().includes(search.toLowerCase());
    return matchSearch
      && (!roleFilter   || u.role   === roleFilter)
      && (!statusFilter || u.status === statusFilter);
  }), [users, search, roleFilter, statusFilter]);

  const totalPages   = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleUsers = useMemo(
    () => filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [filtered, page]
  );

  const totalUsers = users.length;
  const managers   = users.filter(u => u.role === "MANAGER").length;
  const admins     = users.filter(u => u.role === "ADMIN").length;
  const inactive   = users.filter(u => u.status === "INACTIVE").length;

  const handleClearAll = () => { setSearch(""); setRoleFilter(""); setStatusFilter(""); setPage(0); };

  return (
    <div className="min-h-full bg-[#f7fbff] dark:bg-[#0f172a]">
      {/* Topbar */}
      <div className="flex items-center justify-between border-b border-[#e3ebf5] bg-[#f7fbff] px-6 py-4 dark:bg-[#0f172a] dark:border-[#1e293b]">
        <div>
          <h1 className="text-[18px] font-bold text-[#101828] dark:text-[#f1f5f9]">User Management</h1>
          <p className="text-[13px] text-[#667085] dark:text-[#94a3b8]">Manage roles, designations and account status</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 rounded-[14px] bg-[#edf4fa] px-3.5 py-2 text-[#667085] dark:bg-[#1e293b] dark:text-[#94a3b8]">
            <Search className="h-4 w-4 shrink-0" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search users by name or email"
              className="w-52 bg-transparent text-[13px] outline-none placeholder:text-[#9aa5b4] dark:text-[#94a3b8]" />
          </label>
          <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#e3ebf5] bg-[#f7fbff] text-[#51607a] dark:border-[#334155] dark:bg-[#0f172a] dark:text-[#94a3b8]">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#d14343]" />
          </button>
          <button
            type="button"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e3ebf5] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[#51607a] dark:text-[#94a3b8] transition-colors hover:bg-[#f8fbff] dark:hover:bg-[#334155]"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link href="/admin/account" className="flex items-center gap-2.5 rounded-[16px] px-2 py-1.5 hover:bg-[#f4f8fc] dark:hover:bg-[#1e293b]">
            <UserAvatar name={name} src={profilePhoto} className="h-9 w-9 ring-0" />
            <div className="leading-tight">
              <div className="text-[13px] font-semibold text-[#111827] dark:text-[#f1f5f9]">{name ?? "System Admin"}</div>
              <div className="text-[11px] uppercase tracking-[0.08em] text-[#6b7280] dark:text-[#64748b]">Super User</div>
            </div>
          </Link>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <StatCard icon={UsersRound}  label="Total Users"        value={String(totalUsers)} iconClassName="bg-[#eef4ff] text-[#1557d6]" />
          <StatCard icon={ShieldCheck} label="Managers"           value={String(managers)}   iconClassName="bg-[#eef9f1] text-[#16a34a]" />
          <StatCard icon={UserPlus}    label="Admins"             value={String(admins)}     iconClassName="bg-[#f5f1ff] text-[#7c3aed]" />
          <StatCard icon={Hourglass}   label="Disabled Accounts"  value={String(inactive)}   iconClassName="bg-[#fff4ea] text-[#ea580c]" />
        </div>

        {/* Designation panel toggle */}
        <div className="flex justify-end">
          <button type="button" onClick={() => setShowDesignationPanel(v => !v)}
            className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/30 dark:text-purple-300 dark:hover:bg-purple-950/50 transition-colors">
            <Briefcase className="h-3.5 w-3.5" />
            {showDesignationPanel ? "Hide Designations" : "Manage Designations"}
            {showDesignationPanel ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          </button>
        </div>

        {showDesignationPanel && (
          <ManageDesignationsPanel designations={designations} onRefresh={loadDesignations} />
        )}

        {/* Filter bar */}
        <FilterBar
          dropdowns={[
            { id: "role", placeholder: "All Roles", value: roleFilter,
              options: [{ value: "ADMIN", label: "Admin" }, { value: "MANAGER", label: "Manager" }, { value: "EMPLOYEE", label: "Employee" }],
              onChange: v => { setRoleFilter(v); setPage(0); }, chipLabel: "Role" },
            { id: "status", placeholder: "All Statuses", value: statusFilter,
              options: [{ value: "ACTIVE", label: "Active" }, { value: "INACTIVE", label: "Inactive" }],
              onChange: v => { setStatusFilter(v); setPage(0); }, chipLabel: "Status" },
          ]}
          actions={
            <ActionButton icon={Download} size="compact"
              onClick={() => downloadTextFile("workspace-users.csv",
                ["name,email,role,designation,status", ...users.map(u => `"${u.name}","${u.email}","${u.role}","${u.designation ?? ""}","${u.status}"`)].join("\n"),
                "text/csv;charset=utf-8")}>
              Export CSV
            </ActionButton>
          }
          onClearAll={handleClearAll}
        />

        {/* Table */}
        <Panel className="overflow-hidden">
          <div className="grid min-w-[1000px] grid-cols-12 bg-[#f8fbff] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#7b8794] dark:bg-[#1e293b] dark:text-[#64748b]">
            <div className="col-span-3">User</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Designation</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Member Since</div>
            <div className="col-span-2 text-right">Change Role</div>
          </div>

          {(isLoading ? Array.from({ length: PAGE_SIZE }, (_, i) => ({ id: i })) : visibleUsers).map((user: any, index) => (
            <div key={user.id ?? index} className="grid min-w-[1000px] grid-cols-12 items-center border-b border-[#edf2f7] px-6 py-4 last:border-b-0 dark:border-[#334155]">

              {/* User */}
              <div className="col-span-3 flex items-center gap-3">
                <UserAvatar name={user.name} src={user.profilePhoto} className="h-10 w-10 ring-0" />
                <div>
                  {user.name ? (
                    <>
                      <div className="text-[14px] font-semibold text-[#1f2937] dark:text-[#f1f5f9]">{user.name}</div>
                      <div className="text-[12px] text-[#667085] dark:text-[#94a3b8]">{user.email}</div>
                    </>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />
                      <div className="h-3 w-40 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Role badge */}
              <div className="col-span-2">
                {user.role
                  ? <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${ROLE_STYLES[user.role] ?? "bg-[#f1f5f9] text-[#475467]"}`}>{user.role}</span>
                  : <div className="h-6 w-20 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />}
              </div>

              {/* Designation */}
              <div className="col-span-2">
                {user.id && user.role !== "ADMIN" ? (
                  <DesignationDropdown
                    userId={user.id}
                    current={user.designation}
                    designations={designations.filter(d => !d.applicableRole || d.applicableRole === user.role)}
                    onUpdate={handleAssignDesignation}
                  />
                ) : user.id ? (
                  <span className="text-[11px] text-gray-400 dark:text-[#475569]">N/A</span>
                ) : (
                  <div className="h-6 w-28 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />
                )}
              </div>

              {/* Status toggle */}
              <div className="col-span-1">
                {user.id ? (
                  <button type="button"
                    onClick={() => updateUserStatus(user.id, user.status === "ACTIVE" ? "INACTIVE" as UserStatus : "ACTIVE" as UserStatus)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${user.status === "ACTIVE" ? "bg-[#1557d6]" : "bg-[#94a3b8]"}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${user.status === "ACTIVE" ? "right-0.5" : "left-0.5"}`} />
                  </button>
                ) : <div className="h-6 w-11 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />}
              </div>

              {/* Member since */}
              <div className="col-span-2 text-[13px] text-[#475467] dark:text-[#94a3b8]">
                {user.createdAt ? (
                  <div>
                    <div>{new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                    <div className={`text-[11px] ${user.status === "ACTIVE" ? "text-[#16a34a]" : "text-[#94a3b8]"}`}>
                      {user.status === "ACTIVE" ? "Online" : "Offline"}
                    </div>
                  </div>
                ) : <div className="h-4 w-24 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />}
              </div>

              {/* Role dropdown */}
              <div className="col-span-2 flex items-center justify-end">
                {user.id
                  ? <RoleDropdown userId={user.id} currentRole={user.role} onUpdate={updateUserRole} />
                  : <div className="h-8 w-28 rounded-xl bg-[#edf2f7] dark:bg-[#334155]" />}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-[#edf2f7] px-6 py-4 dark:border-[#334155]">
            <span className="text-[13px] text-[#556274] dark:text-[#64748b]">
              {`Showing ${filtered.length ? page * PAGE_SIZE + 1 : 0}–${page * PAGE_SIZE + visibleUsers.length} of ${filtered.length.toLocaleString()} users`}
            </span>
            <PaginationDisplay compact page={Math.min(page + 1, totalPages)} total={totalPages} onPageChange={p => setPage(p - 1)} />
          </div>
        </Panel>
      </div>
    </div>
  );
}
