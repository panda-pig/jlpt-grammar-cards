import type { GrammarCategory, GrammarEntry, StudyStatus } from "./types";

export type AppLocale = "zh" | "en";

const hanPattern = /[\u3400-\u9fff]/;
const kanaPattern = /[\u3040-\u30ff]/;
const latinPattern = /[A-Za-z]/g;

function latinRatio(value: string) {
  const letters = value.match(latinPattern)?.length ?? 0;
  const length = value.replace(/\s/g, "").length || 1;
  return letters / length;
}

function isEnglishOnly(value: string) {
  return !hanPattern.test(value) && !kanaPattern.test(value) && (value.match(latinPattern)?.length ?? 0) >= 3 && latinRatio(value) > 0.35;
}

function cleanTextForLocale(value: string | null | undefined, locale: AppLocale) {
  const text = value?.trim() ?? "";
  if (!text) return "";
  if (locale === "zh") return isEnglishOnly(text) ? "" : text;
  return text;
}

function firstLocalizedText(locale: AppLocale, candidates: Array<string | null | undefined>) {
  for (const candidate of candidates) {
    const cleaned = cleanTextForLocale(candidate, locale);
    if (cleaned) return cleaned;
  }
  return "";
}

export function localizedGrammar(grammar: GrammarEntry, locale: AppLocale) {
  const zh = locale === "zh";

  return {
    meaning: zh
      ? firstLocalizedText(locale, [grammar.meaningZh, grammar.meaningCn])
      : firstLocalizedText(locale, [grammar.meaningEn]),
    explanation: zh
      ? firstLocalizedText(locale, [grammar.explanationZh, grammar.explanation])
      : firstLocalizedText(locale, [grammar.explanationEn]),
    usageNote: zh
      ? firstLocalizedText(locale, [grammar.usageNoteZh, grammar.usageNote])
      : firstLocalizedText(locale, [grammar.usageNoteEn]),
    exampleTranslation: zh
      ? firstLocalizedText(locale, [grammar.exampleZh, grammar.exampleCn])
      : firstLocalizedText(locale, [grammar.exampleEn]),
    commonMistake: zh
      ? firstLocalizedText(locale, [grammar.commonMistakeZh, grammar.commonMistake])
      : firstLocalizedText(locale, [grammar.commonMistakeEn]),
    memoryTip: zh
      ? firstLocalizedText(locale, [grammar.memoryTipZh, grammar.memoryTip])
      : firstLocalizedText(locale, [grammar.memoryTipEn]),
  };
}

const tagLabelsEn: Record<string, string> = {
  基础: "Basic",
  常用: "Common",
  原因与理由: "Cause / Reason",
  条件与假设: "Condition",
  让步与转折: "Concession / Contrast",
  目的与意图: "Purpose",
  情感与可能: "Feeling / Potential",
  倾向与样态: "Tendency / Appearance",
  程度与比较: "Degree / Comparison",
  许可与义务: "Permission / Obligation",
  敬语与礼貌: "Honorific / Polite",
  形式名词: "Formal Noun",
  复句与连接: "Connection",
  判断与说明: "Judgment",
  动作与时态: "Action / Tense",
  方向与授受: "Direction / Giving",
  其他表达: "Other",
};

export function localizedTagLabel(tag: string, locale: AppLocale) {
  if (locale === "zh") return tag;
  return tagLabelsEn[tag] ?? cleanTextForLocale(tag, "en");
}

const structureTermsEn: Array<[RegExp, string]> = [
  [/动词ます形词干/g, "masu-stem verb"],
  [/动词词干/g, "verb stem"],
  [/形容词词干/g, "adjective stem"],
  [/な形容词/g, "na-adjective"],
  [/い形容词/g, "i-adjective"],
  [/汉语名词/g, "Sino-Japanese noun"],
  [/动词ます形/g, "masu-form verb"],
  [/动词て形/g, "te-form verb"],
  [/动词た形/g, "ta-form verb"],
  [/动词ない形/g, "nai-form verb"],
  [/动词原形/g, "dictionary-form verb"],
  [/动词意志形/g, "volitional-form verb"],
  [/动词可能形/g, "potential-form verb"],
  [/动词/g, "verb"],
  [/名词/g, "noun"],
  [/形容词/g, "adjective"],
  [/普通形/g, "plain form"],
  [/礼貌体/g, "polite form"],
  [/句尾/g, "sentence ending"],
  [/句首/g, "sentence start"],
  [/句中/g, "sentence middle"],
  [/人名/g, "person name"],
  [/主题/g, "topic"],
  [/主语/g, "subject"],
  [/宾语/g, "object"],
  [/时间/g, "time"],
  [/地点/g, "place"],
  [/对象/g, "target"],
  [/场所/g, "place"],
  [/手段/g, "means"],
  [/方向/g, "direction"],
  [/起点/g, "starting point"],
  [/终点/g, "end point"],
  [/共同/g, "together with"],
  [/列举/g, "listing"],
  [/举例/g, "example"],
  [/程度/g, "degree"],
  [/原因/g, "reason"],
  [/条件/g, "condition"],
  [/只/g, "only"],
  [/也/g, "also"],
];

export function localizedStructure(structure: string, locale: AppLocale) {
  if (locale === "zh") return structure;
  return structureTermsEn.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), structure);
}

export function grammarCategoryLabel(category: GrammarCategory, locale: AppLocale): string {
  if (locale === "zh") return category;
  const labels: Record<GrammarCategory, string> = {
    "原因・理由": "Cause / Reason",
    "条件": "Condition",
    "逆接・譲歩": "Contrast / Concession",
    "推量・様態": "Inference / Appearance",
    "否定": "Negation",
    "敬語": "Honorifics",
    "比較": "Comparison",
    "目的": "Purpose",
    "限定": "Limitation",
    "範囲": "Range",
    "並列": "Parallel",
    "例示": "Examples",
    "伝聞": "Hearsay",
    "提示": "Topic / Presentation",
    "意志・勧誘": "Intention / Invitation",
    "願望": "Desire",
    "義務・当然": "Obligation",
    "存在": "Existence",
    "結果": "Result",
    "関係": "Relation",
    "時点": "Time Point",
    "程度": "Degree",
    "変化": "Change",
    "評価": "Evaluation",
    "感情": "Emotion",
    "確認": "Confirmation",
    "強調": "Emphasis",
    "規則": "Rule",
    "その他": "Other",
  };
  // Category is effectively free-text in the data (many nuance values beyond the
  // typed union). Fall back to the raw value so English UI never shows undefined.
  return labels[category] ?? category;
}

export function studyStatusLabel(status: StudyStatus, locale: AppLocale): string {
  if (locale === "zh") return status;
  const labels: Record<StudyStatus, string> = {
    "未学习": "New",
    "学习中": "Learning",
    "已掌握": "Mastered",
  };
  return labels[status];
}

export function ratingLabelForLocale(rating: string | null | undefined, locale: AppLocale): string {
  if (!rating) return locale === "zh" ? "未复习" : "Not reviewed";
  if (locale === "zh") return rating;
  const labels: Record<string, string> = {
    "忘记了": "Again",
    "有点模糊": "Hard",
    "记住了": "Good",
    "很简单": "Easy",
  };
  return labels[rating] ?? rating;
}
