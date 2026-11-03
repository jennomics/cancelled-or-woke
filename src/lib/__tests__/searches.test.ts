import { describe, expect, it } from "vitest";
import { DEFAULT_SEARCHES, normalizeSearches } from "../searches";

describe("normalizeSearches", () => {
  it("accepts the defaults unchanged", () => {
    expect(normalizeSearches([...DEFAULT_SEARCHES])).toEqual(DEFAULT_SEARCHES);
  });

  it("trims and assigns ids to custom entries without one", () => {
    expect(normalizeSearches([{ label: " Lawsuits ", terms: " lawsuit OR sued " }])).toEqual([
      { id: "custom-0", label: "Lawsuits", terms: "lawsuit OR sued" },
    ]);
  });

  it("rejects empty lists, too many, and bad entries", () => {
    expect(() => normalizeSearches([])).toThrow("1 to 12");
    expect(() => normalizeSearches(Array(13).fill({ label: "a", terms: "b" }))).toThrow("1 to 12");
    expect(() => normalizeSearches([{ label: "", terms: "b" }])).toThrow("Search 1: label");
    expect(() => normalizeSearches([{ label: "a", terms: "x".repeat(201) }])).toThrow("Search 1: terms");
    expect(() => normalizeSearches([null])).toThrow("Search 1: label");
  });
});
