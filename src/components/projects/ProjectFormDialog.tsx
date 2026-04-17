import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PRIORITIES,
  PROJECT_STATUSES,
  listClientProfiles,
  statusLabel,
  type Project,
} from "@/lib/projects";
import { useAuth } from "@/lib/auth";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

const empty = {
  name: "",
  description: "",
  status: "planning" as const,
  priority: "medium" as const,
  client_id: "",
  start_date: "",
  due_date: "",
  github_owner: "",
  github_repo: "",
  budget: "",
};

export function ProjectFormDialog({ open, onOpenChange, project }: Props) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ ...empty });

  const { data: clients = [] } = useQuery({
    queryKey: ["client-profiles"],
    queryFn: listClientProfiles,
    enabled: open,
  });

  useEffect(() => {
    if (!open) return;
    if (project) {
      setForm({
        name: project.name ?? "",
        description: project.description ?? "",
        status: (project.status as typeof empty.status) ?? "planning",
        priority: (project.priority as typeof empty.priority) ?? "medium",
        client_id: project.client_id ?? "",
        start_date: project.start_date ?? "",
        due_date: project.due_date ?? "",
        github_owner: project.github_owner ?? "",
        github_repo: project.github_repo ?? "",
        budget: project.budget != null ? String(project.budget) : "",
      });
    } else {
      setForm({ ...empty });
    }
  }, [open, project]);

  const save = useMutation({
    mutationFn: async () => {
      if (!form.name.trim()) throw new Error("Project name is required");
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        status: form.status,
        priority: form.priority,
        client_id: form.client_id || null,
        start_date: form.start_date || null,
        due_date: form.due_date || null,
        github_owner: form.github_owner.trim() || null,
        github_repo: form.github_repo.trim() || null,
        budget: form.budget ? Number(form.budget) : null,
      };
      if (project) {
        const { error } = await supabase.from("projects").update(payload).eq("id", project.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("projects")
          .insert({ ...payload, created_by: user?.id ?? null });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      if (project) qc.invalidateQueries({ queryKey: ["project", project.id] });
      toast.success(project ? "Project updated" : "Project created");
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{project ? "Edit project" : "New project"}</DialogTitle>
          <DialogDescription>
            {project ? "Update project details, status, and assignment." : "Create a project to track milestones, progress, and GitHub activity."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Acme website redesign"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What is this project about?"
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as typeof empty.status })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm({ ...form, priority: v as typeof empty.priority })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Client</Label>
            <Select
              value={form.client_id || "none"}
              onValueChange={(v) => setForm({ ...form, client_id: v === "none" ? "" : v })}
            >
              <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.user_id} value={c.user_id}>
                    {c.full_name || c.email} {c.company ? `· ${c.company}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              The assigned client will see this project in their portal.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="start">Start date</Label>
              <Input
                id="start"
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="due">Due date</Label>
              <Input
                id="due"
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2 sm:col-span-1">
              <Label htmlFor="owner">GitHub owner</Label>
              <Input
                id="owner"
                value={form.github_owner}
                onChange={(e) => setForm({ ...form, github_owner: e.target.value })}
                placeholder="vercel"
              />
            </div>
            <div className="grid gap-2 sm:col-span-1">
              <Label htmlFor="repo">GitHub repo</Label>
              <Input
                id="repo"
                value={form.github_repo}
                onChange={(e) => setForm({ ...form, github_repo: e.target.value })}
                placeholder="next.js"
              />
            </div>
            <div className="grid gap-2 sm:col-span-1">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? "Saving…" : project ? "Save changes" : "Create project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
