// Download provider. VidVault link discovery is proxied through
// same-origin Next routes (/api/get-token + /api/download-proxy) because:
//  - browser fetch to vidvault.* is blocked by CORS (no ACAO header), and
//  - vidvault.ru 301-redirects to vidvault.to, which drops POST bodies.
// The server routes (running on localhost, so quota still counts against the
// user's own IP) try each host in VIDVAULT_API_CANDIDATES and POST to the
// one that answers — see lib/vidvault.ts.
"use client";

import { VIDVAULT_SITE } from "@/lib/vidvault";

const API = "/api";

// All file downloads go through our local proxy route, which adds the
// VidVault Referer — their workers reject direct browser requests without it.
const viaProxy = (upstreamUrl: string, filename: string) =>
  `/api/proxy-download?url=${encodeURIComponent(upstreamUrl)}&name=${encodeURIComponent(filename)}`;

export interface DlFile {
  resolution: string | null;
  format: string;
  size: string;
  url: string;
  locked?: boolean;
  note?: string;
}

export interface SubFile {
  lanName: string;
  size: string;
  url: string;
}

export interface LinksResult {
  videos: Record<string, DlFile[]>;
  subtitles: SubFile[];
  limited: boolean;
  freeNum: number | null;
  // False when the backend has no record of this title/season at all
  // (all data blocks null) — common for very recent episodes.
  known: boolean;
}

export function redirectUrl(
  type: "movie" | "tv",
  tmdbId: number,
  season?: number,
  episode?: number,
): string {
  // Plain GET navigation: browsers follow the .ru -> .to 301 transparently,
  // so redirects survive domain moves. Still point at the canonical host to
  // skip the extra hop (see lib/vidvault.ts).
  if (type === "movie") return `${VIDVAULT_SITE}/movie/${tmdbId}`;
  return `${VIDVAULT_SITE}/tv/${tmdbId}/${season}/${episode}`;
}

function fmtSize(bytes: number): string {
  if (!bytes || Number.isNaN(bytes)) return "Unknown";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n >= 100 ? 0 : 2)} ${units[i]}`;
}

async function fetchJson(url: string, init?: RequestInit, retries = 2) {
  let last: unknown = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.status === 403 || res.status === 429) {
        const e = new Error(
          res.status === 429 ? "rate-limited" : "verification",
        ) as Error & { code?: string };
        e.code = res.status === 429 ? "rate-limited" : "verification";
        throw e;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      last = e;
      if ((e as Error & { code?: string }).code) throw e;
      if (attempt < retries)
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  throw last;
}

export async function getLinks(
  type: "movie" | "tv",
  tmdbId: number,
  title: string,
  year: string,
  season?: number,
  episode?: number,
): Promise<LinksResult> {
  const label =
    type === "movie" ? `${title} (${year})` : `${title} (${year}) S${season}E${episode}`;

  // Token fetch goes through our same-origin proxy (see header comment).
  // The proxy answers with `x-vidvault-base`: the VidVault host that really
  // responded. Forward it so the link POST below goes straight to the live
  // host instead of trying a stale one first.
  const tokRes = await fetch(`${API}/get-token`, { cache: "no-store" });
  if (!tokRes.ok) throw new Error(`HTTP ${tokRes.status}`);
  const tokenJson = (await tokRes.json()) as { t?: string };
  const token = tokenJson?.t ?? "";
  if (!token) throw new Error("Could not get a download token");
  const apiBase = tokRes.headers.get("x-vidvault-base") ?? "";

  const body: Record<string, unknown> = { type, tmdbId };
  if (type === "tv") {
    body.season = season;
    body.episode = episode;
  }

  const data = await fetchJson(`${API}/download-proxy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-request-token": token,
      ...(apiBase ? { "x-vidvault-base": apiBase } : {}),
    },
    body: JSON.stringify(body),
  });

  const videos: Record<string, DlFile[]> = {};
  const subtitles: SubFile[] = [];

  const mp4 = data?.mp4Data;
  const info = mp4?.downloadInfo?.data ?? mp4?.data?.data ?? mp4?.data ?? null;

  if (info?.downloads) {
    for (const d of info.downloads) {
      if (!d?.size || (!d?.url && !d?.vipLocked)) continue;
      const group = videos["MP4"] ?? (videos["MP4"] = []);
      const res = d.resolution != null ? String(d.resolution) : null;
      group.push({
        resolution: res,
        format: "MP4",
        size: fmtSize(Number(d.size)),
        url: d.url
          ? viaProxy(d.url, `${label} - ${res ?? "video"}p.mp4`)
          : "",
        locked: d.vipLocked === true || !d.url,
      });
    }
  }

  if (info?.captions) {
    for (const c of info.captions) {
      if (!c?.size || !c?.url || !c?.lanName) continue;
      subtitles.push({
        lanName: c.lanName,
        size: fmtSize(Number(c.size)),
        url: viaProxy(c.url, `${label} - ${c.lanName}.srt`),
      });
    }
  }

  const mkvFiles: { url?: string; size?: unknown }[] =
    data?.mkvData?.files ?? [];
  if (mkvFiles.length > 0 && mkvFiles[0]?.url) {
    const group = videos["MKV"] ?? (videos["MKV"] = []);
    const s = mkvFiles[0].size;
    group.push({
      resolution: "480",
      format: "MKV",
      size: typeof s === "number" ? fmtSize(s) : String(s ?? "Unknown"),
      url: viaProxy(mkvFiles[0].url as string, `${label} - 480p.mkv`),
    });
  }

  // mkvV2Data: alternate MKV source. Observed shapes: a single
  // {url, size, quality, language, ...}, a list of those, or {files:[...]}.
  // Size here is already a string like "280.54 MB".
  const pushMkvV2 = (f: {
    url?: unknown;
    size?: unknown;
    quality?: unknown;
    language?: unknown;
  }) => {
    if (!f || typeof f.url !== "string" || !f.url) return;
    const group = videos["MKV"] ?? (videos["MKV"] = []);
    const q =
      typeof f.quality === "string" ? f.quality.replace(/p$/i, "") : null;
    group.push({
      resolution: q,
      format: "MKV",
      size: typeof f.size === "number" ? fmtSize(f.size) : String(f.size ?? "Unknown"),
      url: viaProxy(
        f.url,
        `${label} - ${q ?? "video"}p${typeof f.language === "string" && f.language ? ` [${f.language}]` : ""}.mkv`,
      ),
      note: typeof f.language === "string" && f.language ? f.language : undefined,
    });
  };
  const v2 = data?.mkvV2Data;
  if (Array.isArray(v2)) {
    for (const f of v2) pushMkvV2(f);
  } else if (v2 && typeof v2 === "object") {
    if (Array.isArray(v2.files)) {
      for (const f of v2.files) pushMkvV2(f);
    } else {
      pushMkvV2(v2);
    }
  }

  const known =
    data?.mp4Data != null || data?.mkvData != null || data?.mkvV2Data != null;

  return {
    videos,
    subtitles,
    limited: info?.limited === true,
    freeNum: typeof info?.freeNum === "number" ? info.freeNum : null,
    known,
  };
}
