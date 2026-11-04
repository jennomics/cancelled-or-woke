import { afterEach, describe, expect, it } from "vitest";
import { normalizeImage, openaiIdentify, subjectFromReply } from "../identify";

const png = "data:image/png;base64,iVBORw0KGgo=";

describe("normalizeImage", () => {
  it("accepts a jpeg, png, or webp data URL", () => {
    expect(normalizeImage(png)).toBe(png);
    expect(normalizeImage("data:image/jpeg;base64,/9j/4AAQ")).toBeTruthy();
  });

  it("rejects other types, non-strings, and oversized payloads", () => {
    expect(() => normalizeImage("data:image/gif;base64,R0lGODlh")).toThrow("JPEG, PNG, or WebP");
    expect(() => normalizeImage("https://x.test/a.png")).toThrow("data URL");
    expect(() => normalizeImage(42)).toThrow("data URL");
    expect(() => normalizeImage("data:image/png;base64," + "A".repeat(6 * 1024 * 1024))).toThrow("under 4 MB");
  });
});

describe("subjectFromReply", () => {
  it("trims and strips surrounding quotes", () => {
    expect(subjectFromReply(' "Jim Carrey" \n')).toBe("Jim Carrey");
  });

  it("returns null on UNKNOWN, empty, or over-long replies", () => {
    expect(subjectFromReply("UNKNOWN")).toBeNull();
    expect(subjectFromReply("unknown")).toBeNull();
    expect(subjectFromReply("")).toBeNull();
    expect(subjectFromReply("x".repeat(101))).toBeNull();
  });
});

describe("openaiIdentify", () => {
  afterEach(() => { delete process.env.OPENAI_API_KEY; });
  it("throws when the key is missing", async () => {
    await expect(openaiIdentify(png)).rejects.toThrow("OPENAI_API_KEY");
  });
});
