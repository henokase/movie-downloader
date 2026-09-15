import { NextResponse } from "next/server";
import { VIDVAULT_API_CANDIDATES, VIDVAULT_SITE } from "@/lib/vidvault";

export const dynamic = "force-dynamic";

// POST /api/download-proxy — same-origin proxy for VidVault link lookup.
// The browser never talks to vidvault.* directly (CORS-blocked); the Next
// server (localhost, same egress IP as the user) forwards the request, so
// quota accounting is unchanged.
// Domain mitigation: tries each host in VIDVAULT_API_CANDIDATES, preferring
// the `x-vidvault-base` hint returned by our /api/get-token (the host that
// actually answered). POSTs always go to a live host directly — never to a
// redirecting one, where the 301 would downgrade POST to GET and drop the
// JSON body ("req.body undefined" / "Cannot GET /download-proxy").
export async function POST(req: Request) {
  const rawBody = await req.text();
  const token = req.headers.get("x-request-token") ?? "";
  const hint = req.headers.get("x-vidvault-base") ?? "";

  const bases = [
    hint,
    ...VIDVAULT_API_CANDIDATES.filter((b) => b !== hint),
  ].filter(Boolean);

  let lastStatus = 502;
  let lastBody = "";
  for (const base of bases) {
    try {
      const upstream = await fetch(`${base}/download-proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-request-token": token,
          Referer: `${VIDVAULT_SITE}/`,
          Origin: VIDVAULT_SITE,
          Accept: "application/json",
        },
        body: rawBody,
        cache: "no-store",
      });
      const body = await upstream.text();
      if (!upstream.ok) {
        lastStatus = upstream.status;
        lastBody = body;
        continue;
      }
      return new NextResponse(body, {
        status: 200,
        headers: {
          "Content-Type":
            upstream.headers.get("Content-Type") ?? "application/json",
          "Cache-Control": "no-store",
        },
      });
    } catch {
      continue;
    }
  }
  return new NextResponse(lastBody || '{"error":"unreachable"}', {
    status: lastStatus,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
