// Client-side download provider. All VidVault calls run in the browser
// so the quota/limit is counted against the user's own IP.
"use client";

const API = "https://vidvault.ru/api";
// VidVault renders downloads through these workers.
const DL_PROXY = "https://dl.gemlelispe.workers.dev";
const SUB_PROXY = "https://sub.k5s7sjozpn.workers.dev";

export interface DlFile {
  resolution: string | null;
  format: string;
  size: string;
  url: string;
  locked?: boolean;
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
}

export function redirectUrl(
  type: "movie" | "tv",
  tmdbId: number,
  season?: number,
  episode?: number,
): string {
  if (type === "movie") return `https://vidvault.ru/movie/${tmdbId}`;
  return `https://vidvault.ru/tv/${tmdbId}/${season}/${episode}`;
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

  const tokenJson = (await fetchJson(`${API}/get-token`)) as { t?: string };
  const token = tokenJson?.t ?? "";
  if (!token) throw new Error("Could not get a download token");

  const body: Record<string, unknown> = { type, tmdbId };
  if (type === "tv") {
    body.season = season;
    body.episode = episode;
  }

  const data = await fetchJson(`${API}/download-proxy`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-request-token": token },
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
      group.push({
        resolution: d.resolution != null ? String(d.resolution) : null,
        format: "MP4",
        size: fmtSize(Number(d.size)),
        url: d.url
          ? `${DL_PROXY}/${encodeURIComponent(d.url)}?n=${encodeURIComponent(label)}`
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
        url: `${SUB_PROXY}/?url=${encodeURIComponent(c.url)}&title=${encodeURIComponent(label)}`,
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
      url: mkvFiles[0].url as string,
    });
  }

  return {
    videos,
    subtitles,
    limited: info?.limited === true,
    freeNum: typeof info?.freeNum === "number" ? info.freeNum : null,
  };
}
