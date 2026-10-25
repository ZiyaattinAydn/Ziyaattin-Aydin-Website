// Only repository images and this project's public image bucket are renderable.
// Private Storage URLs and signed URLs must never enter public content.
export function publicImageUrl(
  value: string | null | undefined,
  origin = process.env.NEXT_PUBLIC_SUPABASE_URL,
): string | null {
  if (!value) return null;
  if (
    /^\/images\/[a-zA-Z0-9_./-]+\.(png|jpg|jpeg|webp|avif)$/.test(value) &&
    !value.includes("..")
  )
    return value;
  try {
    const url = new URL(value);
    const base = new URL(origin ?? "");
    if (
      url.protocol !== "https:" ||
      url.origin !== base.origin ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      return null;
    if (
      !/^\/storage\/v1\/object\/public\/public-assets\/[a-zA-Z0-9_./-]+\.(png|jpg|jpeg|webp|avif)$/.test(
        url.pathname,
      ) ||
      url.pathname.includes("..")
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}
