import { NextResponse } from "next/server";

// Force dynamic: signed upstream URLs expire, never cache.
export const dynamic = "force-dynamic";

// GET /api/proxy-download?url=<encoded upstream file url>&name=<filename>
// Fetches the file server-side with VidVault's Referer (their workers
// reject direct browser requests without it) and streams it to the browser.
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const target = sp.get("url") ?? "";
  const name = sp.get("name") ?? "download";

  if (!target) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  let upstream: URL;
  try {
    upstream = new URL(target);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Only allow the known file hosts — never proxy arbitrary URLs.
  const host = upstream.hostname;
  const allowed =
    host.endsWith(".hakunaymatata.com") ||
    host === "hakunaymatata.com" ||
    host.endsWith(".workers.dev");
  if (!allowed) {
    return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
  }

  let res: Response;
  try {
    res = await fetch(upstream.toString(), {
      headers: {
        Referer: "https://vidvault.ru/",
        Origin: "https://vidvault.ru",
      },
    });
  } catch {
    return NextResponse.json({ error: "Upstream unreachable" }, { status: 502 });
  }

  if (!res.ok || !res.body) {
    return NextResponse.json(
      { error: `Upstream responded ${res.status}` },
      { status: res.status === 404 ? 404 : 502 },
    );
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

  return new Response(res.body, { status: 200, headers });
}
