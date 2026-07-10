import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicEnvironment } from "@/lib/supabase/environment";

let browserClient:
  | ReturnType<typeof createBrowserClient>
  | undefined;

/**
 * Browser client for Auth UI and explicitly approved client interactions.
 *
 * This factory can access only the public project URL and publishable key.
 * Validation occurs when the client is requested, not during module import.
 */
export function createBrowserSupabaseClient() {
  const environment = getSupabasePublicEnvironment();

  browserClient ??= createBrowserClient(
    environment.url,
    environment.publishableKey,
  );

  return browserClient;
}
