"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@/types/user";

interface ProjectFiltersProps {
  managers: User[];
  managerId: string;
  onManagerChange: (v: string) => void;
}

export function ProjectFilters({ managers, managerId, onManagerChange }: ProjectFiltersProps) {
  return (
    <Select value={managerId || "all"} onValueChange={(v) => onManagerChange(v === "all" ? "" : v)}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="All Managers" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Managers</SelectItem>
        {managers.map((m) => (
          <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
