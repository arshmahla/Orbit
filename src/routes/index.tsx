import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, LineChart, Target } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user && role === "admin") navigate({ to: "/dashboard" });
    else if (user && role === "client") navigate({ to: "/portal" });
  }, [user, role, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="page-shell flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold">
              O
            </div>
            <span className="font-semibold tracking-tight">Orbit</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="page-shell py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Built for solo operators and small teams
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
            Wake up knowing exactly <br className="hidden md:block" />
            <span className="text-accent">what to work on next.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            Orbit unifies your client projects and your lead pipeline in one calm workspace.
            See priorities, progress, and outreach status at a glance — and let your clients
            follow along without the back-and-forth.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                Start using Orbit <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline">See how it works</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-surface-muted">
        <div className="page-shell grid gap-8 py-16 md:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Daily clarity",
              body: "A morning dashboard that surfaces today's priorities, follow-ups, and deadlines so you stop guessing.",
            },
            {
              icon: CheckCircle2,
              title: "Project + client view",
              body: "Track milestones, status, and GitHub activity. Share a clean progress page with your clients.",
            },
            {
              icon: LineChart,
              title: "Lead pipeline & stats",
              body: "Source, outreach, response, follow-up — all in one place, with the numbers to forecast next month.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-surface p-6 shadow-soft">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="page-shell flex h-14 items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Orbit</span>
          <span>Calm, focused, future-proof.</span>
        </div>
      </footer>
    </div>
  );
}
