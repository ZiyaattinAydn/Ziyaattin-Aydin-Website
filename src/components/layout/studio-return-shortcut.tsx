import Link from "next/link";
import { getStudioAuthorization } from "@/lib/auth/studio-authorization";

/**
 * Only a currently authorized owner/admin with active MFA sees this quick return.
 * Never derive authorization from browser storage or unauthenticated cookie markers,
 * or a client-side boolean.
 */
export async function StudioReturnShortcut() {
  try {
    const authorization = await getStudioAuthorization();
    if (!authorization.ok) return null;
  } catch {
    // Public pages stay available even when auth is temporarily unavailable.
    return null;
  }

  return (
    <Link
      href="/studio"
      aria-label="Yönetici Studio alanına dön"
      className="fixed bottom-5 right-4 z-40 inline-flex items-center gap-2 rounded-xl border border-[var(--accent-dim)] bg-[var(--surface-strong)] px-4 py-3 text-sm font-semibold text-[var(--accent)] shadow-xl backdrop-blur transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-elevated)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:bottom-6 sm:right-6"
    >
      <span aria-hidden="true">↩</span> Studio’ya dön
    </Link>
  );
}
