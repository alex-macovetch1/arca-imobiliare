import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/* ---------------------------------------------------------------------------
   One password, kept in ADMIN_KEY, checked on the server. The cookie carries a
   signature of the key rather than the key itself, so nothing readable ever
   reaches the browser and changing ADMIN_KEY logs everyone out at once.
   --------------------------------------------------------------------------- */

export const ADMIN_COOKIE = "arca_admin";

/** Ten days: long enough that the agency does not retype it every morning. */
export const ADMIN_MAX_AGE = 60 * 60 * 24 * 10;

const FALLBACK = "arca";
const PAYLOAD = "arca-admin-v1";

export function adminKey(): string {
  return process.env.ADMIN_KEY?.trim() || FALLBACK;
}

/** True while the site runs on the built-in key, which the login screen says out loud. */
export function usingFallbackKey(): boolean {
  return !process.env.ADMIN_KEY?.trim();
}

export function adminToken(): string {
  return createHmac("sha256", adminKey()).update(PAYLOAD).digest("hex");
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const expected = Buffer.from(adminToken(), "utf8");
  const given = Buffer.from(token, "utf8");
  // timingSafeEqual throws on a length mismatch, which is itself an answer.
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export function checkPassword(password: unknown): boolean {
  if (typeof password !== "string" || password.length === 0) return false;
  const expected = Buffer.from(adminKey(), "utf8");
  const given = Buffer.from(password, "utf8");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Server components ask this before rendering anything from the store. */
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(ADMIN_COOKIE)?.value);
}
