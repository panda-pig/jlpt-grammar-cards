import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import type { Database } from "@/lib/database.types";

type GrammarRow = Database["public"]["Tables"]["grammar"]["Row"];

export const grammarService = {
  async getAll() {
    const { data, error } = await supabase.from("grammar").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data as GrammarRow[];
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase.from("grammar").select("*").eq("slug", slug).single();
    if (error) throw error;
    return data as GrammarRow;
  },

  async getByLevel(level: string) {
    const { data, error } = await supabase.from("grammar").select("*").eq("jlpt_level", level);
    if (error) throw error;
    return data as GrammarRow[];
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from("grammar")
      .select("*")
      .or(`title.ilike.%${query}%,meaning_cn.ilike.%${query}%`);
    if (error) throw error;
    return data as GrammarRow[];
  },

  async create(entry: Record<string, unknown>) {
    const { data, error } = await (supabase.from("grammar") as any).insert(entry).select().single();
    if (error) throw error;
    return data as GrammarRow;
  },

  async update(id: string, entry: Record<string, unknown>) {
    const { data, error } = await (supabase.from("grammar") as any).update(entry).eq("id", id).select().single();
    if (error) throw error;
    return data as GrammarRow;
  },

  async delete(id: string) {
    const { error } = await supabase.from("grammar").delete().eq("id", id);
    if (error) throw error;
  },
};
