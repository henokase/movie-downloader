"use client";

import { useSettings } from "@/lib/settings";

export default function SettingsPage() {
  const { settings, set } = useSettings();

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-zinc-300">
          What should the Download button do?
        </h2>

        <label
          className={`cursor-pointer rounded-lg border p-4 ${
            settings.downloadMode === "redirect"
              ? "border-white bg-zinc-900"
              : "border-zinc-800 bg-zinc-900/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="mode"
              checked={settings.downloadMode === "redirect"}
              onChange={() => set({ downloadMode: "redirect" })}
            />
            <span className="font-medium">Open download page (redirect)</span>
          </div>
          <p className="mt-1 pl-7 text-xs text-zinc-400">
            Opens vidvault.ru in a new tab. Simplest, uses your own IP quota.
            External site may show pop-up ads.
          </p>
        </label>

        <label
          className={`cursor-pointer rounded-lg border p-4 ${
            settings.downloadMode === "direct"
              ? "border-white bg-zinc-900"
              : "border-zinc-800 bg-zinc-900/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="mode"
              checked={settings.downloadMode === "direct"}
              onChange={() => set({ downloadMode: "direct" })}
            />
            <span className="font-medium">Show links here (direct)</span>
          </div>
          <p className="mt-1 pl-7 text-xs text-zinc-400">
            Fetches MP4 / MKV / subtitle links into a popup inside this app.
            Same quota and expiry rules apply.
          </p>
        </label>
      </section>

      <label className="flex cursor-pointer items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={settings.openInNewTab}
          onChange={(e) => set({ openInNewTab: e.target.checked })}
        />
        Open redirect links in a new tab
      </label>

      <p className="text-xs text-zinc-500">
        Settings are stored only in this browser (localStorage). Current mode:{" "}
        <span className="font-medium text-zinc-300">
          {settings.downloadMode}
        </span>
      </p>
    </div>
  );
}
