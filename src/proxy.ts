import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { isSupabaseConfigured } from "@/lib/supabase/environment";
import { refreshSupabaseSession } from "@/lib/supabase/proxy";

function unavailableResponse(): NextResponse {
  return new NextResponse("Authentication service is unavailable.", {
    status: 503,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

function redirectWithCookies(
  destination: URL,
  sourceResponse: NextResponse,
): NextResponse {
  const redirectResponse = NextResponse.redirect(destination);
  sourceResponse.cookies.getAll().forEach((cookie) => {
    const { name, value, ...options } = cookie;
    redirectResponse.cookies.set(name, value, options);
  });
  return redirectResponse;
}

/**
 * Next.js 16 Proxy owns session refresh and optional early redirects only.
 *
 * Studio authorization is repeated by server-only helpers and database RLS.
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  const isLoginRoute = pathname === "/login";
  const isMfaRoute = pathname === "/mfa";
  const isStudioRoute =
    pathname === "/studio" || pathname.startsWith("/studio/");

  if (!isLoginRoute && !isMfaRoute && !isStudioRoute) {
    return NextResponse.next();
  }

  if (!isSupabaseConfigured()) {
    return unavailableResponse();
  }

  try {
    const { response, hasAuthenticatedClaims } =
      await refreshSupabaseSession(request);

    if ((isStudioRoute || isMfaRoute) && !hasAuthenticatedClaims) {
      const loginUrl = new URL("/login", request.url);
      const requestedPath = `${pathname}${request.nextUrl.search}`;
      loginUrl.searchParams.set(
        "next",
        getSafeRedirectPath(requestedPath),
      );
      return redirectWithCookies(loginUrl, response);
    }

    if (isLoginRoute && hasAuthenticatedClaims) {
      const nextPath = getSafeRedirectPath(
        request.nextUrl.searchParams.get("next"),
      );
      return redirectWithCookies(new URL(nextPath, request.url), response);
    }

    return response;
  } catch {
    return unavailableResponse();
  }
}

export const config = {
  matcher: ["/login", "/mfa", "/studio/:path*"],
};
