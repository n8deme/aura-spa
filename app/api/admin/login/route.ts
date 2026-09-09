import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE_MAX_AGE_SECONDS, ADMIN_COOKIE_NAME, createSessionToken, verifyPassword } from "@/lib/admin/session";
import { isRateLimited } from "@/lib/admin/rate-limit";

const bodySchema = z.object({ password: z.string().min(1) });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Trop de tentatives, réessayez plus tard." }, { status: 429 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !verifyPassword(parsed.data.password)) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE_SECONDS,
  });
  return response;
}
