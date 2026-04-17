import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireRole } from "@/components/RequireRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MilestonesPanel } from "@/components/projects/MilestonesPanel";
import { computeProgress, getProject, listMilestones, statusLabel, statusTone } from "@/lib/projects";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/portal/$projectId")({
  component: ClientProjectPage,
});

function ClientProjectPage() {
  return (
    <RequireRole role="client">
      <Inner />
    </RequireRole>
  );
}

function Inner() {
  const { projectId } = Route.useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  });

  const { data: milestones = [] } = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => listMilestones(projectId),
  });

  const { data: updates = [] } = useQuery({
    queryKey: ["updates", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_updates")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) {
    return <AppShell title="Loading…"><Card><CardContent className="py-10 text-sm text-muted-foreground">Loading…</CardContent></Card></AppShell>;
  }

  if (!project) {
    return (
      <AppShell title="Not found">
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Project not found. <Link to="/portal" className="text-accent">Back</Link>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const progress = computeProgress(milestones, project.progress);

  return (
    <AppShell
      title={project.name}
      description={project.description ?? undefined}
      actions={
        <Button variant="ghost" size="sm" asChild>
          <Link to="/portal"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
      }
    >
      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={`${statusTone[project.status]} border-0 text-[10px] uppercase tracking-wide`}>
              {statusLabel[project.status]}
            </Badge>
            {project.due_date && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Due {new Date(project.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium uppercase tracking-wide text-muted-foreground">Progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <Progress value={progress} />
            <p className="mt-2 text-xs text-muted-foreground">
              {milestones.filter((m) => m.is_completed).length} of {milestones.length} milestones complete
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Milestones</h2>
          <MilestonesPanel projectId={projectId} canEdit={false} />
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Updates</h2>
          {updates.length === 0 ? (
            <div className="rounded-md border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
              No updates yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {updates.map((u) => (
                <li key={u.id} className="rounded-md border border-border bg-card p-3">
                  <p className="text-sm">{u.message}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {new Date(u.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
