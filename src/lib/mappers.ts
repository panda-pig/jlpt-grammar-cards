import type { GrammarEntry } from "./types";

export function toGrammarEntry(row: any): GrammarEntry {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    jlptLevel: row.jlpt_level,
    sourceRoute: row.source_route,
    grammarType: row.grammar_type,
    tags: row.tags || [],
    meaningCn: row.meaning_cn,
    meaningEn: row.meaning_en || "",
    structure: row.structure || "",
    explanation: row.explanation || "",
    usageNote: row.usage_note || "",
    exampleJp: row.example_jp || "",
    exampleCn: row.example_cn || "",
    furigana: row.furigana,
    similarGrammar: row.similar_grammar || [],
    commonMistake: row.common_mistake || "",
    memoryTip: row.memory_tip || "",
    quizQuestion: row.quiz_question || "",
    quizChoices: row.quiz_choices || [],
    quizAnswer: row.quiz_answer || "",
    quizExplanation: row.quiz_explanation || "",
  };
}
