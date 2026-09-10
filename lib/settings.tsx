// Global settings: download mode toggle + preferences.
// Persisted to localStorage (local-only app, no account).
"use client";

import {
  createContext,
  useContext,
  useEffect,
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
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* keep defaults */
    }
  }, []);

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
