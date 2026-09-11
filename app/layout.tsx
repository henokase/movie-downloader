import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings";
import { LogoIcon, SearchIcon, SettingsIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: {
    default: "FlickFetch — Movie & TV Downloader",
    template: "%s · FlickFetch",
  },
  description:
    "Search movies and TV shows and download them. Local use only.",
};

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="FlickFetch home">
          <LogoIcon className="h-7 w-7" />
          <span className="text-[17px] font-bold tracking-tight text-zinc-50">
            Flick<span className="text-amber-400">Fetch</span>
          </span>
        </Link>
        <div className="ml-6 hidden items-center gap-1 sm:flex">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
          >
            <SearchIcon className="h-4 w-4" />
            Browse
          </Link>
        </div>
        <Link
          href="/settings"
          aria-label="Settings"
          className="ml-auto flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
        >
          <SettingsIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </Link>
      </nav>
    </header>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#09090b] text-zinc-100">
        <SettingsProvider>
          {/* ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10"
          >
            <div className="absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(251,191,36,0.07),transparent_70%)]" />
            <div className="absolute bottom-0 left-0 h-[380px] w-[520px] bg-[radial-gradient(100%_100%_at_0%_100%,rgba(99,102,241,0.05),transparent_70%)]" />
          </div>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 sm:px-6">
            {children}
          </main>
          <footer className="border-t border-white/[0.06]">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-1 px-4 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="text-xs text-zinc-500">
                Metadata and artwork by{" "}
                <span className="font-medium text-zinc-400">TMDB</span>
              </p>
              <p className="text-xs text-zinc-600">
                Personal local use only · Downloads count against your own IP
              </p>
            </div>
          </footer>
        </SettingsProvider>
      </body>
    </html>
  );
}
