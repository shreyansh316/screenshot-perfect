import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LovableMark } from "@lovable.dev/cloud-auth-js/react";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/site/GoogleIcon";
import { LogoMark } from "@/components/site/Logo";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { isValidEmail } from "@/lib/resume";
import { safeRedirect, setPostAuthRedirect, takePostAuthRedirect, useAuth } from "@/lib/auth";
import { pageMeta } from "@/lib/seo";

type Mode = "signin" | "signup" | "forgot";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string | undefined; mode?: "signin" | "signup" | undefined } => ({
    redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined,
    mode: s["mode"] === "signup" ? "signup" : s["mode"] === "signin" ? "signin" : undefined,
  }),
  head: () => ({ meta: pageMeta("Sign in or create an account", "Sign in to Growvia to save opportunities, track applications and keep your resume in your account.") }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>(search.mode ?? "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<null | "confirm" | "reset">(null);

  useEffect(() => setMode(search.mode ?? "signin"), [search.mode]);

  // Once a session exists (password, Google, or returning from OAuth), go where the user was headed.
  useEffect(() => {
    if (loading || !user) return;
    const dest = takePostAuthRedirect() ?? safeRedirect(search.redirect);
    navigate({ to: dest, replace: true });
  }, [user, loading, navigate, search.redirect]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) return setError("Enter a valid email address.");
    if (mode !== "forgot" && password.length < 8) return setError("Password must be at least 8 characters.");
    if (mode === "signup" && !name.trim()) return setError("Enter your name.");
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message === "Invalid login credentials" ? "That email and password don't match an account." : error.message);
      } else if (mode === "signup") {
        const dest = safeRedirect(search.redirect);
        setPostAuthRedirect(dest);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name.trim() }, emailRedirectTo: `${window.location.origin}/auth?redirect=${encodeURIComponent(dest)}` },
        });
        if (error) setError(error.message);
        else if (!data.session) setSent("confirm");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) setError(error.message);
        else setSent("reset");
      }
    } finally {
      setBusy(false);
    }
  };

  const oauth = async (provider: "google" | "lovable") => {
    setError(null);
    setPostAuthRedirect(safeRedirect(search.redirect));
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${window.location.origin}/auth` });
    if (result.error) {
      setError("Sign-in didn't complete. Please try again.");
      return;
    }
    if (result.redirected) return;
    toast.success("Signed in");
  };

  const heading = mode === "signup" ? "Create your Growvia account" : mode === "forgot" ? "Reset your password" : "Welcome back";

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-navy p-12 text-navy-foreground lg:flex">
        <div className="grid-lines absolute" aria-hidden="true" />
        <p className="eyebrow">From Potential to Opportunity</p>
        <div>
          <h2 className="max-w-md text-3xl font-semibold leading-tight">One account for your search, your resume and every application.</h2>
          <ul className="mt-8 grid gap-3 text-sm text-navy-foreground/80">
            {["Save internships, jobs and projects to come back to", "Keep your resume in your account and download it anytime", "Track every application and its status"].map((t) => (
              <li key={t} className="flex items-center gap-2.5"><Check className="size-4 text-teal" aria-hidden="true" />{t}</li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-navy-foreground/50">Growvia is free for candidates.</p>
      </div>

      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm animate-page">
          <LogoMark className="size-10" />
          <h1 className="mt-6 text-2xl font-semibold text-navy">{heading}</h1>
          {search.redirect && mode !== "forgot" && (
            <p className="mt-2 text-sm text-muted-foreground">Sign in to continue — we'll take you back to where you were.</p>
          )}

          {sent ? (
            <div className="mt-6 rounded-lg border bg-teal-soft p-4 text-sm" role="status">
              <p className="font-medium text-foreground">Check your inbox</p>
              <p className="mt-1 text-muted-foreground">
                {sent === "confirm"
                  ? `We sent a confirmation link to ${email}. Open it to finish creating your account.`
                  : `If an account exists for ${email}, you'll receive a link to choose a new password.`}
              </p>
              <Button variant="link" className="mt-2 h-auto p-0" onClick={() => { setSent(null); setMode("signin"); }}>Back to sign in</Button>
            </div>
          ) : (
            <>
              {mode !== "forgot" && (
                <div className="mt-6 grid gap-2.5">
                  <Button type="button" variant="google" size="lg" onClick={() => void oauth("google")}>
                    <GoogleIcon /> Continue with Google
                  </Button>
                  <Button type="button" variant="outline" size="lg" onClick={() => void oauth("lovable")}>
                    <LovableMark className="size-[18px]" /> Continue with Lovable
                  </Button>
                  <div className="my-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="h-px flex-1 bg-border" /> or with email <span className="h-px flex-1 bg-border" />
                  </div>
                </div>
              )}
              <form onSubmit={submit} className="mt-2 grid gap-4" noValidate>
                {mode === "signup" && (
                  <div className="grid gap-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 bg-surface" />
                  </div>
                )}
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 bg-surface" />
                </div>
                {mode !== "forgot" && (
                  <div className="grid gap-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {mode === "signin" && (
                        <button type="button" onClick={() => setMode("forgot")} className="text-xs font-medium text-primary hover:underline">Forgot password?</button>
                      )}
                    </div>
                    <Input id="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 bg-surface" />
                    {mode === "signup" && <p className="text-xs text-muted-foreground">At least 8 characters.</p>}
                  </div>
                )}
                {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
                <Button type="submit" size="lg" disabled={busy}>
                  {busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "signup" ? (
                  <>Already have an account? <button className="font-medium text-primary hover:underline" onClick={() => setMode("signin")}>Sign in</button></>
                ) : mode === "forgot" ? (
                  <button className="inline-flex items-center gap-1 font-medium text-primary hover:underline" onClick={() => setMode("signin")}><ArrowLeft className="size-3.5" /> Back to sign in</button>
                ) : (
                  <>New to Growvia? <button className="font-medium text-primary hover:underline" onClick={() => setMode("signup")}>Create an account</button></>
                )}
              </p>
              {mode === "signup" && (
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  By creating an account you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy policy</Link>.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
