"use server";
import { revalidatePath } from "next/cache";
import { libraryContext } from "./server";
import { UUID, type LibraryState } from "./domain";
import { publicImageUrl } from "@/lib/public-image";
import { getApprovedPublicUrl } from "@/features/public/content/approvals";
export async function approvePublicationMedia(
  kind: "projects" | "writings",
  id: string,
  _state: LibraryState,
  form: FormData,
): Promise<LibraryState> {
  if (!UUID.test(id) || form.get("confirmation") !== "approve")
    return {
      status: "error",
      message: "Görsel ve bağlantıları incelediğini onayla.",
    };
  try {
    const { db, owner } = await libraryContext();
    const r = await db
      .from(kind)
      .select("*")
      .eq("id", id)
      .eq("owner_id", owner)
      .maybeSingle();
    if (r.error || !r.data || r.data.publish_state === "archived")
      throw new Error();
    const row = r.data;
    const image = kind === "projects" ? row.image_url : row.cover_image_url;
    if (image) {
      const safe = publicImageUrl(image);
      if (!safe)
        return {
          status: "error",
          message:
            "Görseli bu ekrandaki yükleme aracıyla yükle veya kaldır. Özel ve dış görsel adresleri onaylanamaz.",
        };
      if (safe.startsWith("https:")) {
        const path = new URL(safe).pathname.split("/public-assets/")[1];
        const f = await db
          .from("files")
          .select("id")
          .eq("owner_id", owner)
          .eq("storage_bucket", "public-assets")
          .eq("storage_path", path)
          .eq("upload_status", "uploaded")
          .eq("status", "active")
          .maybeSingle();
        if (f.error || !f.data)
          return {
            status: "error",
            message: "Görselin yüklemesi doğrulanmamış veya görsel arşivde.",
          };
        const exists = await db.storage.from("public-assets").info(path);
        if (exists.error)
          return {
            status: "error",
            message: "Görsel dosyası bulunamadı. Yeniden yükle.",
          };
      }
    }
    if (
      kind === "projects" &&
      [row.github_url, row.demo_url].some(
        (url) => url && !getApprovedPublicUrl(url, "approved"),
      )
    )
      return {
        status: "error",
        message: "Bağlantılarda güvenli ve geçerli bir HTTPS adresi kullan.",
      };
    const payload =
      kind === "projects"
        ? {
            image_approval_state: image ? "approved" : "not_required",
            link_approval_state:
              row.github_url || row.demo_url ? "approved" : "not_required",
          }
        : { image_approval_state: image ? "approved" : "not_required" };
    const update = await db
      .from(kind)
      .update(payload)
      .eq("id", id)
      .eq("owner_id", owner)
      .eq("updated_at", String(form.get("version") ?? ""))
      .select("id")
      .maybeSingle();
    if (update.error || !update.data)
      return {
        status: "error",
        message: "Kayıt değişmiş olabilir. Sayfayı yenileyip yeniden incele.",
      };
    revalidatePath(`/studio/${kind}/${id}/edit`);
    revalidatePath("/", "layout");
    return {
      status: "success",
      message:
        "Görsel ve bağlantı incelemesi kaydedildi. Yayınlama adımına geçebilirsin.",
    };
  } catch {
    return {
      status: "error",
      message: "İnceleme kaydedilemedi. Oturumunu ve bağlantını kontrol et.",
    };
  }
}
