import "server-only";
import { getStudioAuthorization } from "@/lib/auth/studio-authorization";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { JOURNEY_ID, type JourneyRow } from "./domain";
const COLUMNS = "id,owner_id,title,slug,period_label,summary,content,occurred_on,sort_order,status,visibility,publish_state,published_at,archived_at,created_at,updated_at";
export async function journeyContext() {
  const auth = await getStudioAuthorization();
  if (!auth.ok) throw new Error("Güvenli Studio oturumu gerekli.");
  return { owner: auth.profile.userId, db: await createServerSupabaseClient() };
}
export async function listStudioJourney(): Promise<{ ok: true; rows: JourneyRow[] } | { ok: false }> {
  try {
    const { db, owner } = await journeyContext();
    const { data, error } = await db.from("journey_items").select(COLUMNS)
      .eq("owner_id", owner).order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }).limit(1000);
    if (error || !data) throw new Error();
    return { ok: true, rows: data as JourneyRow[] };
  } catch { return { ok: false }; }
}
export async function getStudioJourney(id: string): Promise<JourneyRow | null> {
  if (!JOURNEY_ID.test(id)) return null;
  const { db, owner } = await journeyContext();
  const { data, error } = await db.from("journey_items").select(COLUMNS)
    .eq("id", id).eq("owner_id", owner).maybeSingle();
  if (error) throw new Error("Kayıt okunamadı.");
  return data as JourneyRow | null;
}
