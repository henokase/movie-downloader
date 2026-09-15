// VidVault domain mitigation (2026-09: vidvault.ru 301-redirects to vidvault.to).
//
// Never hardcode a single VidVault host:
// - Browsers follow 301 on GET (so old redirect links keep working), but a
//   server-side POST that hits the 301 loses its body (301 turns POST into
//   GET) and the API answers "req.body undefined" / "Cannot GET".
// - Browser fetch to vidvault.* is blocked by CORS (no ACAO header), so all
//   link discovery must go through same-origin Next routes anyway.
//
// Strategy: try candidates in order (.to first = current canonical, .ru as
// the legacy redirector). A GET to a stale host follows its 301 and lands on
// the live one; POSTs always go to the host that answered the GET, so the
// body is never dropped by a redirect. If VidVault moves again, add the new
// host (or set VIDVAULT_BASE) — one place instead of a hunt through files.

// Override for the next move: set NEXT_PUBLIC_VIDVAULT_BASE (client +
// server) or VIDVAULT_BASE (server routes) to e.g. https://vidvault.xyz
// and it is tried first, no code changes needed.
const override =
  process.env.NEXT_PUBLIC_VIDVAULT_BASE ?? process.env.VIDVAULT_BASE;

export const VIDVAULT_API_CANDIDATES = [
  override ? `${override.replace(/\/+$/, "")}/api` : "",
  "https://vidvault.to/api",
  "https://vidvault.ru/api",
].filter(Boolean);

// Canonical host for user-facing redirect links and the Referer that file
// hosts expect. GET navigations follow 301 anyway, so this stays valid even
// while .ru keeps redirecting.
export const VIDVAULT_SITE = "https://vidvault.to";
