export type StudioRole = "owner" | "admin";
export type AssuranceLevel = "aal1" | "aal2";

export type OwnerProfileCandidate = {
  user_id?: unknown;
  role?: unknown;
  status?: unknown;
};

export type ActiveOwnerProfile = {
  user_id: string;
  role: StudioRole;
  status: "active";
};

export function isAssuranceLevel(value: unknown): value is AssuranceLevel {
  return value === "aal1" || value === "aal2";
}

export function hasRequiredStudioAssurance(value: unknown): value is "aal2" {
  return value === "aal2";
}

export function isActiveOwnerProfile(
  profile: OwnerProfileCandidate | null | undefined,
  trustedUserId: string,
): profile is ActiveOwnerProfile {
  return Boolean(
    profile &&
      profile.user_id === trustedUserId &&
      profile.status === "active" &&
      (profile.role === "owner" || profile.role === "admin"),
  );
}
