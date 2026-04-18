import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  try {
    return intlMiddleware(request);
  } catch (err) {
    console.error(
      "[middleware] failure on",
      request.nextUrl.pathname,
      err instanceof Error ? err.stack : err
    );
    throw err;
  }
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|images|.*\\..*).+)"],
};
