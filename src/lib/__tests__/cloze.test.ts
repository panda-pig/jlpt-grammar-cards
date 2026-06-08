import { describe, it, expect } from "vitest";
import {
  cleanPattern,
  isClozeEligible,
  buildClozeQuestion,
  buildClozeDeck,
  BLANK_MARKER,
} from "@/lib/cloze";
import type { GrammarEntry, JLPTLevel } from "@/lib/types";

function entry(partial: Partial<GrammarEntry> & { id: string; title: string; jlptLevel: JLPTLevel }): GrammarEntry {
  return {
    slug: partial.id,
    sourceRoute: "综合",
    grammarType: "その他",
    tags: [],
    meaningCn: "", meaningZh: "", meaningEn: "",
    structure: "", explanation: "", explanationZh: "", explanationEn: "",
    usageNote: "", usageNoteZh: "", usageNoteEn: "",
    exampleJp: "", exampleCn: "", exampleZh: "", exampleEn: "",
    similarGrammar: [],
    commonMistake: "", commonMistakeZh: "", commonMistakeEn: "",
    memoryTip: "", memoryTipZh: "", memoryTipEn: "",
    quizQuestion: "", quizChoices: [], quizAnswer: "", quizExplanation: "",
    ...partial,
  } as GrammarEntry;
}

const pool: GrammarEntry[] = [
  entry({ id: "1", title: "わけではない", jlptLevel: "N3", exampleJp: "嫌いなわけではないが、好きでもない。" }),
  entry({ id: "2", title: "に違いない", jlptLevel: "N3", exampleJp: "彼は来るに違いない。" }),
  entry({ id: "3", title: "から（原因）", jlptLevel: "N5", exampleJp: "寒いから、コートを着る。" }),
  entry({ id: "4", title: "ものだから", jlptLevel: "N3", exampleJp: "急いでいたものだから、忘れた。" }),
  entry({ id: "5", title: "といえども", jlptLevel: "N1", exampleJp: "プロといえども失敗する。" }),
];

describe("cleanPattern", () => {
  it("strips parentheticals, wave dashes and variant suffixes", () => {
    expect(cleanPattern("から（原因）")).toBe("から");
    expect(cleanPattern("〜わけではない")).toBe("わけではない");
    expect(cleanPattern("ようが～ようが / ようと～ようと")).toBe("ようがようが");
    expect(cleanPattern("より [2]")).toBe("より");
  });
});

describe("isClozeEligible", () => {
  it("requires a title and an example sentence", () => {
    expect(isClozeEligible(pool[0])).toBe(true);
    expect(isClozeEligible(entry({ id: "x", title: "X", jlptLevel: "N3" }))).toBe(false);
  });
});

describe("buildClozeQuestion", () => {
  it("blanks the pattern when it appears in the example", () => {
    const q = buildClozeQuestion(pool[0], pool)!;
    expect(q).not.toBeNull();
    expect(q.mode).toBe("blank");
    expect(q.sentence).toContain(BLANK_MARKER);
    expect(q.sentence).not.toContain("わけではない");
  });

  it("produces 4 unique options including the correct answer", () => {
    const q = buildClozeQuestion(pool[0], pool)!;
    expect(q.options).toHaveLength(4);
    expect(new Set(q.options).size).toBe(4);
    expect(q.options).toContain("わけではない");
  });

  it("falls back to identify mode when the pattern is not in the sentence", () => {
    const odd = entry({ id: "9", title: "ぞ・ぜ", jlptLevel: "N1", exampleJp: "行くぞ。" });
    const q = buildClozeQuestion(odd, [...pool, odd])!;
    expect(q.mode).toBe("identify");
    expect(q.sentence).toBe("行くぞ。");
  });

  it("returns null when there are not enough distractors", () => {
    const lonely = entry({ id: "z", title: "X", jlptLevel: "N3", exampleJp: "Xです。" });
    expect(buildClozeQuestion(lonely, [lonely])).toBeNull();
  });
});

describe("buildClozeDeck", () => {
  it("respects the requested count", () => {
    const deck = buildClozeDeck(pool, "all", 3);
    expect(deck.length).toBe(3);
  });

  it("filters by level", () => {
    const deck = buildClozeDeck(pool, "N3", 10);
    expect(deck.every((q) => q.level === "N3")).toBe(true);
  });
});
