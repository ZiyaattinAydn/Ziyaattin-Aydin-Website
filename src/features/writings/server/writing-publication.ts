import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { publicImageUrl } from "@/lib/public-image";
import { writingFailure, writingSuccess, type WritingResult } from "@/features/writings/domain";

/** Owner-confirmed public visibility is sufficient only after server checks. */
export async function verifyPublicWriting(
  db: SupabaseClient,
  ownerId: string,
  input: { title: string; excerpt: string; content: string; coverImageUrl: string | null },
): Promise<WritingResult<{ imageApproval: "approved" | "not_required" }>> {
  const fieldErrors: Record<string, string[]> = {};
  if (!input.title.trim()) fieldErrors.title = ["Başlık ekle."];
  if (!input.excerpt.trim()) fieldErrors.excerpt = ["Herkese açık yayınlamak için kısa özet ekle."];
  if (!input.content.trim()) fieldErrors.content = ["Yayınlamak için yazı içeriğini ekle."];
  if (Object.keys(fieldErrors).length) {
    return writingFailure("validation_failed", "Yayınlamak için gerekli alanlar eksik.", fieldErrors);
  }

  if (!input.coverImageUrl) return writingSuccess({ imageApproval: "not_required" });
  const safe = publicImageUrl(input.coverImageUrl);
  if (!safe) {
    return writingFailure("validation_failed", "Kapak görseli güvenli değil.", {
      coverImageUrl: ["Kapak görselini Studio'dan yükle veya kaldır."],
    });
  }

  if (safe.startsWith("https:")) {
    const path = new URL(safe).pathname.split("/public-assets/")[1];
    if (!path) return writingFailure("validation_failed", "Görsel adresi geçersiz.", {
      coverImageUrl: ["Görseli yeniden yükle."],
    });
    const owned = await db.from("files").select("id")
      .eq("owner_id", ownerId).eq("storage_bucket", "public-assets")
      .eq("storage_path", path).eq("upload_status", "uploaded")
      .eq("status", "active").maybeSingle();
    if (owned.error || !owned.data) {
      return writingFailure("validation_failed", "Görsel yüklemesi doğrulanamadı.", {
        coverImageUrl: ["Görseli tekrar yükle veya kaldır."],
      });
    }
    const object = await db.storage.from("public-assets").info(path);
    if (object.error) return writingFailure("validation_failed", "Görsel depoda bulunamadı.", {
      coverImageUrl: ["Görseli yeniden yükle veya kaldır."],
    });
  }
  return writingSuccess({ imageApproval: "approved" });
}
