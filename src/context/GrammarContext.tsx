"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import grammarData from "@/data/grammar.json";
import type {
  GrammarEntry,
  JLPTLevel,
  SourceRoute,
  GrammarCategory,
  StudyStatus,
  LevelProgress,
  ReviewRecord,
} from "@/lib/types";

interface GrammarContextValue {
  entries: GrammarEntry[];
  addGrammar: (entry: Omit<GrammarEntry, "id">) => void;
  updateGrammar: (id: string, entry: Partial<GrammarEntry>) => void;
  deleteGrammar: (id: string) => void;
  toggleFavorite: (id: string) => void;
  getLevelProgress: () => LevelProgress[];
  getReviewRecords: () => ReviewRecord[];
  getEntriesByLevel: (level: string) => GrammarEntry[];
  userStats: {
    todayNewCards: number;
    todayReviewCards: number;
    todayCompleted: number;
    todayTotal: number;
    totalLearned: number;
    totalMastered: number;
    totalFavorites: number;
    streakDays: number;
  };
  favoriteCollections: { id: string; name: string; count: number }[];
}

const GrammarContext = createContext<GrammarContextValue | null>(null);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function GrammarProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<GrammarEntry[]>(grammarData as GrammarEntry[]);

  const addGrammar = useCallback((entry: Omit<GrammarEntry, "id">) => {
    const newEntry: GrammarEntry = { ...entry, id: generateId() };
    setEntries((prev) => [newEntry, ...prev]);
  }, []);

  const updateGrammar = useCallback((id: string, updates: Partial<GrammarEntry>) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const deleteGrammar = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isFavorite: !e.isFavorite } : e))
    );
  }, []);

  const getEntriesByLevel = useCallback(
    (level: string) => entries.filter((e) => e.jlptLevel === level),
    [entries]
  );

  const getLevelProgress = useCallback((): LevelProgress[] => {
    const levels: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];
    return levels.map((level) => {
      const items = entries.filter((e) => e.jlptLevel === level);
      return {
        level,
        total: items.length,
        learned: items.filter((e) => e.studyStatus === "学习中" || e.studyStatus === "已掌握").length,
        mastered: items.filter((e) => e.studyStatus === "已掌握").length,
      };
    });
  }, [entries]);

  const getReviewRecords = useCallback((): ReviewRecord[] => {
    return entries
      .filter((e) => e.studyStatus === "学习中")
      .map((e) => ({
        grammarId: e.id,
        title: e.title,
        level: e.jlptLevel,
        lastRating: e.reviewCount > 0 ? "记住了" : "未复习",
        nextReviewDate: e.nextReviewAt
          ? new Date(e.nextReviewAt).toLocaleDateString("zh-CN")
          : "未安排",
        isFavorite: e.isFavorite,
      }));
  }, [entries]);

  const userStats = useMemo(() => {
    const learned = entries.filter((e) => e.studyStatus === "学习中" || e.studyStatus === "已掌握").length;
    const mastered = entries.filter((e) => e.studyStatus === "已掌握").length;
    const favorites = entries.filter((e) => e.isFavorite).length;
    return {
      todayNewCards: 10,
      todayReviewCards: 30,
      todayCompleted: 8,
      todayTotal: 40,
      totalLearned: learned,
      totalMastered: mastered,
      totalFavorites: favorites,
      streakDays: 5,
    };
  }, [entries]);

  const favoriteCollections = [
    { id: "1", name: "默认收藏", count: entries.filter((e) => e.isFavorite).length },
    { id: "2", name: "易错语法", count: 0 },
    { id: "3", name: "考前复习", count: 0 },
    { id: "4", name: "N2 重点", count: 0 },
    { id: "5", name: "敬语专项", count: 0 },
  ];

  const value: GrammarContextValue = {
    entries,
    addGrammar,
    updateGrammar,
    deleteGrammar,
    toggleFavorite,
    getLevelProgress,
    getReviewRecords,
    getEntriesByLevel,
    userStats,
    favoriteCollections,
  };

  return <GrammarContext.Provider value={value}>{children}</GrammarContext.Provider>;
}

export function useGrammar() {
  const ctx = useContext(GrammarContext);
  if (!ctx) throw new Error("useGrammar must be used within GrammarProvider");
  return ctx;
}
