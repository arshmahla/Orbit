import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, FolderKanban, Users2, BarChart3, LogOut, Briefcase } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/leads", label: "Leads", icon: Users2 },
  { to: "/stats", label: "Statistics", icon: BarChart3 },
];

const clientNav = [
  { to: "/portal", label: "My Projects", icon: Briefcase },
];

export function AppSidebar() {
  const { role, user, signOut } = useAuth();
  const location = useLocation();
  const items = role === "admin" ? adminNav : clientNav;

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold">
          O
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight text-sidebar-foreground">Orbit</div>
          <div className="text-[11px] text-muted-foreground -mt-0.5">Project & Lead OS</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="mb-2 px-2">
          <div className="truncate text-xs font-medium text-sidebar-foreground">{user?.email}</div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{role ?? "guest"}</div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
