"use client";
import { useActionState, useState } from "react";
import { saveSiteProfile, changeSiteProfileStatus } from "./actions";
import { initialProfileState, type ProfileState, type SiteProfile, type ProfileFields } from "./domain";
import { useUnsavedChanges } from "@/features/studio/library/unsaved";
import { taskInputClass as input } from "@/features/studio/tasks/task-styles";

function PublishControl({ profile }: { profile: SiteProfile }) {
  const [state, action, pending] = useActionState(changeSiteProfileStatus, initialProfileState);
  const published = profile.status === "published";
  const target = published ? "unpublish" : "publish";
  return <form action={action} className="mt-6 space-y-3 rounded-2xl border border-[var(--border)] p-5">
    <h2 className="text-xl font-semibold">Yayın kontrolü</h2>
    <input type="hidden" name="target" value={target}/>
    <input type="hidden" name="version" value={profile.updated_at}/>
    <label className="flex items-start gap-3 text-sm">
      <input type="checkbox" name="confirmation" value={target} required disabled={pending} className="mt-1"/>
      {published
        ? "Profilimi ve iletişim bilgilerimi herkese açık sayfadan kaldır."
        : "Biyografimi ve girdiğim iletişim bağlantılarını inceledim; herkese açık yayımlanmalarını onaylıyorum."}
    </label>
    {state.message && <p role={state.status === "error" ? "alert" : "status"}
      className={state.status === "error" ? "text-amber-200 text-sm" : "text-[var(--accent)] text-sm"}>{state.message}</p>}
    <button disabled={pending} className="rounded-xl border border-[var(--accent-dim)] px-5 py-3 text-sm font-semibold text-[var(--accent)] disabled:opacity-50">
      {pending ? "İşleniyor…" : published ? "Yayından kaldır" : "Profilimi yayınla"}
    </button>
  </form>;
}
export function ProfileEditor({ profile }: { profile: SiteProfile | null }) {
  const [dirty, setDirty] = useState(false);
  // Controlled values survive a rejected server action and its React form reset.
  const [fields, setFields] = useState({
    headline: profile?.headline ?? "",
    description: profile?.description ?? "",
    email: profile?.email ?? "",
    github_url: profile?.github_url ?? "",
    linkedin_url: profile?.linkedin_url ?? "",
  });
  const setField = (key: keyof ProfileFields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };
  const [state, action, pending] = useActionState(
    async (previous: ProfileState, form: FormData) => {
      const result = await saveSiteProfile(previous, form);
      if (result.status === "success") setDirty(false);
      return result;
    }, initialProfileState,
  );
  useUnsavedChanges(dirty && !pending);
  const published = profile?.status === "published";
  return <>
    <form data-unsaved-editor action={action} onChange={() => setDirty(true)}
      className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
      {published && <p className="rounded-xl border border-[var(--border)] p-4 text-sm text-[var(--muted)]">
        Profil yayında. Düzenlemek için önce yayından kaldır; yanlışlıkla public içeriği değiştirme.
      </p>}
      {state.message && <p role={state.status === "error" ? "alert" : "status"}
        className={state.status === "error" ? "text-amber-200" : "text-[var(--accent)]"}>{state.message}</p>}
      {profile && <input type="hidden" name="version" value={profile.updated_at}/>}
      <fieldset className="space-y-5" disabled={pending || published}>
        <label className="block text-sm font-medium">Kısa tanıtım başlığı
          <input name="headline" maxLength={200} value={fields.headline} onChange={(event) => setField("headline", event.target.value)}
            className={input + " mt-2"} placeholder="Kendimi nasıl tanıtıyorum?"/>
        </label>
        <label className="block text-sm font-medium">Biyografi
          <textarea name="description" rows={10} maxLength={3000}
            value={fields.description} onChange={(event) => setField("description", event.target.value)} className={input + " mt-2"}/>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">İletişim e-postası (isteğe bağlı)
            <input name="email" type="email" maxLength={254}
              value={fields.email} onChange={(event) => setField("email", event.target.value)} className={input + " mt-2"}/>
          </label>
          <label className="block text-sm font-medium">GitHub profil adresi
            <input name="github_url" type="text" inputMode="url" maxLength={500}
              value={fields.github_url} onChange={(event) => setField("github_url", event.target.value)} placeholder="https://github.com/kullanici" className={input + " mt-2"}/>
          </label>
          <label className="block text-sm font-medium">LinkedIn profil adresi
            <input name="linkedin_url" type="text" inputMode="url" maxLength={500}
              value={fields.linkedin_url} onChange={(event) => setField("linkedin_url", event.target.value)} placeholder="linkedin.com/in/kullanici" className={input + " mt-2"}/>
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-[var(--muted)]">
            Kaydetmek yayınlamak değildir. Bilgiler yalnız yayın onayından sonra ziyaretçilere açılır.
          </p>
          {!published && <button disabled={pending}
            className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">
            {pending ? "Kaydediliyor…" : "Taslağı kaydet"}
          </button>}
        </div>
      </fieldset>
    </form>
    {profile && <PublishControl profile={profile}/>}
  </>;
}
