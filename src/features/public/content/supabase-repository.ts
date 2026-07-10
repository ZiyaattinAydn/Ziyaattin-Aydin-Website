import {
  getApprovedPublicUrl,
} from "@/features/public/content/approvals";
import type {
  ApprovalState,
  JourneyItem,
  ProfileContent,
  ProjectStatus,
  ProjectSummary,
  WritingSection,
  WritingSummary,
} from "@/features/public/content/model";
import {
  PublicRepositoryUnavailableError,
  type PublicContentRepository,
} from "@/features/public/content/repository";
import {
  PUBLIC_ACCESS_FILTERS,
  type PublicQueryReader,
  type PublicQueryRequest,
} from "@/features/public/content/supabase-query-reader";
import {
  isPubliclyReadable,
  normalizePublishState,
  normalizeVisibility,
} from "@/features/public/content/visibility";

export const PROJECT_LIST_COLUMNS = [
  "id",
  "slug",
  "title",
  "summary",
  "status",
  "progress",
  "is_featured",
  "github_url",
  "demo_url",
  "link_approval_state",
  "visibility",
  "publish_state",
  "published_at",
  "updated_at",
] as const;

export const PROJECT_DETAIL_COLUMNS = [
  ...PROJECT_LIST_COLUMNS,
  "problem",
  "approach",
  "highlights",
  "next_steps",
] as const;

export const WRITING_LIST_COLUMNS = [
  "id",
  "slug",
  "title",
  "excerpt",
  "category",
  "tags",
  "reading_time",
  "status",
  "is_featured",
  "visibility",
  "publish_state",
  "published_at",
  "updated_at",
] as const;

export const WRITING_DETAIL_COLUMNS = [
  ...WRITING_LIST_COLUMNS,
  "content",
] as const;

export const JOURNEY_LIST_COLUMNS = [
  "id",
  "slug",
  "title",
  "period_label",
  "summary",
  "content",
  "occurred_on",
  "sort_order",
  "status",
  "visibility",
  "publish_state",
  "published_at",
  "updated_at",
] as const;

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  problem?: string;
  approach?: string;
  highlights?: string[];
  next_steps?: string[];
  status: string;
  progress: number;
  is_featured: boolean;
  github_url: string | null;
  demo_url: string | null;
  link_approval_state: string;
  visibility: string;
  publish_state: string;
  published_at: string | null;
  updated_at: string;
};

type WritingRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string | null;
  tags: string[];
  reading_time: number | null;
  status: string;
  is_featured: boolean;
  visibility: string;
  publish_state: string;
  published_at: string | null;
  updated_at: string;
};

type JourneyRow = {
  id: string;
  slug: string;
  title: string;
  period_label: string | null;
  summary: string;
  content: string;
  occurred_on: string | null;
  sort_order: number;
  status: string;
  visibility: string;
  publish_state: string;
  published_at: string | null;
  updated_at: string;
};

function normalizeLimit(limit: number): number {
  if (!Number.isFinite(limit)) {
    return 0;
  }

  return Math.max(0, Math.floor(limit));
}

function asApprovalState(value: string): ApprovalState {
  if (
    value === "not_required" ||
    value === "pending" ||
    value === "approved" ||
    value === "rejected"
  ) {
    return value;
  }

  return "pending";
}

function mapProjectStatus(status: string): ProjectStatus {
  if (status === "completed") {
    return "Tamamlandı";
  }

  if (status === "active" || status === "paused") {
    return "Devam Ediyor";
  }

  return "Planlandı";
}

function projectStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    planned: "Planlandı",
    active: "Geliştirme devam ediyor",
    paused: "Geçici olarak duraklatıldı",
    completed: "Tamamlandı",
    archived: "Arşivlendi",
  };

  return labels[status] ?? "Durum belirtilmedi";
}

function formatDate(value: string | null): string {
  return value?.slice(0, 10) ?? "";
}

function mapProjectRow(row: ProjectRow): ProjectSummary | null {
  const visibility = normalizeVisibility(row.visibility);
  const publishState = normalizePublishState(row.publish_state);

  if (
    !isPubliclyReadable({
      visibility,
      publishState,
      publishedAt: row.published_at,
    }) ||
    !row.slug.trim() ||
    !row.title.trim() ||
    !row.summary.trim()
  ) {
    return null;
  }

  const approvalState = asApprovalState(row.link_approval_state);
  const demoUrl = getApprovedPublicUrl(
    row.demo_url,
    approvalState,
  );
  const githubUrl = getApprovedPublicUrl(
    row.github_url,
    approvalState,
  );

  return {
    slug: row.slug,
    title: row.title,
    description: row.summary,
    status: mapProjectStatus(row.status),
    statusLabel: projectStatusLabel(row.status),
    progress: Math.min(100, Math.max(0, row.progress)),
    category: "Genel",
    timeframe: formatDate(row.published_at),
    contentState: "database-content",
    visibility,
    publishState,
    publishFlowState: "published",
    isFeatured: row.is_featured,
    sourceNote: "",
    approvalNote: "",
    visibilityNote:
      "Yalnız doğrulanmış ve onaylanmış public bağlantılar gösterilir.",
    technologies: [],
    summary: row.summary,
    problem: row.problem ?? "",
    approach: row.approach ?? "",
    highlights: row.highlights ?? [],
    technicalNotes: [],
    milestones: [],
    learnings: [],
    nextSteps: row.next_steps ?? [],
    publicNotes: [],
    links: {
      demo: {
        label: "Canlı demo",
        href: demoUrl,
        note: demoUrl
          ? "Onaylı public demo bağlantısı."
          : "Onaylı demo bağlantısı bulunmuyor.",
        disabledLabel: demoUrl ? "Aktif" : "Pasif",
        approvalState,
      },
      github: {
        label: "GitHub",
        href: githubUrl,
        note: githubUrl
          ? "Onaylı public repository bağlantısı."
          : "Onaylı repository bağlantısı bulunmuyor.",
        disabledLabel: githubUrl ? "Aktif" : "Pasif",
        approvalState,
      },
    },
    image: null,
  };
}

function parseWritingSections(
  content: string,
): WritingSection[] | null {
  const trimmed = content.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);

    if (!Array.isArray(parsed)) {
      return null;
    }

    const sections = parsed.flatMap((value) => {
      if (
        typeof value !== "object" ||
        value === null ||
        !("id" in value) ||
        !("title" in value) ||
        !("paragraphs" in value)
      ) {
        return [];
      }

      const candidate = value as {
        id: unknown;
        title: unknown;
        paragraphs: unknown;
        quote?: unknown;
        code?: unknown;
        codeLanguage?: unknown;
      };

      if (
        typeof candidate.id !== "string" ||
        !candidate.id.trim() ||
        typeof candidate.title !== "string" ||
        !candidate.title.trim() ||
        !Array.isArray(candidate.paragraphs) ||
        !candidate.paragraphs.every(
          (paragraph) =>
            typeof paragraph === "string" &&
            paragraph.trim().length > 0,
        )
      ) {
        return [];
      }

      return [
        {
          id: candidate.id,
          title: candidate.title,
          paragraphs: candidate.paragraphs,
          quote:
            typeof candidate.quote === "string"
              ? candidate.quote
              : undefined,
          code:
            typeof candidate.code === "string"
              ? candidate.code
              : undefined,
          codeLanguage:
            typeof candidate.codeLanguage === "string"
              ? candidate.codeLanguage
              : undefined,
        },
      ];
    });

    return sections.length > 0 ? sections : null;
  } catch {
    const paragraphs = trimmed
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    if (paragraphs.length === 0) {
      return null;
    }

    return [
      {
        id: "content",
        title: "İçerik",
        paragraphs,
      },
    ];
  }
}

function mapWritingRow(
  row: WritingRow,
  requireContent: boolean,
): WritingSummary | null {
  const visibility = normalizeVisibility(row.visibility);
  const publishState = normalizePublishState(row.publish_state);

  if (
    !isPubliclyReadable({
      visibility,
      publishState,
      publishedAt: row.published_at,
    }) ||
    !row.slug.trim() ||
    !row.title.trim() ||
    !row.excerpt.trim()
  ) {
    return null;
  }

  const sections = row.content
    ? parseWritingSections(row.content)
    : [];

  if (requireContent && !sections) {
    return null;
  }

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category?.trim() || "Genel",
    tags: row.tags ?? [],
    date: formatDate(row.published_at),
    updatedLabel: formatDate(row.updated_at),
    readingTime: row.reading_time
      ? `${row.reading_time} dk`
      : "",
    sortOrder: Date.parse(row.published_at ?? row.updated_at) || 0,
    coverLabel: row.category?.trim() || "Yazı",
    visibility,
    publishState,
    publishFlowState: "published",
    isFeatured: row.is_featured,
    isDraft: false,
    sourceNote: "",
    approvalNote: "",
    placeholderNote: "",
    sections: sections ?? [],
    relatedSlugs: [],
    externalLinks: [],
    coverImage: null,
  };
}

function mapJourneyRow(row: JourneyRow): JourneyItem | null {
  const visibility = normalizeVisibility(row.visibility);
  const publishState = normalizePublishState(row.publish_state);

  if (
    !isPubliclyReadable({
      visibility,
      publishState,
      publishedAt: row.published_at,
    }) ||
    !row.title.trim() ||
    !row.summary.trim()
  ) {
    return null;
  }

  return {
    marker:
      row.period_label?.trim() ||
      row.occurred_on ||
      formatDate(row.published_at),
    title: row.title,
    detail: row.summary,
    lesson: row.content,
    statusNote: "",
    visibility,
    publishState,
    publishFlowState: "published",
    isFeatured: false,
    sourceNote: "",
    approvalNote: "",
  };
}

async function executeRows<TRow>(
  reader: PublicQueryReader,
  request: PublicQueryRequest,
): Promise<TRow[]> {
  const response = await reader.execute<TRow>(request);

  if (response.error) {
    console.error(
      `[public-content] Query failed for ${request.table}.`,
    );
    throw new PublicRepositoryUnavailableError();
  }

  if (response.data === null) {
    return [];
  }

  return Array.isArray(response.data)
    ? response.data
    : [response.data];
}

async function executeMaybeRow<TRow>(
  reader: PublicQueryReader,
  request: PublicQueryRequest,
): Promise<TRow | null> {
  const rows = await executeRows<TRow>(reader, request);
  return rows[0] ?? null;
}

const projectOrder = [
  { column: "is_featured", ascending: false },
  { column: "published_at", ascending: false },
  { column: "updated_at", ascending: false },
  { column: "id", ascending: true },
] as const;

const writingOrder = [
  { column: "is_featured", ascending: false },
  { column: "published_at", ascending: false },
  { column: "updated_at", ascending: false },
  { column: "id", ascending: true },
] as const;

export function createSupabasePublicContentRepository(
  reader: PublicQueryReader,
): PublicContentRepository {
  return {
    source: "supabase",

    async listProjects() {
      const rows = await executeRows<ProjectRow>(reader, {
        table: "projects",
        columns: PROJECT_LIST_COLUMNS,
        filters: PUBLIC_ACCESS_FILTERS,
        order: projectOrder,
        result: "many",
      });

      return rows.flatMap((row) => {
        const project = mapProjectRow(row);
        return project ? [project] : [];
      });
    },

    async getProjectBySlug(slug) {
      const row = await executeMaybeRow<ProjectRow>(reader, {
        table: "projects",
        columns: PROJECT_DETAIL_COLUMNS,
        filters: [
          ...PUBLIC_ACCESS_FILTERS,
          { column: "slug", operator: "eq", value: slug },
        ],
        limit: 1,
        result: "maybe-single",
      });

      return row ? mapProjectRow(row) : null;
    },

    async listFeaturedProjects(limit) {
      const safeLimit = normalizeLimit(limit);

      if (safeLimit === 0) {
        return [];
      }

      const rows = await executeRows<ProjectRow>(reader, {
        table: "projects",
        columns: PROJECT_LIST_COLUMNS,
        filters: [
          ...PUBLIC_ACCESS_FILTERS,
          {
            column: "is_featured",
            operator: "eq",
            value: true,
          },
        ],
        order: projectOrder,
        limit: safeLimit,
        result: "many",
      });

      return rows.flatMap((row) => {
        const project = mapProjectRow(row);
        return project ? [project] : [];
      });
    },

    async listWritings() {
      const rows = await executeRows<WritingRow>(reader, {
        table: "writings",
        columns: WRITING_LIST_COLUMNS,
        filters: PUBLIC_ACCESS_FILTERS,
        order: writingOrder,
        result: "many",
      });

      return rows.flatMap((row) => {
        const writing = mapWritingRow(row, false);
        return writing ? [writing] : [];
      });
    },

    async getWritingBySlug(slug) {
      const row = await executeMaybeRow<WritingRow>(reader, {
        table: "writings",
        columns: WRITING_DETAIL_COLUMNS,
        filters: [
          ...PUBLIC_ACCESS_FILTERS,
          { column: "slug", operator: "eq", value: slug },
        ],
        limit: 1,
        result: "maybe-single",
      });

      return row ? mapWritingRow(row, true) : null;
    },

    async listFeaturedWritings(limit) {
      const safeLimit = normalizeLimit(limit);

      if (safeLimit === 0) {
        return [];
      }

      const rows = await executeRows<WritingRow>(reader, {
        table: "writings",
        columns: WRITING_LIST_COLUMNS,
        filters: [
          ...PUBLIC_ACCESS_FILTERS,
          {
            column: "is_featured",
            operator: "eq",
            value: true,
          },
        ],
        order: writingOrder,
        limit: safeLimit,
        result: "many",
      });

      return rows.flatMap((row) => {
        const writing = mapWritingRow(row, false);
        return writing ? [writing] : [];
      });
    },

    async listRelatedWritings(slugs) {
      const uniqueSlugs = [...new Set(slugs)].filter(Boolean);

      if (uniqueSlugs.length === 0) {
        return [];
      }

      const rows = await executeRows<WritingRow>(reader, {
        table: "writings",
        columns: WRITING_LIST_COLUMNS,
        filters: [
          ...PUBLIC_ACCESS_FILTERS,
          {
            column: "slug",
            operator: "in",
            value: uniqueSlugs,
          },
        ],
        order: writingOrder,
        result: "many",
      });

      const bySlug = new Map(
        rows.flatMap((row) => {
          const writing = mapWritingRow(row, false);
          return writing ? [[writing.slug, writing] as const] : [];
        }),
      );

      return uniqueSlugs.flatMap((slug) => {
        const writing = bySlug.get(slug);
        return writing ? [writing] : [];
      });
    },

    async listJourneyItems() {
      const rows = await executeRows<JourneyRow>(reader, {
        table: "journey_items",
        columns: JOURNEY_LIST_COLUMNS,
        filters: PUBLIC_ACCESS_FILTERS,
        order: [
          { column: "sort_order", ascending: true },
          { column: "published_at", ascending: true },
          { column: "id", ascending: true },
        ],
        result: "many",
      });

      return rows.flatMap((row) => {
        const item = mapJourneyRow(row);
        return item ? [item] : [];
      });
    },

    async getProfile(): Promise<ProfileContent> {
      console.error(
        "[public-content] Public profile storage is not available in the current Supabase schema.",
      );
      throw new PublicRepositoryUnavailableError();
    },
  };
}
