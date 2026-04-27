"use client";

import { useQuery } from "@tanstack/react-query";
import { anilistRequest, SEARCH_ANIME_QUERY } from "@/lib/anilist-client";

export interface SearchAnimeItem {
  id: number;
  title: {
    romaji: string | null;
    english: string | null;
  };
  description?: string | null;
  genres?: string[] | null;
  studios?: {
    nodes: {
      name: string;
    }[];
  } | null;
  coverImage: {
    large?: string | null;
  };
}

interface SearchAnimeResponse {
  Page: {
    media: SearchAnimeItem[];
  };
}

export function useSearchAnime(searchTerm: string) {
  return useQuery({
    queryKey: ["anime-search", searchTerm],
    enabled: searchTerm.trim().length > 0,
    queryFn: async () => {
      const data = await anilistRequest<SearchAnimeResponse, { search: string }>(SEARCH_ANIME_QUERY, {
        search: searchTerm
      });
      return data.Page.media;
    }
  });
}
