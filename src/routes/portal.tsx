import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RequireRole } from "@/components/RequireRole";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/portal")({
  component: PortalPage,
});

function PortalPage() {
  return (
    <RequireRole role="client">
      <AppShell title="My projects" description="Live progress on the work we're delivering for you.">
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Your project list will appear here. Once a project is assigned to your account, you'll
            see milestones, progress, and updates in real time.
          </CardContent>
        </Card>
      </AppShell>
    </RequireRole>
  );
}
