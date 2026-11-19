import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { emptyResume, normalizeResume, type ResumeData, type TemplateKey } from "@/lib/resume";

/**
 * Loads and autosaves the user's single resume.
 * Signed in: the `resumes` row owned by the user (RLS-scoped). Signed out: this browser only.
 * Status is only ever "saved" after the write has actually succeeded.
 */
export type SaveStatus = "loading" | "idle" | "dirty" | "saving" | "saved" | "local" | "error";

const ANON_KEY = "growvia:resume-draft";
const backupKey = (uid: string) => `growvia:resume-backup:${uid}`;
const TEMPLATE_KEYS: TemplateKey[] = ["classic", "modern", "compact"];

interface Stored { data: ResumeData; template: TemplateKey }

function readLocal(key: string): Stored | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const v = JSON.parse(raw) as { data?: unknown; template?: unknown };
    return { data: normalizeResume(v.data), template: asTemplate(v.template) };
  } catch {
    return null;
  }
}
function writeLocal(key: string, v: Stored): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(v));
    return true;
  } catch {
    return false;
  }
}
function removeLocal(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
function asTemplate(v: unknown): TemplateKey {
  return TEMPLATE_KEYS.includes(v as TemplateKey) ? (v as TemplateKey) : "classic";
}

export function useResume() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [template, setTemplateState] = useState<TemplateKey>("classic");
  const [status, setStatus] = useState<SaveStatus>("loading");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  /** A signed-out draft found on this device while the account already has a resume. */
  const [deviceDraft, setDeviceDraft] = useState<Stored | null>(null);

  const latest = useRef<Stored>({ data, template });
  const loadedFor = useRef<string | null | undefined>(undefined);
  const inFlight = useRef(false);
  const queued = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userId = user?.id ?? null;

  // ---------- Load ----------
  useEffect(() => {
    if (authLoading || loadedFor.current === userId) return;
    loadedFor.current = userId;
    let cancelled = false;
    (async () => {
      setStatus("loading");
      if (!userId) {
        const local = readLocal(ANON_KEY);
        if (cancelled) return;
        const v = local ?? { data: emptyResume(), template: "classic" as TemplateKey };
        latest.current = v;
        setData(v.data);
        setTemplateState(v.template);
        setStatus(local ? "local" : "idle");
        return;
      }
      const { data: row, error } = await supabase.from("resumes").select("data, template, updated_at").eq("user_id", userId).maybeSingle();
      if (cancelled) return;
      const backup = readLocal(backupKey(userId));
      const anon = readLocal(ANON_KEY);
      if (error) {
        // Could not reach the account copy: keep working from this device's backup, retry on next edit.
        const v = backup ?? anon ?? { data: emptyResume(), template: "classic" as TemplateKey };
        latest.current = v;
        setData(v.data);
        setTemplateState(v.template);
        setStatus("error");
        return;
      }
      let v: Stored;
      let needsSave = false;
      if (backup) {
        // An earlier save from this device never confirmed; it is the newest copy.
        v = backup;
        needsSave = true;
      } else if (row) {
        v = { data: normalizeResume(row.data), template: asTemplate(row.template) };
        setSavedAt(new Date(row.updated_at));
        if (anon) setDeviceDraft(anon);
      } else if (anon) {
        v = anon;
        needsSave = true;
      } else {
        v = { data: emptyResume(), template: "classic" };
      }
      latest.current = v;
      setData(v.data);
      setTemplateState(v.template);
      setStatus(row && !needsSave ? "saved" : "idle");
      if (needsSave) void flush();
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, userId]);

  // ---------- Save ----------
  const flush = useCallback(async () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    const v = latest.current;
    if (!userId) {
      setStatus(writeLocal(ANON_KEY, v) ? "local" : "error");
      return;
    }
    if (inFlight.current) {
      queued.current = true;
      return;
    }
    inFlight.current = true;
    setStatus("saving");
    writeLocal(backupKey(userId), v);
    const { error } = await supabase
      .from("resumes")
      .upsert({ user_id: userId, data: v.data as never, template: v.template }, { onConflict: "user_id" });
    inFlight.current = false;
    if (error) {
      setStatus("error");
      return;
    }
    if (latest.current === v) {
      removeLocal(backupKey(userId));
      removeLocal(ANON_KEY);
      setSavedAt(new Date());
      setStatus("saved");
    }
    if (queued.current || latest.current !== v) {
      queued.current = false;
      void flush();
    }
  }, [userId]);

  const schedule = useCallback(
    (next: Stored) => {
      latest.current = next;
      if (userId) writeLocal(backupKey(userId), next);
      setStatus("dirty");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), 1200);
    },
    [flush, userId],
  );

  const update = useCallback(
    (fn: (d: ResumeData) => ResumeData) => {
      const next = fn(latest.current.data);
      setData(next);
      schedule({ data: next, template: latest.current.template });
    },
    [schedule],
  );

  const setTemplate = useCallback(
    (t: TemplateKey) => {
      setTemplateState(t);
      schedule({ data: latest.current.data, template: t });
    },
    [schedule],
  );

  const useDeviceDraft = useCallback(() => {
    if (!deviceDraft) return;
    setData(deviceDraft.data);
    setTemplateState(deviceDraft.template);
    setDeviceDraft(null);
    schedule(deviceDraft);
  }, [deviceDraft, schedule]);

  const dismissDeviceDraft = useCallback(() => {
    removeLocal(ANON_KEY);
    setDeviceDraft(null);
  }, []);

  // Warn before leaving with an unconfirmed save.
  useEffect(() => {
    const unsaved = status === "dirty" || status === "saving" || (status === "error" && !!userId);
    if (!unsaved) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [status, userId]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return {
    data, template, status, savedAt, signedIn: !!userId,
    update, setTemplate, saveNow: flush,
    deviceDraft, useDeviceDraft, dismissDeviceDraft,
  };
}
