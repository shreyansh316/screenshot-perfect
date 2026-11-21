import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { setPendingAction, useAuth, useSignInRedirect } from "@/lib/auth";
import type { Opportunity } from "@/lib/opportunities";

export type SavedRow = Database["public"]["Tables"]["saved_opportunities"]["Row"];
export type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export function useSaved() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["saved", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_opportunities")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useToggleSave() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const signIn = useSignInRedirect();
  const saved = useSaved();

  const mutation = useMutation({
    mutationFn: async ({ o, isSaved }: { o: Opportunity; isSaved: boolean }) => {
      if (!user) throw new Error("not-signed-in");
      if (isSaved) {
        const { error } = await supabase
          .from("saved_opportunities")
          .delete()
          .eq("opportunity_id", o.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("saved_opportunities")
          .insert({ user_id: user.id, opportunity_id: o.id, opportunity_type: o.type });
        if (error) throw error;
      }
    },
    onMutate: async ({ o, isSaved }) => {
      const key = ["saved", user?.id];
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<SavedRow[]>(key);
      qc.setQueryData<SavedRow[]>(key, (rows = []) =>
        isSaved
          ? rows.filter((r) => r.opportunity_id !== o.id)
          : [
              {
                id: `tmp-${o.id}`,
                user_id: user?.id ?? "",
                opportunity_id: o.id,
                opportunity_type: o.type,
                created_at: new Date().toISOString(),
              },
              ...rows,
            ],
      );
      return { prev, key };
    },
    onError: (_e, _v, ctx) => {
      if (ctx) qc.setQueryData(ctx.key, ctx.prev);
      toast.error("Couldn't update your saved list. Please try again.");
    },
    onSuccess: (_d, { o, isSaved }) => {
      toast.success(isSaved ? "Removed from saved" : `Saved “${o.title}”`);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["saved"] }),
  });

  const isSaved = (id: string) => !!saved.data?.some((r) => r.opportunity_id === id);

  const toggle = (o: Opportunity) => {
    if (!user) {
      setPendingAction({ kind: "save", id: o.id, type: o.type, title: o.title });
      toast("Sign in to save opportunities", {
        description: "We'll save it and bring you right back.",
      });
      signIn();
      return;
    }
    mutation.mutate({ o, isSaved: isSaved(o.id) });
  };

  return { toggle, isSaved, pending: mutation.isPending };
}

export function useApplications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["applications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: ProfileUpdate) => {
      if (!user) throw new Error("not-signed-in");
      const { error } = await supabase.from("profiles").upsert({ id: user.id, ...patch });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile saved");
    },
    onError: () => toast.error("Couldn't save your profile. Please try again."),
  });
}

export function profileCompletion(p: ProfileRow | null | undefined): number {
  if (!p) return 0;
  const checks = [
    !!p.full_name,
    !!p.headline,
    !!p.location,
    !!p.bio,
    p.skills.length >= 3,
    p.interests.length > 0,
    !!(p.linkedin_url || p.portfolio_url || p.github_url),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
