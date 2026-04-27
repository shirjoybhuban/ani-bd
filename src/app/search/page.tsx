"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimeGrid } from "@/components/anime-grid";
import { SearchAnimeCard } from "@/components/search-anime-card";
import { SearchInput } from "@/components/search-input";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchAnime } from "@/hooks/useSearchAnime";

interface WatchlistItem {
  id: number;
}

const WATCHLIST_KEY = "watchlist";

function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(WATCHLIST_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as WatchlistItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is WatchlistItem => typeof item?.id === "number");
  } catch {
    return [];
  }
}

function saveWatchlist(list: WatchlistItem[]) {
  window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const { data = [], isLoading, isError, error } = useSearchAnime(searchTerm);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setWatchlist(getWatchlist());
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const watchlistIds = useMemo(() => new Set(watchlist.map((item) => item.id)), [watchlist]);

  const onAdd = useCallback(
    (id: number) => {
      if (watchlistIds.has(id)) return;

      setWatchlist((previous) => {
        const next = [...previous, { id }];
        saveWatchlist(next);
        return next;
      });
    },
    [watchlistIds]
  );

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Search Anime</h2>
        <p className="text-sm text-muted-foreground">
          Search and manually add anime to watchlist. Then check them on the <Link href="/" className="underline">My Anime</Link>.
        </p>
        {/* <Badge variant="outline">Debounced search (500ms)</Badge> */}
      </div>

      <SearchInput onDebouncedChange={setSearchTerm} />

      {isLoading && (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">Searching...</CardContent>
        </Card>
      )}
      {isError && (
        <Card>
          <CardContent className="pt-6 text-sm text-destructive">
            Search failed: {(error as Error)?.message || "Unknown error"}
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && data.length === 0 && searchTerm && (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">No anime found.</CardContent>
        </Card>
      )}

      {!isError && data.length > 0 && (
        <AnimeGrid>
          {data.map((anime) => (
            <SearchAnimeCard
              key={anime.id}
              anime={anime}
              onAdd={onAdd}
              disabled={watchlistIds.has(anime.id)}
            />
          ))}
        </AnimeGrid>
      )}
    </section>
  );
}
