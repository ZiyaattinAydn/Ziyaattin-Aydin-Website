import {
  journeyItems as legacyJourneyItems,
  profileContent as legacyProfileContent,
  projects as legacyProjects,
  writings as legacyWritings,
  type JourneyItem as LegacyJourneyItem,
  type ProjectSummary as LegacyProjectSummary,
  type WritingSummary as LegacyWritingSummary,
} from "@/data/mock-content";
import {
  getApprovedPublicImage,
  sanitizeProjectLinks,
  sanitizeWritingExternalLinks,
} from "@/features/public/content/approvals";
import type {
  JourneyItem,
  ProfileContent,
  ProjectSummary,
  WritingSummary,
} from "@/features/public/content/model";
import type {
  PublicContentRepository,
} from "@/features/public/content/repository";
import {
  getVisibleRecordBy,
  getVisibleRecords,
  normalizePublishState,
  normalizeVisibility,
  type PublicAccessState,
  type PublicRecord,
} from "@/features/public/content/visibility";

const MOCK_FIXTURE_PUBLISHED_AT = "2000-01-01T00:00:00.000Z";

/**
 * Existing production currently renders these explicit mock fixtures.
 * Their legacy draft/review labels remain visible in the UI, while this
 * internal access envelope keeps the current mock presentation available.
 *
 * Real database rows never receive this fixture access override.
 */
const mockFixtureAccess: PublicAccessState = {
  visibility: "public",
  publishState: "published",
  publishedAt: MOCK_FIXTURE_PUBLISHED_AT,
};

function mapMockProject(
  project: LegacyProjectSummary,
): ProjectSummary {
  return {
    ...project,
    visibility: normalizeVisibility(project.visibility),
    publishState: normalizePublishState(project.publishState),
    links: sanitizeProjectLinks(project.links),
    image: null,
  };
}

function mapMockWriting(
  writing: LegacyWritingSummary,
): WritingSummary {
  return {
    ...writing,
    visibility: normalizeVisibility(writing.visibility),
    publishState: normalizePublishState(writing.publishState),
    externalLinks: sanitizeWritingExternalLinks(
      writing.externalLinks,
    ),
    coverImage: null,
  };
}

function mapMockJourneyItem(
  item: LegacyJourneyItem,
): JourneyItem {
  return {
    ...item,
    visibility: normalizeVisibility(item.visibility),
    publishState: normalizePublishState(item.publishState),
  };
}

const projectRecords: PublicRecord<ProjectSummary>[] =
  legacyProjects.map((project) => ({
    content: mapMockProject(project),
    access: mockFixtureAccess,
  }));

const writingRecords: PublicRecord<WritingSummary>[] =
  legacyWritings.map((writing) => ({
    content: mapMockWriting(writing),
    access: mockFixtureAccess,
  }));

const journeyRecords: PublicRecord<JourneyItem>[] =
  legacyJourneyItems.map((item) => ({
    content: mapMockJourneyItem(item),
    access: mockFixtureAccess,
  }));

const profile: ProfileContent = {
  displayName: legacyProfileContent.displayName,
  eyebrow: legacyProfileContent.eyebrow,
  headline: legacyProfileContent.headline,
  description: legacyProfileContent.description,
  portrait: getApprovedPublicImage(
    {
      src: legacyProfileContent.portrait.src,
      alt: legacyProfileContent.portrait.alt,
      note: legacyProfileContent.portrait.note,
    },
    legacyProfileContent.portrait.approvalState,
  ),
  portraitApprovalState:
    legacyProfileContent.portrait.approvalState,
  portraitNote: legacyProfileContent.portrait.note,
  focusAreas: legacyProfileContent.focusAreas,
  values: legacyProfileContent.values,
  technologies: legacyProfileContent.technologies,
  publishFlowState: legacyProfileContent.publishFlowState,
  approvalNote: legacyProfileContent.approvalNote,
  contactNote: legacyProfileContent.contactNote,
  contactStateLabel: legacyProfileContent.contactStateLabel,
};

function normalizeLimit(limit: number): number {
  if (!Number.isFinite(limit)) {
    return 0;
  }

  return Math.max(0, Math.floor(limit));
}

export const mockPublicContentRepository: PublicContentRepository = {
  source: "mock",

  async listProjects() {
    return getVisibleRecords(projectRecords);
  },

  async getProjectBySlug(slug) {
    return getVisibleRecordBy(
      projectRecords,
      (project) => project.slug === slug,
    );
  },

  async listFeaturedProjects(limit) {
    return getVisibleRecords(projectRecords)
      .filter((project) => project.isFeatured)
      .slice(0, normalizeLimit(limit));
  },

  async listWritings() {
    return getVisibleRecords(writingRecords);
  },

  async getWritingBySlug(slug) {
    return getVisibleRecordBy(
      writingRecords,
      (writing) => writing.slug === slug,
    );
  },

  async listFeaturedWritings(limit) {
    return getVisibleRecords(writingRecords)
      .filter((writing) => writing.isFeatured)
      .slice(0, normalizeLimit(limit));
  },

  async listRelatedWritings(slugs) {
    const visibleWritings = getVisibleRecords(writingRecords);
    const bySlug = new Map(
      visibleWritings.map((writing) => [
        writing.slug,
        writing,
      ]),
    );

    return slugs.flatMap((slug) => {
      const writing = bySlug.get(slug);
      return writing ? [writing] : [];
    });
  },

  async listJourneyItems() {
    return getVisibleRecords(journeyRecords);
  },

  async getProfile() {
    return profile;
  },
};
