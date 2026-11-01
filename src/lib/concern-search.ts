import { CATEGORIES } from "./categories";
import type { SearchProvider, SearchResponse } from "./search-provider";

export type CategoryReport = SearchResponse & { id: string; label: string; query: string };

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

export async function searchConcerns(subject: string, search: SearchProvider): Promise<CategoryReport[]> {
  return Promise.all(
    CATEGORIES.map(async ({ id, label, terms }) => {
      const query = buildQuery(subject, terms);
      return { id, label, query, ...(await search(query)) };
    })
  );
}
