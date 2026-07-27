import type { MetadataRoute } from "next";
import { AGENCY } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The panel and the saved list are private; the API answers no crawler.
      disallow: ["/admin", "/api", "/favorite"],
    },
    sitemap: `${AGENCY.origin}/sitemap.xml`,
  };
}
