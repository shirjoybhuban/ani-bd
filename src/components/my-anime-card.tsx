"use client";

import Image from "next/image";
import { memo, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AnimeMedia } from "@/lib/anilist-client";
import { formatCountdown, formatDateWithWeekday } from "@/utils/time";

interface MyAnimeCardProps {
  anime: AnimeMedia;
  onRemove: (id: number) => void;
}

function getTitle(title: { english: string | null; romaji: string | null }): string {
  return title.english || title.romaji || "Unknown title";
}

function MyAnimeCardComponent({ anime, onRemove }: MyAnimeCardProps) {
  const title = getTitle(anime.title);
  const imageUrl = anime.coverImage.extraLarge || anime.coverImage.large || "";
  const nextAiring = anime.nextAiringEpisode;
  const [nowMs, setNowMs] = useState(() => Date.now());
  const nowSeconds = Math.floor(nowMs / 1000);

  const latestEpisode =
    anime.airingSchedule?.nodes
      ?.filter((node) => node.airingAt <= nowSeconds)
      ?.reduce<{ episode: number; airingAt: number } | null>((latest, node) => {
        if (!latest || node.airingAt > latest.airingAt) {
          return { episode: node.episode, airingAt: node.airingAt };
        }
        return latest;
      }, null)?.episode ?? "N/A";

  useEffect(() => {
    if (!nextAiring) {
      return;
    }

    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [nextAiring]);

  const remaining = nextAiring ? Math.max(0, nextAiring.airingAt - nowSeconds) : 0;

  const countdownLabel = useMemo(() => {
    if (!nextAiring) {
      return "No upcoming airing data";
    }

    return formatCountdown(remaining);
  }, [nextAiring, remaining]);

  return (
    <article className="overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-b from-slate-900/95 to-slate-950/95 shadow-[0_12px_36px_rgba(56,28,130,0.35)]">
      <div className="relative h-40 w-full overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 33vw" />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        {/* <div className="absolute left-3 top-3">
          <Badge className="bg-emerald-500/20 text-[10px] tracking-wide text-emerald-300">TRACKING</Badge>
        </div> */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <div className="rounded-t-xl bg-black/35 px-2.5 py-2 backdrop-blur-sm w-full flex justify-center">
            <h3
              title={title}
              className="line-clamp-2 min-h-10 text-base font-semibold leading-5 tracking-tight text-white text-center flex items-center justify-center w-full"
            >
              {title}
            </h3>
          </div>
        </div>
   
        <button
          type="button"
          onClick={() => onRemove(anime.id)}
          className="absolute right-3 top-2 text-lg text-slate-200/80 transition hover:text-red-500"
          aria-label="Remove from watchlist"
        >
          <Badge className="bg-red-500/20 text-[10px] tracking-wide text-red-300">Remove</Badge>
        </button>
      </div>

      <div className="grid grid-cols-2 border-t border-white/10 text-sm">
        <div className="space-y-1 border-r border-white/10 p-4">
          <p className="text-slate-400">Latest Episode</p>
          <p className="text-3xl font-semibold text-emerald-400">{latestEpisode}</p>
        </div>
        <div className="space-y-1 p-4">
          <p className="text-slate-400">Next Episode</p>
          <p className="text-3xl font-semibold text-violet-400">{nextAiring?.episode ?? "N/A"}</p>
        </div>
        <div className="space-y-1 border-r border-t border-white/10 p-4">
          <p className="text-slate-400">Airs On</p>
          <p className="text-sm font-medium text-sky-300">{nextAiring?.airingAt ? formatDateWithWeekday(nextAiring.airingAt) : "N/A"}</p>
        </div>
        <div className="space-y-1 border-t border-white/10 p-4">
          <p className="text-slate-400">Airing In</p>
          <p className="inline-flex rounded-full bg-violet-500/20 px-2.5 py-1 text-sm font-semibold text-violet-200">
            {countdownLabel}
          </p>
        </div>
      </div>
    </article>
  );
}

export const MyAnimeCard = memo(MyAnimeCardComponent);
