import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RequireRole } from "@/components/RequireRole";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <RequireRole role="admin">
      <AppShell title="Projects" description="Track every active project, milestone, and GitHub activity.">
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Projects module ships in Stage 2 — list, detail page, milestones, GitHub sync.
          </CardContent>
        </Card>
      </AppShell>
    </RequireRole>
  );
}
