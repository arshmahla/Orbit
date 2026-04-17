import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RequireRole } from "@/components/RequireRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <RequireRole role="admin">
      <AppShell title="Good morning" description="Your daily snapshot — coming together in the next stage.">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Leads today", value: "—" },
            { label: "Pending follow-ups", value: "—" },
            { label: "Active projects", value: "—" },
            { label: "Due this week", value: "—" },
          ].map((s) => (
            <Card key={s.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tracking-tight">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardContent className="flex items-center gap-3 py-8 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            Stage 1 complete. In the next message we'll bring this dashboard to life with today's
            priorities, leads, and project deadlines.
          </CardContent>
        </Card>
      </AppShell>
    </RequireRole>
  );
}
