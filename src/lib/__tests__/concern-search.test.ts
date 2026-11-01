import { describe, expect, it, vi } from "vitest";
import { CATEGORIES } from "../categories";
import { buildQuery, normalizeSubject, searchConcerns } from "../concern-search";
import type { SearchProvider } from "../search-provider";

describe("normalizeSubject", () => {
  it("trims whitespace and strips double quotes", () => {
    expect(normalizeSubject('  "The Band"  ')).toBe("The Band");
  });

  it("rejects non-strings, empty, and over-long input", () => {
    expect(() => normalizeSubject(42)).toThrow("must be a string");
    expect(() => normalizeSubject("   ")).toThrow("1 to 100");
    expect(() => normalizeSubject("x".repeat(101))).toThrow("1 to 100");
  });
});

describe("buildQuery", () => {
  it("quotes the subject and appends category terms", () => {
    expect(buildQuery("Some Show", "racism OR racist")).toBe('"Some Show" racism OR racist');
  });
});

describe("searchConcerns", () => {
  it("runs one search per category and returns labeled reports", async () => {
    const search: SearchProvider = vi.fn(async (query) => ({
      estimatedTotal: 3,
      results: [{ title: `t:${query}`, link: "https://example.com", snippet: "s" }],
    }));

    const reports = await searchConcerns("Some Show", search);

    expect(search).toHaveBeenCalledTimes(CATEGORIES.length);
    expect(reports.map((r) => r.id)).toEqual(CATEGORIES.map((c) => c.id));
    expect(reports[0]).toMatchObject({
      label: "Misogyny",
      query: '"Some Show" misogyny OR sexism OR misogynist',
      estimatedTotal: 3,
    });
    expect(reports[0].results[0].title).toBe('t:"Some Show" misogyny OR sexism OR misogynist');
  });

  it("propagates provider failures", async () => {
    const search: SearchProvider = async () => {
      throw new Error("Google search failed (403): quota");
    };
    await expect(searchConcerns("Some Show", search)).rejects.toThrow("quota");
  });
});
