import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabasePublicEnvironment } from "@/lib/supabase/environment";

export type SupabaseProxySession = {
  response: NextResponse;
  hasAuthenticatedClaims: boolean;
};

/**
 * Refreshes the cookie-backed Auth session inside the writable Proxy response.
 *
 * This helper does not perform owner or MFA authorization. Those controls
 * belong to the Studio server layout, server mutations and database RLS.
 */
export async function refreshSupabaseSession(
  request: NextRequest,
): Promise<SupabaseProxySession> {
  const environment = getSupabasePublicEnvironment();

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    environment.url,
    environment.publishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.getClaims();

  return {
    response,
    hasAuthenticatedClaims: !error && Boolean(data?.claims?.sub),
  };
}
