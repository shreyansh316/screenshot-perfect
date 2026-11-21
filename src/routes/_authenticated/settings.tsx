import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  User,
  Shield,
  Bell,
  LogOut,
  KeyRound,
  Check,
  AlertCircle,
  Loader2,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/site/common";
import { useProfile, useUpdateProfile } from "@/hooks/use-account";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useSignOut, displayName } from "@/lib/auth";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: pageMeta(
      "Account Settings — Growvia",
      "Manage your account security, notification preferences, and session.",
    ),
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const signOut = useSignOut();
  const profileQuery = useProfile();
  const updateProfile = useUpdateProfile();

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Email reset request state
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmailBusy, setResetEmailBusy] = useState(false);

  const emailUpdates = profileQuery.data?.email_updates ?? true;

  const handleToggleEmailUpdates = async (checked: boolean) => {
    try {
      await updateProfile.mutateAsync({ email_updates: checked });
    } catch {
      // toast is already dispatched by useUpdateProfile onError
    }
  };

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        throw error;
      }
      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update password.";
      setPasswordError(msg);
      toast.error("Password update failed", { description: msg });
    } finally {
      setPasswordBusy(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!user?.email) return;
    setResetEmailBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetEmailSent(true);
      toast.success("Password reset email sent", {
        description: `Check ${user.email} for reset instructions.`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not send reset email.";
      toast.error(msg);
    } finally {
      setResetEmailBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Account Settings"
        title="Settings & Preferences"
        description="Manage your login information, security credentials, and email notification preferences."
      />

      <div className="container-page py-10 max-w-3xl space-y-8">
        {/* Section 1: Account Information */}
        <div className="surface-card p-6 md:p-8 rounded-xl border bg-surface space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <span className="grid size-9 place-items-center rounded-md bg-blue-soft text-primary">
              <User className="size-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-navy">Account Information</h2>
              <p className="text-xs text-muted-foreground">Your verified login identity.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Display Name</p>
              <p className="font-semibold text-navy mt-1">{displayName(user)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Registered Email</p>
              <p className="font-semibold text-navy mt-1">{user?.email ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Account Created</p>
              <p className="text-foreground mt-1">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Account ID</p>
              <p className="font-mono text-xs text-muted-foreground mt-1 truncate">{user?.id}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Security & Password */}
        <div className="surface-card p-6 md:p-8 rounded-xl border bg-surface space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <span className="grid size-9 place-items-center rounded-md bg-navy text-navy-foreground">
              <Shield className="size-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-navy">Security &amp; Password</h2>
              <p className="text-xs text-muted-foreground">
                Update your account password or send a reset link.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md" noValidate>
            <div className="grid gap-1.5">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="bg-surface"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="bg-surface"
              />
            </div>

            {passwordError && (
              <div
                className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                role="alert"
              >
                <AlertCircle className="size-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div
                className="flex items-center gap-2 rounded-md bg-teal-soft p-3 text-sm text-foreground"
                role="status"
              >
                <Check className="size-4 shrink-0 text-teal" />
                <span>Password changed successfully.</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button type="submit" disabled={passwordBusy || !newPassword}>
                {passwordBusy ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Updating…
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 size-4" /> Change Password
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleSendResetEmail}
                disabled={resetEmailBusy || resetEmailSent}
              >
                {resetEmailBusy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : resetEmailSent ? (
                  "Reset link sent"
                ) : (
                  "Send reset email"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Section 3: Notification Preferences */}
        <div className="surface-card p-6 md:p-8 rounded-xl border bg-surface space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <span className="grid size-9 place-items-center rounded-md bg-teal-soft text-teal">
              <Bell className="size-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-navy">Notifications &amp; Updates</h2>
              <p className="text-xs text-muted-foreground">
                Manage opportunity digest and announcement emails.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label
                htmlFor="email-updates"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                Opportunity and platform updates
              </Label>
              <p className="text-xs text-muted-foreground">
                Receive email notifications when new verified internships matching your field are
                posted.
              </p>
            </div>
            <Switch
              id="email-updates"
              checked={emailUpdates}
              onCheckedChange={handleToggleEmailUpdates}
              disabled={updateProfile.isPending}
            />
          </div>
        </div>

        {/* Section 4: Sign Out */}
        <div className="surface-card p-6 md:p-8 rounded-xl border border-destructive/20 bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-destructive">Sign Out</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              End your active session on this device. Your saved data and resumes remain securely in
              your account.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-destructive/30 hover:bg-destructive/10 text-destructive"
            onClick={() => void signOut()}
          >
            <LogOut className="mr-2 size-4" /> Sign Out
          </Button>
        </div>
      </div>
    </>
  );
}
