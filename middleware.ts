import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect paths without trailing slash → with trailing slash (308 permanent).
  // Admin, API, static files and Vercel internals are excluded by the matcher below.
  // `skipTrailingSlashRedirect: true` in next.config.ts ensures Next.js itself
  // never counter-redirects back, so there is no redirect loop.
  if (!pathname.endsWith("/")) {
    const redirectUrl = new URL(request.nextUrl);
    redirectUrl.pathname = `${pathname}/`;
    return NextResponse.redirect(redirectUrl, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|admin|_next|_vercel|images|assets|favicon|manifest|robots\\.txt|sitemap\\.xml|sitemap|.*\\..*).*)",
  ],
};
