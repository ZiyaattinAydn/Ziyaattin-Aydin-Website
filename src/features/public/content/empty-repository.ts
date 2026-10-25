import type { PublicContentRepository } from "./repository";
import { publicProfile } from "@/features/public/content/profile";

/** Missing configuration never turns demonstration records into portfolio content. */
export const emptyPublicContentRepository: PublicContentRepository = {
  source: "empty",
  async listProjects() {
    return [];
  },
  async getProjectBySlug() {
    return null;
  },
  async listFeaturedProjects() {
    return [];
  },
  async listWritings() {
    return [];
  },
  async getWritingBySlug() {
    return null;
  },
  async listFeaturedWritings() {
    return [];
  },
  async listRelatedWritings() {
    return [];
  },
  async listJourneyItems() {
    return [];
  },
  async getProfile() {
    return publicProfile;
  },
};
