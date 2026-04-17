import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, FolderKanban, Calendar, Github } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireRole } from "@/components/RequireRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import {
  PROJECT_STATUSES,
  listProjects,
  priorityTone,
  statusLabel,
  statusTone,
  type Project,
  type ProjectStatus,
} from "@/lib/projects";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | ProjectStatus>("all");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [projects, q, status]);

  return (
    <RequireRole role="admin">
      <AppShell
        title="Projects"
        description="Track every active project, milestone, and GitHub activity."
        actions={
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4" /> New project
          </Button>
        }
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {PROJECT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Loading projects…</CardContent></Card>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <FolderKanban className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-base font-semibold">No projects yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first project to start tracking milestones and GitHub activity.
                </p>
              </div>
              <Button onClick={() => { setEditing(null); setOpen(true); }}>
                <Plus className="h-4 w-4" /> New project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to="/projects/$projectId"
                params={{ projectId: p.id }}
                className="group rounded-xl border border-border bg-card p-5 shadow-soft transition hover:border-accent/40 hover:shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold tracking-tight group-hover:text-accent">
                      {p.name}
                    </h3>
                    {p.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {p.description}
                      </p>
                    )}
                  </div>
                  <Badge className={`${statusTone[p.status]} border-0 text-[10px] uppercase tracking-wide`}>
                    {statusLabel[p.status]}
                  </Badge>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-medium text-foreground">{p.progress}%</span>
                  </div>
                  <Progress value={p.progress} className="h-1.5" />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  <Badge variant="outline" className={`${priorityTone[p.priority]} border-0 capitalize`}>
                    {p.priority}
                  </Badge>
                  {p.due_date && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(p.due_date).toLocaleDateString()}
                    </span>
                  )}
                  {p.github_owner && p.github_repo && (
                    <span className="inline-flex items-center gap-1">
                      <Github className="h-3 w-3" />
                      {p.github_owner}/{p.github_repo}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <ProjectFormDialog open={open} onOpenChange={setOpen} project={editing} />
      </AppShell>
    </RequireRole>
  );
}
