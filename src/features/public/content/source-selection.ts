import { mockPublicContentRepository } from "@/features/public/content/mock-repository";
import type {
  PublicContentRepository,
} from "@/features/public/content/repository";
import {
  resolvePublicContentSource,
  type PublicSourceEnvironment,
} from "@/features/public/content/source-policy";
import {
  createSupabasePublicContentRepository,
} from "@/features/public/content/supabase-repository";
import type {
  PublicQueryReader,
} from "@/features/public/content/supabase-query-reader";

type CreatePublicRepositoryOptions = {
  environment?: PublicSourceEnvironment;
  supabaseReader?: PublicQueryReader;
};

export function createPublicContentRepository({
  environment = process.env,
  supabaseReader,
}: CreatePublicRepositoryOptions = {}): PublicContentRepository {
  const source = resolvePublicContentSource(environment);

  if (source === "mock") {
    return mockPublicContentRepository;
  }

  if (!supabaseReader) {
    console.warn(
      "[public-content] Supabase source requested without a Core query reader; using mock content.",
    );
    return mockPublicContentRepository;
  }

  return createSupabasePublicContentRepository(supabaseReader);
}

/**
 * Production remains explicitly pinned to mock during Sprint 06.
 *
 * Integration can wire the Core-owned Supabase client by passing a
 * PublicQueryReader to createPublicContentRepository without changing
 * route components or copying Core helpers into the Public branch.
 */
export function getPublicContentRepository(): PublicContentRepository {
  return createPublicContentRepository();
}

export {
  resolvePublicContentSource,
};

export type {
  PublicSourceEnvironment,
};
