const SUPABASE_CONFIGURATION_ERROR_MESSAGE =
  "Supabase is not configured for this runtime.";

export class SupabaseConfigurationError extends Error {
  readonly code = "SUPABASE_NOT_CONFIGURED";

  constructor() {
    super(SUPABASE_CONFIGURATION_ERROR_MESSAGE);
    this.name = "SupabaseConfigurationError";
  }
}

export type PublicRuntimeEnvironment = {
  siteUrl: string | null;
  supabaseUrl: string | null;
  supabasePublishableKey: string | null;
};

export type SupabasePublicEnvironment = {
  url: string;
  publishableKey: string;
};

function normalizeEnvironmentValue(
  value: string | undefined,
): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Public runtime values only.
 *
 * Every NEXT_PUBLIC_* access remains explicit so Next.js can safely expose
 * only these approved values to browser bundles.
 */
export function readPublicRuntimeEnvironment(): PublicRuntimeEnvironment {
  return {
    siteUrl: normalizeEnvironmentValue(
      process.env.NEXT_PUBLIC_SITE_URL,
    ),
    supabaseUrl: normalizeEnvironmentValue(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    supabasePublishableKey: normalizeEnvironmentValue(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
  };
}

/**
 * A passive presence check that never throws.
 *
 * Public mock routes can call or import this module while Supabase is absent.
 */
export function isSupabaseConfigured(): boolean {
  const environment = readPublicRuntimeEnvironment();

  return Boolean(
    environment.supabaseUrl &&
      isValidHttpUrl(environment.supabaseUrl) &&
      environment.supabasePublishableKey,
  );
}

/**
 * Validate only when a Supabase-backed operation actually requests a client.
 *
 * The error deliberately does not reveal which value is missing or malformed.
 */
export function getSupabasePublicEnvironment(): SupabasePublicEnvironment {
  const environment = readPublicRuntimeEnvironment();

  if (
    !environment.supabaseUrl ||
    !isValidHttpUrl(environment.supabaseUrl) ||
    !environment.supabasePublishableKey
  ) {
    throw new SupabaseConfigurationError();
  }

  return {
    url: environment.supabaseUrl,
    publishableKey: environment.supabasePublishableKey,
  };
}

export function getSiteUrl(): string | null {
  const { siteUrl } = readPublicRuntimeEnvironment();

  if (!siteUrl || !isValidHttpUrl(siteUrl)) {
    return null;
  }

  return siteUrl;
}
