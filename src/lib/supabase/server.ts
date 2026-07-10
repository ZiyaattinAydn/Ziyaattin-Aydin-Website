import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabasePublicEnvironment } from "@/lib/supabase/environment";

/**
 * Request-scoped Supabase client for Server Components, Server Functions and
 * Route Handlers.
 *
 * Server Components may read cookies but cannot always write refreshed values.
 * Cookie writes are therefore attempted where supported and safely ignored
 * during Server Component rendering. src/proxy.ts will own session refresh.
 */
export async function createServerSupabaseClient() {
  const environment = getSupabasePublicEnvironment();
  const cookieStore = await cookies();

  return createServerClient(
    environment.url,
    environment.publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Cookie writes are unavailable during Server Component rendering.
            // Proxy, Server Functions and Route Handlers handle writable flows.
          }
        },
      },
    },
  );
}
