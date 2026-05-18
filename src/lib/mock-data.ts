import grammarData from "@/data/grammar.json";
import type { GrammarEntry, UserStats, LevelProgress, ReviewRecord, FavoriteCollection } from "./types";

export const grammarEntries: GrammarEntry[] = grammarData as GrammarEntry[];

export function getEntriesByLevel(level: string): GrammarEntry[] {
  return grammarEntries.filter((e) => e.jlptLevel === level);
}

export function getLevelProgress(): LevelProgress[] {
  const levels = ["N5", "N4", "N3", "N2", "N1"] as const;
  return levels.map((level) => {
    const entries = getEntriesByLevel(level);
    return {
      level,
      total: entries.length,
      learned: entries.filter((e) => e.studyStatus === "学习中" || e.studyStatus === "已掌握").length,
      mastered: entries.filter((e) => e.studyStatus === "已掌握").length,
    };
  });
}

export const userStats: UserStats = {
  todayNewCards: 10,
  todayReviewCards: 30,
  todayCompleted: 8,
  todayTotal: 40,
  totalLearned: 24,
  totalMastered: 10,
  totalFavorites: 5,
  streakDays: 5,
};

export const reviewRecords: ReviewRecord[] = grammarEntries
  .filter((e) => e.studyStatus === "学习中")
  .map((e) => ({
    grammarId: e.id,
    title: e.title,
    level: e.jlptLevel,
    lastRating: e.reviewCount > 0 ? "记住了" : "未复习",
    nextReviewDate: e.nextReviewAt ? new Date(e.nextReviewAt).toLocaleDateString("zh-CN") : "未安排",
    isFavorite: e.isFavorite,
  }));

export const favoriteCollections: FavoriteCollection[] = [
  { id: "1", name: "默认收藏", count: 0 },
  { id: "2", name: "易错语法", count: 0 },
  { id: "3", name: "考前复习", count: 0 },
  { id: "4", name: "N2 重点", count: 0 },
  { id: "5", name: "敬语专项", count: 0 },
];

export const favorites = grammarEntries.filter((e) => e.isFavorite);
