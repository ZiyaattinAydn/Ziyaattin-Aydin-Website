import {
  writingFailure,
  type WritingResult,
} from "@/features/writings/domain";

export type WritingDatabaseErrorLike = {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  hint?: string | null;
};

export function mapWritingDatabaseError(
  error: WritingDatabaseErrorLike | null | undefined,
): WritingResult<never> {
  if (error?.code === "23505") {
    return writingFailure(
      "slug_conflict",
      "Bu slug başka bir yazıda kullanılıyor.",
      {
        slug: ["Benzersiz bir slug seçin."],
      },
    );
  }

  if (
    error?.code === "42501" ||
    error?.code === "PGRST301"
  ) {
    return writingFailure(
      "forbidden",
      "Bu yazı işlemi için yetkiniz yok.",
    );
  }

  if (error?.code === "23514") {
    return writingFailure(
      "validation_failed",
      "Yazı verisi database kurallarıyla uyuşmuyor.",
      {
        _form: ["Alanları kontrol edip tekrar deneyin."],
      },
    );
  }

  return writingFailure(
    "database_error",
    "Yazı işlemi tamamlanamadı.",
  );
}
