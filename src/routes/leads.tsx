import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RequireRole } from "@/components/RequireRole";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/leads")({
  component: LeadsPage,
});

function LeadsPage() {
  return (
    <RequireRole role="admin">
      <AppShell title="Leads" description="Your full pipeline — sources, outreach, responses, follow-ups.">
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            CRM ships in Stage 3 — pipeline board, lead details, activity timeline, filters.
          </CardContent>
        </Card>
      </AppShell>
    </RequireRole>
  );
}
