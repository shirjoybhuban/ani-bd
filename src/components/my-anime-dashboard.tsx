"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimeGrid } from "@/components/anime-grid";
import { MyAnimeCard } from "@/components/my-anime-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAnimeList } from "@/hooks/useAnimeList";

interface WatchlistItem {
  id: number;
}

const WATCHLIST_KEY = "watchlist";

function getWatchlistIds(): number[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(WATCHLIST_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as WatchlistItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is WatchlistItem => typeof item?.id === "number").map((item) => item.id);
  } catch {
    return [];
  }
}

function saveWatchlistIds(ids: number[]) {
  const payload: WatchlistItem[] = ids.map((id) => ({ id }));
  window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(payload));
}

interface MyAnimeDashboardProps {
  source: "localStorage" | "static";
  staticIds?: number[];
  datasetName?: string;
}

export function MyAnimeDashboard({ source, staticIds = [], datasetName }: MyAnimeDashboardProps) {
  const [ids, setIds] = useState<number[]>(() => (source === "static" ? staticIds : []));

  useEffect(() => {
    if (source !== "localStorage") return;

    const frame = requestAnimationFrame(() => {
      setIds(getWatchlistIds());
    });

    return () => cancelAnimationFrame(frame);
  }, [source]);

  const { data = [], isLoading, isError, error } = useAnimeList(ids);

  const onRemove = useCallback(
    (id: number) => {
      setIds((previous) => {
        const next = previous.filter((itemId) => itemId !== id);
        if (source === "localStorage") {
          saveWatchlistIds(next);
        }
        return next;
      });
    },
    [source]
  );

  const subtitle = useMemo(() => {
    if (source === "localStorage") {
      return `${ids.length} anime in your watchlist`;
    }

    return `${ids.length} anime from ${datasetName ?? "dataset"}`;
  }, [datasetName, ids.length, source]);

  return (
    <section className="space-y-7">
      <div className="flex flex-col gap-4 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-slate-950 to-slate-900/80 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            My Anime Tracker <span className="text-violet-400">●</span>
          </h2>
          <p className="text-sm text-slate-300">{subtitle}</p>
        </div>
        <Link
          href="/search"
          className={cn(buttonVariants({ variant: "secondary" }), "bg-violet-600/80 text-white hover:bg-violet-500")}
        >
          + Add Anime
        </Link>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading watchlist anime...</p>}
      {isError && <p className="text-sm text-destructive">Failed to load anime data: {(error as Error)?.message || "Unknown error"}</p>}

      {!isLoading && !isError && (
        <AnimeGrid>
          {data.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-violet-400/30 bg-slate-950/60 p-8 text-center">
              <p className="text-lg font-semibold text-white">No anime found</p>
              <p className="mt-1 text-sm text-slate-400">
                {source === "localStorage"
                  ? "Search and add anime to start tracking schedules."
                  : "This dataset has no IDs available."}
              </p>
            </div>
          )}
          {data.map((anime) => (
            <MyAnimeCard key={anime.id} anime={anime} onRemove={onRemove} />
          ))}
          <Link
            href="/search"
            className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-violet-400/40 bg-gradient-to-b from-slate-900/50 to-slate-950/70 p-6 text-center transition hover:border-violet-300 hover:bg-slate-900/80"
          >
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/20 text-3xl text-violet-300">
              +
            </span>
            <p className="text-xl font-semibold text-violet-300">Add Anime</p>
            <p className="mt-1 text-sm text-slate-400">Search and add anime to your watchlist</p>
          </Link>
        </AnimeGrid>
      )}
    </section>
  );
}
