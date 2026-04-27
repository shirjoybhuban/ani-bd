"use client";

import { useQuery } from "@tanstack/react-query";
import { ANIME_DETAILS_QUERY, AnimeMedia, anilistRequest } from "@/lib/anilist-client";

interface AnimeDetailsResponse {
  Media: AnimeMedia;
}

export function useAnimeDetails(animeId: number) {
  return useQuery({
    queryKey: ["anime-details", animeId],
    enabled: Number.isFinite(animeId),
    queryFn: async () => {
      const data = await anilistRequest<AnimeDetailsResponse, { id: number }>(ANIME_DETAILS_QUERY, {
        id: animeId
      });
      return data.Media;
    }
  });
}
