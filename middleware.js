import { NextResponse } from "next/server";
import { checkToken } from "./app/utils/useful";

export async function middleware(request) {

  let path = request.nextUrl.pathname;
  let token = request.cookies.get("access_token")?.value;

  let check = await checkToken(token || "");

  if (!token && (path !== "/login")) {

    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!token && (path === "/login")) {
    return NextResponse.next();
  }

  if ((token && check?.isValid) && ((path === "/login"))) {
    return NextResponse.redirect(new URL("/main/feed/newForYou", request.url));
  }

  if (token && !check?.isValid) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/login",
    "/main/:chat*",
    "/main/feed",
    "/main/feed/community",
    "/main/feed/newForYou",
    "/main/:library*",
  ],
};