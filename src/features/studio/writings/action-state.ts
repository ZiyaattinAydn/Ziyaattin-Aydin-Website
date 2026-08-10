import type {
  WritingDomainError,
  WritingFieldErrors,
  WritingErrorCode,
} from "@/features/writings/domain";

export type WritingActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: WritingFieldErrors;
};

export const INITIAL_WRITING_ACTION_STATE: WritingActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

const SAFE_ERROR_MESSAGES: Record<WritingErrorCode, string> = {
  configuration_missing: "Yazı servisi şu anda kullanılamıyor.",
  unauthenticated: "Bu işlem için güvenli Studio oturumu gereklidir.",
  forbidden: "Bu işlem için yetkiniz bulunmuyor.",
  mfa_required: "Bu işlem için current AAL2 doğrulaması gereklidir.",
  validation_failed: "Yazı alanlarını kontrol edin.",
  not_found: "Yazı bulunamadı veya erişilemiyor.",
  invalid_transition: "Bu durum geçişine izin verilmiyor.",
  slug_locked: "Bu yazının slug değeri artık değiştirilemez.",
  slug_conflict: "Bu slug başka bir yazıda kullanılıyor.",
  writing_archived: "Arşivlenmiş yazı değiştirilemez.",
  database_error: "Yazı işlemi güvenli şekilde tamamlanamadı.",
};

export function toWritingActionError(
  error: WritingDomainError,
): WritingActionState {
  return {
    status: "error",
    message: SAFE_ERROR_MESSAGES[error.code],
    fieldErrors: error.fieldErrors ?? {},
  };
}

export function writingActionSuccess(message: string): WritingActionState {
  return {
    status: "success",
    message,
    fieldErrors: {},
  };
}
