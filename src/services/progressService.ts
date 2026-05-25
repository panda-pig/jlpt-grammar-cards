import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { canonicalGrammarId } from "@/lib/grammar-dedupe";
import { calculateSM2, ratingToQuality } from "@/lib/sm2";
import type { ReviewRating } from "@/lib/types";

export interface ProgressRow {
  id: string;
  user_id: string;
  grammar_id: string;
  grammar_key: string;
  study_status: string;
  is_favorite: boolean;
  review_count: number;
  mastery_level: number;
  interval: number;
  repetition: number;
  ease_factor: number;
  next_review_at: string | null;
  last_reviewed_at: string | null;
  last_rating: string | null;
  created_at: string;
  updated_at: string;
}

export interface RemoteReviewHistoryRow {
  id: string;
  user_id: string;
  grammar_id: string;
  grammar_key: string;
  rating: string;
  reviewed_at: string;
  interval: number;
  repetition: number;
  ease_factor: number;
  next_review_at: string | null;
  created_at: string;
}

const RATING_LABELS = {
  1: "忘记了",
  2: "有点模糊",
  3: "记住了",
  4: "很简单",
} as const;

type RatingLabel = (typeof RATING_LABELS)[keyof typeof RATING_LABELS];

function ratingLabel(rating: ReviewRating): RatingLabel {
  return RATING_LABELS[rating];
}

const SM2_DEFAULTS = { interval: 0, repetition: 0, easeFactor: 2.5 };

function normalizeProgressRow(row: any): ProgressRow {
  const grammarKey = canonicalGrammarId(String(row.grammar_key ?? row.grammar_id));
  return {
    ...row,
    grammar_id: grammarKey,
    grammar_key: grammarKey,
    interval: row.interval ?? 0,
    repetition: row.repetition ?? row.review_count ?? 0,
    ease_factor: row.ease_factor ?? 2.5,
  } as ProgressRow;
}

function normalizeHistoryRow(row: any): RemoteReviewHistoryRow {
  const grammarKey = canonicalGrammarId(String(row.grammar_key ?? row.grammar_id));
  return {
    ...row,
    grammar_id: grammarKey,
    grammar_key: grammarKey,
  } as RemoteReviewHistoryRow;
}

function progressPayload(userId: string, grammarId: string, values: Record<string, unknown>) {
  const grammarKey = canonicalGrammarId(grammarId);
  return {
    ...values,
    user_id: userId,
    grammar_id: null,
    grammar_key: grammarKey,
  };
}

export const progressService = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from("user_grammar_progress")
      .select("*")
      .eq("user_id", userId);
    if (error) throw error;
    return (data ?? []).map(normalizeProgressRow);
  },

  async getProgressMap(userId: string) {
    const rows = await this.getByUser(userId);
    return new Map(rows.map((row) => [row.grammar_key, row]));
  },

  async getDueForReview(userId: string) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("user_grammar_progress")
      .select("*")
      .eq("user_id", userId)
      .in("study_status", ["学习中", "已掌握"])
      .gt("review_count", 0)
      .lte("next_review_at", now)
      .order("next_review_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(normalizeProgressRow);
  },

  async getDueCount(userId: string): Promise<number> {
    const now = new Date().toISOString();
    const { count, error } = await supabase
      .from("user_grammar_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("study_status", ["学习中", "已掌握"])
      .gt("review_count", 0)
      .lte("next_review_at", now);
    if (error) return 0;
    return count ?? 0;
  },

  async getByGrammar(userId: string, grammarId: string) {
    const canonicalId = canonicalGrammarId(grammarId);
    const { data, error } = await supabase
      .from("user_grammar_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("grammar_key", canonicalId)
      .maybeSingle();
    if (error || !data) return null;
    return normalizeProgressRow(data);
  },

  async startLearning(userId: string, grammarId: string) {
    const canonicalId = canonicalGrammarId(grammarId);
    const existing = await this.getByGrammar(userId, canonicalId);
    if (existing && existing.study_status !== "未学习") return existing;

    const record = progressPayload(userId, canonicalId, {
      study_status: "学习中",
      is_favorite: existing?.is_favorite ?? false,
      review_count: 0,
      mastery_level: 0,
      next_review_at: new Date().toISOString(),
      last_reviewed_at: null,
      last_rating: null,
      interval: existing?.interval ?? 0,
      repetition: existing?.repetition ?? 0,
      ease_factor: existing?.ease_factor ?? 2.5,
    });

    const { data, error } = await (supabase
      .from("user_grammar_progress") as any)
      .upsert(record, { onConflict: "user_id,grammar_key" })
      .select()
      .single();
    if (error) throw error;
    return normalizeProgressRow(data);
  },

  async startLearningBatch(userId: string, grammarIds: string[]) {
    for (const grammarId of grammarIds) {
      await this.startLearning(userId, grammarId);
    }
  },

  async recordReview(
    userId: string,
    grammarId: string,
    rating: ReviewRating
  ) {
    const canonicalId = canonicalGrammarId(grammarId);
    const existing = await this.getByGrammar(userId, canonicalId);
    const prevSM2 = {
      interval: existing?.interval ?? SM2_DEFAULTS.interval,
      repetition: existing?.repetition ?? SM2_DEFAULTS.repetition,
      easeFactor: existing?.ease_factor ?? SM2_DEFAULTS.easeFactor,
      nextReviewDate: new Date(existing?.next_review_at ?? Date.now()),
    };

    const quality = ratingToQuality(ratingLabel(rating));
    const sm2 = calculateSM2(quality, prevSM2);

    const newReviewCount = (existing?.review_count ?? 0) + 1;
    const newMasteryLevel = Math.min(
      100,
      Math.round(((existing?.mastery_level ?? 0) * (newReviewCount - 1) + quality * 20) / newReviewCount)
    );

    const newStatus: "学习中" | "已掌握" =
      sm2.interval >= 21 && newMasteryLevel >= 80 ? "已掌握" : "学习中";
    const reviewedAt = new Date().toISOString();

    const record = progressPayload(userId, canonicalId, {
      study_status: newStatus,
      is_favorite: existing?.is_favorite ?? false,
      review_count: newReviewCount,
      mastery_level: newMasteryLevel,
      next_review_at: sm2.nextReviewDate.toISOString(),
      last_reviewed_at: reviewedAt,
      last_rating: ratingLabel(rating),
      interval: sm2.interval,
      repetition: sm2.repetition,
      ease_factor: sm2.easeFactor,
    });

    const { data, error } = await (supabase
      .from("user_grammar_progress") as any)
      .upsert(record, { onConflict: "user_id,grammar_key" })
      .select()
      .single();
    if (error) throw error;

    const today = new Date().toISOString().split("T")[0];
    const { data: existingStats } = await (supabase
      .from("daily_stats") as any)
      .select("completed")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    await (supabase.from("daily_stats") as any).upsert(
      {
        user_id: userId,
        date: today,
        completed: (existingStats?.completed ?? 0) + 1,
      },
      { onConflict: "user_id,date" }
    );

    await (supabase.from("review_history") as any).insert({
      user_id: userId,
      grammar_id: null,
      grammar_key: canonicalId,
      rating: ratingLabel(rating),
      reviewed_at: reviewedAt,
      interval: sm2.interval,
      repetition: sm2.repetition,
      ease_factor: sm2.easeFactor,
      next_review_at: sm2.nextReviewDate.toISOString(),
    }).then(() => undefined, () => undefined);

    return normalizeProgressRow(data);
  },

  async toggleFavorite(userId: string, grammarId: string) {
    const canonicalId = canonicalGrammarId(grammarId);
    const existing = await this.getByGrammar(userId, canonicalId);
    const newFavorite = !existing?.is_favorite;

    const { data, error } = await (supabase
      .from("user_grammar_progress") as any)
      .upsert(
        progressPayload(userId, canonicalId, {
          is_favorite: newFavorite,
          study_status: existing?.study_status ?? "未学习",
          review_count: existing?.review_count ?? 0,
          mastery_level: existing?.mastery_level ?? 0,
          interval: existing?.interval ?? 0,
          repetition: existing?.repetition ?? 0,
          ease_factor: existing?.ease_factor ?? 2.5,
          next_review_at: existing?.next_review_at ?? null,
          last_reviewed_at: existing?.last_reviewed_at ?? null,
          last_rating: existing?.last_rating ?? null,
        }),
        { onConflict: "user_id,grammar_key" }
      )
      .select()
      .single();
    if (error) throw error;
    return normalizeProgressRow(data);
  },

  async getDailyStats(userId: string) {
    const today = new Date().toISOString().split("T")[0];

    const { data: todayStats } = await (supabase
      .from("daily_stats") as any)
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    const dueCount = await this.getDueCount(userId);

    const { data: allStats } = await (supabase
      .from("daily_stats") as any)
      .select("date")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    let streakDays = 0;
    if (allStats) {
      const todayDate = new Date(today);
      for (let i = 0; i < allStats.length; i++) {
        const expected = new Date(todayDate);
        expected.setDate(expected.getDate() - i);
        const expectedStr = expected.toISOString().split("T")[0];
        if (allStats.some((s: any) => s.date === expectedStr)) {
          streakDays++;
        } else if (i > 0) {
          break;
        }
      }
    }

    return {
      todayDue: dueCount,
      todayNew: todayStats?.new_cards ?? 0,
      todayCompleted: todayStats?.completed ?? 0,
      streakDays,
    };
  },

  async getFavorites(userId: string) {
    const { data, error } = await supabase
      .from("user_grammar_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("is_favorite", true);
    if (error) throw error;
    return (data ?? []).map(normalizeProgressRow);
  },

  async getRecentReviews(userId: string, limit = 8) {
    const { data, error } = await (supabase.from("review_history") as any)
      .select("*")
      .eq("user_id", userId)
      .order("reviewed_at", { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data ?? []).map(normalizeHistoryRow);
  },

  async importLocalProgress(userId: string, rows: Array<{
    grammar_id: string;
    study_status: string;
    is_favorite: boolean;
    review_count: number;
    mastery_level: number;
    next_review_at: string | null;
    last_reviewed_at: string | null;
    last_rating: string | null;
    interval: number;
    repetition: number;
    ease_factor: number;
    review_history?: Array<{
      rating: string;
      reviewedAt: string;
      interval: number;
      repetition: number;
      easeFactor: number;
      nextReviewAt: string;
    }>;
  }>) {
    if (rows.length === 0) return;

    await (supabase.from("user_grammar_progress") as any).upsert(
      rows.map((row) => progressPayload(userId, row.grammar_id, {
        study_status: row.study_status,
        is_favorite: row.is_favorite,
        review_count: row.review_count,
        mastery_level: row.mastery_level,
        next_review_at: row.next_review_at,
        last_reviewed_at: row.last_reviewed_at,
        last_rating: row.last_rating,
        interval: row.interval,
        repetition: row.repetition,
        ease_factor: row.ease_factor,
      })),
      { onConflict: "user_id,grammar_key" }
    );

    const historyRows = rows.flatMap((row) =>
      (row.review_history ?? []).map((history) => ({
        user_id: userId,
        grammar_id: null,
        grammar_key: canonicalGrammarId(row.grammar_id),
        rating: history.rating,
        reviewed_at: history.reviewedAt,
        interval: history.interval,
        repetition: history.repetition,
        ease_factor: history.easeFactor,
        next_review_at: history.nextReviewAt,
      }))
    );

    if (historyRows.length > 0) {
      await (supabase.from("review_history") as any)
        .insert(historyRows)
        .then(() => undefined, () => undefined);
    }
  },
};
