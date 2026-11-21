import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

// Client-only gate: the session lives in browser storage, which SSR cannot read.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      throw redirect({ to: "/auth", search: { redirect: location.href, mode: "signin" } });
    }
    return { user: data.user };
  },
  pendingComponent: () => (
    <div className="container-page py-16" aria-busy="true">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  ),
  component: () => <Outlet />,
});
