/** Produce a stable URL segment from a Turkish project title. */
export function projectSlugFromTitle(title: string): string {
  return (
    title
      .trim()
      .toLocaleLowerCase("tr-TR")
      .replace(/ı/g, "i")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 108)
      .replace(/-+$/g, "") || "proje"
  );
}
