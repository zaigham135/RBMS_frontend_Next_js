"use client";

import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/common/DatePicker";
import type { CreateTaskRequest, Priority } from "@/types/task";
import type { Project } from "@/types/project";
import type { User } from "@/types/user";

interface TaskFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateTaskRequest) => Promise<void>;
  projects: Project[];
  employees: User[];  // active only
  isLoading?: boolean;
  defaultAssigneeId?: number; // pre-populate assignee (e.g. from Team page)
}

const defaultForm: CreateTaskRequest = {
  title: "",
  description: "",
  projectId: 0,
  assignedTo: 0,
  dueDate: "",
  priority: "MEDIUM",
};

export function TaskFormModal({ open, onOpenChange, onSubmit, projects, employees, isLoading, defaultAssigneeId }: TaskFormModalProps) {
  const [form, setForm] = useState<CreateTaskRequest>(defaultForm);

  useEffect(() => {
    if (open) {
      setForm({ ...defaultForm, assignedTo: defaultAssigneeId ?? 0 });
    }
  }, [open, defaultAssigneeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Title *</Label>
            <Input id="task-title" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Task title" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea id="task-desc" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Task description" rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Project *</Label>
              <Select
                value={form.projectId ? String(form.projectId) : ""}
                onValueChange={(v) => setForm({ ...form, projectId: Number(v) })}
              >
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Assign To *</Label>
              <Select
                value={form.assignedTo ? String(form.assignedTo) : ""}
                onValueChange={(v) => setForm({ ...form, assignedTo: Number(v) })}
              >
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>
                  {employees.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="task-due">Due Date</Label>
              <DatePicker
                value={form.dueDate}
                onChange={(v) => setForm({ ...form, dueDate: v })}
                placeholder="Pick a due date"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm({ ...form, priority: v as Priority })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading || !form.title || !form.projectId || !form.assignedTo}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
