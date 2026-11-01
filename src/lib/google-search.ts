import type { SearchProvider, SearchResult } from "./search-provider";

const DEFAULT_API_URL = "https://www.googleapis.com/customsearch/v1";

type GoogleItem = { title?: string; link?: string; snippet?: string };
type GoogleResponse = {
  items?: GoogleItem[];
  searchInformation?: { totalResults?: string };
  error?: { message?: string };
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable ${name}`);
  return value;
}

export const googleSearch: SearchProvider = async (query) => {
  const key = requireEnv("GOOGLE_SEARCH_API_KEY");
  const cx = requireEnv("GOOGLE_SEARCH_ENGINE_ID");
  const url = new URL(process.env.GOOGLE_SEARCH_API_URL ?? DEFAULT_API_URL);
  url.searchParams.set("key", key);
  url.searchParams.set("cx", cx);
  url.searchParams.set("q", query);
  url.searchParams.set("num", "10");

  const response = await fetch(url);
  const body = (await response.json()) as GoogleResponse;
  if (!response.ok) {
    throw new Error(`Google search failed (${response.status}): ${body.error?.message ?? "no message"}`);
  }

  const results: SearchResult[] = (body.items ?? []).map((item) => ({
    title: item.title ?? "",
    link: item.link ?? "",
    snippet: item.snippet ?? "",
  }));
  return { estimatedTotal: Number(body.searchInformation?.totalResults ?? 0), results };
};
