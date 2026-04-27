const FALLBACK_DATASETS: Record<string, number[]> = {
  bbn: [21, 196935],
};

const DATASET_ENDPOINT = 'https://gist.githubusercontent.com/bhubanmalek/058fdd20a2cb3db27b9a59561968f07a/raw/72454ff3eed472aeddf6d115cf7bf39b92b1c710/user_anime_mapping.json';

function parseDatasetPayload(rawText: string): unknown {
  try {
    return JSON.parse(rawText);
  } catch {
    // Supports object-literal style responses, e.g. { bbn: [1], shefa: [2] }
    const jsonLikeText = rawText
      .replace(/([{,]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":')
      .replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(jsonLikeText);
  }
}

function normalizeDatasets(payload: unknown): Record<string, number[]> {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  const result: Record<string, number[]> = {};
  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    if (!Array.isArray(value)) continue;

    const ids = value.filter((item): item is number => typeof item === "number" && Number.isFinite(item));
    result[key.trim().toLowerCase()] = ids;
  }

  return result;
}

export async function getAnimeDatasets(): Promise<Record<string, number[]>> {
  if (!DATASET_ENDPOINT) {
    return FALLBACK_DATASETS;
  }

  try {
    const response = await fetch(DATASET_ENDPOINT, {
      next: { revalidate: 60 }
    });
    if (!response.ok) {
      return FALLBACK_DATASETS;
    }

    const rawText = await response.text();
    const payload = parseDatasetPayload(rawText);
    const normalized = normalizeDatasets(payload);
    return Object.keys(normalized).length > 0 ? normalized : FALLBACK_DATASETS;
  } catch {
    return FALLBACK_DATASETS;
  }
}

export async function getDatasetIdsBySlug(slug?: string): Promise<number[] | null> {
  if (!slug) return null;
  const normalizedSlug = slug.trim().toLowerCase();
  const datasets = await getAnimeDatasets();
  return datasets[normalizedSlug] ?? null;
}
