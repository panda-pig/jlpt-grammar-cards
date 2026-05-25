"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { grammarService } from "@/services/grammarService";
import { toGrammarEntry } from "@/lib/mappers";
import type { GrammarEntry } from "@/lib/types";

interface GrammarContextValue {
  entries: GrammarEntry[];
  loading: boolean;
  addGrammar: (entry: Omit<GrammarEntry, "id">) => Promise<void>;
  updateGrammar: (id: string, entry: Partial<GrammarEntry>) => Promise<void>;
  deleteGrammar: (id: string) => Promise<void>;
}

const GrammarContext = createContext<GrammarContextValue | null>(null);

export function GrammarProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<GrammarEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    grammarService.getAll().then((data) => {
      setEntries(data.map(toGrammarEntry));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const addGrammar = useCallback(async (entry: Omit<GrammarEntry, "id">) => {
    const row = await grammarService.create({
      title: entry.title,
      slug: entry.slug,
      jlpt_level: entry.jlptLevel,
      source_route: entry.sourceRoute,
      grammar_type: entry.grammarType,
      tags: entry.tags,
      meaning_cn: entry.meaningCn,
      meaning_en: entry.meaningEn,
      structure: entry.structure,
      explanation: entry.explanation,
      usage_note: entry.usageNote,
      example_jp: entry.exampleJp,
      example_cn: entry.exampleCn,
      furigana: entry.furigana,
      similar_grammar: entry.similarGrammar,
      common_mistake: entry.commonMistake,
      memory_tip: entry.memoryTip,
      quiz_question: entry.quizQuestion,
      quiz_choices: entry.quizChoices,
      quiz_answer: entry.quizAnswer,
      quiz_explanation: entry.quizExplanation,
    });
    const created = toGrammarEntry(row);
    setEntries((prev) => [created, ...prev]);
  }, []);

  const updateGrammar = useCallback(async (id: string, updates: Partial<GrammarEntry>) => {
    const updateData: Record<string, unknown> = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.jlptLevel !== undefined) updateData.jlpt_level = updates.jlptLevel;
    if (updates.sourceRoute !== undefined) updateData.source_route = updates.sourceRoute;
    if (updates.grammarType !== undefined) updateData.grammar_type = updates.grammarType;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.meaningCn !== undefined) updateData.meaning_cn = updates.meaningCn;
    if (updates.meaningEn !== undefined) updateData.meaning_en = updates.meaningEn;
    if (updates.structure !== undefined) updateData.structure = updates.structure;
    if (updates.explanation !== undefined) updateData.explanation = updates.explanation;
    if (updates.usageNote !== undefined) updateData.usage_note = updates.usageNote;
    if (updates.exampleJp !== undefined) updateData.example_jp = updates.exampleJp;
    if (updates.exampleCn !== undefined) updateData.example_cn = updates.exampleCn;
    if (updates.commonMistake !== undefined) updateData.common_mistake = updates.commonMistake;
    if (updates.memoryTip !== undefined) updateData.memory_tip = updates.memoryTip;
    await grammarService.update(id, updateData);
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const deleteGrammar = useCallback(async (id: string) => {
    await grammarService.delete(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <GrammarContext.Provider value={{ entries, loading, addGrammar, updateGrammar, deleteGrammar }}>
      {children}
    </GrammarContext.Provider>
  );
}

export function useGrammar() {
  const ctx = useContext(GrammarContext);
  if (!ctx) throw new Error("useGrammar must be used within GrammarProvider");
  return ctx;
}
