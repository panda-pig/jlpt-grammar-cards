import { supabase } from "@/lib/supabase";

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
      .eq("study_status", "学习中")
      .lte("next_review_at", now)
      .order("next_review_at", { ascending: true });
    if (error) throw error;
    return data as (ProgressRow & { grammar: any })[];
  },

  async upsert(progress: Record<string, unknown>) {
    const { data, error } = await (supabase
      .from("user_grammar_progress") as any)
      .upsert(progress, { onConflict: "user_id,grammar_id" })
      .select()
      .single();
    if (error) throw error;
    return data as ProgressRow;
  },

  async toggleFavorite(userId: string, grammarId: string) {
    const { data: existing } = await supabase
      .from("user_grammar_progress")
      .select("is_favorite")
      .eq("user_id", userId)
      .eq("grammar_id", grammarId)
      .single();

    const newFavorite = !(existing as any)?.is_favorite;

    const { data, error } = await supabase
      .from("user_grammar_progress")
      .upsert(
        {
          user_id: userId,
          grammar_id: grammarId,
          is_favorite: newFavorite,
        } as any,
        { onConflict: "user_id,grammar_id" }
      )
      .select()
      .single();
    if (error) throw error;
    return data as ProgressRow;
  },
};
