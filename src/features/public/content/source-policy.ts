import type { PublicRepositorySource } from "./repository";
export type PublicSourceEnvironment = {
  NODE_ENV?: string;
  VERCEL_ENV?: string;
  PUBLIC_CONTENT_SOURCE?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
};
export function hasPublicSupabaseConfiguration(
  environment: PublicSourceEnvironment = process.env,
): boolean {
  return Boolean(
    environment.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim(),
  );
}
export function resolvePublicContentSource(
  environment: PublicSourceEnvironment = process.env,
): PublicRepositorySource {
  return hasPublicSupabaseConfiguration(environment) ? "supabase" : "empty";
}
