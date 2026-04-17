import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];
export type Milestone = Database["public"]["Tables"]["milestones"]["Row"];
export type ProjectStatus = Database["public"]["Enums"]["project_status"];
export type Priority = Database["public"]["Enums"]["priority_level"];

export const PROJECT_STATUSES: ProjectStatus[] = [
  "planning",
  "in_progress",
  "review",
  "on_hold",
  "completed",
  "cancelled",
];

export const PRIORITIES: Priority[] = ["low", "medium", "high", "urgent"];

export const statusLabel: Record<ProjectStatus, string> = {
  planning: "Planning",
  in_progress: "In progress",
  review: "Review",
  on_hold: "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const statusTone: Record<ProjectStatus, string> = {
  planning: "bg-secondary text-secondary-foreground",
  in_progress: "bg-accent/15 text-accent",
  review: "bg-warning/15 text-warning-foreground border border-warning/30",
  on_hold: "bg-muted text-muted-foreground",
  completed: "bg-success/15 text-success border border-success/20",
  cancelled: "bg-destructive/10 text-destructive",
};

export const priorityTone: Record<Priority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-secondary text-secondary-foreground",
  high: "bg-warning/15 text-warning-foreground",
  urgent: "bg-destructive/10 text-destructive",
};

export async function listProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProject(id: string) {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listMilestones(projectId: string) {
  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function listClientProfiles() {
  // Admins can view all profiles via RLS
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, full_name, email, company")
    .order("full_name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export function computeProgress(milestones: Milestone[], fallback: number) {
  if (milestones.length === 0) return fallback;
  const done = milestones.filter((m) => m.is_completed).length;
  return Math.round((done / milestones.length) * 100);
}
