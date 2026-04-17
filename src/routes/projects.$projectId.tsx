import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Github, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { RequireRole } from "@/components/RequireRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { MilestonesPanel } from "@/components/projects/MilestonesPanel";
import { GitHubPanel } from "@/components/projects/GitHubPanel";
import {
  computeProgress,
  getProject,
  listMilestones,
  priorityTone,
  statusLabel,
  statusTone,
} from "@/lib/projects";

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  return (
    <RequireRole role="admin">
      <Inner />
    </RequireRole>
  );
}

function Inner() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  });

  const { data: milestones = [] } = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => listMilestones(projectId),
  });

  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("projects").delete().eq("id", projectId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Project deleted");
      qc.invalidateQueries({ queryKey: ["projects"] });
      navigate({ to: "/projects" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <AppShell title="Loading…">
        <Card><CardContent className="py-10 text-sm text-muted-foreground">Loading…</CardContent></Card>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell title="Not found">
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Project not found.{" "}
            <Link to="/projects" className="text-accent">Back to projects</Link>
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
        <>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/projects"><ArrowLeft className="h-4 w-4" /> All projects</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the project and all its milestones. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => remove.mutate()}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`${statusTone[project.status]} border-0 text-[10px] uppercase tracking-wide`}>
                {statusLabel[project.status]}
              </Badge>
              <Badge variant="outline" className={`${priorityTone[project.priority]} border-0 capitalize`}>
                {project.priority}
              </Badge>
              {project.due_date && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Due {new Date(project.due_date).toLocaleDateString()}
                </span>
              )}
              {project.github_owner && project.github_repo && (
                <a
                  href={`https://github.com/${project.github_owner}/${project.github_repo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent"
                >
                  <Github className="h-3 w-3" />
                  {project.github_owner}/{project.github_repo}
                </a>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium uppercase tracking-wide text-muted-foreground">Overall progress</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <Progress value={progress} />
              <p className="mt-2 text-xs text-muted-foreground">
                {milestones.filter((m) => m.is_completed).length} of {milestones.length} milestones complete
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6 text-sm">
            <Detail label="Start date" value={project.start_date ? new Date(project.start_date).toLocaleDateString() : "—"} />
            <Detail label="Due date" value={project.due_date ? new Date(project.due_date).toLocaleDateString() : "—"} />
            <Detail label="Budget" value={project.budget != null ? `$${Number(project.budget).toLocaleString()}` : "—"} />
            <Detail label="Created" value={new Date(project.created_at).toLocaleDateString()} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="milestones" className="mt-6">
        <TabsList>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="github">GitHub activity</TabsTrigger>
        </TabsList>
        <TabsContent value="milestones" className="mt-4">
          <MilestonesPanel projectId={projectId} canEdit />
        </TabsContent>
        <TabsContent value="github" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <GitHubPanel owner={project.github_owner} repo={project.github_repo} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ProjectFormDialog open={editOpen} onOpenChange={setEditOpen} project={project} />
    </AppShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
