"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type ProjectSubmitButtonProps = {
  children: ReactNode;
  pendingLabel: string;
  className?: string;
};

export function ProjectSubmitButton({
  children,
  pendingLabel,
  className = "",
}: ProjectSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-xl border border-[var(--accent-dim)] bg-[rgba(18,217,120,0.1)] px-5 py-3 text-sm font-semibold text-[var(--accent)] transition hover:bg-[rgba(18,217,120,0.16)] disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
