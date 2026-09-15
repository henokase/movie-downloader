"use client";

import { useSettings, type DownloadMode } from "@/lib/settings";
import {
  CheckIcon,
  DownloadIcon,
  ExternalIcon,
  SettingsIcon,
} from "@/components/icons";

function ModeCard({
  active,
  onSelect,
  icon,
  title,
  desc,
  badge,
}: {
  active: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge: string;
}) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={active}
      className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
        active
          ? "border-amber-400/60 bg-amber-400/[0.06] shadow-[0_0_0_1px_rgba(251,191,36,0.4)]"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
          active ? "bg-amber-400 text-zinc-950" : "bg-white/[0.06] text-zinc-300"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-zinc-50">{title}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
              active
                ? "bg-amber-400/20 text-amber-300"
                : "bg-white/[0.06] text-zinc-500"
            }`}
          >
            {badge}
          </span>
        </span>
        <span className="mt-1 block text-[13px] leading-relaxed text-zinc-400">
          {desc}
        </span>
      </span>
      <span
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          active ? "border-amber-400 bg-amber-400 text-zinc-950" : "border-zinc-700 text-transparent"
        }`}
      >
        <CheckIcon className="h-3 w-3" />
      </span>
    </button>
  );
}

export default function SettingsPage() {
  const { settings, set } = useSettings();

  const modes: {
    key: DownloadMode;
    title: string;
    desc: string;
    badge: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "redirect",
      title: "Open download page",
      badge: "Recommended",
      desc: "Opens the provider's download page in your browser. Simplest and most reliable — pick quality and subtitles there.",
      icon: <ExternalIcon className="h-5 w-5" />,
    },
    {
      key: "direct",
      title: "Show links in this app",
      badge: "Advanced",
      desc: "Fetches MP4, MKV and subtitle links into a popup here. Same quota and expiry rules apply; some hosts throttle direct fetches.",
      icon: <DownloadIcon className="h-5 w-5" />,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 pt-6">
      <div className="flex items-center gap-3.5">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-amber-300">
          <SettingsIcon className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-50">
            Settings
          </h1>
          <p className="text-sm text-zinc-500">
            Stored only in this browser · no account
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-zinc-400">
          What should the Download button do?
        </h2>
        {modes.map((m) => (
          <ModeCard
            key={m.key}
            active={settings.downloadMode === m.key}
            onSelect={() => set({ downloadMode: m.key })}
            icon={m.icon}
            title={m.title}
            desc={m.desc}
            badge={m.badge}
          />
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-zinc-400">
          Links
        </h2>
        <button
          onClick={() => set({ openInNewTab: !settings.openInNewTab })}
          aria-pressed={settings.openInNewTab}
          className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-left transition-colors hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <span>
            <span className="block font-semibold text-zinc-50">
              Open redirect links in a new tab
            </span>
            <span className="mt-1 block text-[13px] text-zinc-400">
              Keep this app open while the provider page loads.
            </span>
          </span>
          <span
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              settings.openInNewTab ? "bg-amber-400" : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                settings.openInNewTab ? "left-6" : "left-1"
              }`}
            />
          </span>
        </button>
      </section>

      <p className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 text-xs leading-relaxed text-zinc-500">
        Current setup:{" "}
        <span className="font-semibold text-zinc-300">
          {settings.downloadMode === "redirect"
            ? "redirect page"
            : "in-app links"}
        </span>
        {" · "}
        {settings.openInNewTab ? "new tab" : "same tab"}. Quota and limits are
        counted by the provider against your own IP address.
      </p>
    </div>
  );
}
