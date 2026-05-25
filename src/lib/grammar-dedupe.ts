import redirects from "@/data/grammar-dedupe-redirects.json";

export const grammarDedupeRedirects = redirects as Record<string, string>;

export function canonicalGrammarId(grammarId: string | number | null | undefined) {
  let current = String(grammarId ?? "");
  const seen = new Set<string>();

  while (grammarDedupeRedirects[current] && !seen.has(current)) {
    seen.add(current);
    current = grammarDedupeRedirects[current];
  }

  return current;
}

export function grammarIdFromSlug(slug: string) {
  return slug.match(/-(\d+)$/)?.[1] ?? null;
}

export function canonicalizeReviewHistory<T extends { grammarId?: string }>(history: T[], grammarId: string) {
  return history.map((item) => ({ ...item, grammarId }));
}
