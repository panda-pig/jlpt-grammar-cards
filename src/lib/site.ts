import grammarData from "@/data/grammar.json";
import type { Locale } from "@/app/[lang]/dictionaries";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jlpt-grammar-cards.com").replace(/\/$/, "");

export const LOCALES: Locale[] = ["zh", "en"];

/** hreflang codes for the two shipped locales. */
export const HREFLANG: Record<Locale, string> = { zh: "zh-CN", en: "en" };

export interface DeckRow {
  id: string | number;
  slug: string;
  title: string;
  jlptLevel: string;
  meaningZh?: string;
  meaningEn?: string;
  meaningCn?: string;
  explanationZh?: string;
  explanationEn?: string;
  structure?: string;
}

const deck = grammarData as unknown as DeckRow[];

/**
 * The bundled deck, available on the server without a network hop. Only used by
 * metadata, the sitemap, and the detail page's server shell — the browser still
 * fetches `/grammar.json` lazily so the deck never enters a client bundle.
 */
export function getDeck(): DeckRow[] {
  return deck;
}

const bySlug = new Map(deck.map((row) => [row.slug, row]));

export function findDeckEntry(slug: string): DeckRow | null {
  return bySlug.get(slug) ?? null;
}

/** The meaning line, falling back across the locale columns the deck actually has. */
export function deckMeaning(row: DeckRow, locale: Locale): string {
  const localized = locale === "en" ? row.meaningEn : row.meaningZh ?? row.meaningCn;
  return (localized ?? row.meaningEn ?? row.meaningZh ?? row.meaningCn ?? "").trim();
}

export function deckExplanation(row: DeckRow, locale: Locale): string {
  const localized = locale === "en" ? row.explanationEn : row.explanationZh;
  return (localized ?? "").trim();
}
