import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { listMilestones, type Milestone } from "@/lib/projects";

export function MilestonesPanel({
  projectId,
  canEdit,
}: {
  projectId: string;
  canEdit: boolean;
}) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");

  const { data: milestones = [], isLoading } = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => listMilestones(projectId),
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("Title required");
      const { error } = await supabase.from("milestones").insert({
        project_id: projectId,
        title: title.trim(),
        due_date: due || null,
        sort_order: milestones.length,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["milestones", projectId] });
      qc.invalidateQueries({ queryKey: ["project", projectId] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      setTitle("");
      setDue("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async (m: Milestone) => {
      const { error } = await supabase
        .from("milestones")
        .update({
          is_completed: !m.is_completed,
          completed_at: !m.is_completed ? new Date().toISOString() : null,
        })
        .eq("id", m.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["milestones", projectId] });
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("milestones").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["milestones", projectId] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Milestone removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      {canEdit && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="New milestone title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add.mutate()}
          />
          <Input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="sm:w-44"
          />
          <Button onClick={() => add.mutate()} disabled={add.isPending}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading milestones…</p>
      ) : milestones.length === 0 ? (
        <div className="rounded-md border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          No milestones yet. {canEdit && "Add the first one above."}
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border bg-card">
          {milestones.map((m) => (
            <li key={m.id} className="flex items-center gap-3 px-4 py-3">
              <Checkbox
                checked={m.is_completed}
                disabled={!canEdit}
                onCheckedChange={() => canEdit && toggle.mutate(m)}
              />
              <div className="min-w-0 flex-1">
                <div
                  className={`text-sm font-medium ${
                    m.is_completed ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {m.title}
                </div>
                {m.due_date && (
                  <div className="text-xs text-muted-foreground">
                    Due {new Date(m.due_date).toLocaleDateString()}
                  </div>
                )}
              </div>
              {m.is_completed && <Check className="h-4 w-4 text-success" />}
              {canEdit && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => remove.mutate(m.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
