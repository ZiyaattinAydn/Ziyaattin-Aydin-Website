const DEFAULT_REDIRECT_PATH = "/studio";
const INTERNAL_ORIGIN = "https://internal.invalid";

function containsUnsafeCharacters(value: string): boolean {
  return (
    /[\u0000-\u001f\u007f]/.test(value) ||
    value.includes("\\") ||
    /%(?:2f|5c)/i.test(value)
  );
}

/**
 * Accepts only an application-internal absolute path.
 *
 * Protocol-relative URLs, external origins, backslashes, control characters
 * and encoded slash/backslash bypass attempts are rejected.
 */
export function getSafeRedirectPath(
  candidate: string | null | undefined,
  fallback = DEFAULT_REDIRECT_PATH,
): string {
  if (
    !candidate ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    containsUnsafeCharacters(candidate)
  ) {
    return fallback;
  }

  try {
    const parsedUrl = new URL(candidate, INTERNAL_ORIGIN);

    if (parsedUrl.origin !== INTERNAL_ORIGIN) {
      return fallback;
    }

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch {
    return fallback;
  }
}
