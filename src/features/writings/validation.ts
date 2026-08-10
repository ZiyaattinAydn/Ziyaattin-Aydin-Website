import {
  WRITING_PUBLISH_STATES,
  WRITING_VISIBILITIES,
  writingFailure,
  writingSuccess,
  type CreateWritingInput,
  type WritingFieldErrors,
  type WritingFormValues,
  type WritingPublishState,
  type WritingResult,
  type WritingVisibility,
  type UpdateWritingInput,
} from "@/features/writings/domain";

export const WRITING_VALIDATION_LIMITS = {
  title: 200,
  slug: 120,
  excerpt: 800,
  content: 100_000,
  category: 100,
  tag: 80,
  tags: 20,
  url: 2_048,
} as const;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const EDITABLE_KEYS = [
  "title",
  "slug",
  "excerpt",
  "content",
  "category",
  "tags",
  "readingTime",
  "visibility",
  "isFeatured",
  "coverImageUrl",
] as const satisfies readonly (keyof WritingFormValues)[];

type EditableKey = (typeof EDITABLE_KEYS)[number];
type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function addError(
  errors: WritingFieldErrors,
  field: keyof WritingFieldErrors,
  message: string,
): void {
  const existing = errors[field] ?? [];
  errors[field] = [...existing, message];
}

function hasErrors(errors: WritingFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

function readTrimmedString(
  value: unknown,
  field: keyof WritingFieldErrors,
  errors: WritingFieldErrors,
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

function readTagList(
  value: unknown,
  errors: WritingFieldErrors,
): string[] | undefined {
  if (value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    addError(errors, "tags", "Etiket listesi bekleniyor.");
    return undefined;
  }

  if (value.length > WRITING_VALIDATION_LIMITS.tags) {
    addError(
      errors,
      "tags",
      `En fazla ${WRITING_VALIDATION_LIMITS.tags} etiket kullanılabilir.`,
    );
  }

  const normalized: string[] = [];

  value.forEach((item, index) => {
    if (typeof item !== "string") {
      addError(errors, "tags", `${index + 1}. etiket metin olmalıdır.`);
      return;
    }

    const trimmed = item.trim();

    if (!trimmed) {
      return;
    }

    if (trimmed.length > WRITING_VALIDATION_LIMITS.tag) {
      addError(
        errors,
        "tags",
        `${index + 1}. etiket en fazla ${WRITING_VALIDATION_LIMITS.tag} karakter olabilir.`,
      );
      return;
    }

    normalized.push(trimmed);
  });

  return normalized;
}

function readUrl(
  value: unknown,
  field: "coverImageUrl",
  errors: WritingFieldErrors,
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

  if (normalized.length > WRITING_VALIDATION_LIMITS.url) {
    addError(
      errors,
      field,
      `URL en fazla ${WRITING_VALIDATION_LIMITS.url} karakter olabilir.`,
    );
    return undefined;
  }

  if (!isSafeHttpUrl(normalized)) {
    addError(errors, field, "Yalnız güvenli HTTP veya HTTPS URL kabul edilir.");
  }

  return normalized;
}

function readVisibility(
  value: unknown,
  errors: WritingFieldErrors,
): WritingVisibility | undefined {
  if (
    typeof value === "string" &&
    WRITING_VISIBILITIES.includes(value as WritingVisibility)
  ) {
    return value as WritingVisibility;
  }

  addError(errors, "visibility", "Geçersiz görünürlük değeri.");
  return undefined;
}

function readReadingTime(
  value: unknown,
  errors: WritingFieldErrors,
): number | null | undefined {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const num = typeof value === "number" ? value : Number(value);

  if (
    !Number.isInteger(num) ||
    num < 1 ||
    num > 999
  ) {
    addError(errors, "readingTime", "Okuma süresi 1–999 dakika arasında tam sayı olmalıdır.");
    return undefined;
  }

  return num;
}

function readBoolean(
  value: unknown,
  field: "isFeatured",
  errors: WritingFieldErrors,
): boolean | undefined {
  if (typeof value !== "boolean") {
    addError(errors, field, "Boolean değeri bekleniyor.");
    return undefined;
  }

  return value;
}

function rejectUnknownKeys(
  input: UnknownRecord,
  errors: WritingFieldErrors,
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
  errors: WritingFieldErrors,
): WritingFormValues[EditableKey] | undefined {
  switch (key) {
    case "title":
      return readTrimmedString(value, "title", errors, {
        required: true,
        maximum: WRITING_VALIDATION_LIMITS.title,
      });
    case "slug": {
      const slug = readTrimmedString(value, "slug", errors, {
        required: true,
        maximum: WRITING_VALIDATION_LIMITS.slug,
      });

      if (slug !== undefined && slug.length > 0 && !isCanonicalWritingSlug(slug)) {
        addError(
          errors,
          "slug",
          "Slug yalnız küçük harf, rakam ve tek tire ayırıcıları içerebilir.",
        );
      }

      return slug;
    }
    case "excerpt":
      return readTrimmedString(value, "excerpt", errors, {
        maximum: WRITING_VALIDATION_LIMITS.excerpt,
        nullAsEmpty: true,
      });
    case "content":
      return readTrimmedString(value, "content", errors, {
        maximum: WRITING_VALIDATION_LIMITS.content,
        nullAsEmpty: true,
      });
    case "category":
      return readTrimmedString(value, "category", errors, {
        maximum: WRITING_VALIDATION_LIMITS.category,
        nullAsEmpty: true,
      });
    case "tags":
      return readTagList(value, errors);
    case "readingTime":
      return readReadingTime(value, errors);
    case "visibility":
      return readVisibility(value, errors);
    case "isFeatured":
      return readBoolean(value, key, errors);
    case "coverImageUrl":
      return readUrl(value, key, errors);
  }
}

export function isCanonicalWritingSlug(value: string): boolean {
  return (
    value.length > 0 &&
    value.length <= WRITING_VALIDATION_LIMITS.slug &&
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

export function validateWritingId(
  value: unknown,
): WritingResult<string> {
  if (typeof value !== "string" || !UUID_PATTERN.test(value.trim())) {
    return writingFailure(
      "validation_failed",
      "Yazı kimliği geçersiz.",
      {
        writingId: ["Geçerli bir UUID bekleniyor."],
      },
    );
  }

  return writingSuccess(value.trim().toLowerCase());
}

export function validateWritingPublishState(
  value: unknown,
): WritingResult<WritingPublishState> {
  if (
    typeof value === "string" &&
    WRITING_PUBLISH_STATES.includes(value as WritingPublishState)
  ) {
    return writingSuccess(value as WritingPublishState);
  }

  return writingFailure(
    "validation_failed",
    "Publish state geçersiz.",
    {
      publishState: ["Canonical publish-state değerlerinden biri kullanılmalıdır."],
    },
  );
}

export function validateCreateWritingInput(
  rawInput: unknown,
): WritingResult<CreateWritingInput> {
  if (!isRecord(rawInput)) {
    return writingFailure(
      "validation_failed",
      "Yazı verisi geçersiz.",
      {
        _form: ["Nesne biçiminde yazı verisi bekleniyor."],
      },
    );
  }

  const errors: WritingFieldErrors = {};
  rejectUnknownKeys(rawInput, errors);

  const defaults: CreateWritingInput = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [],
    readingTime: null,
    visibility: "private",
    isFeatured: false,
    coverImageUrl: null,
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
    return writingFailure(
      "validation_failed",
      "Yazı alanlarını kontrol edin.",
      errors,
    );
  }

  return writingSuccess(normalized);
}

export function validateUpdateWritingInput(
  rawInput: unknown,
): WritingResult<UpdateWritingInput> {
  if (!isRecord(rawInput)) {
    return writingFailure(
      "validation_failed",
      "Yazı güncellemesi geçersiz.",
      {
        _form: ["Nesne biçiminde güncelleme verisi bekleniyor."],
      },
    );
  }

  const errors: WritingFieldErrors = {};
  rejectUnknownKeys(rawInput, errors);

  const normalized: UpdateWritingInput = {};

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
    return writingFailure(
      "validation_failed",
      "Yazı alanlarını kontrol edin.",
      errors,
    );
  }

  return writingSuccess(normalized);
}
