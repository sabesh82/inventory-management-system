import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest, _: NextResponse) {
  const session = request.cookies.get("user");

  const onlyPublicRoutes = ["/login", "/register"];

  const isOnlyPublic = onlyPublicRoutes.includes(request.nextUrl.pathname);

  if (!session && !isOnlyPublic) {
    let url = "/login";
    url += `?redirect_to=${request.nextUrl.pathname}`;

    return NextResponse.redirect(new URL(url, request.url));
  }

  if (session && isOnlyPublic) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }

  if (session && !isOnlyPublic) {
    NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/",
    "/login/:paths*",
    "/register/:paths*",
    "/create-item/:paths*",
    "/add-to-inventory/:paths*",
  ],
};
