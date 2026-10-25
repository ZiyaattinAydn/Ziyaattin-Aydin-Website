import "server-only";
import { getStudioAuthorization } from "@/lib/auth/studio-authorization";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  UUID,
  type LibraryProject,
  type Note,
  type StoredFile,
} from "./domain";
export async function libraryContext() {
  const auth = await getStudioAuthorization();
  if (!auth.ok)
    throw new Error(
      "Oturumun doğrulanamadı. Yeniden giriş yapıp iki adımlı doğrulamayı tamamla.",
    );
  return { owner: auth.profile.userId, db: await createServerSupabaseClient() };
}
export async function checkProject(
  ctx: Awaited<ReturnType<typeof libraryContext>>,
  id: string | null,
) {
  if (!id) return;
  if (!UUID.test(id)) throw new Error("Geçerli bir proje seç.");
  const r = await ctx.db
    .from("projects")
    .select("id")
    .eq("id", id)
    .eq("owner_id", ctx.owner)
    .maybeSingle();
  if (r.error || !r.data) throw new Error("Seçilen projeye erişilemiyor.");
}
export async function listLibrary(kind: "notes" | "files") {
  try {
    const ctx = await libraryContext();
    const rows: (Note | StoredFile)[] = [];
    const columns =
      kind === "notes"
        ? "id,project_id,title,content,category,tags,status,created_at,updated_at"
        : "id,project_id,original_name,storage_bucket,storage_path,mime_type,size_bytes,status,upload_status,created_at,updated_at";
    for (let offset = 0; ; offset += 500) {
      const r = await ctx.db
        .from(kind)
        .select(columns)
        .eq("owner_id", ctx.owner)
        .order("id")
        .range(offset, offset + 499);
      if (r.error) throw new Error();
      rows.push(...(r.data as unknown as (Note | StoredFile)[]));
      if (r.data.length < 500) break;
    }
    const projects: LibraryProject[] = [];
    for (let offset = 0; ; offset += 500) {
      const r = await ctx.db
        .from("projects")
        .select("id,title,status,publish_state")
        .eq("owner_id", ctx.owner)
        .order("id")
        .range(offset, offset + 499);
      if (r.error) throw new Error();
      projects.push(...r.data);
      if (r.data.length < 500) break;
    }
    return { ok: true as const, rows, projects };
  } catch {
    return { ok: false as const };
  }
}
export async function ownedFile(id: string) {
  if (!UUID.test(id)) throw new Error("Dosya bulunamadı.");
  const ctx = await libraryContext();
  const r = await ctx.db
    .from("files")
    .select("*")
    .eq("id", id)
    .eq("owner_id", ctx.owner)
    .maybeSingle();
  if (r.error || !r.data) throw new Error("Dosya bulunamadı.");
  return { ...ctx, file: r.data as StoredFile };
}
