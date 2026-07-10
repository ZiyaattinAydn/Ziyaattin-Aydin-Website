import "server-only";

/**
 * Presence-only inspection for future explicitly approved administrative work.
 *
 * The service-role value is intentionally not returned because normal Auth,
 * Public and Studio CRUD must use the user session and RLS instead.
 */
export function isSupabaseServiceRoleConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}
