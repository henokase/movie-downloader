import { NextResponse } from "next/server";

// Force dynamic: signed upstream URLs expire, never cache.
export const dynamic = "force-dynamic";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// File hosts rate-limit per IP (HTTP 429) and sometimes stall excess
// requests instead of answering. Bound the time to first byte and retry a
// couple of times with backoff before giving up — a retry often lands after
// the limit window instead of failing outright. The timeout is cleared as
// soon as response headers arrive, so long downloads can stream for as long
// as they need (an un-cleared fetch timeout would abort healthy streams
// mid-download — exactly the "failed to pipe response" 500 after ~25s).
// Throws an Error with `upstreamStatus === 429` when the host kept
// rate-limiting us, so the caller can say so honestly.
async function fetchWithRetry(url: string, headers: Record<string, string>) {
  let lastStatus = 0;
  for (let attempt = 0; attempt <= 2; attempt++) {
    if (attempt > 0) await sleep(2000 * attempt);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 25000);
    try {
      const res = await fetch(url, { headers, signal: ctrl.signal });
      if (res.status !== 429) return res;
      await res.body?.cancel().catch(() => {});
      lastStatus = 429;
    } catch {
      // Timeout before first byte, or connection error — retry while
      // attempts remain.
      lastStatus = -1;
    } finally {
      clearTimeout(timer);
    }
  }
  const e = new Error(
    lastStatus === 429 ? "rate-limited" : "unreachable",
  ) as Error & { upstreamStatus?: number };
  e.upstreamStatus = lastStatus;
  throw e;
}

// Browsers navigate to this endpoint, so render a readable page instead of
// raw JSON when something goes wrong.
function errPage(status: number, title: string, hint: string) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Download failed</title></head><body style="font-family:sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem"><h1>Download failed</h1><p><strong>${title}.</strong></p><p>${hint}</p></body></html>`;
  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

// GET /api/proxy-download?url=<encoded upstream file url>&name=<filename>
// Fetches the file server-side with VidVault's Referer (their workers
// reject direct browser requests without it) and streams it to the browser.
// Browsers navigate to this URL, so errors are small HTML pages, not JSON.
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const target = sp.get("url") ?? "";
  const name = sp.get("name") ?? "download";

  if (!target) {
    return errPage(400, "Missing url param", "Go back and pick a quality again.");
  }

  let upstream: URL;
  try {
    upstream = new URL(target);
  } catch {
    return errPage(400, "Invalid URL", "Go back and pick a quality again.");
  }

  // Only allow the known file hosts — never proxy arbitrary URLs.
  const host = upstream.hostname;
  const allowed =
    host.endsWith(".hakunaymatata.com") ||
    host === "hakunaymatata.com" ||
    host.endsWith(".workers.dev");
  if (!allowed) {
    return errPage(403, "Domain not allowed", "That link points somewhere unexpected.");
  }

  let res: Response;
  try {
    const upstreamHeaders: Record<string, string> = {
      Referer: "https://vidvault.to/",
      Origin: "https://vidvault.to",
    };
    // Forward range requests so large files support resume/seek.
    const range = req.headers.get("range");
    if (range) upstreamHeaders.Range = range;
    res = await fetchWithRetry(upstream.toString(), upstreamHeaders);
  } catch (e) {
    if ((e as { upstreamStatus?: number }).upstreamStatus === 429) {
      return errPage(
        429,
        "The file host is rate-limiting your network right now",
        "Too many requests from your connection — wait a bit and try again. Redirect mode and the MKV versions (served from a different host) usually work meanwhile.",
      );
    }
    return errPage(502, "Upstream unreachable", "Check your connection and try again.");
  }

  if (!res.ok || !res.body) {
    if (res.status === 429) {
      return errPage(
        429,
        "The file host is rate-limiting your network right now",
        "Too many requests from your connection — wait a bit and try again. Redirect mode and the MKV versions (served from a different host) usually work meanwhile.",
      );
    }
    if (res.status === 403) {
      return errPage(
        502,
        "File link was rejected by the host",
        "The signed link probably expired — go back, reopen the title to refresh the links, and try again.",
      );
    }
    return errPage(502, `Upstream responded ${res.status}`, "Try again, or use redirect mode.");
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    res.headers.get("Content-Type") ?? "application/octet-stream",
  );
  headers.set(
    "Content-Disposition",
    `attachment; filename="${name.replace(/"/g, "")}"`,
  );
  const len = res.headers.get("Content-Length");
  if (len) headers.set("Content-Length", len);
  const range = res.headers.get("Content-Range");
  if (range) headers.set("Content-Range", range);

  return new Response(res.body, { status: res.status, headers });
}
