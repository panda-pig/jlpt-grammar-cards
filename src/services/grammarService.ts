import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import type { Database } from "@/lib/database.types";
import grammarData from "@/data/grammar.json";
import { canonicalGrammarId, grammarIdFromSlug } from "@/lib/grammar-dedupe";
import { localGrammarLibraryService } from "./localGrammarLibraryService";

type GrammarRow = Database["public"]["Tables"]["grammar"]["Row"];
type GrammarInsert = Database["public"]["Tables"]["grammar"]["Insert"];
type GrammarUpdate = Database["public"]["Tables"]["grammar"]["Update"];
type UserGrammarOverride = Database["public"]["Tables"]["user_grammar_overrides"]["Row"];
type UserGrammarItem = Database["public"]["Tables"]["user_grammar_items"]["Row"];

type GrammarDeckRow = GrammarRow & {
  user_id?: string | null;
  deleted_at?: string | null;
  is_user_created?: boolean;
  base_grammar_key?: string | null;
};

const localGrammarData = grammarData as unknown as GrammarRow[];
const localGrammarById = new Map(localGrammarData.map((item: any) => [String(item.id), item]));
const localOrderById = new Map(localGrammarData.map((item: any, index) => [String(item.id), index]));

const cachedRemoteDeckByUser = new Map<string, { deck: GrammarDeckRow[]; cachedAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

const OVERRIDABLE_FIELDS = [
  "title",
  "slug",
  "jlpt_level",
  "source_route",
  "grammar_type",
  "tags",
  "meaning_cn",
  "meaning_zh",
  "meaning_en",
  "structure",
  "explanation",
  "explanation_zh",
  "explanation_en",
  "usage_note",
  "usage_note_zh",
  "usage_note_en",
  "example_jp",
  "example_cn",
  "example_zh",
  "example_en",
  "furigana",
  "similar_grammar",
  "common_mistake",
  "common_mistake_zh",
  "common_mistake_en",
  "memory_tip",
  "memory_tip_zh",
  "memory_tip_en",
  "quiz_question",
  "quiz_choices",
  "quiz_answer",
  "quiz_explanation",
] as const;

function normalizeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function sourceKeyFor(row: Partial<GrammarRow> & { id?: string }) {
  return String(row.source_key ?? row.id ?? "");
}

function findLocalBySlug(slug: string) {
  const normalized = normalizeSlug(slug);
  const found = localGrammarData.find((item: any) => item.slug === normalized || item.slug === slug);
  if (found) return found;

  const slugId = grammarIdFromSlug(normalized) ?? grammarIdFromSlug(slug);
  if (!slugId) return undefined;

  const canonicalId = canonicalGrammarId(slugId);
  return localGrammarById.get(canonicalId);
}

function mergeOverride(row: GrammarRow, override?: UserGrammarOverride): GrammarDeckRow | null {
  const sourceKey = sourceKeyFor(row);
  if (!override) return { ...row, source_key: sourceKey, is_user_created: false };
  if (override.hidden) return null;

  const merged: Record<string, unknown> = {
    ...row,
    source_key: sourceKey,
    is_user_created: false,
  };

  for (const field of OVERRIDABLE_FIELDS) {
    const value = override[field];
    if (value !== null && value !== undefined) merged[field] = value;
  }

  return merged as GrammarDeckRow;
}

function normalizeUserItem(row: UserGrammarItem): GrammarDeckRow {
  return {
    ...(row as unknown as GrammarRow),
    source_key: row.source_key,
    is_system: false,
    is_user_created: true,
    user_id: row.user_id,
    deleted_at: row.deleted_at,
  };
}

function sortDeckRows(rows: GrammarDeckRow[]) {
  return rows.sort((left, right) => {
    const leftKey = sourceKeyFor(left);
    const rightKey = sourceKeyFor(right);
    const leftOrder = localOrderById.get(leftKey) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = localOrderById.get(rightKey) ?? Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return (left.created_at ?? "").localeCompare(right.created_at ?? "");
  });
}

async function getRemoteDeck(userId: string): Promise<GrammarDeckRow[]> {
  const now = Date.now();
  const cache = cachedRemoteDeckByUser.get(userId);
  if (cache && now - cache.cachedAt < CACHE_TTL_MS) {
    const hiddenIds = localGrammarLibraryService.getHiddenIds(userId);
    return cache.deck.filter((row) => !hiddenIds.has(canonicalGrammarId(String(row.source_key ?? row.id))));
  }

  const [grammarResult, overridesResult, userItemsResult] = await Promise.all([
    supabase.from("grammar").select("*"),
    (supabase.from("user_grammar_overrides") as any).select("*").eq("user_id", userId),
    (supabase
      .from("user_grammar_items") as any)
      .select("*")
      .eq("user_id", userId)
      .is("deleted_at", null),
  ]);

  if (grammarResult.error) throw grammarResult.error;
  if (overridesResult.error) throw overridesResult.error;
  if (userItemsResult.error) throw userItemsResult.error;
  if (!grammarResult.data || grammarResult.data.length === 0) {
    throw new Error("Remote grammar deck is empty");
  }

  const overridesByKey = new Map(
    ((overridesResult.data ?? []) as UserGrammarOverride[]).map((override) => [override.grammar_source_key, override])
  );
  const systemRows = (grammarResult.data as GrammarRow[])
    .map((row) => mergeOverride(row, overridesByKey.get(sourceKeyFor(row))))
    .filter(Boolean) as GrammarDeckRow[];
  const userRows = ((userItemsResult.data ?? []) as UserGrammarItem[]).map((row) => normalizeUserItem(row));

  const fullDeck = sortDeckRows([...systemRows, ...userRows]);
  cachedRemoteDeckByUser.set(userId, { deck: fullDeck, cachedAt: Date.now() });

  const hiddenIds = localGrammarLibraryService.getHiddenIds(userId);
  return fullDeck.filter((row) => !hiddenIds.has(canonicalGrammarId(String(row.source_key ?? row.id))));
}

function fallbackLocalDeck(userId?: string | null) {
  if (!userId) return localGrammarData;
  const hiddenIds = localGrammarLibraryService.getHiddenIds(userId);
  const systemRows = localGrammarData
    .filter((row: any) => !hiddenIds.has(canonicalGrammarId(String(row.source_key ?? row.id))))
    .map((row: any) => ({
      ...row,
      source_key: String(row.source_key ?? row.id),
      is_user_created: false,
    }));
  const userRows = localGrammarLibraryService.getItems(userId);
  return sortDeckRows([...systemRows, ...userRows] as GrammarDeckRow[]);
}

function clearGrammarCache() {
  cachedRemoteDeckByUser.clear();
}

export const grammarService = {
  _clearCache: clearGrammarCache,

  async getUserLibraryStatus() {
    const checks = {
      grammarStableKeys: false,
      userOverrides: false,
      userItems: false,
    };

    const grammarCheck = await supabase
      .from("grammar")
      .select("source_key")
      .limit(1);
    checks.grammarStableKeys = !grammarCheck.error;

    const overridesCheck = await (supabase.from("user_grammar_overrides") as any)
      .select("id")
      .limit(1);
    checks.userOverrides = !overridesCheck.error;

    const userItemsCheck = await (supabase.from("user_grammar_items") as any)
      .select("id")
      .limit(1);
    checks.userItems = !userItemsCheck.error;

    return {
      ready: checks.grammarStableKeys && checks.userOverrides && checks.userItems,
      checks,
      errors: {
        grammarStableKeys: grammarCheck.error?.message ?? null,
        userOverrides: overridesCheck.error?.message ?? null,
        userItems: userItemsCheck.error?.message ?? null,
      },
    };
  },

  async getAll(userId?: string | null) {
    if (!userId) return fallbackLocalDeck();
    try {
      return await getRemoteDeck(userId);
    } catch {
      return fallbackLocalDeck(userId);
    }
  },

  async getBySlug(slug: string, userId?: string | null) {
    const normalized = normalizeSlug(slug);

    if (userId) {
      const deck = await this.getAll(userId);
      const found = deck.find((item: any) => item.slug === normalized || item.slug === slug);
      if (found) return found as GrammarDeckRow;
    }

    const localFound = findLocalBySlug(normalized);
    if (localFound) return localFound as GrammarRow;

    const { data, error } = await supabase.from("grammar").select("*").eq("slug", normalized).single();
    if (error) throw error;
    return data as GrammarRow;
  },

  async getByLevel(level: string, userId?: string | null) {
    const deck = await this.getAll(userId);
    return deck.filter((item: any) => item.jlptLevel === level || item.jlpt_level === level);
  },

  async search(query: string, userId?: string | null) {
    const normalized = query.toLowerCase();
    const deck = await this.getAll(userId);
    return deck.filter((item: any) =>
      item.title?.toLowerCase().includes(normalized) ||
      item.meaningCn?.toLowerCase().includes(normalized) ||
      item.meaning_cn?.toLowerCase().includes(normalized) ||
      item.meaning_zh?.toLowerCase().includes(normalized) ||
      item.meaning_en?.toLowerCase().includes(normalized)
    );
  },

  async create(entry: GrammarInsert | Record<string, unknown>) {
    const { data, error } = await (supabase.from("grammar") as any).insert(entry).select().single();
    if (error) throw error;
    clearGrammarCache();
    return data as GrammarRow;
  },

  async update(id: string, entry: GrammarUpdate | Record<string, unknown>) {
    const { data, error } = await (supabase.from("grammar") as any).update(entry).eq("id", id).select().single();
    if (error) throw error;
    clearGrammarCache();
    return data as GrammarRow;
  },

  async delete(id: string) {
    const { error } = await supabase.from("grammar").delete().eq("id", id);
    if (error) throw error;
    clearGrammarCache();
  },

  async upsertUserOverride(
    userId: string,
    grammarSourceKey: string,
    updates: Partial<UserGrammarOverride>
  ) {
    const { data, error } = await (supabase.from("user_grammar_overrides") as any)
      .upsert(
        {
          ...updates,
          user_id: userId,
          grammar_source_key: canonicalGrammarId(grammarSourceKey),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,grammar_source_key" }
      )
      .select()
      .single();
    if (error) throw error;
    clearGrammarCache();
    return data as UserGrammarOverride;
  },

  async hideForUser(userId: string, grammarSourceKey: string) {
    try {
      return await this.upsertUserOverride(userId, grammarSourceKey, { hidden: true });
    } catch {
      localGrammarLibraryService.hide(userId, grammarSourceKey);
      return null;
    }
  },

  async restoreForUser(userId: string, grammarSourceKey: string) {
    try {
      return await this.upsertUserOverride(userId, grammarSourceKey, { hidden: false });
    } catch {
      localGrammarLibraryService.restore(userId, grammarSourceKey);
      return null;
    }
  },

  async createUserItem(userId: string, entry: Record<string, unknown>) {
    try {
      const { data, error } = await (supabase.from("user_grammar_items") as any)
        .insert({
          ...entry,
          user_id: userId,
          source_key: entry.source_key ?? `user:${crypto.randomUUID()}`,
        })
        .select()
        .single();
      if (error) throw error;
      clearGrammarCache();
      return normalizeUserItem(data as UserGrammarItem);
    } catch {
      return localGrammarLibraryService.createItem(userId, entry) as unknown as GrammarDeckRow;
    }
  },

  getLocalUserLibraryMeta(userId: string) {
    return localGrammarLibraryService.getMeta(userId);
  },

  async getHiddenItems(userId: string): Promise<GrammarDeckRow[]> {
    const { data: overrides, error } = await (supabase.from("user_grammar_overrides") as any)
      .select("*")
      .eq("user_id", userId)
      .eq("hidden", true);
    if (error || !overrides?.length) return [];
    const hiddenKeys = new Set((overrides as UserGrammarOverride[]).map((o) => o.grammar_source_key));
    const { data: grammarRows } = await supabase.from("grammar").select("*");
    if (!grammarRows) return [];
    return (grammarRows as GrammarRow[])
      .filter((row) => hiddenKeys.has(canonicalGrammarId(sourceKeyFor(row))))
      .map((row) => ({ ...row, source_key: sourceKeyFor(row), is_user_created: false }));
  },

  async getHiddenCount(userId: string): Promise<number> {
    const { count, error } = await (supabase.from("user_grammar_overrides") as any)
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("hidden", true);
    if (error) return localGrammarLibraryService.getMeta(userId).hiddenCount;
    return count ?? 0;
  },

  async updateUserItem(userId: string, sourceKey: string, entry: Record<string, unknown>) {
    const { data, error } = await (supabase.from("user_grammar_items") as any)
      .update({ ...entry, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("source_key", sourceKey)
      .select()
      .single();
    if (error) throw error;
    clearGrammarCache();
    return normalizeUserItem(data as UserGrammarItem);
  },

  async deleteUserItem(userId: string, sourceKey: string) {
    const { error } = await (supabase
      .from("user_grammar_items") as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("source_key", sourceKey);
    if (error) throw error;
    clearGrammarCache();
  },
};
