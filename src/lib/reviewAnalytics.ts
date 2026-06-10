/**
 * Pro analytics computed from review history (SM-2 logs).
 * Pure functions over normalized rows so both the remote `review_history`
 * table and the local-storage history can feed them.
 */

export interface ReviewAnalyticsRow {
  grammarId: string;
  /** Rating label or key: 忘记了/有点模糊/记住了/很简单 or Again/Hard/Good/Easy. */
  rating: string;
  /** SM-2 interval (days) that scheduled this review; 0 = same-day. */
  interval: number;
  reviewedAt: string;
}

const REMEMBERED = new Set(["记住了", "很简单", "Good", "Easy", "3", "4"]);
const FORGOT = new Set(["忘记了", "有点模糊", "Again", "Hard", "1", "2"]);

export function isRemembered(rating: string): boolean {
  return REMEMBERED.has(rating.trim());
}

export function isForgotten(rating: string): boolean {
  return FORGOT.has(rating.trim());
}

/** Interval buckets for the retention (forgetting-curve) chart. */
export const RETENTION_BUCKETS = [
  { key: "d0", min: 0, max: 0 },
  { key: "d1", min: 1, max: 1 },
  { key: "d2_3", min: 2, max: 3 },
  { key: "d4_7", min: 4, max: 7 },
  { key: "d8_14", min: 8, max: 14 },
  { key: "d15p", min: 15, max: Infinity },
] as const;

export type RetentionBucketKey = (typeof RETENTION_BUCKETS)[number]["key"];

export interface RetentionBucket {
  key: RetentionBucketKey;
  total: number;
  remembered: number;
  /** 0-100, rounded; null when the bucket has no reviews. */
  rate: number | null;
}

/**
 * Retention rate per review interval: of the reviews that came due after
 * N days, how many were still remembered (rated Good/Easy)? This is the
 * practical forgetting curve an SRS can draw from its own logs.
 */
export function computeRetentionByInterval(rows: ReviewAnalyticsRow[]): RetentionBucket[] {
  const acc = new Map<RetentionBucketKey, { total: number; remembered: number }>(
    RETENTION_BUCKETS.map((b) => [b.key, { total: 0, remembered: 0 }])
  );

  for (const row of rows) {
    const interval = Number(row.interval);
    if (!Number.isFinite(interval) || interval < 0) continue;
    const known = isRemembered(row.rating);
    if (!known && !isForgotten(row.rating)) continue; // unknown label — skip
    const bucket = RETENTION_BUCKETS.find((b) => interval >= b.min && interval <= b.max);
    if (!bucket) continue;
    const slot = acc.get(bucket.key)!;
    slot.total += 1;
    if (known) slot.remembered += 1;
  }

  return RETENTION_BUCKETS.map((b) => {
    const { total, remembered } = acc.get(b.key)!;
    return {
      key: b.key,
      total,
      remembered,
      rate: total > 0 ? Math.round((remembered / total) * 100) : null,
    };
  });
}

export interface WeakGrammarStat {
  grammarId: string;
  total: number;
  forgotten: number;
  /** 0-100 rounded share of Again/Hard ratings. */
  failRate: number;
  lastReviewedAt: string;
}

/**
 * Weak-grammar ranking: items the learner keeps missing. Requires at least
 * `minReviews` reviews and one miss; sorted by fail rate, then review count.
 */
export function computeWeakGrammar(
  rows: ReviewAnalyticsRow[],
  minReviews = 2,
  limit = 8
): WeakGrammarStat[] {
  const byGrammar = new Map<string, { total: number; forgotten: number; last: string }>();

  for (const row of rows) {
    const known = isRemembered(row.rating);
    if (!known && !isForgotten(row.rating)) continue;
    const slot = byGrammar.get(row.grammarId) ?? { total: 0, forgotten: 0, last: row.reviewedAt };
    slot.total += 1;
    if (!known) slot.forgotten += 1;
    if (row.reviewedAt > slot.last) slot.last = row.reviewedAt;
    byGrammar.set(row.grammarId, slot);
  }

  return [...byGrammar.entries()]
    .filter(([, s]) => s.total >= minReviews && s.forgotten > 0)
    .map(([grammarId, s]) => ({
      grammarId,
      total: s.total,
      forgotten: s.forgotten,
      failRate: Math.round((s.forgotten / s.total) * 100),
      lastReviewedAt: s.last,
    }))
    .sort((a, b) => b.failRate - a.failRate || b.total - a.total)
    .slice(0, limit);
}
