"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Task, UpdateTaskRequest, TaskStatus, Priority } from "@/types/task";

interface TaskUpdateFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSubmit: (taskId: number, data: UpdateTaskRequest) => Promise<void>;
  isLoading?: boolean;
  canEditPriorityAndDueDate?: boolean; // manager/admin only
}

export function TaskUpdateFormModal({
  open, onOpenChange, task, onSubmit, isLoading, canEditPriorityAndDueDate = false,
}: TaskUpdateFormModalProps) {
  const [form, setForm] = useState<UpdateTaskRequest>({});

  useEffect(() => {
    if (task) {
      setForm({
        status: task.status,
        description: task.description,
        comment: "",
        ...(canEditPriorityAndDueDate ? {
          dueDate: task.dueDate,
          priority: task.priority,
        } : {}),
      });
    }
  }, [task, canEditPriorityAndDueDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    const payload: UpdateTaskRequest = {
      status: form.status,
      description: form.description,
      comment: form.comment?.trim() || undefined,
      ...(canEditPriorityAndDueDate ? {
        dueDate: form.dueDate,
        priority: form.priority,
      } : {}),
    };

    await onSubmit(task.id, payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Task — {task?.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TaskStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">Todo</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="upd-desc">Description</Label>
            <Textarea id="upd-desc" value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Update description" rows={3} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="upd-comment">Comment</Label>
            <Textarea id="upd-comment" value={form.comment ?? ""}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="Add a comment..." rows={2} />
          </div>

          {canEditPriorityAndDueDate && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="upd-due">Due Date</Label>
                <Input id="upd-due" type="date" value={form.dueDate ?? ""}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Priority })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
