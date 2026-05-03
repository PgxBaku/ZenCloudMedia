"use server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/divination", req.url));
  res.cookies.delete("divination_bypass");
  res.cookies.delete("divination_token_active");
  return res;
}
