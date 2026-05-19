export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      grammar: {
        Row: {
          id: string;
          title: string;
          slug: string;
          jlpt_level: "N1" | "N2" | "N3" | "N4" | "N5";
          source_route: "蓝宝书" | "TRY" | "一册合格" | "综合";
          grammar_type: string;
          tags: string[];
          meaning_cn: string;
          meaning_en: string;
          structure: string;
          explanation: string;
          usage_note: string;
          example_jp: string;
          example_cn: string;
          furigana: string | null;
          similar_grammar: Json;
          common_mistake: string;
          memory_tip: string;
          quiz_question: string;
          quiz_choices: Json;
          quiz_answer: string;
          quiz_explanation: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          jlpt_level: "N1" | "N2" | "N3" | "N4" | "N5";
          source_route: "蓝宝书" | "TRY" | "一册合格" | "综合";
          grammar_type: string;
          tags?: string[];
          meaning_cn: string;
          meaning_en?: string;
          structure?: string;
          explanation?: string;
          usage_note?: string;
          example_jp?: string;
          example_cn?: string;
          furigana?: string | null;
          similar_grammar?: Json;
          common_mistake?: string;
          memory_tip?: string;
          quiz_question?: string;
          quiz_choices?: Json;
          quiz_answer?: string;
          quiz_explanation?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          jlpt_level?: "N1" | "N2" | "N3" | "N4" | "N5";
          source_route?: "蓝宝书" | "TRY" | "一册合格" | "综合";
          grammar_type?: string;
          tags?: string[];
          meaning_cn?: string;
          meaning_en?: string;
          structure?: string;
          explanation?: string;
          usage_note?: string;
          example_jp?: string;
          example_cn?: string;
          furigana?: string | null;
          similar_grammar?: Json;
          common_mistake?: string;
          memory_tip?: string;
          quiz_question?: string;
          quiz_choices?: Json;
          quiz_answer?: string;
          quiz_explanation?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          streak_days: number;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          streak_days?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          streak_days?: number;
          created_at?: string;
        };
      };
      user_grammar_progress: {
        Row: {
          id: string;
          user_id: string;
          grammar_id: string;
          study_status: "未学习" | "学习中" | "已掌握";
          is_favorite: boolean;
          review_count: number;
          mastery_level: number;
          next_review_at: string | null;
          last_reviewed_at: string | null;
          last_rating: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          grammar_id: string;
          study_status?: "未学习" | "学习中" | "已掌握";
          is_favorite?: boolean;
          review_count?: number;
          mastery_level?: number;
          next_review_at?: string | null;
          last_reviewed_at?: string | null;
          last_rating?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          grammar_id?: string;
          study_status?: "未学习" | "学习中" | "已掌握";
          is_favorite?: boolean;
          review_count?: number;
          mastery_level?: number;
          next_review_at?: string | null;
          last_reviewed_at?: string | null;
          last_rating?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_stats: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          new_cards: number;
          review_cards: number;
          completed: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          new_cards?: number;
          review_cards?: number;
          completed?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          new_cards?: number;
          review_cards?: number;
          completed?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
