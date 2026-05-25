import { calculateSM2, ratingToQuality } from "@/lib/sm2";
import { canonicalGrammarId, canonicalizeReviewHistory } from "@/lib/grammar-dedupe";
import type { ReviewHistoryRecord, ReviewRating } from "@/lib/types";

const STORAGE_KEY = "jlpt-grammar-progress:v1";
const SYNCED_USERS_KEY = "jlpt-grammar-progress-synced-users:v1";

const RATING_LABELS = {
  1: "忘记了",
  2: "有点模糊",
  3: "记住了",
  4: "很简单",
} as const;

export interface LocalProgressRow {
  grammar_id: string;
  study_status: "未学习" | "学习中" | "已掌握";
  is_favorite: boolean;
  review_count: number;
  mastery_level: number;
  next_review_at: string | null;
  last_reviewed_at: string | null;
  last_rating: string | null;
  interval: number;
  repetition: number;
  ease_factor: number;
  created_at: string;
  updated_at: string;
  review_history: ReviewHistoryRecord[];
}

type LocalProgressStore = Record<string, LocalProgressRow>;

function emptyStore(): LocalProgressStore {
  return {};
}

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function readStore(): LocalProgressStore {
  if (!canUseStorage()) return emptyStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return migrateStore(raw ? JSON.parse(raw) : emptyStore());
  } catch {
    return emptyStore();
  }
}

function writeStore(store: LocalProgressStore) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function nowIso() {
  return new Date().toISOString();
}

function createProgress(grammarId: string): LocalProgressRow {
  const now = nowIso();
  const canonicalId = canonicalGrammarId(grammarId);
  return {
    grammar_id: canonicalId,
    study_status: "未学习",
    is_favorite: false,
    review_count: 0,
    mastery_level: 0,
    next_review_at: null,
    last_reviewed_at: null,
    last_rating: null,
    interval: 0,
    repetition: 0,
    ease_factor: 2.5,
    created_at: now,
    updated_at: now,
    review_history: [],
  };
}

function statusRank(status: LocalProgressRow["study_status"]) {
  if (status === "已掌握") return 2;
  if (status === "学习中") return 1;
  return 0;
}

function latestDate(...values: Array<string | null | undefined>) {
  return values.filter(Boolean).sort().at(-1) ?? null;
}

function earliestDate(...values: Array<string | null | undefined>) {
  return values.filter(Boolean).sort()[0] ?? null;
}

function mergeProgressRows(a: LocalProgressRow, b: LocalProgressRow, grammarId: string): LocalProgressRow {
  const later = (a.updated_at ?? "") >= (b.updated_at ?? "") ? a : b;
  const history = [
    ...(a.review_history ?? []),
    ...(b.review_history ?? []),
  ];
  const uniqueHistory = Array.from(
    new Map(history.map((item) => [`${item.reviewedAt}:${item.rating}:${item.nextReviewAt}`, item])).values()
  ).sort((left, right) => left.reviewedAt.localeCompare(right.reviewedAt));

  return {
    ...later,
    grammar_id: grammarId,
    study_status: statusRank(a.study_status) >= statusRank(b.study_status) ? a.study_status : b.study_status,
    is_favorite: a.is_favorite || b.is_favorite,
    review_count: Math.max(a.review_count ?? 0, b.review_count ?? 0, uniqueHistory.length),
    mastery_level: Math.max(a.mastery_level ?? 0, b.mastery_level ?? 0),
    next_review_at: earliestDate(a.next_review_at, b.next_review_at),
    last_reviewed_at: latestDate(a.last_reviewed_at, b.last_reviewed_at),
    last_rating: later.last_rating,
    interval: later.interval,
    repetition: later.repetition,
    ease_factor: later.ease_factor,
    created_at: earliestDate(a.created_at, b.created_at) ?? later.created_at,
    updated_at: latestDate(a.updated_at, b.updated_at) ?? later.updated_at,
    review_history: canonicalizeReviewHistory(uniqueHistory, grammarId),
  };
}

function migrateStore(store: LocalProgressStore): LocalProgressStore {
  const migrated: LocalProgressStore = {};
  let changed = false;

  for (const [key, row] of Object.entries(store)) {
    const canonicalId = canonicalGrammarId(row.grammar_id || key);
    const nextRow: LocalProgressRow = {
      ...row,
      grammar_id: canonicalId,
      review_history: canonicalizeReviewHistory(row.review_history ?? [], canonicalId),
    };

    if (canonicalId !== key || row.grammar_id !== canonicalId) changed = true;

    migrated[canonicalId] = migrated[canonicalId]
      ? mergeProgressRows(migrated[canonicalId], nextRow, canonicalId)
      : nextRow;
  }

  if (changed) writeStore(migrated);
  return migrated;
}

function ratingLabel(rating: ReviewRating) {
  return RATING_LABELS[rating];
}

export const localProgressService = {
  getAll(): LocalProgressRow[] {
    return Object.values(readStore());
  },

  getMap(): Map<string, LocalProgressRow> {
    return new Map(this.getAll().map((row) => [row.grammar_id, row]));
  },

  getByGrammar(grammarId: string): LocalProgressRow | null {
    return readStore()[canonicalGrammarId(grammarId)] ?? null;
  },

  startLearning(grammarId: string): LocalProgressRow {
    const canonicalId = canonicalGrammarId(grammarId);
    const store = readStore();
    const existing = store[canonicalId] ?? createProgress(canonicalId);
    const next: LocalProgressRow = {
      ...existing,
      study_status: existing.study_status === "已掌握" ? "已掌握" : "学习中",
      next_review_at: existing.next_review_at ?? nowIso(),
      updated_at: nowIso(),
    };
    store[canonicalId] = next;
    writeStore(store);
    return next;
  },

  startLearningBatch(grammarIds: string[]) {
    grammarIds.forEach((grammarId) => this.startLearning(grammarId));
  },

  recordReview(grammarId: string, rating: ReviewRating): LocalProgressRow {
    const canonicalId = canonicalGrammarId(grammarId);
    const store = readStore();
    const existing = store[canonicalId] ?? this.startLearning(canonicalId);
    const quality = ratingToQuality(ratingLabel(rating));
    const sm2 = calculateSM2(quality, {
      interval: existing.interval ?? 0,
      repetition: existing.repetition ?? existing.review_count ?? 0,
      easeFactor: existing.ease_factor ?? 2.5,
      nextReviewDate: new Date(existing.next_review_at ?? Date.now()),
    });
    const reviewedAt = nowIso();
    const reviewCount = (existing.review_count ?? 0) + 1;
    const masteryLevel = Math.min(
      100,
      Math.round(((existing.mastery_level ?? 0) * (reviewCount - 1) + quality * 20) / reviewCount)
    );
    const studyStatus: "学习中" | "已掌握" =
      sm2.interval >= 21 && masteryLevel >= 80 ? "已掌握" : "学习中";
    const history: ReviewHistoryRecord = {
      grammarId: canonicalId,
      rating: ratingLabel(rating),
      reviewedAt,
      interval: sm2.interval,
      repetition: sm2.repetition,
      easeFactor: sm2.easeFactor,
      nextReviewAt: sm2.nextReviewDate.toISOString(),
    };
    const next: LocalProgressRow = {
      ...existing,
      study_status: studyStatus,
      review_count: reviewCount,
      mastery_level: masteryLevel,
      next_review_at: sm2.nextReviewDate.toISOString(),
      last_reviewed_at: reviewedAt,
      last_rating: ratingLabel(rating),
      interval: sm2.interval,
      repetition: sm2.repetition,
      ease_factor: sm2.easeFactor,
      updated_at: reviewedAt,
      review_history: [...(existing.review_history ?? []), history],
    };
    store[canonicalId] = next;
    writeStore(store);
    return next;
  },

  toggleFavorite(grammarId: string): LocalProgressRow {
    const canonicalId = canonicalGrammarId(grammarId);
    const store = readStore();
    const existing = store[canonicalId] ?? createProgress(canonicalId);
    const next = {
      ...existing,
      is_favorite: !existing.is_favorite,
      updated_at: nowIso(),
    };
    store[canonicalId] = next;
    writeStore(store);
    return next;
  },

  clear() {
    if (!canUseStorage()) return;
    window.localStorage.removeItem(STORAGE_KEY);
  },

  markSynced(userId: string) {
    if (!canUseStorage()) return;
    const synced = this.getSyncedUsers();
    synced.add(userId);
    window.localStorage.setItem(SYNCED_USERS_KEY, JSON.stringify(Array.from(synced)));
  },

  wasSynced(userId: string) {
    return this.getSyncedUsers().has(userId);
  },

  getSyncedUsers(): Set<string> {
    if (!canUseStorage()) return new Set();
    try {
      return new Set(JSON.parse(window.localStorage.getItem(SYNCED_USERS_KEY) ?? "[]"));
    } catch {
      return new Set();
    }
  },
};
