import { isFromOutlet } from "./outlets";
import type { SearchSpec } from "./searches";
import type { SearchProvider, SearchResult } from "./search-provider";
import type { Summarizer } from "./summarize";

export type SearchReport = {
  id: string;
  label: string;
  query: string;
  summary: string;
  /** Hits from the outlet list, in search-engine order. */
  sources: SearchResult[];
};

export const MAX_SUBJECT_LENGTH = 100;

export function normalizeSubject(input: unknown): string {
  if (typeof input !== "string") throw new Error("Subject must be a string");
  const subject = input.trim().replace(/"/g, "");
  if (subject.length === 0 || subject.length > MAX_SUBJECT_LENGTH) {
    throw new Error(`Subject must be 1 to ${MAX_SUBJECT_LENGTH} characters`);
  }
  return subject;
}

export function buildQuery(subject: string, terms: string): string {
  return `"${subject}" ${terms}`;
}

export async function searchConcerns(
  subject: string,
  searches: readonly SearchSpec[],
  outlets: readonly string[],
  search: SearchProvider,
  summarize: Summarizer
): Promise<SearchReport[]> {
  return Promise.all(
    searches.map(async ({ id, label, terms }) => {
      const query = buildQuery(subject, terms);
      const { results } = await search(query);
      const sources = results.filter((r) => isFromOutlet(r.link, outlets));
      const summary = await summarize(subject, label, sources);
      return { id, label, query, summary, sources };
    })
  );
}
