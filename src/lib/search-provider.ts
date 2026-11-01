export type SearchResult = {
  title: string;
  link: string;
  snippet: string;
};

export type SearchResponse = {
  /** Google's estimated total match count for the query. */
  estimatedTotal: number;
  results: SearchResult[];
};

export type SearchProvider = (query: string) => Promise<SearchResponse>;
