import type { Metadata } from "next";
import { GrammarDetailClient } from "./GrammarDetailClient";
import { hasLocale, type Locale } from "@/app/[lang]/dictionaries";
import { toGrammarEntry } from "@/lib/mappers";
import { getSameTitleEntries } from "@/lib/grammar-relations";
import { HREFLANG, LOCALES, SITE_URL, deckExplanation, deckMeaning, findDeckEntry, getDeck } from "@/lib/site";
import type { GrammarEntry } from "@/lib/types";

// Cached and refreshed daily. The empty generateStaticParams is required:
// without it `revalidate` is ignored and every request re-renders.
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

type Params = Promise<{ lang: string; slug: string }>;

function decodeSlug(rawSlug: string) {
  try {
    return decodeURIComponent(rawSlug);
  } catch {
    return rawSlug;
  }
}

function resolveLocale(lang: string): Locale {
  return hasLocale(lang) ? (lang as Locale) : "zh";
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug: rawSlug } = await params;
  const locale = resolveLocale(lang);
  const slug = decodeSlug(rawSlug);
  const row = findDeckEntry(slug);

  // Private grammar lives only in a user's account: it resolves client-side and
  // must never be indexed.
  if (!row) {
    return { robots: { index: false, follow: false } };
  }

  const meaning = deckMeaning(row, locale);
  const explanation = deckExplanation(row, locale);
  const title =
    locale === "en"
      ? `${row.title} — ${row.jlptLevel} Japanese Grammar`
      : `${row.title} — ${row.jlptLevel} 日语语法`;
  const description = [meaning, row.structure, explanation]
    .filter(Boolean)
    .join(" · ")
    .slice(0, 160);

  const path = (l: Locale) => `${SITE_URL}/${l}/grammar/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(LOCALES.map((l) => [HREFLANG[l], path(l)])),
    },
    openGraph: { title, description, url: path(locale), type: "article" },
  };
}

export default async function GrammarDetailPage({ params }: { params: Params }) {
  const { slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const row = findDeckEntry(slug);

  let initialGrammar: GrammarEntry | null = null;
  let initialSameTitle: GrammarEntry[] = [];

  if (row) {
    initialGrammar = toGrammarEntry(row);
    // Only same-title siblings are needed downstream, so the whole deck never
    // has to be serialized into the page payload.
    const siblings = getDeck()
      .filter((entry) => entry.title === row.title)
      .map(toGrammarEntry);
    initialSameTitle = [initialGrammar, ...getSameTitleEntries(siblings, initialGrammar)];
  }

  return (
    <GrammarDetailClient
      rawSlug={rawSlug}
      slug={slug}
      initialGrammar={initialGrammar}
      initialSameTitle={initialSameTitle}
    />
  );
}
