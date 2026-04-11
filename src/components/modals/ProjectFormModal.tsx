"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/common/DatePicker";
import type { Project, CreateProjectRequest, UpdateProjectRequest } from "@/types/project";
import type { User } from "@/types/user";

interface ProjectFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProjectRequest | UpdateProjectRequest) => Promise<void>;
  project?: Project | null;
  managers: User[];
  isAdmin?: boolean;
  isLoading?: boolean;
}

export function ProjectFormModal({
  open, onOpenChange, onSubmit, project, managers, isAdmin = false, isLoading,
}: ProjectFormModalProps) {
  const isEdit = !!project;

  const [form, setForm] = useState({
    name: "",
    description: "",
    managerId: "",
    dueDate: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: project?.name ?? "",
        description: project?.description ?? "",
        managerId: project?.managerId ? String(project.managerId) : "",
        dueDate: project?.dueDate ?? "",
        status: project?.status ?? "ACTIVE",
      });
    }
  }, [open, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateProjectRequest | UpdateProjectRequest = {
      name: form.name,
      description: form.description,
      managerId: Number(form.managerId),
      ...(form.dueDate ? { dueDate: form.dueDate } : {}),
      ...(isEdit && isAdmin ? { status: form.status } : {}),
    };
    await onSubmit(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Project" : "Create Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="proj-name">Project Name *</Label>
            <Input
              id="proj-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Project name"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proj-desc">Description</Label>
            <Textarea
              id="proj-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Project description"
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proj-manager">Manager</Label>
            <select
              id="proj-manager"
              value={form.managerId}
              onChange={(e) => setForm({ ...form, managerId: e.target.value })}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="" disabled>Select manager</option>
              {managers.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.name} — {m.email}
                </option>
              ))}
            </select>
          </div>

          {(!isEdit || isAdmin) && (
            <div className="space-y-1.5">
              <Label htmlFor="proj-due">
                Due Date{isEdit && isAdmin && <span className="ml-1 text-xs text-muted-foreground">(Admin only)</span>}
              </Label>
              <DatePicker
                value={form.dueDate}
                onChange={(v) => setForm({ ...form, dueDate: v })}
                placeholder="Pick a due date"
              />
            </div>
          )}

          {/* Status — admin only, edit mode */}
          {isEdit && isAdmin && (
            <div className="space-y-1.5">
              <Label htmlFor="proj-status">
                Status <span className="ml-1 text-xs text-muted-foreground">(Admin only)</span>
              </Label>
              <select
                id="proj-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading || !form.name || !form.managerId}>
              {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
