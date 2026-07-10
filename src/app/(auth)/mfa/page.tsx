import Link from "next/link";
import { redirect } from "next/navigation";

import { Panel } from "@/components/ui/panel";
import {
  MfaForm,
  type StudioMfaMode,
} from "@/features/studio/auth/mfa-form";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { getStudioMfaAccess } from "@/lib/auth/studio-authorization";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type MfaPageProps = {
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

export default async function MfaPage({ searchParams }: MfaPageProps) {
  const parameters = await searchParams;
  const nextCandidate = Array.isArray(parameters.next)
    ? parameters.next[0]
    : parameters.next;
  const nextPath = getSafeRedirectPath(nextCandidate);
  const access = await getStudioMfaAccess();

  if (!access.ok) {
    if (access.reason === "unauthenticated") {
      const loginParameters = new URLSearchParams({
        next: `/mfa?next=${encodeURIComponent(nextPath)}`,
      });
      redirect(`/login?${loginParameters.toString()}`);
    }

    if (access.reason === "unauthorized") {
      redirect("/unauthorized");
    }

    return (
      <Panel className="w-full max-w-xl p-7 sm:p-9">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          Studio Security
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Doğrulama kullanılamıyor</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          Güvenli doğrulama şu anda tamamlanamıyor. Yapılandırma ayrıntıları
          gösterilmedi ve Studio kapalı tutuldu.
        </p>
      </Panel>
    );
  }

  let mode: StudioMfaMode = "enroll";

  if (access.currentLevel === "aal2") {
    mode = "manage";
  } else if (access.nextLevel === "aal2") {
    mode = "challenge";
  }

  return (
    <Panel className="w-full max-w-xl p-7 sm:p-9">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            Studio Security
          </p>
          <h1 className="mt-4 text-3xl font-semibold">
            {mode === "enroll"
              ? "Authenticator kurulumu"
              : mode === "challenge"
                ? "İkinci faktör doğrulaması"
                : "MFA cihazları"}
          </h1>
        </div>
        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)]"
          >
            Çıkış
          </button>
        </form>
      </div>

      <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
        Studio yalnız server-side active owner doğrulaması ve current AAL2 ile
        açılır. Recovery code üretilmez.
      </p>

      <div className="mt-7">
        <MfaForm mode={mode} nextPath={nextPath} />
      </div>

      <Link
        href="/"
        className="mt-6 block text-center text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
      >
        Public siteye dön
      </Link>
    </Panel>
  );
}
