import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Briefcase } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireRole } from "@/components/RequireRole";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { statusLabel, statusTone, type Project } from "@/lib/projects";

export const Route = createFileRoute("/portal")({
  component: PortalPage,
});

function PortalPage() {
  return (
    <RequireRole role="client">
      <Inner />
    </RequireRole>
  );
}

function Inner() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["my-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Project[];
    },
  });

  return (
    <AppShell
      title="My projects"
      description="Live progress on the work we're delivering for you."
    >
      {isLoading ? (
        <Card><CardContent className="py-10 text-sm text-muted-foreground">Loading…</CardContent></Card>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-base font-semibold">No projects assigned yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Once a project is assigned to your account, you'll see milestones, progress, and updates here in real time.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {projects.map((p) => (
            <Link
              key={p.id}
              to="/portal/$projectId"
              params={{ projectId: p.id }}
              className="group rounded-xl border border-border bg-card p-5 shadow-soft transition hover:border-accent/40 hover:shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="truncate text-base font-semibold tracking-tight group-hover:text-accent">
                  {p.name}
                </h3>
                <Badge className={`${statusTone[p.status]} border-0 text-[10px] uppercase tracking-wide`}>
                  {statusLabel[p.status]}
                </Badge>
              </div>
              {p.description && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
              )}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-medium text-foreground">{p.progress}%</span>
                </div>
                <Progress value={p.progress} className="h-1.5" />
              </div>
              {p.due_date && (
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Due {new Date(p.due_date).toLocaleDateString()}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
