import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isLoginPage = req.nextUrl.pathname === "/login";

  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard");

  // ❌ belum login → paksa ke login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ❌ sudah login tapi buka login page
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
