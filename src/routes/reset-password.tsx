import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: pageMeta("Choose a new password", "Set a new password for your Growvia account."),
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const isRecovery = window.location.hash.includes("type=recovery");
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    supabase.auth.getSession().then(({ data: s }) => {
      if (s.session && isRecovery) setReady(true);
      else if (s.session) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("The passwords don't match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError(error.message);
    toast.success("Password updated");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="container-page flex justify-center py-20">
      <div className="w-full max-w-sm animate-page">
        <h1 className="text-2xl font-semibold text-navy">Choose a new password</h1>
        {!ready ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Open this page from the reset link in your email. If the link has expired,{" "}
            <Link to="/auth" search={{ mode: "signin" }} className="text-primary underline">
              request a new one
            </Link>
            .
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4" noValidate>
            <div className="grid gap-1.5">
              <Label htmlFor="pw">New password</Label>
              <Input
                id="pw"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 bg-surface"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pw2">Confirm password</Label>
              <Input
                id="pw2"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="h-11 bg-surface"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" disabled={busy}>
              {busy ? "Saving…" : "Update password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
