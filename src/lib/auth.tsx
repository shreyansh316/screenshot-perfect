import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({ user: null, session: null, loading: true });

const PENDING_KEY = "growvia:pending-action";
const POST_AUTH_KEY = "growvia:post-auth-redirect";

export interface PendingSave {
  kind: "save";
  id: string;
  type: string;
  title: string;
}

/** Only same-origin relative paths are allowed as post-auth destinations. */
export function safeRedirect(path: unknown, fallback = "/dashboard"): string {
  if (typeof path !== "string") return fallback;
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return fallback;
  if (path.startsWith("/auth")) return fallback;
  return path;
}

export function setPostAuthRedirect(path: string) {
  try {
    sessionStorage.setItem(POST_AUTH_KEY, safeRedirect(path));
  } catch {
    /* storage unavailable */
  }
}
export function takePostAuthRedirect(): string | null {
  try {
    const v = sessionStorage.getItem(POST_AUTH_KEY);
    sessionStorage.removeItem(POST_AUTH_KEY);
    return v ? safeRedirect(v) : null;
  } catch {
    return null;
  }
}

export function setPendingAction(a: PendingSave) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(a));
  } catch {
    /* storage unavailable */
  }
}

async function runPendingAction(userId: string) {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(PENDING_KEY);
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    return false;
  }
  if (!raw) return false;
  try {
    const a = JSON.parse(raw) as PendingSave;
    if (a.kind === "save") {
      const { error } = await supabase
        .from("saved_opportunities")
        .upsert(
          { user_id: userId, opportunity_id: a.id, opportunity_type: a.type },
          { onConflict: "user_id,opportunity_id" },
        );
      if (!error) toast.success(`Saved “${a.title}”`);
      return true;
    }
  } catch {
    /* ignore malformed */
  }
  return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, session: null, loading: true });
  const router = useRouter();
  const queryClient = useQueryClient();
  const ranPending = useRef(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setState({ user: data.session?.user ?? null, session: data.session, loading: false });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setState({ user: session?.user ?? null, session, loading: false });
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      if (event === "SIGNED_OUT") ranPending.current = false;
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [router, queryClient]);

  useEffect(() => {
    if (!state.user || ranPending.current) return;
    ranPending.current = true;
    runPendingAction(state.user.id).then((did) => {
      if (did) queryClient.invalidateQueries({ queryKey: ["saved"] });
    });
  }, [state.user, queryClient]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

/** Returns a function that sends a signed-out visitor to sign in, returning here afterwards. */
export function useSignInRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  return (opts?: { mode?: "signin" | "signup" }) =>
    navigate({ to: "/auth", search: { redirect: location.href, mode: opts?.mode ?? "signin" } });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("You've been signed out.");
    navigate({ to: "/", replace: true });
  };
}

export function displayName(user: User | null): string {
  if (!user) return "";
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const n = (meta?.["full_name"] ?? meta?.["name"]) as string | undefined;
  return n?.trim() || user.email?.split("@")[0] || "there";
}
