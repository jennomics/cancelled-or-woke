import type { SearchProvider, SearchResult } from "./search-provider";

const DEFAULT_API_URL = "https://google.serper.dev/search";

type SerperItem = { title?: string; link?: string; snippet?: string };
type SerperResponse = {
  organic?: SerperItem[];
  // Serper's documented /search response has no Google-style estimated
  // total, so callers must not treat estimatedTotal as a real total here.
  searchInformation?: { totalResults?: string | number };
  error?: { message?: string };
  message?: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable ${name}`);
  return value;
}

export const serperSearch: SearchProvider = async (query) => {
  const key = requireEnv("SERPER_API_KEY");
  const url = process.env.SERPER_API_URL ?? DEFAULT_API_URL;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-KEY": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, num: 10 }),
  });
  const body = (await response.json()) as SerperResponse;
  if (!response.ok) {
    throw new Error(
      `Serper search failed (${response.status}): ${body.error?.message ?? body.message ?? "no message"}`,
    );
  }

  const results: SearchResult[] = (body.organic ?? []).map((item) => ({
    title: item.title ?? "",
    link: item.link ?? "",
    snippet: item.snippet ?? "",
  }));
  const total = body.searchInformation?.totalResults;
  return {
    estimatedTotal: typeof total === "number" ? total : Number(total ?? 0),
    results,
  };
};
