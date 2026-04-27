const ANILIST_API_URL = "https://graphql.anilist.co";

export interface AnimeTitle {
  romaji: string | null;
  english: string | null;
}

export interface CoverImage {
  extraLarge?: string | null;
  large?: string | null;
  medium?: string | null;
}

export interface AiringNode {
  episode: number;
  airingAt: number;
}

export interface AnimeMedia {
  id: number;
  title: AnimeTitle;
  coverImage: CoverImage;
  nextAiringEpisode: {
    episode: number;
    airingAt: number;
    timeUntilAiring: number;
  } | null;
  airingSchedule: {
    nodes: AiringNode[];
  } | null;
}

export interface AnimeMediaListItem {
  id: number;
  title: AnimeTitle;
  coverImage: CoverImage;
  nextAiringEpisode: {
    episode: number;
    airingAt: number;
    timeUntilAiring: number;
  } | null;
  airingSchedule: {
    nodes: AiringNode[];
  } | null;
}

interface AniListError {
  message: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: AniListError[];
}

export async function anilistRequest<TData, TVariables extends Record<string, unknown>>(
  query: string,
  variables?: TVariables
): Promise<TData> {
  const response = await fetch(ANILIST_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`AniList request failed: ${response.status}`);
  }

  const payload = (await response.json()) as GraphQLResponse<TData>;

  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message || "AniList GraphQL error");
  }

  if (!payload.data) {
    throw new Error("AniList returned empty data");
  }

  return payload.data;
}

export const SEARCH_ANIME_QUERY = `
  query ($search: String) {
    Page(perPage: 10) {
      media(search: $search, type: ANIME) {
        id
        title {
          romaji
          english
        }
        description(asHtml: false)
        genres
        studios(isMain: true) {
          nodes {
            name
          }
        }
        coverImage {
          large
        }
      }
    }
  }
`;

export const ANIME_DETAILS_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
      }
      coverImage {
        extraLarge
        large
      }
      nextAiringEpisode {
        episode
        airingAt
        timeUntilAiring
      }
      airingSchedule(notYetAired: false, perPage: 50) {
        nodes {
          episode
          airingAt
        }
      }
    }
  }
`;

export const ANIME_LIST_QUERY = `
  query ($ids: [Int]) {
    Page(perPage: 50) {
      media(id_in: $ids, type: ANIME) {
        id
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
          large
        }
        nextAiringEpisode {
          episode
          airingAt
          timeUntilAiring
        }
        airingSchedule(notYetAired: false, perPage: 50) {
          nodes {
            episode
            airingAt
          }
        }
      }
    }
  }
`;
