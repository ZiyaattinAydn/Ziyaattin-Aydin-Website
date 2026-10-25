import "server-only";
import { emptyPublicContentRepository } from "./empty-repository";
import type { PublicContentRepository } from "./repository";
import {
  hasPublicSupabaseConfiguration,
  resolvePublicContentSource,
  type PublicSourceEnvironment,
} from "./source-policy";
import { createSupabasePublicContentRepository } from "./supabase-repository";
import { createSupabaseServerPublicQueryReader } from "./supabase-server-query-reader";
import type { PublicQueryReader } from "./supabase-query-reader";

export function createPublicContentRepository({
  environment = process.env,
  supabaseReader,
}: {
  environment?: PublicSourceEnvironment;
  supabaseReader?: PublicQueryReader;
} = {}): PublicContentRepository {
  if (resolvePublicContentSource(environment) === "empty")
    return emptyPublicContentRepository;
  return createSupabasePublicContentRepository(
    supabaseReader ?? createSupabaseServerPublicQueryReader(),
  );
}
export function getPublicContentRepository() {
  return createPublicContentRepository();
}
export const getPublicProjectContentRepository = getPublicContentRepository;
export const getPublicWritingContentRepository = getPublicContentRepository;
export { hasPublicSupabaseConfiguration, resolvePublicContentSource };
export type { PublicSourceEnvironment };
