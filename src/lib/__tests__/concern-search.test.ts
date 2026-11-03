import { describe, expect, it, vi } from "vitest";
import { buildQuery, normalizeSubject, searchConcerns } from "../concern-search";
import type { SearchProvider } from "../search-provider";
import type { Summarizer } from "../summarize";

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
  it("quotes the subject and appends terms", () => {
    expect(buildQuery("Some Show", "racism OR racist")).toBe('"Some Show" racism OR racist');
  });
});

describe("searchConcerns", () => {
  const searches = [
    { id: "a", label: "Alpha", terms: "alpha" },
    { id: "b", label: "Beta", terms: "beta" },
  ];
  const hit = (link: string) => ({ title: link, link, snippet: "s" });

  it("runs one search per spec, keeps only outlet links, and summarizes those", async () => {
    const search: SearchProvider = vi.fn(async () => ({
      estimatedTotal: 0,
      results: [hit("https://www.reuters.com/x"), hit("https://tabloid.example/y"), hit("https://apnews.com/z")],
    }));
    const summarize: Summarizer = vi.fn(async (subject, label, results) => `${subject}/${label}/${results.length}`);

    const reports = await searchConcerns("Some Show", searches, ["reuters.com", "apnews.com"], search, summarize);

    expect(search).toHaveBeenCalledTimes(2);
    expect(search).toHaveBeenCalledWith('"Some Show" alpha');
    expect(reports[0]).toEqual({
      id: "a",
      label: "Alpha",
      query: '"Some Show" alpha',
      summary: "Some Show/Alpha/2",
      sources: [hit("https://www.reuters.com/x"), hit("https://apnews.com/z")],
    });
    expect(reports[1].id).toBe("b");
  });

  it("propagates provider and summarizer failures", async () => {
    const search: SearchProvider = async () => ({ estimatedTotal: 0, results: [] });
    const failing: Summarizer = async () => { throw new Error("OpenAI down"); };
    await expect(searchConcerns("S", searches, [], search, failing)).rejects.toThrow("OpenAI down");

    const badSearch: SearchProvider = async () => { throw new Error("Serper search failed (403): quota"); };
    await expect(searchConcerns("S", searches, [], badSearch, failing)).rejects.toThrow("quota");
  });
});
