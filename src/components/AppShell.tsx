import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

interface AppShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function AppShell({ title, description, actions, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-6">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
              {description && (
                <p className="truncate text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </header>
        <div className="px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
