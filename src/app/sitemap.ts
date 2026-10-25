import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/public-metadata";
import { getPublicContentRepository } from "@/features/public/content/source-selection";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/about", "/projects", "/writings", "/journey"].map(
    (path) => ({ url: publicSiteUrl + path }),
  );
  const repository = getPublicContentRepository();
  const [projects, writings] = await Promise.allSettled([
    repository.listProjects(),
    repository.listWritings(),
  ]);
  return [
    ...staticPages,
    ...(projects.status === "fulfilled"
      ? projects.value.map((p) => ({
          url: publicSiteUrl + "/projects/" + encodeURIComponent(p.slug),
        }))
      : []),
    ...(writings.status === "fulfilled"
      ? writings.value.map((w) => ({
          url: publicSiteUrl + "/writings/" + encodeURIComponent(w.slug),
        }))
      : []),
  ];
}
