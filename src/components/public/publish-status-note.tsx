import type { PublicVisibility, PublishFlowState } from "@/features/public/content/model";
import { publishFlowStateLabels, visibilityLabels } from "@/features/public/content/model";

type PublishStatusNoteProps = {
  publishFlowState: PublishFlowState;
  visibility: PublicVisibility;
  sourceNote: string;
  approvalNote?: string;
  compact?: boolean;
};

export function PublishStatusNote({
  publishFlowState,
  visibility,
  sourceNote,
  approvalNote,
  compact = false,
}: PublishStatusNoteProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 text-xs leading-5 text-[var(--muted)]">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[var(--accent)]">
          {publishFlowStateLabels[publishFlowState]}
        </span>
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1">
          {visibilityLabels[visibility]}
        </span>
      </div>
      {!compact ? <p className="mt-3">{sourceNote}</p> : null}
      {approvalNote ? <p className="mt-2 text-[var(--foreground)]">{approvalNote}</p> : null}
    </div>
  );
}
