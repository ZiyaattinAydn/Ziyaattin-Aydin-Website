import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";

import {
  hasRequiredStudioAssurance,
  isActiveOwnerProfile,
  isAssuranceLevel,
  type AssuranceLevel,
} from "@/lib/auth/studio-authorization-rules";
import { isSupabaseConfigured } from "@/lib/supabase/environment";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type TrustedUserResult =
  | {
      ok: true;
      user: User;
    }
  | {
      ok: false;
      reason: "configuration_missing" | "unauthenticated";
    };

export type AssuranceLevelResult =
  | {
      ok: true;
      currentLevel: AssuranceLevel;
      nextLevel: AssuranceLevel;
    }
  | {
      ok: false;
      reason: "assurance_unavailable";
    };

export type StudioAuthorizationResult =
  | {
      ok: true;
      user: User;
      profile: {
        userId: string;
        role: "owner" | "admin";
      };
      assuranceLevel: "aal2";
    }
  | {
      ok: false;
      reason:
        | "configuration_missing"
        | "unauthenticated"
        | "unauthorized"
        | "mfa_required";
    };

async function readTrustedUser(
  supabase: SupabaseClient,
): Promise<TrustedUserResult> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false,
      reason: "unauthenticated",
    };
  }

  return {
    ok: true,
    user,
  };
}

export async function getTrustedServerUser(): Promise<TrustedUserResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      reason: "configuration_missing",
    };
  }

  const supabase = await createServerSupabaseClient();

  return readTrustedUser(supabase);
}

export async function getAuthenticatorAssuranceLevel(
  supabase?: SupabaseClient,
): Promise<AssuranceLevelResult> {
  if (!supabase && !isSupabaseConfigured()) {
    return {
      ok: false,
      reason: "assurance_unavailable",
    };
  }

  const serverClient = supabase ?? (await createServerSupabaseClient());
  const { data, error } =
    await serverClient.auth.mfa.getAuthenticatorAssuranceLevel();

  if (
    error ||
    !isAssuranceLevel(data.currentLevel) ||
    !isAssuranceLevel(data.nextLevel)
  ) {
    return {
      ok: false,
      reason: "assurance_unavailable",
    };
  }

  return {
    ok: true,
    currentLevel: data.currentLevel,
    nextLevel: data.nextLevel,
  };
}

/**
 * Canonical Studio authorization check.
 *
 * The trusted Auth user is resolved on the server, the caller's own
 * owner_profiles row is read through RLS, and current AAL2 is mandatory.
 * Client metadata, email strings and service-role bypass are not used.
 */
export async function getStudioAuthorization(): Promise<StudioAuthorizationResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      reason: "configuration_missing",
    };
  }

  const supabase = await createServerSupabaseClient();
  const trustedUser = await readTrustedUser(supabase);

  if (!trustedUser.ok) {
    return trustedUser;
  }

  const { data: profile, error } = await supabase
    .from("owner_profiles")
    .select("user_id, role, status")
    .eq("user_id", trustedUser.user.id)
    .maybeSingle();

  if (
    error ||
    !isActiveOwnerProfile(profile, trustedUser.user.id)
  ) {
    return {
      ok: false,
      reason: "unauthorized",
    };
  }

  const assuranceLevel = await getAuthenticatorAssuranceLevel(supabase);

  if (
    !assuranceLevel.ok ||
    !hasRequiredStudioAssurance(assuranceLevel.currentLevel)
  ) {
    return {
      ok: false,
      reason: "mfa_required",
    };
  }

  return {
    ok: true,
    user: trustedUser.user,
    profile: {
      userId: profile.user_id,
      role: profile.role,
    },
    assuranceLevel: "aal2",
  };
}
