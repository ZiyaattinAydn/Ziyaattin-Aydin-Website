import {
  PROJECT_PUBLISH_STATES,
  PROJECT_STATUSES,
  PROJECT_VISIBILITIES,
  projectFailure,
  projectSuccess,
  type CreateProjectInput,
  type ProjectFieldErrors,
  type ProjectFormValues,
  type ProjectPublishState,
  type ProjectResult,
  type ProjectStatus,
  type ProjectVisibility,
  type UpdateProjectInput,
} from "@/features/projects/domain";

export const PROJECT_VALIDATION_LIMITS = {
  title: 140,
  slug: 120,
  summary: 600,
  sectionText: 12_000,
  listItem: 500,
  listItems: 40,
  url: 2_048,
} as const;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const EDITABLE_KEYS = [
  "title",
  "slug",
  "summary",
  "problem",
  "approach",
  "highlights",
  "nextSteps",
  "status",
  "visibility",
  "progress",
  "isFeatured",
  "githubUrl",
  "demoUrl",
  "imageUrl",
] as const satisfies readonly (keyof ProjectFormValues)[];

type EditableKey = (typeof EDITABLE_KEYS)[number];
type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function addError(
  errors: ProjectFieldErrors,
  field: keyof ProjectFieldErrors,
  message: string,
): void {
  const existing = errors[field] ?? [];
  errors[field] = [...existing, message];
}

function hasErrors(errors: ProjectFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

function readTrimmedString(
  value: unknown,
  field: keyof ProjectFieldErrors,
  errors: ProjectFieldErrors,
  options: {
    required?: boolean;
    maximum: number;
    nullAsEmpty?: boolean;
  },
): string | undefined {
  if (value === null && options.nullAsEmpty) {
    return "";
  }

  if (typeof value !== "string") {
    addError(errors, field, "Metin değeri bekleniyor.");
    return undefined;
  }

  const normalized = value.trim();

  if (options.required && normalized.length === 0) {
    addError(errors, field, "Bu alan boş bırakılamaz.");
  }

  if (normalized.length > options.maximum) {
    addError(
      errors,
      field,
      `En fazla ${options.maximum} karakter kullanılabilir.`,
    );
  }

  return normalized;
}

function readStringList(
  value: unknown,
  field: "highlights" | "nextSteps",
  errors: ProjectFieldErrors,
): string[] | undefined {
  if (value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    addError(errors, field, "Metin listesi bekleniyor.");
    return undefined;
  }

  if (value.length > PROJECT_VALIDATION_LIMITS.listItems) {
    addError(
      errors,
      field,
      `En fazla ${PROJECT_VALIDATION_LIMITS.listItems} öğe kullanılabilir.`,
    );
  }

  const normalized: string[] = [];

  value.forEach((item, index) => {
    if (typeof item !== "string") {
      addError(errors, field, `${index + 1}. öğe metin olmalıdır.`);
      return;
    }

    const trimmed = item.trim();

    if (!trimmed) {
      return;
    }

    if (trimmed.length > PROJECT_VALIDATION_LIMITS.listItem) {
      addError(
        errors,
        field,
        `${index + 1}. öğe en fazla ${PROJECT_VALIDATION_LIMITS.listItem} karakter olabilir.`,
      );
      return;
    }

    normalized.push(trimmed);
  });

  return normalized;
}

function readUrl(
  value: unknown,
  field: "githubUrl" | "demoUrl" | "imageUrl",
  errors: ProjectFieldErrors,
): string | null | undefined {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    addError(errors, field, "URL metin olarak gönderilmelidir.");
    return undefined;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  if (normalized.length > PROJECT_VALIDATION_LIMITS.url) {
    addError(
      errors,
      field,
      `URL en fazla ${PROJECT_VALIDATION_LIMITS.url} karakter olabilir.`,
    );
    return undefined;
  }

  if (!isSafeHttpUrl(normalized)) {
    addError(errors, field, "Yalnız güvenli HTTP veya HTTPS URL kabul edilir.");
  }

  return normalized;
}

function readStatus(
  value: unknown,
  errors: ProjectFieldErrors,
): ProjectStatus | undefined {
  if (
    typeof value === "string" &&
    PROJECT_STATUSES.includes(value as ProjectStatus)
  ) {
    return value as ProjectStatus;
  }

  addError(errors, "status", "Geçersiz proje durumu.");
  return undefined;
}

function readVisibility(
  value: unknown,
  errors: ProjectFieldErrors,
): ProjectVisibility | undefined {
  if (
    typeof value === "string" &&
    PROJECT_VISIBILITIES.includes(value as ProjectVisibility)
  ) {
    return value as ProjectVisibility;
  }

  addError(errors, "visibility", "Geçersiz görünürlük değeri.");
  return undefined;
}

function readProgress(
  value: unknown,
  errors: ProjectFieldErrors,
): number | undefined {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 0 ||
    value > 100
  ) {
    addError(errors, "progress", "İlerleme 0–100 arasında tam sayı olmalıdır.");
    return undefined;
  }

  return value;
}

function readBoolean(
  value: unknown,
  field: "isFeatured",
  errors: ProjectFieldErrors,
): boolean | undefined {
  if (typeof value !== "boolean") {
    addError(errors, field, "Boolean değeri bekleniyor.");
    return undefined;
  }

  return value;
}

function rejectUnknownKeys(
  input: UnknownRecord,
  errors: ProjectFieldErrors,
): void {
  const allowed = new Set<string>(EDITABLE_KEYS);
  const unknownKeys = Object.keys(input).filter((key) => !allowed.has(key));

  if (unknownKeys.length > 0) {
    addError(
      errors,
      "_form",
      `Bilinmeyen veya yönetilen alanlar kabul edilmez: ${unknownKeys.sort().join(", ")}`,
    );
  }
}

function validateField(
  key: EditableKey,
  value: unknown,
  errors: ProjectFieldErrors,
): ProjectFormValues[EditableKey] | undefined {
  switch (key) {
    case "title":
      return readTrimmedString(value, "title", errors, {
        required: true,
        maximum: PROJECT_VALIDATION_LIMITS.title,
      });
    case "slug": {
      const slug = readTrimmedString(value, "slug", errors, {
        required: true,
        maximum: PROJECT_VALIDATION_LIMITS.slug,
      });

      if (slug !== undefined && slug.length > 0 && !isCanonicalProjectSlug(slug)) {
        addError(
          errors,
          "slug",
          "Slug yalnız küçük harf, rakam ve tek tire ayırıcıları içerebilir.",
        );
      }

      return slug;
    }
    case "summary":
      return readTrimmedString(value, "summary", errors, {
        maximum: PROJECT_VALIDATION_LIMITS.summary,
        nullAsEmpty: true,
      });
    case "problem":
    case "approach":
      return readTrimmedString(value, key, errors, {
        maximum: PROJECT_VALIDATION_LIMITS.sectionText,
        nullAsEmpty: true,
      });
    case "highlights":
    case "nextSteps":
      return readStringList(value, key, errors);
    case "status":
      return readStatus(value, errors);
    case "visibility":
      return readVisibility(value, errors);
    case "progress":
      return readProgress(value, errors);
    case "isFeatured":
      return readBoolean(value, key, errors);
    case "githubUrl":
    case "demoUrl":
    case "imageUrl":
      return readUrl(value, key, errors);
  }
}

export function isCanonicalProjectSlug(value: string): boolean {
  return (
    value.length > 0 &&
    value.length <= PROJECT_VALIDATION_LIMITS.slug &&
    SLUG_PATTERN.test(value)
  );
}

export function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateProjectId(
  value: unknown,
): ProjectResult<string> {
  if (typeof value !== "string" || !UUID_PATTERN.test(value.trim())) {
    return projectFailure(
      "validation_failed",
      "Proje kimliği geçersiz.",
      {
        projectId: ["Geçerli bir UUID bekleniyor."],
      },
    );
  }

  return projectSuccess(value.trim().toLowerCase());
}

export function validateProjectPublishState(
  value: unknown,
): ProjectResult<ProjectPublishState> {
  if (
    typeof value === "string" &&
    PROJECT_PUBLISH_STATES.includes(value as ProjectPublishState)
  ) {
    return projectSuccess(value as ProjectPublishState);
  }

  return projectFailure(
    "validation_failed",
    "Publish state geçersiz.",
    {
      publishState: ["Canonical publish-state değerlerinden biri kullanılmalıdır."],
    },
  );
}

export function validateCreateProjectInput(
  rawInput: unknown,
): ProjectResult<CreateProjectInput> {
  if (!isRecord(rawInput)) {
    return projectFailure(
      "validation_failed",
      "Proje verisi geçersiz.",
      {
        _form: ["Nesne biçiminde proje verisi bekleniyor."],
      },
    );
  }

  const errors: ProjectFieldErrors = {};
  rejectUnknownKeys(rawInput, errors);

  const defaults: CreateProjectInput = {
    title: "",
    slug: "",
    summary: "",
    problem: "",
    approach: "",
    highlights: [],
    nextSteps: [],
    status: "planned",
    visibility: "private",
    progress: 0,
    isFeatured: false,
    githubUrl: null,
    demoUrl: null,
    imageUrl: null,
  };

  const normalized = { ...defaults };

  for (const key of EDITABLE_KEYS) {
    const value =
      key in rawInput
        ? rawInput[key]
        : key === "title" || key === "slug"
          ? undefined
          : defaults[key];

    const validated = validateField(key, value, errors);

    if (validated !== undefined) {
      Object.assign(normalized, { [key]: validated });
    }
  }

  if (hasErrors(errors)) {
    return projectFailure(
      "validation_failed",
      "Proje alanlarını kontrol edin.",
      errors,
    );
  }

  return projectSuccess(normalized);
}

export function validateUpdateProjectInput(
  rawInput: unknown,
): ProjectResult<UpdateProjectInput> {
  if (!isRecord(rawInput)) {
    return projectFailure(
      "validation_failed",
      "Proje güncellemesi geçersiz.",
      {
        _form: ["Nesne biçiminde güncelleme verisi bekleniyor."],
      },
    );
  }

  const errors: ProjectFieldErrors = {};
  rejectUnknownKeys(rawInput, errors);

  const normalized: UpdateProjectInput = {};

  for (const key of EDITABLE_KEYS) {
    if (!(key in rawInput)) {
      continue;
    }

    const validated = validateField(key, rawInput[key], errors);

    if (validated !== undefined) {
      Object.assign(normalized, { [key]: validated });
    }
  }

  if (Object.keys(normalized).length === 0 && !hasErrors(errors)) {
    addError(errors, "_form", "Güncellenecek en az bir alan gönderilmelidir.");
  }

  if (hasErrors(errors)) {
    return projectFailure(
      "validation_failed",
      "Proje alanlarını kontrol edin.",
      errors,
    );
  }

  return projectSuccess(normalized);
}
