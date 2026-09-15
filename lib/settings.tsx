// Global settings: download mode toggle + preferences.
// Persisted to localStorage (local-only app, no account).
"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type DownloadMode = "redirect" | "direct";

export interface Settings {
  downloadMode: DownloadMode;
  openInNewTab: boolean;
}

const DEFAULTS: Settings = { downloadMode: "redirect", openInNewTab: true };
const KEY = "md-settings";

const Ctx = createContext<{
  settings: Settings;
  set: (patch: Partial<Settings>) => void;
}>({ settings: DEFAULTS, set: () => {} });

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Lazy initializer reads localStorage once — no effect needed.
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === "undefined") return DEFAULTS;
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  const set = (patch: Partial<Settings>) =>
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

  return <Ctx.Provider value={{ settings, set }}>{children}</Ctx.Provider>;
}

export const useSettings = () => useContext(Ctx);
