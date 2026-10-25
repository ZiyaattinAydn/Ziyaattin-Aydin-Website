import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/public-metadata";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/login", "/mfa", "/auth/", "/unauthorized"],
    },
    sitemap: publicSiteUrl + "/sitemap.xml",
  };
}
