import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const key     = req.nextUrl.searchParams.get("key") ?? "";
  const bypassKey = process.env.DIVINATION_BYPASS_KEY ?? "";

  if (!bypassKey || key !== bypassKey) {
    return NextResponse.redirect(new URL("/divination", req.url));
  }

  const res = NextResponse.redirect(new URL("/divination", req.url));

  // 1-year cookie — httpOnly so it can't be read or cleared by JS
  res.cookies.set("divination_bypass", "1", {
    httpOnly: true,
    secure:   true,
    sameSite: "lax",
    maxAge:   60 * 60 * 24 * 365,
    path:     "/",
  });

  return res;
}
