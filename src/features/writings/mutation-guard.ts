import {
  writingFailure,
  writingSuccess,
  type WritingResult,
} from "@/features/writings/domain";

type AuthorizationFailureReason =
  | "configuration_missing"
  | "unauthenticated"
  | "unauthorized"
  | "mfa_required";

export type WritingMutationAuthorization =
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

export type WritingMutationContext = {
  ownerId: string;
};

export function getWritingMutationContext(
  authorization: WritingMutationAuthorization,
): WritingResult<WritingMutationContext> {
  if (!authorization.ok) {
    switch (authorization.reason) {
      case "configuration_missing":
        return writingFailure(
          "configuration_missing",
          "Yazı servisi yapılandırılmamış.",
        );
      case "unauthenticated":
        return writingFailure(
          "unauthenticated",
          "Bu işlem için giriş yapılmalıdır.",
        );
      case "mfa_required":
        return writingFailure(
          "mfa_required",
          "Bu işlem için current AAL2 gereklidir.",
        );
      case "unauthorized":
        return writingFailure(
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
    return writingFailure(
      "forbidden",
      "Yazı mutation güvenlik bağlamı geçersiz.",
    );
  }

  return writingSuccess({
    ownerId: authorization.user.id,
  });
}
