import type { GrammarEntry, JLPTLevel } from "@/lib/types";

export type ClozeMode = "blank" | "identify";

export interface ClozeQuestion {
  id: string;
  mode: ClozeMode;
  /** Sentence to show. In "blank" mode the pattern is replaced by a blank marker. */
  sentence: string;
  /** The grammar title that is the correct answer. */
  correctTitle: string;
  /** Shuffled option titles, including the correct one. */
  options: string[];
  level: JLPTLevel;
}

export const BLANK_MARKER = "（　　　）";

/**
 * Reduce a grammar title to a core surface pattern we can search for inside an
 * example sentence: drop wave dashes, parenthetical disambiguators ("から（原因）"),
 * bracketed indices ("より [2]") and surrounding whitespace. Returns the first
 * variant when a title lists several ("ようが～ようが / ようと～ようと").
 */
export function cleanPattern(title: string): string {
  let s = (title ?? "").trim();
  // take the first variant if several are slash-separated
  if (s.includes(" / ")) s = s.split(" / ")[0];
  if (s.includes("／")) s = s.split("／")[0];
  s = s
    .replace(/[（(][^）)]*[）)]/g, "") // parenthetical notes
    .replace(/\[[^\]]*\]/g, "") // [2] style indices
    .replace(/[〜～]/g, "") // wave dashes
    .replace(/\s+/g, "")
    .trim();
  return s;
}

function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Whether an entry can be turned into a cloze question at all. */
export function isClozeEligible(entry: GrammarEntry): boolean {
  return Boolean(entry.exampleJp && entry.exampleJp.trim() && entry.title && entry.title.trim());
}

/**
 * Build a single cloze question for `entry`, drawing 3 distractor options from
 * `pool` (same JLPT level preferred). Returns null when there aren't enough
 * distinct distractors to form a 4-option question.
 */
export function buildClozeQuestion(
  entry: GrammarEntry,
  pool: GrammarEntry[],
  rand: () => number = Math.random
): ClozeQuestion | null {
  if (!isClozeEligible(entry)) return null;

  const correctTitle = entry.title.trim();
  const pattern = cleanPattern(entry.title);
  const example = entry.exampleJp.trim();

  let mode: ClozeMode = "identify";
  let sentence = example;
  if (pattern && example.includes(pattern)) {
    mode = "blank";
    sentence = example.replace(pattern, BLANK_MARKER);
  }

  // Distractors: unique titles, not the answer; prefer same level, then any.
  const seen = new Set<string>([correctTitle]);
  const sameLevel = shuffle(
    pool.filter((g) => g.jlptLevel === entry.jlptLevel && g.title.trim() !== correctTitle),
    rand
  );
  const otherLevel = shuffle(
    pool.filter((g) => g.jlptLevel !== entry.jlptLevel && g.title.trim() !== correctTitle),
    rand
  );

  const distractors: string[] = [];
  for (const g of [...sameLevel, ...otherLevel]) {
    const title = g.title.trim();
    if (seen.has(title)) continue;
    seen.add(title);
    distractors.push(title);
    if (distractors.length === 3) break;
  }

  if (distractors.length < 3) return null;

  return {
    id: entry.id,
    mode,
    sentence,
    correctTitle,
    options: shuffle([correctTitle, ...distractors], rand),
    level: entry.jlptLevel,
  };
}

/**
 * Build a deck of up to `count` cloze questions for the given level ("all" for
 * every level). Distractors are drawn from the full entry set.
 */
export function buildClozeDeck(
  entries: GrammarEntry[],
  level: JLPTLevel | "all",
  count = 10,
  rand: () => number = Math.random
): ClozeQuestion[] {
  const pool = entries.filter((e) => e.title && e.title.trim());
  const candidates = shuffle(
    entries.filter((e) => isClozeEligible(e) && (level === "all" || e.jlptLevel === level)),
    rand
  );

  const deck: ClozeQuestion[] = [];
  for (const entry of candidates) {
    const q = buildClozeQuestion(entry, pool, rand);
    if (q) deck.push(q);
    if (deck.length === count) break;
  }
  return deck;
}
