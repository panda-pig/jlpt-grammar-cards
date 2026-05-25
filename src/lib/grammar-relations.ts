import type { GrammarEntry } from "./types";
import { grammarCategoryLabel, localizedStructure, type AppLocale } from "./grammar-content";

function normalizeStructure(value: string) {
  return value.replace(/\s+/g, "").replace(/[＋]/g, "+").trim();
}

function duplicateKey(grammar: GrammarEntry) {
  return [
    grammar.title,
    grammar.grammarType,
    normalizeStructure(grammar.structure),
  ].join("::");
}

export interface GrammarRelationMeta {
  sameTitleCount: number;
}

export function buildGrammarRelationMap(entries: GrammarEntry[]) {
  const byTitle = new Map<string, GrammarEntry[]>();

  for (const entry of entries) {
    byTitle.set(entry.title, [...(byTitle.get(entry.title) ?? []), entry]);
  }

  const result = new Map<string, GrammarRelationMeta>();

  for (const entry of entries) {
    result.set(entry.id, {
      sameTitleCount: byTitle.get(entry.title)?.length ?? 1,
    });
  }

  return result;
}

export function getSameTitleEntries(entries: GrammarEntry[], current: GrammarEntry) {
  return entries
    .filter((entry) => entry.title === current.title && entry.id !== current.id)
    .sort((a, b) => {
      if (a.jlptLevel !== b.jlptLevel) return a.jlptLevel.localeCompare(b.jlptLevel);
      return normalizeStructure(a.structure).localeCompare(normalizeStructure(b.structure));
    });
}

export function isDuplicateCandidate(entries: GrammarEntry[], grammar: GrammarEntry) {
  return entries.filter((entry) => duplicateKey(entry) === duplicateKey(grammar)).length > 1;
}

export function isDuplicateCandidatePair(a: GrammarEntry, b: GrammarEntry) {
  return duplicateKey(a) === duplicateKey(b);
}

export function grammarVariantLabel(grammar: GrammarEntry, locale: AppLocale) {
  return [
    grammar.jlptLevel,
    grammarCategoryLabel(grammar.grammarType, locale),
    localizedStructure(grammar.structure, locale),
  ].join(" · ");
}
