export const LS_KEYS = {
  settings: "glv:settings:v1",
  lastSession: "glv:last-session:v1",
} as const;

export function safeLocalStorage<T>(key: string, value?: T): T | null {
  try {
    if (typeof window === "undefined") return null;
    if (value === undefined) {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    }
    localStorage.setItem(key, JSON.stringify(value));
    return value ?? null;
  } catch {
    return null;
  }
}
