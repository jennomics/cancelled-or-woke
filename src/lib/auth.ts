import { timingSafeEqual } from "node:crypto";

/** Returns true when the request carries the password set in APP_PASSWORD. Throws if APP_PASSWORD is unset. */
export function isAuthorized(request: Request): boolean {
  const expected = process.env.APP_PASSWORD;
  if (!expected) throw new Error("Missing required environment variable APP_PASSWORD");
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
