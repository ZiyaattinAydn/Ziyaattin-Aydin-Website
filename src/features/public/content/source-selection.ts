import "server-only";

import { mockPublicContentRepository } from "@/features/public/content/mock-repository";
import type {
  PublicContentRepository,
} from "@/features/public/content/repository";
import {
  hasPublicSupabaseConfiguration,
  resolvePublicContentSource,
  type PublicSourceEnvironment,
} from "@/features/public/content/source-policy";
import {
  createSupabasePublicContentRepository,
} from "@/features/public/content/supabase-repository";
import {
  createSupabaseServerPublicQueryReader,
} from "@/features/public/content/supabase-server-query-reader";
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
      "[public-content] Supabase source requested without a query reader; using mock content.",
    );
    return mockPublicContentRepository;
  }

  return createSupabasePublicContentRepository(supabaseReader);
}

/**
 * General Public content remains mock-first during Sprint 07.
 *
 * Only the projects list/detail vertical slice uses the dedicated
 * getPublicProjectContentRepository() entry point below.
 */
export function getPublicContentRepository(): PublicContentRepository {
  return createPublicContentRepository();
}

/**
 * Local development and Vercel Preview may read project records from the
 * development Supabase project. Production is forced to mock by
 * resolvePublicContentSource(), even when Supabase variables exist.
 *
 * Missing non-production configuration safely keeps the project routes on
 * mock. Once the reader is active, query failures are not masked by mock and
 * are converted to PublicRepositoryUnavailableError by the repository.
 */
export function getPublicProjectContentRepository(): PublicContentRepository {
  const environment = process.env;
  const source = resolvePublicContentSource(environment);

  if (source === "mock") {
    return mockPublicContentRepository;
  }

  if (!hasPublicSupabaseConfiguration(environment)) {
    console.warn(
      "[public-content] Supabase project reads requested without complete public configuration; using mock content.",
    );
    return mockPublicContentRepository;
  }

  return createPublicContentRepository({
    environment,
    supabaseReader: createSupabaseServerPublicQueryReader(),
  });
}

export {
  hasPublicSupabaseConfiguration,
  resolvePublicContentSource,
};

export type {
  PublicSourceEnvironment,
};
