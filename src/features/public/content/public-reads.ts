import "server-only";
import { cache } from "react";
import { getPublicContentRepository } from "./source-selection";
export const readPublicProject = cache(async (slug: string) =>
  getPublicContentRepository().getProjectBySlug(slug),
);
export const readPublicWriting = cache(async (slug: string) =>
  getPublicContentRepository().getWritingBySlug(slug),
);
