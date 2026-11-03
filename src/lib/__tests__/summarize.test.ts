import { afterEach, describe, expect, it } from "vitest";
import { buildUserPrompt, openaiSummarize } from "../summarize";

describe("buildUserPrompt", () => {
  it("lists subject, topic, and each result with its outlet", () => {
    const prompt = buildUserPrompt("Some Show", "Racism", [
      { title: "T1", link: "https://www.reuters.com/a", snippet: "S1" },
    ]);
    expect(prompt).toContain("Subject: Some Show");
    expect(prompt).toContain("Topic: Racism");
    expect(prompt).toContain("1. Outlet: www.reuters.com");
    expect(prompt).toContain("Title: T1");
    expect(prompt).toContain("Link: https://www.reuters.com/a");
  });
});

describe("openaiSummarize", () => {
  afterEach(() => { delete process.env.OPENAI_API_KEY; });

  it("throws when the key is missing", async () => {
    await expect(openaiSummarize("S", "L", [])).rejects.toThrow("OPENAI_API_KEY");
  });

  it("returns a fixed sentence without calling OpenAI when there are no results", async () => {
    process.env.OPENAI_API_KEY = "k";
    await expect(openaiSummarize("S", "L", [])).resolves.toBe("No results from the listed outlets.");
  });
});
