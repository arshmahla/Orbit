import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RequireRole } from "@/components/RequireRole";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/stats")({
  component: StatsPage,
});

function StatsPage() {
  return (
    <RequireRole role="admin">
      <AppShell title="Statistics" description="Trends across leads, conversions, and project velocity.">
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Statistics ships in Stage 4 — charts, conversion %, response rate, forecast.
          </CardContent>
        </Card>
      </AppShell>
    </RequireRole>
  );
}
