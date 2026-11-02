import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isAuthorized } from "../auth";

const req = (auth?: string) => new Request("http://x", { headers: auth ? { authorization: auth } : {} });

describe("isAuthorized", () => {
  beforeEach(() => { process.env.APP_PASSWORD = "hunter2"; });
  afterEach(() => { delete process.env.APP_PASSWORD; });

  it("throws when APP_PASSWORD is unset", () => {
    delete process.env.APP_PASSWORD;
    expect(() => isAuthorized(req("Bearer hunter2"))).toThrow("APP_PASSWORD");
  });

  it("accepts the matching bearer password", () => {
    expect(isAuthorized(req("Bearer hunter2"))).toBe(true);
  });

  it("rejects a wrong, empty, or missing password", () => {
    expect(isAuthorized(req("Bearer hunter3"))).toBe(false);
    expect(isAuthorized(req("Bearer "))).toBe(false);
    expect(isAuthorized(req())).toBe(false);
  });
});
