import { grammarService } from "./grammarService";
import { localProgressService, type LocalProgressRow } from "./localProgressService";
import { progressService, type ProgressRow, type RemoteReviewHistoryRow } from "./progressService";
import { toGrammarEntry } from "@/lib/mappers";
import { canonicalGrammarId } from "@/lib/grammar-dedupe";
import type { GrammarEntry, JLPTLevel, ReviewRating } from "@/lib/types";

export type UnifiedProgressRow = ProgressRow | LocalProgressRow;
export type ProgressWithGrammar = UnifiedProgressRow & { grammar: any };

function todayKey(date = new Date()) {
  return date.toISOString().split("T")[0];
}

function isToday(iso: string | null | undefined) {
  return !!iso && iso.split("T")[0] === todayKey();
}

function progressFor(progressMap: Map<string, UnifiedProgressRow>, grammarId: string): UnifiedProgressRow | undefined {
  return progressMap.get(canonicalGrammarId(grammarId));
}

function rowGrammarKey(row: UnifiedProgressRow | { grammar_id?: string | null; grammar_key?: string | null }) {
  const keyedRow = row as { grammar_id?: string | null; grammar_key?: string | null };
  return canonicalGrammarId(String(keyedRow.grammar_key ?? keyedRow.grammar_id));
}

function attachGrammar(progress: UnifiedProgressRow[], grammarEntries: GrammarEntry[]) {
  const grammarById = new Map(grammarEntries.map((grammar) => [grammar.id, grammar]));
  return progress
    .map((row) => {
      const grammarId = rowGrammarKey(row);
      return { ...row, grammar_id: grammarId, grammar: grammarById.get(grammarId) };
    })
    .filter((row) => row.grammar) as ProgressWithGrammar[];
}

let remoteProgressUnavailable = false;

function fallbackToLocalProgress() {
  remoteProgressUnavailable = true;
}

async function getLocalDueForReview(): Promise<ProgressWithGrammar[]> {
  const now = Date.now();
  const [rows, progress] = await Promise.all([
    grammarService.getAll(),
    Promise.resolve(localProgressService.getAll()),
  ]);
  const grammarEntries = rows.map(toGrammarEntry);
  const due = progress.filter((row) =>
    row.review_count > 0 &&
    !!row.next_review_at &&
    new Date(row.next_review_at).getTime() <= now &&
    (row.study_status === "学习中" || row.study_status === "已掌握")
  );
  return attachGrammar(due, grammarEntries).sort((a, b) =>
    new Date(a.next_review_at ?? 0).getTime() - new Date(b.next_review_at ?? 0).getTime()
  );
}

async function getLocalFavorites(): Promise<ProgressWithGrammar[]> {
  const [rows, progress] = await Promise.all([
    grammarService.getAll(),
    Promise.resolve(localProgressService.getAll().filter((row) => row.is_favorite)),
  ]);
  return attachGrammar(progress, rows.map(toGrammarEntry));
}

async function getLocalDailyStats() {
  const progress = localProgressService.getAll();
  const todayCompleted = progress.reduce((count, row) => (
    count + (row.review_history ?? []).filter((history) => isToday(history.reviewedAt)).length
  ), 0);
  const todayNew = progress.filter((row) => row.review_count > 0 && isToday(row.created_at)).length;
  const due = await getLocalDueForReview();

  const reviewedDays = Array.from(new Set(
    progress.flatMap((row) => (row.review_history ?? []).map((history) => history.reviewedAt.split("T")[0]))
  ));
  let streakDays = 0;
  const base = new Date(todayKey());
  for (let i = 0; i < 365; i++) {
    const expected = new Date(base);
    expected.setDate(expected.getDate() - i);
    if (reviewedDays.includes(todayKey(expected))) streakDays += 1;
    else if (i > 0) break;
  }

  return {
    todayDue: due.length,
    todayNew,
    todayCompleted,
    streakDays,
  };
}

async function getLocalRecentReviews(limit = 8) {
  const grammarRows = await grammarService.getAll();
  const grammarById = new Map(grammarRows.map((row) => {
    const entry = toGrammarEntry(row);
    return [canonicalGrammarId(entry.id), entry];
  }));
  return localProgressService
    .getAll()
    .flatMap((row) => (row.review_history ?? []).map((history) => ({
      ...history,
      grammar_id: row.grammar_id,
      grammar: grammarById.get(row.grammar_id),
    })))
    .sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime())
    .slice(0, limit);
}

export const learningService = {
  async getProgressMap(userId?: string | null): Promise<Map<string, UnifiedProgressRow>> {
    if (userId && !remoteProgressUnavailable) {
      try {
        return await progressService.getProgressMap(userId) as Map<string, UnifiedProgressRow>;
      } catch {
        fallbackToLocalProgress();
      }
    }
    return localProgressService.getMap() as Map<string, UnifiedProgressRow>;
  },

  async getByGrammar(grammarId: string, userId?: string | null): Promise<UnifiedProgressRow | null> {
    const canonicalId = canonicalGrammarId(grammarId);
    if (userId && !remoteProgressUnavailable) {
      try {
        return await progressService.getByGrammar(userId, canonicalId);
      } catch {
        fallbackToLocalProgress();
      }
    }
    return localProgressService.getByGrammar(canonicalId);
  },

  async startLearning(grammarId: string, userId?: string | null) {
    const canonicalId = canonicalGrammarId(grammarId);
    if (userId && !remoteProgressUnavailable) {
      try {
        return await progressService.startLearning(userId, canonicalId);
      } catch {
        fallbackToLocalProgress();
      }
    }
    return localProgressService.startLearning(canonicalId);
  },

  async recordReview(grammarId: string, rating: ReviewRating, userId?: string | null) {
    const canonicalId = canonicalGrammarId(grammarId);
    if (userId && !remoteProgressUnavailable) {
      try {
        return await progressService.recordReview(userId, canonicalId, rating);
      } catch {
        fallbackToLocalProgress();
      }
    }
    return localProgressService.recordReview(canonicalId, rating);
  },

  async toggleFavorite(grammarId: string, userId?: string | null) {
    const canonicalId = canonicalGrammarId(grammarId);
    if (userId && !remoteProgressUnavailable) {
      try {
        return await progressService.toggleFavorite(userId, canonicalId);
      } catch {
        fallbackToLocalProgress();
      }
    }
    return localProgressService.toggleFavorite(canonicalId);
  },

  async getNewStudyCards(level: JLPTLevel | "all", userId?: string | null): Promise<GrammarEntry[]> {
    const [rows, progressMap] = await Promise.all([
      level === "all" ? grammarService.getAll(userId) : grammarService.getByLevel(level, userId),
      this.getProgressMap(userId),
    ]);
    return rows
      .map(toGrammarEntry)
      .filter((grammar) => {
        const progress = progressFor(progressMap, grammar.id);
        return !progress || progress.review_count === 0;
      });
  },

  async getDueForReview(userId?: string | null): Promise<ProgressWithGrammar[]> {
    if (userId && !remoteProgressUnavailable) {
      try {
        const [rows, progress] = await Promise.all([
          grammarService.getAll(userId),
          progressService.getDueForReview(userId),
        ]);
        return attachGrammar(progress, rows.map(toGrammarEntry)).sort((a, b) =>
          new Date(a.next_review_at ?? 0).getTime() - new Date(b.next_review_at ?? 0).getTime()
        );
      } catch {
        fallbackToLocalProgress();
      }
    }

    return getLocalDueForReview();
  },

  async getFavorites(userId?: string | null): Promise<ProgressWithGrammar[]> {
    if (userId && !remoteProgressUnavailable) {
      try {
        const [rows, progress] = await Promise.all([
          grammarService.getAll(userId),
          progressService.getFavorites(userId),
        ]);
        return attachGrammar(progress, rows.map(toGrammarEntry));
      } catch {
        fallbackToLocalProgress();
      }
    }
    return getLocalFavorites();
  },

  async getDailyStats(userId?: string | null) {
    if (userId && !remoteProgressUnavailable) {
      try {
        return await progressService.getDailyStats(userId);
      } catch {
        fallbackToLocalProgress();
      }
    }

    return getLocalDailyStats();
  },

  async getLevelProgress(userId?: string | null) {
    const [rows, progressMap] = await Promise.all([
      grammarService.getAll(userId),
      this.getProgressMap(userId),
    ]);
    const entries = rows.map(toGrammarEntry);
    const levels: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];
    return levels.map((level) => {
      const levelEntries = entries.filter((entry) => entry.jlptLevel === level);
      const progressRows = levelEntries
        .map((entry) => progressMap.get(entry.id))
        .filter(Boolean) as UnifiedProgressRow[];
      return {
        level,
        total: levelEntries.length,
        learned: progressRows.filter((row) => row.study_status === "学习中" || row.study_status === "已掌握").length,
        mastered: progressRows.filter((row) => row.study_status === "已掌握").length,
      };
    });
  },

  async getOverallStats(userId?: string | null) {
    const progress = Array.from((await this.getProgressMap(userId)).values());
    return {
      totalLearned: progress.filter((row) => row.study_status === "学习中" || row.study_status === "已掌握").length,
      totalMastered: progress.filter((row) => row.study_status === "已掌握").length,
      totalFavorites: progress.filter((row) => row.is_favorite).length,
    };
  },

  async getRecentReviews(userId?: string | null, limit = 8) {
    if (userId && !remoteProgressUnavailable) {
      try {
        const [historyRows, grammarRows] = await Promise.all([
          progressService.getRecentReviews(userId, limit),
          grammarService.getAll(userId),
        ]);
        const grammarById = new Map(grammarRows.map((row) => {
          const entry = toGrammarEntry(row);
          return [canonicalGrammarId(entry.id), entry];
        }));
        return (historyRows as RemoteReviewHistoryRow[]).map((history) => ({
          ...history,
          grammar_id: rowGrammarKey(history),
          grammar: grammarById.get(rowGrammarKey(history)),
        }));
      } catch {
        fallbackToLocalProgress();
      }
    }
    return getLocalRecentReviews(limit);
  },

  async syncLocalProgressToRemote(userId: string) {
    if (localProgressService.wasSynced(userId)) return;
    const localRows = localProgressService.getAll();
    if (localRows.length === 0) {
      localProgressService.markSynced(userId);
      return;
    }
    try {
      await progressService.importLocalProgress(userId, localRows);
      localProgressService.markSynced(userId);
    } catch {
      fallbackToLocalProgress();
    }
  },
};
