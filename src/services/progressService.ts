import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { calculateSM2, ratingToQuality, getInitialSM2 } from "@/lib/sm2";
import type { ReviewRating } from "@/lib/types";

export interface ProgressRow {
  id: string;
  user_id: string;
  grammar_id: string;
  study_status: string;
  is_favorite: boolean;
  review_count: number;
  mastery_level: number;
  next_review_at: string | null;
  last_reviewed_at: string | null;
  last_rating: string | null;
  created_at: string;
  updated_at: string;
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

export const progressService = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from("user_grammar_progress")
      .select("*, grammar(*)")
      .eq("user_id", userId);
    if (error) throw error;
    return data as (ProgressRow & { grammar: any })[];
  },

  async getDueForReview(userId: string) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("user_grammar_progress")
      .select("*, grammar(*)")
      .eq("user_id", userId)
      .in("study_status", ["学习中", "未学习"])
      .lte("next_review_at", now)
      .order("next_review_at", { ascending: true });
    if (error) throw error;
    return data as (ProgressRow & { grammar: any })[];
  },

  async getDueCount(userId: string): Promise<number> {
    const now = new Date().toISOString();
    const { count, error } = await supabase
      .from("user_grammar_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("study_status", ["学习中", "未学习"])
      .lte("next_review_at", now);
    if (error) return 0;
    return count ?? 0;
  },

  async getByGrammar(userId: string, grammarId: string) {
    const { data, error } = await supabase
      .from("user_grammar_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("grammar_id", grammarId)
      .single();
    if (error) return null;
    return data as ProgressRow;
  },

  async startLearning(userId: string, grammarId: string) {
    const existing = await this.getByGrammar(userId, grammarId);
    if (existing && existing.study_status !== "未学习") return existing;

    const record = {
      user_id: userId,
      grammar_id: grammarId,
      study_status: "学习中" as const,
      is_favorite: existing?.is_favorite ?? false,
      review_count: 0,
      mastery_level: 0,
      next_review_at: new Date().toISOString(),
      last_reviewed_at: null,
      last_rating: null,
    };

    const { data, error } = await (supabase
      .from("user_grammar_progress") as any)
      .upsert(record, { onConflict: "user_id,grammar_id" })
      .select()
      .single();
    if (error) throw error;
    return data as ProgressRow;
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
    const existing = await this.getByGrammar(userId, grammarId);
    const prevSM2 = {
      interval: (existing as any)?.interval ?? SM2_DEFAULTS.interval,
      repetition: existing?.review_count ?? SM2_DEFAULTS.repetition,
      easeFactor: (existing as any)?.ease_factor ?? SM2_DEFAULTS.easeFactor,
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

    const record = {
      user_id: userId,
      grammar_id: grammarId,
      study_status: newStatus,
      is_favorite: existing?.is_favorite ?? false,
      review_count: newReviewCount,
      mastery_level: newMasteryLevel,
      next_review_at: sm2.nextReviewDate.toISOString(),
      last_reviewed_at: new Date().toISOString(),
      last_rating: ratingLabel(rating),
      interval: sm2.interval,
      repetition: sm2.repetition,
      ease_factor: sm2.easeFactor,
    };

    const { data, error } = await (supabase
      .from("user_grammar_progress") as any)
      .upsert(record, { onConflict: "user_id,grammar_id" })
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

    return data as ProgressRow;
  },

  async toggleFavorite(userId: string, grammarId: string) {
    const existing = await this.getByGrammar(userId, grammarId);
    const newFavorite = !existing?.is_favorite;

    const { data, error } = await (supabase
      .from("user_grammar_progress") as any)
      .upsert(
        {
          user_id: userId,
          grammar_id: grammarId,
          is_favorite: newFavorite,
          study_status: existing?.study_status ?? "未学习",
        },
        { onConflict: "user_id,grammar_id" }
      )
      .select()
      .single();
    if (error) throw error;
    return data as ProgressRow;
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

  async getLevelProgress(userId: string) {
    const levels = ["N5", "N4", "N3", "N2", "N1"] as const;

    const { data: progress } = await (supabase
      .from("user_grammar_progress") as any)
      .select("grammar_id, study_status, grammar!inner(jlpt_level)")
      .eq("user_id", userId);

    if (!progress) {
      return levels.map((level) => ({ level, total: 0, learned: 0 }));
    }

    return levels.map((level) => {
      const items = progress.filter(
        (p: any) => p.grammar?.jlpt_level === level
      );
      return {
        level,
        total: items.length,
        learned: items.filter((p: any) =>
          p.study_status === "学习中" || p.study_status === "已掌握"
        ).length,
      };
    });
  },

  async getFavorites(userId: string) {
    const { data, error } = await supabase
      .from("user_grammar_progress")
      .select("*, grammar(*)")
      .eq("user_id", userId)
      .eq("is_favorite", true);
    if (error) throw error;
    return data as (ProgressRow & { grammar: any })[];
  },
};
