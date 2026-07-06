import type { ProjectStatus } from "@/data/mock-content";

const statusText: Record<ProjectStatus, string> = {
  "Devam Ediyor": "text-[var(--accent)]",
  Tamamlandı: "text-emerald-200",
  Planlandı: "text-[var(--muted)]",
};

export function StatusPill({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold ${statusText[status]}`}
    >
      ● {status}
    </span>
  );
}
