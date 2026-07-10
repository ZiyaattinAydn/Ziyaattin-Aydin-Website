import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";

import { StudioSessionControls } from "@/components/studio/studio-session-controls";
import { StudioShell } from "@/components/studio/studio-shell";
import { getStudioAuthorization } from "@/lib/auth/studio-authorization";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StudioLayout({
  children,
}: PropsWithChildren) {
  const authorization = await getStudioAuthorization();

  if (!authorization.ok) {
    if (authorization.reason === "unauthenticated") {
      redirect("/login?next=/studio");
    }

    if (authorization.reason === "unauthorized") {
      redirect("/unauthorized");
    }

    if (authorization.reason === "mfa_required") {
      redirect("/mfa?next=/studio");
    }

    return (
      <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-16">
        <section className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            Studio Security
          </p>
          <h1 className="mt-4 text-3xl font-semibold">
            Studio şu anda kullanılamıyor
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Güvenli yapılandırma doğrulanamadığı için içerik kapalı tutuldu.
          </p>
        </section>
      </main>
    );
  }

  return (
    <>
      <StudioSessionControls />
      <StudioShell>{children}</StudioShell>
    </>
  );
}
