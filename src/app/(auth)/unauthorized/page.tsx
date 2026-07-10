import Link from "next/link";

import { Panel } from "@/components/ui/panel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function UnauthorizedPage() {
  return (
    <Panel className="w-full max-w-xl p-7 sm:p-9">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
        Studio Security
      </p>
      <h1 className="mt-4 text-3xl font-semibold">Erişim tamamlanamadı</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
        Bu oturum Studio içeriğini açamaz. Owner kaydı veya güvenlik modeli
        hakkında ek bilgi gösterilmedi.
      </p>

      <form action="/auth/logout" method="post" className="mt-7">
        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-[#021108]"
        >
          Güvenli çıkış yap
        </button>
      </form>

      <Link
        href="/"
        className="mt-4 block rounded-xl border border-[var(--border)] px-4 py-3 text-center text-sm text-[var(--muted)]"
      >
        Public siteye dön
      </Link>
    </Panel>
  );
}
