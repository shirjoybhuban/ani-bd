import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anime Tracker",
  description: "Track anime airing schedules with AniList"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background">
        <Providers>
          <main className="container max-w-6xl py-8">
            <nav className="mb-8 flex items-center justify-between rounded-xl border bg-card/50 p-3">
              <h1 className="text-sm font-semibold text-muted-foreground">Anime Tracker</h1>
              <div className="flex gap-2">
                <Link href="/" className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}>
                  My Anime
                </Link>
                <Link href="/search" className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}>
                  Search
                </Link>
              </div>
            </nav>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
