export type Category = {
  id: string;
  label: string;
  /** Extra search terms appended to the quoted subject name. */
  terms: string;
};

export const CATEGORIES: readonly Category[] = [
  { id: "misogyny", label: "Misogyny", terms: "misogyny OR sexism OR misogynist" },
  { id: "racism", label: "Racism", terms: "racism OR racist" },
  { id: "domestic-violence", label: "Domestic Violence", terms: '"domestic violence" OR "domestic abuse"' },
  { id: "drug-abuse", label: "Drug Abuse", terms: '"drug abuse" OR "drug addiction" OR "substance abuse"' },
];
