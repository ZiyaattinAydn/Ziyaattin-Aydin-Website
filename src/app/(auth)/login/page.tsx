import Link from "next/link";
import { Panel } from "@/components/ui/panel";

const authNotes = [
  "Bu sprintte gerçek oturum açma akışı yoktur.",
  "Supabase Auth ve authenticator uyumlu MFA sonraki güvenlik fazında bağlanacak.",
  "Studio rotaları şu an UI iskeleti olarak incelenebilir; gizli URL güvenlik kabul edilmez.",
] as const;

export default function LoginPage() {
  return (
    <Panel className="w-full max-w-5xl overflow-hidden p-0">
      <div className="grid lg:grid-cols-[1fr_1.05fr]">
        <section className="border-b border-[var(--border)] bg-[rgba(18,217,120,0.04)] p-7 sm:p-9 lg:border-b-0 lg:border-r">
          <Link href="/" className="font-mono text-3xl font-bold text-[var(--accent)]">
            Z.
          </Link>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Private Studio</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Studio Girişi</h1>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Bu sayfa Ziyaattin&apos;in özel çalışma alanı için ayrılmış giriş kapısıdır. Şu an yalnızca görsel ve akış
            kabuğu hazırlanmıştır; gerçek kimlik doğrulama henüz bağlı değildir.
          </p>

          <div className="mt-8 space-y-3">
            {authNotes.map((note) => (
              <div key={note} className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                <p>{note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-7 sm:p-9">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Durum</p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Form alanları bilinçli olarak pasif bırakıldı. Bu ekran, ileride bağlanacak Supabase Auth + MFA akışının
              yerini ve kullanıcı mesajlarını göstermek içindir.
            </p>
          </div>

          <form className="mt-7 space-y-4" aria-label="Hazırlık durumundaki Studio giriş formu">
            <label className="block text-sm font-medium">
              <span>E-posta</span>
              <input
                type="email"
                disabled
                placeholder="Yetkili hesap sonraki fazda bağlanacak"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--muted)] outline-none"
              />
            </label>
            <label className="block text-sm font-medium">
              <span>Şifre</span>
              <input
                type="password"
                disabled
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--muted)] outline-none"
              />
            </label>
            <label className="block text-sm font-medium">
              <span>MFA kodu</span>
              <input
                type="text"
                disabled
                inputMode="numeric"
                placeholder="Authenticator adımı sonraki fazda"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--muted)] outline-none"
              />
            </label>
            <button
              disabled
              type="button"
              className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-[#021108] opacity-60"
            >
              Auth + MFA altyapısı bekleniyor
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 text-sm sm:flex-row">
            <Link href="/" className="rounded-xl border border-[var(--border)] px-4 py-3 text-center text-[var(--muted)] hover:text-[var(--foreground)]">
              Public siteye dön
            </Link>
            <Link href="/studio" className="rounded-xl border border-[var(--accent-dim)] px-4 py-3 text-center text-[var(--accent)]">
              Studio kabuğunu incele
            </Link>
          </div>
        </section>
      </div>
    </Panel>
  );
}
