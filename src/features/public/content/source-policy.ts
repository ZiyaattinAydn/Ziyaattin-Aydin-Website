import type {
  PublicRepositorySource,
} from "./repository";

export type PublicSourceEnvironment = {
  NODE_ENV?: string;
  VERCEL_ENV?: string;
  PUBLIC_CONTENT_SOURCE?: string;
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
