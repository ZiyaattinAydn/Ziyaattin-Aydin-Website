import Link from "next/link";

import { Panel } from "@/components/ui/panel";
import { LoginForm } from "@/features/studio/auth/login-form";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string | string[];
    error?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const parameters = await searchParams;
  const nextCandidate = Array.isArray(parameters.next)
    ? parameters.next[0]
    : parameters.next;
  const nextPath = getSafeRedirectPath(nextCandidate);
  const hasAccessError = Boolean(parameters.error);

  return (
    <Panel className="w-full max-w-5xl overflow-hidden p-0">
      <div className="grid lg:grid-cols-[1fr_1.05fr]">
        <section className="border-b border-[var(--border)] bg-[rgba(18,217,120,0.04)] p-7 sm:p-9 lg:border-b-0 lg:border-r">
          <Link
            href="/"
            className="font-mono text-3xl font-bold text-[var(--accent)]"
          >
            Z.
          </Link>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
            Özel çalışma alanı
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Studio Girişi
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            E-posta ve şifrenle giriş yap, ardından doğrulama uygulamandaki
            kodla oturumunu tamamla.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Bu alan kişisel kullanıma özeldir.",
              "Giriş için yetkili hesabını kullan.",
              "İki adımlı doğrulama hesabını korur.",
            ].map((note) => (
              <div
                key={note}
                className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]"
              >
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                <p>{note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-7 sm:p-9">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              Güvenli oturum
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Girişten sonra doğrulama kodun istenir. İlk kullanımda doğrulama
              uygulamanı bağlayabilirsin.
            </p>
          </div>

          {hasAccessError ? (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              Bu hesapla Studio erişimi tamamlanamadı.
            </p>
          ) : null}

          <LoginForm nextPath={nextPath} />

          <Link
            href="/"
            className="mt-6 block rounded-xl border border-[var(--border)] px-4 py-3 text-center text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Web sitesine dön
          </Link>
        </section>
      </div>
    </Panel>
  );
}
