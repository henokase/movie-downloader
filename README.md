# FlickFetch — Movie & TV Downloader

A [Next.js](https://nextjs.org) app for finding movies and TV shows
and downloading them. Search by title, open a result, and grab MP4/MKV files —
either via the provider's download page (redirect) or as direct links inside
the app. Metadata and artwork come from [TMDB](https://www.themoviedb.org).

> Quota and limits are counted by the provider
> against your own IP address.

## Features

- **Browse & search** — trending movies/TV rails on the home page, full
  search with Movies / TV Shows tabs, counts, and empty states.
- **Detail pages** — cinematic backdrop hero, poster, rating / runtime /
  genres, overview, download actions.
- **Cast with real photos** — each actor links to a **person page** with
  photo, biography, facts, and a full filmography split into Movies / TV tabs.
- **More like this** — recommendation rail (with similar-titles fallback) on
  every movie and TV page.
- **Trailers** — Trailer button on detail pages opens a dedicated player page
  in a new tab (autoplay + fullscreen toggle + Open-on-YouTube fallback).
- **Episodes** — season picker with per-episode stills, air dates, and
  per-episode download buttons.
- **Download proxy** (`/api/proxy-download`) — server-side fetch with the
  provider's required `Referer`, `Range`/resume support, 429 retries with
  backoff, bounded time-to-first-byte so long downloads never get cut, and
  honest error pages (rate-limited vs expired vs unreachable).
- **Loading skeletons** on every async surface (home, search, details,
  person, trailer, episodes, link modal).

## Getting started

Prerequisites: Node.js 20+ and a free TMDB read-access token
([themoviedb.org → Settings → API](https://www.themoviedb.org/settings/api)).

```bash
npm install
cp .env.example .env.local   # then paste your TMDB_READ_TOKEN
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script          | What it does                              |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Start the dev server (hot reload)         |
| `npm run build` | Production build (also type-checks)       |
| `npm start`     | Serve the production build                |
| `npm run lint`  | ESLint                                    |
| `npx tsc --noEmit` | Type-check without emitting           |

## How downloads work

1. The app asks the provider backend for a short-lived token, then requests
   file links for a TMDB id (`/api/download-proxy` via `lib/download.ts`).
2. **Redirect mode** (default) opens the provider's download page, which
   serves the files from its own infrastructure.
3. **Direct mode** lists the files in a modal; each link is routed through
   `/api/proxy-download`, which re-fetches server-side with the required
   `Referer` and streams the bytes to your browser with the right filename.

Signed links expire, free quotas are limited (`freeNum` / `limited` are shown
in the modal), and some file hosts throttle VPN/shared-egress IPs (HTTP 429)
— in that case wait a bit, use redirect mode, or try the MKV versions, which
are served from a different host.

## Project structure

```text
app/
  page.tsx               Home: hero + trending rails
  search/                Search results + tabs
  movie/[id]/            Movie details + cast + related
  tv/[id]/               TV details + episodes + cast + related
  person/[id]/           Actor profile + filmography tabs
  trailer/[kind]/[id]/   Fullscreen trailer player (new tab)
  settings/              Download mode + link preferences
  api/
    search|season        TMDB-backed helpers for client components
    proxy-download       File-download proxy (referer, range, retries)
components/              Cards, rails, modal, skeletons, SVG icon set
lib/
  tmdb.ts                Server-only TMDB client (token never leaves server)
  tmdb-types.ts          Shared types + image URL helper
  download.ts            Provider link client (token/proxy flow, modal data)
  settings.tsx           localStorage-backed settings context
```

## Tech

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · TypeScript.
Images via `next/image` from `image.tmdb.org`. Settings persist in
`localStorage`; nothing is uploaded anywhere.
