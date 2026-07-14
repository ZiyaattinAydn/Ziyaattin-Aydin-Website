import {
  projectFailure,
  projectSuccess,
  type ProjectResult,
} from "@/features/projects/domain";

type AuthorizationFailureReason =
  | "configuration_missing"
  | "unauthenticated"
  | "unauthorized"
  | "mfa_required";

export type ProjectMutationAuthorization =
  | {
      ok: true;
      user: {
        id: string;
      };
      profile: {
        userId: string;
        role: "owner" | "admin";
      };
      assuranceLevel: "aal2";
    }
  | {
      ok: false;
      reason: AuthorizationFailureReason;
    };

export type ProjectMutationContext = {
  ownerId: string;
};

export function getProjectMutationContext(
  authorization: ProjectMutationAuthorization,
): ProjectResult<ProjectMutationContext> {
  if (!authorization.ok) {
    switch (authorization.reason) {
      case "configuration_missing":
        return projectFailure(
          "configuration_missing",
          "Proje servisi yapılandırılmamış.",
        );
      case "unauthenticated":
        return projectFailure(
          "unauthenticated",
          "Bu işlem için giriş yapılmalıdır.",
        );
      case "mfa_required":
        return projectFailure(
          "mfa_required",
          "Bu işlem için current AAL2 gereklidir.",
        );
      case "unauthorized":
        return projectFailure(
          "forbidden",
          "Bu işlem yalnız active owner tarafından yapılabilir.",
        );
    }
  }

  if (
    authorization.assuranceLevel !== "aal2" ||
    !authorization.user.id ||
    authorization.profile.userId !== authorization.user.id ||
    (authorization.profile.role !== "owner" &&
      authorization.profile.role !== "admin")
  ) {
    return projectFailure(
      "forbidden",
      "Proje mutation güvenlik bağlamı geçersiz.",
    );
  }

  return projectSuccess({
    ownerId: authorization.user.id,
  });
}
