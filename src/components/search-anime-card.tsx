"use client";

import Image from "next/image";
import { memo } from "react";
import { SearchAnimeItem } from "@/hooks/useSearchAnime";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchAnimeCardProps {
  anime: SearchAnimeItem;
  onAdd: (id: number) => void;
  disabled?: boolean;
}

function getTitle(title: { english: string | null; romaji: string | null }): string {
  return title.english || title.romaji || "Unknown title";
}

function SearchAnimeCardComponent({ anime, onAdd, disabled }: SearchAnimeCardProps) {
  const title = getTitle(anime.title);
  const imageUrl = anime.coverImage.large || "";
  const secondaryTitle =
    anime.title.english && anime.title.romaji && anime.title.english !== anime.title.romaji ? anime.title.romaji : null;
  const genres = anime.genres?.filter(Boolean).slice(0, 2) ?? [];
  const studioName = anime.studios?.nodes?.[0]?.name ?? "Unknown";
  const cleanDescription = anime.description?.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() ?? "";

  return (
    <article className="overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-b from-slate-900/90 to-slate-950/95 text-slate-100 shadow-[0_8px_24px_rgba(71,38,150,0.25)]">
      <div className="relative h-44 w-full overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
        ) : (
          <div className="h-full w-full bg-slate-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
      </div>

      <div className="flex h-[256px] flex-col p-4">
        <div className="h-[142px] space-y-1 overflow-hidden">
          <h3 title={title} className="line-clamp-2 text-base font-semibold leading-5 text-white">
            {title}
          </h3>
          <p className="line-clamp-1 min-h-4 text-xs text-slate-400">{secondaryTitle || " "}</p>
          <p title={cleanDescription || "No description available for this anime."} className="line-clamp-2 text-sm text-slate-300">
            {cleanDescription || "No description available for this anime."}
          </p>
          <p className="line-clamp-1 text-xs text-violet-200/90">Production House: {studioName}</p>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex h-7 items-center gap-2 overflow-hidden">
            {genres.length > 0 ? (
              genres.map((genre) => (
                <Badge key={genre} className="bg-orange-500/90 text-white hover:bg-orange-500">
                  {genre}
                </Badge>
              ))
            ) : (
              <Badge className="bg-slate-700 text-slate-200 hover:bg-slate-700">No category</Badge>
            )}
          </div>

          <Button
            type="button"
            variant="secondary"
            className="h-11 w-full rounded-full border border-violet-300/40 bg-violet-500/15 text-violet-100 hover:bg-violet-500/25"
            onClick={() => onAdd(anime.id)}
            disabled={disabled}
          >
            {disabled ? "Added to Watchlist" : "Add to Watchlist"}
          </Button>
        </div>
      </div>
    </article>
  );
}

export const SearchAnimeCard = memo(SearchAnimeCardComponent);
