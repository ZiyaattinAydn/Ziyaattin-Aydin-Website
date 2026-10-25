"use server";
import { revalidatePath } from "next/cache";
import { siteProfileContext } from "./server";
import { parseProfile, type ProfileState } from "./domain";

function reject(message: string): ProfileState { return { status: "error", message }; }
function refresh() {
  revalidatePath("/studio/profile");
  revalidatePath("/about");
  revalidatePath("/", "layout");
}
export async function saveSiteProfile(_previous: ProfileState, form: FormData): Promise<ProfileState> {
  let fields;
  try { fields = parseProfile(form); }
  catch (error) { return reject(error instanceof Error ? error.message : "Form geçersiz."); }
  try {
    const { db, owner } = await siteProfileContext();
    const { data: current, error } = await db.from("site_profiles")
      .select("status,updated_at").eq("owner_id", owner).maybeSingle();
    if (error) throw new Error();
    if (current?.status === "published") return reject("Profil yayında. Düzenlemek için önce yayından kaldır.");
    if (current) {
      const r = await db.from("site_profiles").update(fields)
        .eq("owner_id", owner).eq("status", "draft")
        .eq("updated_at", String(form.get("version") ?? ""))
        .select("owner_id").maybeSingle();
      if (r.error || !r.data) return reject("Profil değişmiş olabilir; sayfayı yenile.");
    } else {
      const r = await db.from("site_profiles").insert({
        ...fields, owner_id: owner, status: "draft",
      }).select("owner_id").single();
      if (r.error || !r.data) return reject("Taslak kaydedilemedi.");
    }
    refresh();
    return { status: "success", message: "Özel profil taslağı kaydedildi." };
  } catch { return reject("Profil kaydedilemedi. Oturumunu ve bağlantını kontrol et."); }
}
export async function changeSiteProfileStatus(_previous: ProfileState, form: FormData): Promise<ProfileState> {
  const target = form.get("target");
  if (target !== "publish" && target !== "unpublish") return reject("Geçersiz işlem.");
  if (form.get("confirmation") !== target) return reject("Yayın kararını onaylamalısın.");
  try {
    const { db, owner } = await siteProfileContext();
    const { data: row, error } = await db.from("site_profiles")
      .select("headline,description,status,updated_at").eq("owner_id", owner).maybeSingle();
    if (error || !row) return reject("Önce profil taslağı kaydet.");
    if (target === "publish" && (!row.headline.trim() || !row.description.trim()))
      return reject("Yayınlamak için başlık ve biyografi gerekli.");
    if (target === "publish" && row.status === "published") return reject("Profil zaten yayında.");
    if (target === "unpublish" && row.status !== "published") return reject("Profil yayında değil.");
    const payload = target === "publish"
      ? { status: "published", published_at: new Date().toISOString() }
      : { status: "draft", published_at: null };
    const r = await db.from("site_profiles").update(payload)
      .eq("owner_id", owner).eq("updated_at", String(form.get("version") ?? ""))
      .select("owner_id").maybeSingle();
    if (r.error || !r.data) return reject("Kayıt değişmiş olabilir. Sayfayı yenileyip tekrar dene.");
    refresh();
    return { status: "success", message: target === "publish" ? "Profil yayınlandı." : "Profil yayından kaldırıldı." };
  } catch { return reject("Yayın kararı kaydedilemedi. Oturumunu kontrol et."); }
}
