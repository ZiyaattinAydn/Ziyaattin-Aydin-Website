import type {
  PublicRepositorySource,
} from "./repository";

export type PublicSourceEnvironment = {
  NODE_ENV?: string;
  VERCEL_ENV?: string;
  PUBLIC_CONTENT_SOURCE?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
};

export function resolvePublicContentSource(
  environment: PublicSourceEnvironment = process.env,
): PublicRepositorySource {
  const isProductionDeployment =
    environment.VERCEL_ENV === "production" ||
    (environment.VERCEL_ENV === undefined &&
      environment.NODE_ENV === "production");

  if (isProductionDeployment) {
    return "mock";
  }

  return environment.PUBLIC_CONTENT_SOURCE === "supabase"
    ? "supabase"
    : "mock";
}

export function hasPublicSupabaseConfiguration(
  environment: PublicSourceEnvironment = process.env,
): boolean {
  return Boolean(
    environment.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim(),
  );
}
