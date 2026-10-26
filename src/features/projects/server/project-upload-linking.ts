import "server-only";

import { libraryContext } from "@/features/studio/library/server";
import { UUID } from "@/features/studio/library/domain";

// Prepared uploads have no project until the first project save. Do not trust
// client-provided file IDs: check owner + uploaded status + unassigned state.
export async function validateStagedProjectUploads(rawIds: FormDataEntryValue[]) {
  if (rawIds.length > 20) return { ok: false as const, message: "En fazla 20 dosya ekleyebilirsin." };
  if (!rawIds.length) return { ok: true as const, ids: [] as string[] };

  if (rawIds.some((value) => typeof value !== "string" || !UUID.test(value))) {
    return { ok: false as const, message: "Yüklenen dosya kimliği geçersiz." };
  }
  const ids = rawIds as string[];
  if (new Set(ids).size !== ids.length) {
    return { ok: false as const, message: "Aynı dosya birden fazla kez seçilmiş." };
  }
  try {
    const { db, owner } = await libraryContext();
    const { data, error } = await db.from("files").select("id")
      .eq("owner_id", owner).in("id", ids).is("project_id", null)
      .eq("status", "active").eq("upload_status", "uploaded");
    if (error || !data || data.length !== ids.length) {
      return { ok: false as const, message: "Dosyalardan biri yüklenemedi veya başka bir projeye ait. Dosyaları kontrol et." };
    }
    return { ok: true as const, ids };
  } catch {
    return { ok: false as const, message: "Dosyaların erişimi doğrulanamadı. Studio oturumunu kontrol et." };
  }
}

export async function attachStagedProjectUploads(ids: string[], projectId: string): Promise<boolean> {
  if (!ids.length) return true;
  if (!UUID.test(projectId) || ids.length > 20 || ids.some((id) => !UUID.test(id))) return false;
  try {
    const { db, owner } = await libraryContext();
    const { data, error } = await db.from("files")
      .update({ project_id: projectId })
      .eq("owner_id", owner)
      .in("id", ids)
      .is("project_id", null)
      .eq("status", "active")
      .eq("upload_status", "uploaded")
      .select("id");
    return !error && data?.length === ids.length;
  } catch {
    return false;
  }
}
