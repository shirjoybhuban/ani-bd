"use client";

import { useQuery } from "@tanstack/react-query";
import { ANIME_LIST_QUERY, AnimeMediaListItem, anilistRequest } from "@/lib/anilist-client";

interface AnimeListResponse {
  Page: {
    media: AnimeMediaListItem[];
  };
}

export function useAnimeList(ids: number[]) {
  const validIds = ids.filter(Number.isFinite);

  return useQuery({
    queryKey: ["anime-list", validIds],
    enabled: validIds.length > 0,
    queryFn: async () => {
      const data = await anilistRequest<AnimeListResponse, { ids: number[] }>(ANIME_LIST_QUERY, {
        ids: validIds
      });

      const byId = new Map(data.Page.media.map((anime) => [anime.id, anime]));
      return validIds.map((id) => byId.get(id)).filter(Boolean) as AnimeMediaListItem[];
    }
  });
}
