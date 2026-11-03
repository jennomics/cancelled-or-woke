import { describe, expect, it } from "vitest";
import { hostnameOf, isFromOutlet, normalizeOutlets } from "../outlets";

describe("normalizeOutlets", () => {
  it("lower-cases, trims, and dedupes", () => {
    expect(normalizeOutlets([" Reuters.com ", "reuters.com", "bbc.co.uk"])).toEqual(["reuters.com", "bbc.co.uk"]);
  });

  it("rejects non-lists, non-domains, and over-long lists", () => {
    expect(() => normalizeOutlets("reuters.com")).toThrow("list");
    expect(() => normalizeOutlets(["https://reuters.com"])).toThrow('"https://reuters.com" is not a domain');
    expect(() => normalizeOutlets(["not a domain"])).toThrow("is not a domain");
    expect(() => normalizeOutlets([""])).toThrow("is not a domain");
    expect(() => normalizeOutlets(Array(201).fill("a.com"))).toThrow("at most 200");
  });

  it("allows an empty list", () => {
    expect(normalizeOutlets([])).toEqual([]);
  });
});

describe("isFromOutlet", () => {
  const outlets = ["reuters.com", "bbc.co.uk"];
  it("matches exact hosts and subdomains only", () => {
    expect(isFromOutlet("https://reuters.com/a", outlets)).toBe(true);
    expect(isFromOutlet("https://www.reuters.com/a", outlets)).toBe(true);
    expect(isFromOutlet("https://news.bbc.co.uk/a", outlets)).toBe(true);
    expect(isFromOutlet("https://notreuters.com/a", outlets)).toBe(false);
    expect(isFromOutlet("https://reuters.com.evil.test/a", outlets)).toBe(false);
    expect(isFromOutlet("not a url", outlets)).toBe(false);
  });
});

describe("hostnameOf", () => {
  it("returns the lower-cased host or null", () => {
    expect(hostnameOf("https://WWW.Example.com/p")).toBe("www.example.com");
    expect(hostnameOf("nope")).toBeNull();
  });
});
