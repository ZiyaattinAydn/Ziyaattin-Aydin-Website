import { readStudioProfile } from "@/features/studio/profile/server";
import { ProfileEditor } from "@/features/studio/profile/profile-editor";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function StudioProfilePage() {
  const result = await readStudioProfile();
  return <div className="space-y-6">
    <header className="space-y-3">
      <h1 className="text-3xl font-semibold">Hakkımda ve iletişim</h1>
      <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
        Herkese açık biyografimi ve profesyonel bağlantılarımı buradan yönetirim. Yeni içerik önce özel taslak olarak kalır.
      </p>
    </header>
    {!result.ok ? <p role="alert" className="text-amber-200">Profil okunamadı. Girişini ve bağlantını kontrol et.</p> :
      <ProfileEditor profile={result.row}/>}
  </div>;
}
