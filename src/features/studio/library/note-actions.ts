"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkProject, libraryContext } from "./server";
import { UUID, parseNote, type LibraryState } from "./domain";
export async function saveNote(
  id: string | null,
  _state: LibraryState,
  form: FormData,
): Promise<LibraryState> {
  let savedId: string;
  try {
    const ctx = await libraryContext();
    if (id && !UUID.test(id)) throw new Error("Not bulunamadı.");
    let values;
    try {
      values = parseNote(form);
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
    await checkProject(ctx, values.project_id);
    const payload = {
      ...values,
      visibility: "private",
      publish_state: "draft",
      publish_candidate: false,
    };
    const r = id
      ? await ctx.db
          .from("notes")
          .update(payload)
          .eq("id", id)
          .eq("owner_id", ctx.owner)
          .eq("status", "active")
          .eq("updated_at", String(form.get("version") ?? ""))
          .select("id")
          .maybeSingle()
      : await ctx.db
          .from("notes")
          .insert({ ...payload, owner_id: ctx.owner })
          .select("id")
          .single();
    if (r.error || !r.data)
      return {
        status: "error",
        message:
          "Kaydedilemedi. Not başka bir ekranda değişmiş olabilir. Metnini koruyup sayfayı yenile.",
      };
    savedId = r.data.id;
  } catch {
    return {
      status: "error",
      message:
        "Kayıt yapılamadı. Bağlantını ve doğrulanmış oturumunu kontrol et; metnin bu ekranda korunuyor.",
    };
  }
  revalidatePath("/studio/notes");
  revalidatePath("/studio/notes/" + savedId);
  redirect("/studio/notes/" + savedId + "?notice=saved");
}
export async function archiveNote(
  id: string,
  _state: LibraryState,
  form: FormData,
): Promise<LibraryState> {
  if (!UUID.test(id) || form.get("confirmation") !== "archive")
    return { status: "error", message: "Arşivleme onayını işaretle." };
  try {
    const ctx = await libraryContext();
    const r = await ctx.db
      .from("notes")
      .update({
        status: "archived",
        publish_state: "archived",
        visibility: "private",
        publish_candidate: false,
      })
      .eq("id", id)
      .eq("owner_id", ctx.owner)
      .eq("status", "active")
      .eq("updated_at", String(form.get("version") ?? ""))
      .select("id")
      .maybeSingle();
    if (r.error || !r.data) throw new Error();
  } catch {
    return {
      status: "error",
      message: "Arşivlenemedi. Oturumunu kontrol edip sayfayı yenile.",
    };
  }
  revalidatePath("/studio/notes");
  redirect("/studio/notes?notice=archived");
}
