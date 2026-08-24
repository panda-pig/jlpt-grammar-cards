import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Account-scoped and operational routes hold nothing worth indexing.
      disallow: ["/api/", "/auth/", "/zh/admin/", "/en/admin/", "/zh/settings", "/en/settings", "/zh/payments/", "/en/payments/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
