import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { googleSearch } from "../google-search";

describe("googleSearch", () => {
  beforeEach(() => {
    process.env.GOOGLE_SEARCH_API_KEY = "key";
    process.env.GOOGLE_SEARCH_ENGINE_ID = "cx";
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.GOOGLE_SEARCH_API_KEY;
    delete process.env.GOOGLE_SEARCH_ENGINE_ID;
  });

  it("throws when credentials are missing", async () => {
    delete process.env.GOOGLE_SEARCH_API_KEY;
    await expect(googleSearch("q")).rejects.toThrow("GOOGLE_SEARCH_API_KEY");
  });

  it("sends key, cx, q and maps items", async () => {
    const fetchMock = vi.fn(async (_url: URL) => ({
      ok: true,
      status: 200,
      json: async () => ({
        searchInformation: { totalResults: "1234" },
        items: [{ title: "T", link: "https://x.test", snippet: "S" }],
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await googleSearch('"A" b');

    const url = fetchMock.mock.calls[0][0] as URL;
    expect(url.searchParams.get("key")).toBe("key");
    expect(url.searchParams.get("cx")).toBe("cx");
    expect(url.searchParams.get("q")).toBe('"A" b');
    expect(result).toEqual({
      estimatedTotal: 1234,
      results: [{ title: "T", link: "https://x.test", snippet: "S" }],
    });
  });

  it("throws with status and API message on non-OK responses", async () => {
    vi.stubGlobal("fetch", async () => ({
      ok: false,
      status: 429,
      json: async () => ({ error: { message: "Quota exceeded" } }),
    }));
    await expect(googleSearch("q")).rejects.toThrow("Google search failed (429): Quota exceeded");
  });
});
