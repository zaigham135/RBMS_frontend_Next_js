"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Project, CreateProjectRequest, UpdateProjectRequest } from "@/types/project";
import type { User } from "@/types/user";

interface ProjectFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProjectRequest | UpdateProjectRequest) => Promise<void>;
  project?: Project | null; // if present → edit mode
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
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: project?.name ?? "",
        description: project?.description ?? "",
        managerId: project?.managerId ? String(project.managerId) : "",
        dueDate: project?.dueDate ?? "",
      });
    }
  }, [open, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateProjectRequest | UpdateProjectRequest = {
      name: form.name,
      description: form.description,
      managerId: Number(form.managerId),
      ...(isAdmin && form.dueDate ? { dueDate: form.dueDate } : {}),
      ...(!isEdit && form.dueDate ? { dueDate: form.dueDate } : {}),
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
            <Input id="proj-name" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Project name" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proj-desc">Description</Label>
            <Textarea id="proj-desc" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Project description" rows={3} />
          </div>

          <div className="space-y-1.5">
            <Label>Manager</Label>
            <Select value={form.managerId} onValueChange={(v) => setForm({ ...form, managerId: v })}>
              <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
              <SelectContent>
                {managers.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due date: shown always on create, but edit only for admin */}
          {(!isEdit || isAdmin) && (
            <div className="space-y-1.5">
              <Label htmlFor="proj-due">
                Due Date {isEdit && isAdmin && <span className="text-xs text-muted-foreground">(Admin only)</span>}
              </Label>
              <Input id="proj-due" type="date" value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading || !form.name}>
              {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
