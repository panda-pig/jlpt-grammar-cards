import type { GrammarEntry } from "./types";

export function toGrammarEntry(row: any): GrammarEntry {
  const meaningZh = row.meaning_zh ?? row.meaning_cn ?? row.meaningZh ?? row.meaningCn ?? "";
  const explanationZh = row.explanation_zh ?? row.explanationZh ?? row.explanation ?? "";
  const usageNoteZh = row.usage_note_zh ?? row.usageNoteZh ?? row.usage_note ?? row.usageNote ?? "";
  const exampleZh = row.example_zh ?? row.exampleZh ?? row.example_cn ?? row.exampleCn ?? "";
  const commonMistakeZh = row.common_mistake_zh ?? row.commonMistakeZh ?? row.common_mistake ?? row.commonMistake ?? "";
  const memoryTipZh = row.memory_tip_zh ?? row.memoryTipZh ?? row.memory_tip ?? row.memoryTip ?? "";

  return {
    id: String(row.source_key ?? row.id),
    dbId: row.source_key ? row.id : row.dbId,
    ownerId: row.user_id ?? row.ownerId ?? null,
    isSystem: row.is_system ?? row.isSystem ?? !row.user_id,
    isUserCreated: row.is_user_created ?? row.isUserCreated ?? false,
    isHidden: row.is_hidden ?? row.isHidden ?? false,
    baseGrammarKey: row.base_grammar_key ?? row.baseGrammarKey ?? null,
    title: row.title,
    slug: row.slug,
    jlptLevel: row.jlpt_level ?? row.jlptLevel,
    sourceRoute: row.source_route ?? row.sourceRoute ?? "综合",
    grammarType: row.grammar_type ?? row.grammarType,
    tags: row.tags || [],
    meaningCn: meaningZh,
    meaningZh,
    meaningEn: row.meaning_en ?? row.meaningEn ?? "",
    structure: row.structure || "",
    explanation: explanationZh,
    explanationZh,
    explanationEn: row.explanation_en ?? row.explanationEn ?? "",
    usageNote: usageNoteZh,
    usageNoteZh,
    usageNoteEn: row.usage_note_en ?? row.usageNoteEn ?? "",
    exampleJp: row.example_jp ?? row.exampleJp ?? "",
    exampleCn: exampleZh,
    exampleZh,
    exampleEn: row.example_en ?? row.exampleEn ?? "",
    furigana: row.furigana,
    similarGrammar: row.similar_grammar ?? row.similarGrammar ?? [],
    commonMistake: commonMistakeZh,
    commonMistakeZh,
    commonMistakeEn: row.common_mistake_en ?? row.commonMistakeEn ?? "",
    memoryTip: memoryTipZh,
    memoryTipZh,
    memoryTipEn: row.memory_tip_en ?? row.memoryTipEn ?? "",
    quizQuestion: row.quiz_question ?? row.quizQuestion ?? "",
    quizChoices: row.quiz_choices ?? row.quizChoices ?? [],
    quizAnswer: row.quiz_answer ?? row.quizAnswer ?? "",
    quizExplanation: row.quiz_explanation ?? row.quizExplanation ?? "",
  };
}
