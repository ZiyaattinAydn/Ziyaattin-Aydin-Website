import Link from "next/link";

import { StudioPageHeader } from "@/components/studio/studio-page-header";
import { Panel } from "@/components/ui/panel";
import { listOwnerWritings } from "@/features/writings/server/writing-mutations";
import { WritingCard } from "@/features/studio/writings/writing-card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function WritingListError() {
  return (
    <Panel className="p-6">
      <div
        role="alert"
        className="rounded-2xl border border-[#8a6b2a] bg-[rgba(245,158,11,0.06)] p-6"
      >
        <h2 className="text-xl font-semibold text-[#f0c46b]">
          Yazılar yüklenemedi
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          Güvenli Studio oturumunu doğrulayın ve daha sonra tekrar deneyin.
          Veritabanı veya policy ayrıntıları gösterilmez.
        </p>
      </div>
    </Panel>
  );
}

function EmptyWritings() {
  return (
    <Panel className="p-6">
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[rgba(18,217,120,0.03)] p-8">
        <h2 className="text-2xl font-semibold">Henüz yazı taslağı yok</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          İlk yazı taslağını oluşturun. Owner kimliği ve draft publish state
          server-side atanır.
        </p>
        <Link
          href="/studio/writings/new"
          className="mt-6 inline-flex rounded-xl border border-[var(--accent-dim)] bg-[rgba(18,217,120,0.1)] px-5 py-3 text-sm font-semibold text-[var(--accent)]"
        >
          İlk taslağı oluştur
        </Link>
      </div>
    </Panel>
  );
}

export default async function StudioWritingsPage() {
  const result = await listOwnerWritings();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <StudioPageHeader
          eyebrow="Studio / Writings"
          title="Yazı yönetimi"
          description="Development Supabase üzerindeki owner yazılarını normal cookie-backed session, current AAL2 ve RLS sınırıyla yönetin."
          status="Sprint 08 CRUD"
        />
        <Link
          href="/studio/writings/new"
          className="inline-flex w-fit rounded-xl border border-[var(--accent-dim)] bg-[rgba(18,217,120,0.1)] px-5 py-3 text-sm font-semibold text-[var(--accent)]"
        >
          Yeni yazı
        </Link>
      </div>

      {!result.ok ? (
        <WritingListError />
      ) : result.data.length === 0 ? (
        <EmptyWritings />
      ) : (
        <>
          <section className="space-y-4" aria-labelledby="active-writings-title">
            <div>
              <h2 id="active-writings-title" className="text-2xl font-semibold">
                Aktif kayıtlar
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Draft, review, approved, published ve unpublished yazılar.
              </p>
            </div>
            <div className="grid gap-5">
              {result.data
                .filter((writing) => writing.publishState !== "archived")
                .map((writing) => (
                  <WritingCard key={writing.id} writing={writing} />
                ))}
            </div>
          </section>

          {result.data.some(
            (writing) => writing.publishState === "archived",
          ) ? (
            <section className="space-y-4" aria-labelledby="archived-writings-title">
              <div>
                <h2
                  id="archived-writings-title"
                  className="text-2xl font-semibold"
                >
                  Arşiv
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Hard delete uygulanmamış terminal kayıtlar.
                </p>
              </div>
              <div className="grid gap-5">
                {result.data
                  .filter((writing) => writing.publishState === "archived")
                  .map((writing) => (
                    <WritingCard key={writing.id} writing={writing} />
                  ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
