import { canonicalGrammarId } from "@/lib/grammar-dedupe";

const STORAGE_KEY = "jlpt-user-grammar-library:v1";

type LocalUserGrammarStore = Record<string, {
  hidden: string[];
  items: Record<string, any>;
}>;

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function emptyStore(): LocalUserGrammarStore {
  return {};
}

function readStore(): LocalUserGrammarStore {
  if (!canUseStorage()) return emptyStore();
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return emptyStore();
  }
}

function writeStore(store: LocalUserGrammarStore) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function userBucket(store: LocalUserGrammarStore, userId: string) {
  const key = userId || "local";
  store[key] ??= { hidden: [], items: {} };
  store[key].hidden ??= [];
  store[key].items ??= {};
  return store[key];
}

function nowIso() {
  return new Date().toISOString();
}

function makeLocalSourceKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `user:local:${crypto.randomUUID()}`;
  }
  return `user:local:${Date.now()}`;
}

export const localGrammarLibraryService = {
  getItems(userId: string) {
    const store = readStore();
    return Object.values(userBucket(store, userId).items);
  },

  getHiddenIds(userId: string) {
    const store = readStore();
    return new Set(userBucket(store, userId).hidden.map(canonicalGrammarId));
  },

  getMeta(userId: string) {
    const store = readStore();
    const bucket = userBucket(store, userId);
    return {
      privateCount: Object.keys(bucket.items).length,
      hiddenCount: bucket.hidden.length,
      overrideCount: 0,
    };
  },

  createItem(userId: string, entry: Record<string, unknown>) {
    const store = readStore();
    const bucket = userBucket(store, userId);
    const sourceKey = String(entry.source_key ?? makeLocalSourceKey());
    const timestamp = nowIso();
    const row = {
      id: sourceKey,
      source_route: "综合",
      tags: [],
      similar_grammar: [],
      quiz_choices: [],
      common_mistake: "",
      common_mistake_zh: "",
      common_mistake_en: "",
      memory_tip: "",
      memory_tip_zh: "",
      memory_tip_en: "",
      quiz_question: "",
      quiz_answer: "",
      quiz_explanation: "",
      furigana: "",
      created_at: timestamp,
      updated_at: timestamp,
      ...entry,
      source_key: sourceKey,
      is_system: false,
      is_user_created: true,
      user_id: userId,
    };
    bucket.items[sourceKey] = row;
    writeStore(store);
    return row;
  },

  hide(userId: string, grammarSourceKey: string) {
    const store = readStore();
    const bucket = userBucket(store, userId);
    const canonicalId = canonicalGrammarId(grammarSourceKey);
    if (!bucket.hidden.includes(canonicalId)) bucket.hidden.push(canonicalId);
    writeStore(store);
  },

  restore(userId: string, grammarSourceKey: string) {
    const store = readStore();
    const bucket = userBucket(store, userId);
    const canonicalId = canonicalGrammarId(grammarSourceKey);
    bucket.hidden = bucket.hidden.filter((id) => id !== canonicalId);
    writeStore(store);
  },
};
