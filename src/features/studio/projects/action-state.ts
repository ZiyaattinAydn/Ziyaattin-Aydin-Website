import type {
  ProjectDomainError,
  ProjectFieldErrors,
  ProjectErrorCode,
} from "@/features/projects/domain";

export type ProjectActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: ProjectFieldErrors;
};

export const INITIAL_PROJECT_ACTION_STATE: ProjectActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

const SAFE_ERROR_MESSAGES: Record<ProjectErrorCode, string> = {
  configuration_missing: "Proje servisi şu anda kullanılamıyor.",
  unauthenticated: "Bu işlem için güvenli Studio oturumu gereklidir.",
  forbidden: "Bu işlem için yetkiniz bulunmuyor.",
  mfa_required: "Bu işlem için current AAL2 doğrulaması gereklidir.",
  validation_failed: "Proje alanlarını kontrol edin.",
  not_found: "Proje bulunamadı veya erişilemiyor.",
  invalid_transition: "Bu durum geçişine izin verilmiyor.",
  slug_locked: "Bu projenin slug değeri artık değiştirilemez.",
  slug_conflict: "Bu slug başka bir projede kullanılıyor.",
  project_archived: "Arşivlenmiş proje bu sprintte değiştirilemez.",
  database_error: "Proje işlemi güvenli şekilde tamamlanamadı.",
};

export function toProjectActionError(
  error: ProjectDomainError,
): ProjectActionState {
  return {
    status: "error",
    message: SAFE_ERROR_MESSAGES[error.code],
    fieldErrors: error.fieldErrors ?? {},
  };
}

export function projectActionSuccess(message: string): ProjectActionState {
  return {
    status: "success",
    message,
    fieldErrors: {},
  };
}
