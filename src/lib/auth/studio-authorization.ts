import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";

import {
  hasRequiredStudioAssurance,
  isActiveOwnerProfile,
  isAssuranceLevel,
  type AssuranceLevel,
  type ActiveOwnerProfile,
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

export type StudioMfaAccessResult =
  | {
      ok: true;
      user: User;
      profile: {
        userId: string;
        role: "owner" | "admin";
      };
      currentLevel: AssuranceLevel;
      nextLevel: AssuranceLevel;
    }
  | {
      ok: false;
      reason:
        | "configuration_missing"
        | "unauthenticated"
        | "unauthorized"
        | "mfa_unavailable";
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

async function readActiveOwnerProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<ActiveOwnerProfile | null> {
  const { data: profile, error } = await supabase
    .from("owner_profiles")
    .select("user_id, role, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !isActiveOwnerProfile(profile, user.id)) {
    return null;
  }

  return profile;
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
 * Server-side access check for the MFA enrollment, challenge and management UI.
 *
 * This deliberately verifies the trusted Auth user and the controlled
 * owner_profiles allowlist before exposing any factor-management screen.
 */
export async function getStudioMfaAccess(): Promise<StudioMfaAccessResult> {
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

  const profile = await readActiveOwnerProfile(supabase, trustedUser.user);

  if (!profile) {
    return {
      ok: false,
      reason: "unauthorized",
    };
  }

  const assuranceLevel = await getAuthenticatorAssuranceLevel(supabase);

  if (!assuranceLevel.ok) {
    return {
      ok: false,
      reason: "mfa_unavailable",
    };
  }

  return {
    ok: true,
    user: trustedUser.user,
    profile: {
      userId: profile.user_id,
      role: profile.role,
    },
    currentLevel: assuranceLevel.currentLevel,
    nextLevel: assuranceLevel.nextLevel,
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
  const mfaAccess = await getStudioMfaAccess();

  if (!mfaAccess.ok) {
    return {
      ok: false,
      reason:
        mfaAccess.reason === "mfa_unavailable"
          ? "mfa_required"
          : mfaAccess.reason,
    };
  }

  if (!hasRequiredStudioAssurance(mfaAccess.currentLevel)) {
    return {
      ok: false,
      reason: "mfa_required",
    };
  }

  return {
    ok: true,
    user: mfaAccess.user,
    profile: mfaAccess.profile,
    assuranceLevel: "aal2",
  };
}
