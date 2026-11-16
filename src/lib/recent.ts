const KEY = "growvia:recently-viewed";
const MAX = 8;

export function getRecentlyViewed(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const v: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(id: string) {
  try {
    const next = [id, ...getRecentlyViewed().filter((x) => x !== id)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
}
