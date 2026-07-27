import { NextResponse } from "next/server";
import type { Lang } from "@/lib/types";
import { ADMIN_COOKIE, ADMIN_MAX_AGE, adminToken, checkPassword } from "../../_data/auth";

/* ---------------------------------------------------------------------------
   Login and logout. The password is compared on the server and never leaves
   it; what goes back is a signed, httpOnly cookie.
   --------------------------------------------------------------------------- */

export const dynamic = "force-dynamic";

const WRONG = {
  ro: "Parolă greșită.",
  ru: "Неверный пароль.",
};

/** A wrong password costs a second. Enough to make guessing pointless. */
const PENALTY_MS = 1000;

export async function POST(request: Request) {
  let password: unknown;
  let lang: Lang = "ro";
  try {
    const body = (await request.json()) as { password?: unknown; lang?: unknown };
    password = body.password;
    if (body.lang === "ru") lang = "ru";
  } catch {
    password = undefined;
  }

  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, PENALTY_MS));
    return NextResponse.json({ ok: false, error: WRONG[lang], errorT: WRONG }, { status: 401 });
  }

  // Marking the cookie secure on a plain-http host would silently drop it and
  // leave the panel in a login loop, so the flag follows the actual protocol.
  const forwarded = request.headers.get("x-forwarded-proto");
  const https = forwarded ? forwarded.split(",")[0].trim() === "https" : new URL(request.url).protocol === "https:";

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: https,
    path: "/",
    maxAge: ADMIN_MAX_AGE,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
