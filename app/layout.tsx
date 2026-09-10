import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Movie Downloader",
  description: "Search movies and TV shows, get download links. Local use.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <SettingsProvider>
          <header className="border-b border-zinc-800">
            <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
              <Link href="/" className="text-lg font-bold">
                Movie Downloader
              </Link>
              <Link href="/" className="text-sm text-zinc-400 hover:text-white">
                Search
              </Link>
              <Link
                href="/settings"
                className="ml-auto text-sm text-zinc-400 hover:text-white"
              >
                Settings
              </Link>
            </nav>
          </header>
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
            {children}
          </main>
          <footer className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
            Metadata and images powered by TMDB. Local use only.
          </footer>
        </SettingsProvider>
      </body>
    </html>
  );
}
