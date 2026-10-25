import "server-only";
import { getStudioAuthorization } from "@/lib/auth/studio-authorization";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type SiteProfile } from "./domain";
export async function siteProfileContext() {
  const auth = await getStudioAuthorization();
  if (!auth.ok) throw new Error("Güvenli Studio oturumu gerekli.");
  return { owner: auth.profile.userId, db: await createServerSupabaseClient() };
}
export async function readStudioProfile(): Promise<{
  ok: true; row: SiteProfile | null
} | { ok: false }> {
  try {
    const { db, owner } = await siteProfileContext();
    const { data, error } = await db.from("site_profiles")
      .select("owner_id,headline,description,email,github_url,linkedin_url,status,published_at,updated_at")
      .eq("owner_id", owner).maybeSingle();
    if (error) throw new Error();
    return { ok: true, row: data as SiteProfile | null };
  } catch { return { ok: false }; }
}
