import {
  projectFailure,
  type ProjectResult,
} from "@/features/projects/domain";

export type ProjectDatabaseErrorLike = {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  hint?: string | null;
};

export function mapProjectDatabaseError(
  error: ProjectDatabaseErrorLike | null | undefined,
): ProjectResult<never> {
  if (error?.code === "23505") {
    return projectFailure(
      "slug_conflict",
      "Bu slug başka bir projede kullanılıyor.",
      {
        slug: ["Benzersiz bir slug seçin."],
      },
    );
  }

  if (
    error?.code === "42501" ||
    error?.code === "PGRST301"
  ) {
    return projectFailure(
      "forbidden",
      "Bu proje işlemi için yetkiniz yok.",
    );
  }

  if (error?.code === "23514") {
    return projectFailure(
      "validation_failed",
      "Proje verisi database kurallarıyla uyuşmuyor.",
      {
        _form: ["Alanları kontrol edip tekrar deneyin."],
      },
    );
  }

  return projectFailure(
    "database_error",
    "Proje işlemi tamamlanamadı.",
  );
}
