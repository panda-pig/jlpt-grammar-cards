import type { MetadataRoute } from "next";
import { HREFLANG, LOCALES, SITE_URL, getDeck } from "@/lib/site";
import type { Locale } from "@/app/[lang]/dictionaries";

// Pages a signed-out visitor can actually read; account-only routes are omitted.
const PUBLIC_PATHS = ["", "/grammar", "/study", "/practice", "/review", "/pro", "/support"];

function entry(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) {
  const url = (locale: Locale) => `${SITE_URL}/${locale}${path}`;
  return LOCALES.map((locale) => ({
    url: url(locale),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(LOCALES.map((l) => [HREFLANG[l], url(l)])),
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = PUBLIC_PATHS.flatMap((path) =>
    entry(path, path === "" ? 1 : 0.8, path === "" ? "weekly" : "monthly"),
  );

  const grammar = getDeck().flatMap((row) =>
    entry(`/grammar/${encodeURIComponent(row.slug)}`, 0.7, "monthly"),
  );

  return [...pages, ...grammar];
}
