import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_token";
const SESSION_LENGTH = 60 * 60 * 12;

function safeMatch(candidate: string, expected: string) {
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function tokenIsValid(candidate: string | undefined | null) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || !candidate) return false;
  return safeMatch(candidate, expected);
}

export async function isAdmin() {
  const store = await cookies();
  return tokenIsValid(store.get(ADMIN_COOKIE)?.value);
}

export async function startAdminSession(token: string) {
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_LENGTH,
  });
}

export async function endAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
