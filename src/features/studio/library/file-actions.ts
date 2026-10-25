"use server";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { libraryContext, checkProject, ownedFile } from "./server";
import { validateUpload, matchesSignature } from "./domain";
export async function prepareUpload(input: {
  name: string;
  type: string;
  size: number;
  projectId: string | null;
  image?: boolean;
  publicConsent?: boolean;
}) {
  try {
    const ctx = await libraryContext();
    try {
      validateUpload(input.name, input.type, input.size, input.image);
    } catch (e) {
      return { ok: false as const, message: (e as Error).message };
    }
    if (input.image && input.publicConsent !== true)
      return {
        ok: false as const,
        message: "Görselin herkese açık olacağını onayla.",
      };
    await checkProject(ctx, input.projectId);
    const id = randomUUID();
    const bucket = input.image ? "public-assets" : "private-files";
    const path = `${ctx.owner}/${id}/${randomUUID()}.${input.name.split(".").pop()!.toLowerCase()}`;
    const r = await ctx.db
      .from("files")
      .insert({
        id,
        owner_id: ctx.owner,
        project_id: input.projectId,
        storage_bucket: bucket,
        storage_path: path,
        original_name: input.name,
        mime_type: input.type,
        size_bytes: input.size,
        visibility: input.image ? "public" : "private",
        upload_status: "pending",
      })
      .select("id")
      .single();
    if (r.error || !r.data) throw new Error();
    return { ok: true as const, id, bucket, path };
  } catch {
    return {
      ok: false as const,
      message: "Yükleme başlatılamadı. Oturumunu ve bağlantını kontrol et.",
    };
  }
}
export async function finishUpload(id: string) {
  try {
    const { db, owner, file } = await ownedFile(id);
    if (file.status !== "active") throw new Error();
    if (file.upload_status === "uploaded")
      return {
        ok: true as const,
        url:
          file.storage_bucket === "public-assets"
            ? db.storage.from("public-assets").getPublicUrl(file.storage_path)
                .data.publicUrl
            : null,
      };
    const object = await db.storage
      .from(file.storage_bucket)
      .download(file.storage_path);
    if (object.error || !object.data)
      return {
        ok: false as const,
        message:
          "Dosya henüz ulaşmadı. Bağlantını kontrol edip yüklemeyi tamamlamayı tekrar dene.",
      };
    const bytes = new Uint8Array(await object.data.arrayBuffer());
    if (
      bytes.length !== Number(file.size_bytes) ||
      !matchesSignature(bytes, file.mime_type)
    ) {
      // This is a new pending upload, never an existing user document.
      const removed = await db.storage
        .from(file.storage_bucket)
        .remove([file.storage_path]);
      if (!removed.error)
        await db
          .from("files")
          .update({ upload_status: "failed" })
          .eq("id", id)
          .eq("owner_id", owner)
          .eq("upload_status", "pending");
      return {
        ok: false as const,
        message:
          "Dosyanın içeriği seçilen tür veya boyutla eşleşmiyor. Yükleme kabul edilmedi.",
      };
    }
    const r = await db
      .from("files")
      .update({ upload_status: "uploaded" })
      .eq("id", id)
      .eq("owner_id", owner)
      .eq("status", "active")
      .eq("upload_status", "pending")
      .select("id")
      .maybeSingle();
    if (r.error || !r.data) throw new Error();
    revalidatePath("/studio/files");
    return {
      ok: true as const,
      url:
        file.storage_bucket === "public-assets"
          ? db.storage.from("public-assets").getPublicUrl(file.storage_path)
              .data.publicUrl
          : null,
    };
  } catch {
    return {
      ok: false as const,
      message:
        "Yükleme doğrulanamadı. Dosyalar ekranından tekrar tamamlayabilirsin.",
    };
  }
}
export async function updateFile(id: string, form: FormData) {
  try {
    const ctx = await ownedFile(id);
    const projectId = String(form.get("projectId") ?? "") || null;
    await checkProject(ctx, projectId);
    const archive = form.get("archive") === "yes";
    if (archive && form.get("confirmation") !== "archive")
      return { ok: false as const, message: "Arşivleme onayını işaretle." };
    const r = await ctx.db
      .from("files")
      .update(
        archive
          ? { status: "archived", archived_at: new Date().toISOString() }
          : { project_id: projectId },
      )
      .eq("id", id)
      .eq("owner_id", ctx.owner)
      .eq("updated_at", String(form.get("version") ?? ""))
      .eq("status", "active")
      .select("id")
      .maybeSingle();
    if (r.error || !r.data) throw new Error();
    revalidatePath("/studio/files");
    return {
      ok: true as const,
      message: archive
        ? "Dosya arşivlendi; içeriği korundu."
        : "Proje bağlantısı kaydedildi.",
    };
  } catch {
    return {
      ok: false as const,
      message:
        "Kaydedilemedi. Dosya değişmiş olabilir; sayfayı yenile ve oturumunu kontrol et.",
    };
  }
}
