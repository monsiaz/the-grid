import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Enforce trailing slash on all frontend routes (admin/api/files are excluded by matcher).
  if (!pathname.endsWith("/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname + "/";
    return NextResponse.redirect(url, { status: 308 });
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|admin|_next|_vercel|images|assets|favicon|manifest|robots.txt|sitemap.xml|sitemap|.*\\..*).*)",
  ],
};
