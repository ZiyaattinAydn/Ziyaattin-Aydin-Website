"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { journeyContext } from "./server";
import { JOURNEY_ID, parseJourney, type JourneyState } from "./domain";
const failure = (message: string): JourneyState => ({ status: "error", message });
function refreshJourney() {
  revalidatePath("/studio/journey");
  revalidatePath("/journey");
  revalidatePath("/", "layout");
}
export async function createJourney(_previous: JourneyState, form: FormData): Promise<JourneyState> {
  let id: string;
  try {
    const data = parseJourney(form);
    const { db, owner } = await journeyContext();
    // The database unique index rejects duplicate addresses; retry with a suffix.
    let createdId: string | null = null;
    for (let suffix = 1; suffix <= 30; suffix += 1) {
      const slug = suffix === 1 ? data.slug : `${data.slug}-${suffix}`;
      const result = await db.from("journey_items").insert({
        ...data, slug, owner_id: owner, status: "active",
        publish_state: "draft", visibility: "private",
      }).select("id").single();
      if (!result.error && result.data) {
        createdId = result.data.id;
        break;
      }
      if (result.error?.code !== "23505") break;
    }
    if (!createdId) throw new Error();
    id = createdId;
  } catch { return failure("Taslak oluşturulamadı. Alanları, bağlantını ve benzersiz adresi kontrol et."); }
  refreshJourney();
  redirect("/studio/journey/" + id);
}
export async function updateJourney(id: string, _previous: JourneyState, form: FormData): Promise<JourneyState> {
  if (!JOURNEY_ID.test(id)) return failure("Kayıt bulunamadı.");
  try {
    const { db, owner } = await journeyContext();
    const { data: current, error: readError } = await db.from("journey_items")
      .select("slug,status,publish_state,published_at")
      .eq("id", id).eq("owner_id", owner).maybeSingle();
    if (readError || !current || current.status === "archived") return failure("Bu kayıt düzenlenemiyor.");
    if (current.publish_state === "published")
      return failure("Yayındaki kaydı değiştirmek için önce yayından kaldır.");
    // Preserve every existing URL, even for drafts and unpublished records.
    const input = parseJourney(form, current.slug);
    const { data, error } = await db.from("journey_items").update(input)
      .eq("id", id).eq("owner_id", owner).eq("status", "active")
      .eq("updated_at", String(form.get("version") ?? ""))
      .select("id").maybeSingle();
    if (error || !data) return failure("Kaydedilemedi. Kayıt başka yerde değişmiş olabilir; sayfayı yenile.");
    refreshJourney();
    return { status: "success", message: "Taslak kaydedildi." };
  } catch { return failure("Kayıt yapılamadı. Oturumu ve bağlantıyı kontrol et."); }
}
export async function transitionJourney(id: string, _previous: JourneyState, form: FormData): Promise<JourneyState> {
  if (!JOURNEY_ID.test(id)) return failure("Kayıt bulunamadı.");
  const target = form.get("target");
  if (!["publish", "unpublish", "archive"].includes(String(target)))
    return failure("Geçersiz işlem.");
  if (form.get("confirm") !== target) return failure("İşlemi onaylamalısın.");
  try {
    const { db, owner } = await journeyContext();
    const { data: current, error: readError } = await db.from("journey_items")
      .select("title,slug,summary,status,publish_state").eq("id", id)
      .eq("owner_id", owner).maybeSingle();
    if (readError || !current || current.status === "archived")
      return failure("Arşivdeki kayıt değiştirilemez.");
    if (target === "publish" && (!current.title.trim() || !current.slug.trim() || !current.summary.trim()))
      return failure("Yayınlamak için başlık, adres ve özet gerekli.");
    if (target === "publish" && current.publish_state === "published")
      return failure("Kayıt zaten yayında.");
    if (target === "unpublish" && current.publish_state !== "published")
      return failure("Kayıt yayında değil.");
    const payload = target === "publish" ? { publish_state: "published", visibility: "public" }
      : target === "unpublish" ? { publish_state: "unpublished", visibility: "private" }
      : { publish_state: "archived", visibility: "private", status: "archived" };
    const { data, error } = await db.from("journey_items").update(payload)
      .eq("id", id).eq("owner_id", owner).eq("status", "active")
      .eq("updated_at", String(form.get("version") ?? "")).select("id").maybeSingle();
    if (error || !data) return failure("İşlem yapılamadı. Kaydı yenileyip tekrar kontrol et.");
    refreshJourney();
    revalidatePath("/studio/journey/" + id);
    return { status: "success", message: target === "publish" ? "Kayıt yayınlandı."
      : target === "unpublish" ? "Kayıt yayından kaldırıldı." : "Kayıt arşivlendi." };
  } catch { return failure("İşlem yapılamadı. Oturumunu ve bağlantını kontrol et."); }
}
