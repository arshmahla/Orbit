import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth, type AppRole } from "@/lib/auth";

export function RequireRole({ role, children }: { role: AppRole; children: ReactNode }) {
  const { user, role: userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    if (userRole && userRole !== role) {
      navigate({ to: userRole === "admin" ? "/dashboard" : "/portal" });
    }
  }, [user, userRole, loading, role, navigate]);

  if (loading || !user || userRole !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
  return <>{children}</>;
}
