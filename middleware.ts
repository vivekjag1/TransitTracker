import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";


export  function middleware(request: NextRequest) {
  return  auth0.middleware(request).then();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};