export type SearchSpec = {
  id: string;
  label: string;
  /** Extra search terms appended to the quoted subject name. */
  terms: string;
};

export const DEFAULT_SEARCHES: readonly SearchSpec[] = [
  { id: "misogyny", label: "Misogyny", terms: "misogyny OR sexism OR misogynist" },
  { id: "racism", label: "Racism", terms: "racism OR racist" },
  { id: "domestic-violence", label: "Domestic Violence", terms: '"domestic violence" OR "domestic abuse"' },
  { id: "drug-abuse", label: "Drug Abuse", terms: '"drug abuse" OR "drug addiction" OR "substance abuse"' },
];

export const MAX_SEARCHES = 12;
export const MAX_LABEL_LENGTH = 60;
export const MAX_TERMS_LENGTH = 200;

/** Validates a user-supplied list of searches. Throws on the first bad entry. */
export function normalizeSearches(input: unknown): SearchSpec[] {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_SEARCHES) {
    throw new Error(`Searches must be a list of 1 to ${MAX_SEARCHES} entries`);
  }
  return input.map((entry, i) => {
    const label = typeof entry?.label === "string" ? entry.label.trim() : "";
    const terms = typeof entry?.terms === "string" ? entry.terms.trim() : "";
    if (label.length === 0 || label.length > MAX_LABEL_LENGTH) {
      throw new Error(`Search ${i + 1}: label must be 1 to ${MAX_LABEL_LENGTH} characters`);
    }
    if (terms.length === 0 || terms.length > MAX_TERMS_LENGTH) {
      throw new Error(`Search ${i + 1}: terms must be 1 to ${MAX_TERMS_LENGTH} characters`);
    }
    return { id: typeof entry.id === "string" && entry.id ? entry.id : `custom-${i}`, label, terms };
  });
}
