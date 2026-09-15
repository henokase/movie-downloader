import { NextResponse } from "next/server";
import { VIDVAULT_API_CANDIDATES, VIDVAULT_SITE } from "@/lib/vidvault";

export const dynamic = "force-dynamic";

// GET /api/get-token — same-origin proxy for VidVault's token endpoint.
// Why a proxy: browsers may not fetch vidvault.* directly (no CORS ACAO
// header). The Next server runs on localhost, so proxied requests still
// egress from the user's own IP and quota accounting is unchanged.
// Domain mitigation: tries each host in VIDVAULT_API_CANDIDATES in order
// and returns the first valid token. A GET to a stale host follows its 301
// to the live one, so moves survive as long as one candidate forwards.
export async function GET() {
  let lastStatus = 502;
  for (const base of VIDVAULT_API_CANDIDATES) {
    try {
      const upstream = await fetch(`${base}/get-token`, {
        method: "GET",
        headers: {
          Referer: `${VIDVAULT_SITE}/`,
          Origin: VIDVAULT_SITE,
          Accept: "application/json",
        },
        cache: "no-store",
      });
      if (!upstream.ok) {
        lastStatus = upstream.status;
        continue;
      }
      const body = await upstream.text();
      // Only accept real tokens — skip error pages from dead hosts.
      try {
        const json = JSON.parse(body) as { t?: unknown };
        if (typeof json.t !== "string" || json.t.length < 16) continue;
      } catch {
        continue;
      }
      // Tell the client which API base answered, so its download-proxy POST
      // can go straight there (POSTing to a redirecting host drops the body
      // when fetch follows the 301 as GET).
      return new NextResponse(body, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "x-vidvault-base": new URL(upstream.url).origin + "/api",
        },
      });
    } catch {
      continue;
    }
  }
  return NextResponse.json(
    { error: "VidVault unreachable on all known hosts" },
    { status: lastStatus },
  );
}
