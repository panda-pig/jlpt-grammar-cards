import { describe, it, expect } from "vitest";
import {
  computeRetentionByInterval,
  computeWeakGrammar,
  isRemembered,
  isForgotten,
  type ReviewAnalyticsRow,
} from "@/lib/reviewAnalytics";

function row(partial: Partial<ReviewAnalyticsRow> & { rating: string }): ReviewAnalyticsRow {
  return { grammarId: "g1", interval: 1, reviewedAt: "2026-06-01T00:00:00Z", ...partial };
}

describe("rating normalization", () => {
  it("accepts zh labels and en keys", () => {
    expect(isRemembered("记住了")).toBe(true);
    expect(isRemembered("Easy")).toBe(true);
    expect(isForgotten("忘记了")).toBe(true);
    expect(isForgotten("Hard")).toBe(true);
    expect(isRemembered("???")).toBe(false);
    expect(isForgotten("???")).toBe(false);
  });
});

describe("computeRetentionByInterval", () => {
  it("buckets by interval and computes a 0-100 rate", () => {
    const rows = [
      row({ rating: "记住了", interval: 1 }),
      row({ rating: "忘记了", interval: 1 }),
      row({ rating: "很简单", interval: 7 }),
      row({ rating: "Good", interval: 20 }),
    ];
    const buckets = computeRetentionByInterval(rows);
    const byKey = Object.fromEntries(buckets.map((b) => [b.key, b]));
    expect(byKey.d1.total).toBe(2);
    expect(byKey.d1.rate).toBe(50);
    expect(byKey.d4_7.rate).toBe(100);
    expect(byKey.d15p.rate).toBe(100);
  });

  it("returns null rate for empty buckets and skips unknown ratings / bad intervals", () => {
    const buckets = computeRetentionByInterval([
      row({ rating: "???", interval: 1 }),
      row({ rating: "记住了", interval: -5 }),
      row({ rating: "记住了", interval: Number.NaN }),
    ]);
    expect(buckets.every((b) => b.rate === null && b.total === 0)).toBe(true);
  });

  it("puts same-day reviews in d0", () => {
    const buckets = computeRetentionByInterval([row({ rating: "记住了", interval: 0 })]);
    expect(buckets.find((b) => b.key === "d0")!.total).toBe(1);
  });
});

describe("computeWeakGrammar", () => {
  const rows: ReviewAnalyticsRow[] = [
    // g1: 3 reviews, 2 misses → 67%
    row({ grammarId: "g1", rating: "忘记了", reviewedAt: "2026-06-01T00:00:00Z" }),
    row({ grammarId: "g1", rating: "有点模糊", reviewedAt: "2026-06-02T00:00:00Z" }),
    row({ grammarId: "g1", rating: "记住了", reviewedAt: "2026-06-03T00:00:00Z" }),
    // g2: 2 reviews, 1 miss → 50%
    row({ grammarId: "g2", rating: "Again", reviewedAt: "2026-06-01T00:00:00Z" }),
    row({ grammarId: "g2", rating: "Good", reviewedAt: "2026-06-04T00:00:00Z" }),
    // g3: 2 reviews, 0 misses → excluded
    row({ grammarId: "g3", rating: "记住了" }),
    row({ grammarId: "g3", rating: "很简单" }),
    // g4: 1 review, 1 miss → below minReviews, excluded
    row({ grammarId: "g4", rating: "忘记了" }),
  ];

  it("ranks by fail rate and excludes clean/under-sampled items", () => {
    const weak = computeWeakGrammar(rows, 2);
    expect(weak.map((w) => w.grammarId)).toEqual(["g1", "g2"]);
    expect(weak[0].failRate).toBe(67);
    expect(weak[1].failRate).toBe(50);
  });

  it("tracks the most recent review date per item", () => {
    const weak = computeWeakGrammar(rows, 2);
    expect(weak.find((w) => w.grammarId === "g2")!.lastReviewedAt).toBe("2026-06-04T00:00:00Z");
  });

  it("respects the limit", () => {
    expect(computeWeakGrammar(rows, 2, 1)).toHaveLength(1);
  });
});
