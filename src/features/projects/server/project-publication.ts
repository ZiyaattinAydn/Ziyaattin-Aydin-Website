import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getApprovedPublicUrl } from "@/features/public/content/approvals";
import { publicImageUrl } from "@/lib/public-image";
import { projectFailure, projectSuccess, type ProjectResult } from "@/features/projects/domain";

// The user's authenticated "Herkese açık" save is the publication decision.
// The server independently validates links and verifies public image ownership.
export async function verifyPublicProjectAssets(
  db: SupabaseClient,
  ownerId: string,
  input: {
    summary: string;
    githubUrl: string | null;
    demoUrl: string | null;
    imageUrl: string | null;
  },
): Promise<ProjectResult<{
  linkApproval: "approved" | "not_required";
  imageApproval: "approved" | "not_required";
}>> {
  if (!input.summary.trim()) {
    return projectFailure("validation_failed", "Herkese açık bir proje için kısa açıklama gerekli.", {
      summary: ["Herkese açık yayınlamak için kısa açıklama ekle."],
    });
  }

  if ([input.githubUrl, input.demoUrl].some(
    (url) => url !== null && !getApprovedPublicUrl(url, "approved"),
  )) {
    return projectFailure("validation_failed", "Herkese açık bağlantıları kontrol et.", {
      _form: ["GitHub ve Demo bağlantıları herkese açık güvenli HTTPS adresleri olmalı."],
    });
  }

  if (input.imageUrl) {
    const safe = publicImageUrl(input.imageUrl);
    if (!safe) {
      return projectFailure("validation_failed", "Kapak görselinin adresi herkese açık ve doğrulanabilir olmalı.", {
        imageUrl: ["Görseli Studio'dan yükle veya kaldır."],
      });
    }

    if (safe.startsWith("https:")) {
      const path = new URL(safe).pathname.split("/public-assets/")[1];
      if (!path) {
        return projectFailure("validation_failed", "Kapak görseli geçersiz.", {
          imageUrl: ["Görseli tekrar yükle."],
        });
      }
      const owned = await db.from("files")
        .select("id")
        .eq("owner_id", ownerId)
        .eq("storage_bucket", "public-assets")
        .eq("storage_path", path)
        .eq("upload_status", "uploaded")
        .eq("status", "active")
        .maybeSingle();
      if (owned.error || !owned.data) {
        return projectFailure("validation_failed", "Kapak görselinin yüklemesi doğrulanamadı.", {
          imageUrl: ["Görseli yeniden yükle veya kaldır."],
        });
      }
      const exists = await db.storage.from("public-assets").info(path);
      if (exists.error) {
        return projectFailure("validation_failed", "Kapak görseli depoda bulunamadı.", {
          imageUrl: ["Görseli yeniden yükle veya kaldır."],
        });
      }
    }
  }

  return projectSuccess({
    linkApproval: input.githubUrl || input.demoUrl ? "approved" : "not_required",
    imageApproval: input.imageUrl ? "approved" : "not_required",
  });
}
