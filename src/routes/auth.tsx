import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(1, "Name required").max(100),
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user && role === "admin") navigate({ to: "/dashboard" });
    else if (user && role === "client") navigate({ to: "/portal" });
  }, [user, role, loading, navigate]);

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signUpSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
      fullName: fd.get("fullName"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: parsed.data.fullName },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created. You can sign in now.");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left visual panel */}
      <div className="hidden md:flex flex-col justify-between bg-primary text-primary-foreground p-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-foreground text-primary text-sm font-semibold">
            O
          </div>
          <span className="font-semibold tracking-tight">Orbit</span>
        </Link>
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight leading-tight">
            One workspace for your projects, clients, and pipeline.
          </h2>
          <p className="mt-4 text-primary-foreground/75 text-sm leading-relaxed">
            Stop juggling tabs. Wake up to a clear list of what matters today and ship with
            confidence.
          </p>
        </div>
        <div className="text-xs text-primary-foreground/60">© {new Date().getFullYear()} Orbit</div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-6 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold">
              O
            </div>
            <span className="font-semibold tracking-tight">Orbit</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your workspace or create an account.</p>

          <Tabs defaultValue="signin" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" autoComplete="email" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" autoComplete="current-password" required />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" name="fullName" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email-up">Email</Label>
                  <Input id="email-up" name="email" type="email" autoComplete="email" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password-up">Password</Label>
                  <Input id="password-up" name="password" type="password" autoComplete="new-password" required />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Creating…" : "Create account"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  New accounts are clients by default. Admin role is granted manually in the database.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
