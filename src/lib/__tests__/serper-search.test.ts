import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { serperSearch } from "../serper-search";

describe("serperSearch", () => {
  beforeEach(() => {
    process.env.SERPER_API_KEY = "key";
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.SERPER_API_KEY;
    delete process.env.SERPER_API_URL;
  });

  it("throws when credentials are missing", async () => {
    delete process.env.SERPER_API_KEY;
    await expect(serperSearch("q")).rejects.toThrow("SERPER_API_KEY");
  });

  it("sends key header, q and num and maps organic results", async () => {
    const fetchMock = vi.fn(async (_url: string, init: RequestInit) => ({
      ok: true,
      status: 200,
      json: async () => ({
        organic: [{ title: "T", link: "https://x.test", snippet: "S" }],
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await serperSearch('"A" b');

    const url = fetchMock.mock.calls[0][0] as string;
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(url).toBe("https://google.serper.dev/search");
    expect((init.headers as Record<string, string>)["X-API-KEY"]).toBe("key");
    expect(JSON.parse(init.body as string)).toEqual({ q: '"A" b', num: 10 });
    expect(result).toEqual({
      estimatedTotal: 0,
      results: [{ title: "T", link: "https://x.test", snippet: "S" }],
    });
  });

  it("throws with status and API message on non-OK responses", async () => {
    vi.stubGlobal("fetch", async () => ({
      ok: false,
      status: 429,
      json: async () => ({ message: "Quota exceeded" }),
    }));
    await expect(serperSearch("q")).rejects.toThrow("Serper search failed (429): Quota exceeded");
  });
});
