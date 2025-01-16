import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("session");

  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // if (
  //   !session &&
  //   ["/dashboard", "/wallet"].some((path) => pathname.startsWith(path))
  // ) {
  //   const loginUrl = new URL("/login", req.url);
  //   loginUrl.searchParams.set(
  //     "message",
  //     "Session expired, please login again."
  //   );
  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/wallet/:path*", "/login"],
};
