"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { learningService } from "@/services/learningService";
import { grammarService } from "@/services/grammarService";
import { toGrammarEntry } from "@/lib/mappers";
import { canonicalGrammarId } from "@/lib/grammar-dedupe";
import { computeRetentionByInterval, computeWeakGrammar, type ReviewAnalyticsRow } from "@/lib/reviewAnalytics";
import { formatDate } from "@/lib/date";
import { ratingLabelForLocale } from "@/lib/grammar-content";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import type { UnifiedProgressRow } from "@/services/learningService";
import type { JLPTLevel } from "@/lib/types";
import {
  BookOpen, Flame, Heart, LineChart, RotateCcw, TrendingUp, WifiOff,
  Target, Zap, Award, Calendar
} from "lucide-react";

const LEVEL_COLORS: Record<string, string> = {
  N5: "#dcebd8",
  N4: "#d8e8f0",
  N3: "#cfdaf5",
  N2: "#e8e0f5",
  N1: "#f4b4a8",
};

const LEVEL_BAR_COLORS: Record<string, string> = {
  N5: "bg-[#6a8a5a]",
  N4: "bg-[#4a8a6a]",
  N3: "bg-[#4a6a8a]",
  N2: "bg-[#6a4a8a]",
  N1: "bg-[#8a4a4a]",
};

const RATING_KEYS = ["忘记了", "有点模糊", "记住了", "很简单"] as const;

function normalizeRatingKey(rating: string | null | undefined): (typeof RATING_KEYS)[number] | null {
  const aliases: Record<string, (typeof RATING_KEYS)[number]> = {
    Again: "忘记了",
    Hard: "有点模糊",
    Good: "记住了",
    Easy: "很简单",
    忘记了: "忘记了",
    有点模糊: "有点模糊",
    记住了: "记住了",
    很简单: "很简单",
  };
  return rating ? aliases[rating] ?? null : null;
}

function useDashboardData() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ todayDue: 0, todayNew: 0, todayCompleted: 0, streakDays: 0 });
  const [overall, setOverall] = useState({ totalLearned: 0, totalMastered: 0, totalFavorites: 0 });
  const [levelProgress, setLevelProgress] = useState<{ level: string; total: number; learned: number; mastered: number }[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [progressMap, setProgressMap] = useState<Map<string, UnifiedProgressRow>>(new Map());
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const [dailyStats, lvlProgress, overallStats, recent, pmap] = await Promise.all([
        learningService.getDailyStats(user?.id),
        learningService.getLevelProgress(user?.id),
        learningService.getOverallStats(user?.id),
        learningService.getRecentReviews(user?.id, 10),
        learningService.getProgressMap(user?.id),
      ]);
      setStats(dailyStats);
      setLevelProgress(lvlProgress);
      setOverall(overallStats);
      setRecentReviews(recent);
      setProgressMap(pmap);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const ratingDistribution = useMemo(() => {
    const dist = Object.fromEntries(RATING_KEYS.map((key) => [key, 0])) as Record<(typeof RATING_KEYS)[number], number>;
    for (const row of progressMap.values()) {
      const key = normalizeRatingKey(row.last_rating);
      if (key) dist[key]++;
    }
    return dist;
  }, [progressMap]);

  const weeklyTrend = useMemo(() => {
    const days = 7;
    const now = new Date();
    const trend: { label: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      trend.push({ label: key, count: 0 });
    }
    for (const row of progressMap.values()) {
      if (row.last_reviewed_at) {
        const rd = new Date(row.last_reviewed_at);
        const diff = Math.floor((now.getTime() - rd.getTime()) / (1000 * 60 * 60 * 24));
        if (diff >= 0 && diff < days) {
          trend[days - 1 - diff].count++;
        }
      }
    }
    return trend;
  }, [progressMap]);

  const masteryRate = overall.totalLearned > 0
    ? Math.round((overall.totalMastered / overall.totalLearned) * 100)
    : 0;

  return { user, stats, overall, levelProgress, recentReviews, progressMap, ratingDistribution, weeklyTrend, masteryRate, loading };
}

function KpiCard({
  icon: Icon,
  value,
  label,
  color,
  textColor = "text-[#242424]",
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  color: string;
  textColor?: string;
}) {
  return (
    <Card className={`${color} border-0 rounded-[18px] shadow-none`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className={`font-mono text-3xl font-medium ${textColor}`}>{value}</p>
            <p className={`font-mono text-xs mt-1 ${textColor} opacity-70`}>{label}</p>
          </div>
          <div className={`w-9 h-9 rounded-xl ${textColor} bg-white/40 flex items-center justify-center`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DonutChart({ percentage, label, color }: { percentage: number; label: string; color: string }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (percentage / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(36,36,36,0.08)" strokeWidth="10" />
          <circle
            cx="50" cy="50" r={r} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={c} strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-xl font-medium text-[#242424]">{percentage}%</span>
        </div>
      </div>
      <p className="font-mono text-xs text-[#797776] mt-2">{label}</p>
    </div>
  );
}

function BarChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div className="w-full relative flex items-end" style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? "4px" : "0" }}>
            <div className="w-full bg-[#242424] rounded-t-md transition-all duration-500" style={{ height: "100%", opacity: 0.5 + (i / data.length) * 0.5 }} />
          </div>
          <span className="font-mono text-[10px] text-[#797776]">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const {
    user, stats, overall, levelProgress, recentReviews,
    ratingDistribution, weeklyTrend, masteryRate, loading,
  } = useDashboardData();


  const [proRows, setProRows] = useState<ReviewAnalyticsRow[] | null>(null);
  const [grammarMeta, setGrammarMeta] = useState<Map<string, { title: string; level: JLPTLevel; slug: string }>>(new Map());
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      learningService.getReviewAnalyticsRows(user?.id),
      grammarService.getAll(user?.id).catch(() => [] as any[]),
    ]).then(([rows, grammarRows]) => {
      if (cancelled) return;
      setProRows(rows);
      const meta = new Map<string, { title: string; level: JLPTLevel; slug: string }>();
      for (const raw of grammarRows) {
        const g = toGrammarEntry(raw);
        meta.set(canonicalGrammarId(g.id), { title: g.title, level: g.jlptLevel, slug: g.slug });
      }
      setGrammarMeta(meta);
    });
    return () => { cancelled = true; };
  }, [user?.id]);

  const retention = useMemo(() => (proRows ? computeRetentionByInterval(proRows) : null), [proRows]);
  const weakItems = useMemo(() => (proRows ? computeWeakGrammar(proRows) : null), [proRows]);

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-5xl py-8 flex items-center justify-center min-h-[300px]">
          <p className="text-[#797776] font-mono text-sm">{dict.common.loading}</p>
        </div>
      </MainLayout>
    );
  }

  const totalReviews = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);
  const ratingColors: Record<(typeof RATING_KEYS)[number], string> = {
    忘记了: "#c47a6a",
    有点模糊: "#e8c178",
    记住了: "#6a8a5a",
    很简单: "#4a8a6a",
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-8">
        {!user && (
          <div className="mb-5 flex items-start gap-3 rounded-[14px] border border-[#e8c178]/50 bg-[#fff6df] px-4 py-3 text-sm text-[#4e4d4d]">
            <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-[#a08040]" />
            <p>{dict.common.localModeDesc}</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="mb-2 flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[.06em] text-[#797776]">
              <div className="h-px w-8 bg-[#242424]" />
              {new Date().toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", { month: "long", day: "numeric", weekday: "long" })}
            </div>
            <h1 className="font-serif text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.08] tracking-[-0.022em] text-black text-balance">{dict.dashboard.title}</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/${locale}/study`} className={buttonVariants({ className: "rounded-full font-mono text-xs h-8" })}>
              <Zap className="mr-1 h-3 w-3" />{dict.dashboard.continueStudy}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <KpiCard icon={BookOpen} value={stats.todayNew} label={dict.dashboard.todayNew} color="bg-[#dcebd8]" textColor="text-[#315b3b]" />
          <KpiCard icon={RotateCcw} value={stats.todayDue} label={dict.dashboard.todayReview} color="bg-[#cfdaf5]" textColor="text-[#2a3a5a]" />
          <KpiCard icon={TrendingUp} value={stats.todayCompleted} label={dict.dashboard.completionRate} color="bg-[#fff6df]" textColor="text-[#8a6a20]" />
          <KpiCard icon={Flame} value={stats.streakDays} label={dict.dashboard.streak} color="bg-[#f4b4a8]/40" textColor="text-[#7a3a30]" />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <KpiCard icon={Target} value={overall.totalLearned} label={dict.dashboard.learnedGrammar} color="bg-[#f6f3f1] border border-[rgba(36,36,36,0.12)]" />
          <KpiCard icon={Award} value={overall.totalMastered} label={dict.dashboard.masteredGrammar} color="bg-[#f6f3f1] border border-[rgba(36,36,36,0.12)]" />
          <KpiCard icon={Heart} value={overall.totalFavorites} label={dict.dashboard.favoritesCount} color="bg-[#f6f3f1] border border-[rgba(36,36,36,0.12)]" />
        </div>


        <div className="grid lg:grid-cols-[1fr_280px] gap-4 mb-6">
          <div className="space-y-4">
            <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-mono text-sm font-medium text-[#242424]">{dict.dashboard.levelProgress}</h2>
                  <span className="font-mono text-xs text-[#797776]">{overall.totalLearned} / {levelProgress.reduce((a, b) => a + b.total, 0)}</span>
                </div>
                <div className="space-y-4">
                  {levelProgress.map((lp) => {
                    const pct = lp.total > 0 ? Math.round((lp.learned / lp.total) * 100) : 0;
                    const masteredPct = lp.total > 0 ? Math.round((lp.mastered / lp.total) * 100) : 0;
                    return (
                      <div key={lp.level}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-medium" style={{ backgroundColor: LEVEL_COLORS[lp.level], color: "#242424" }}>
                              {lp.level}
                            </span>
                            <span className="font-mono text-xs text-[#797776]">{lp.learned} / {lp.total}</span>
                          </div>
                          <span className="font-mono text-xs text-[#242424]">{pct}%</span>
                        </div>
                        <div className="h-2.5 bg-[rgba(36,36,36,0.08)] rounded-full overflow-hidden">
                          <div className={`h-full ${LEVEL_BAR_COLORS[lp.level]} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                        </div>
                        {masteredPct > 0 && (
                          <p className="font-mono text-[10px] text-[#797776] mt-1">
                            {dict.dashboard.masteredLabel.replace("{count}", String(lp.mastered)).replace("{percent}", String(masteredPct))}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-mono text-sm font-medium text-[#242424]">{dict.dashboard.weeklyTrend}</h2>
                  <Calendar className="h-4 w-4 text-[#797776]" />
                </div>
                <BarChart data={weeklyTrend} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
              <CardContent className="p-5 flex flex-col items-center">
                <h2 className="font-mono text-sm font-medium text-[#242424] mb-4 self-start">{dict.dashboard.masteryRate}</h2>
                <DonutChart percentage={masteryRate} label={dict.dashboard.masteryRateLabel} color="#6a8a5a" />
                <div className="grid grid-cols-2 gap-2 w-full mt-4">
                  <div className="text-center rounded-2xl bg-[#dcebd8]/40 px-3 py-2">
                    <p className="font-mono text-lg font-medium text-[#315b3b]">{overall.totalMastered}</p>
                    <p className="font-mono text-[10px] text-[#797776]">{dict.dashboard.masteredShort}</p>
                  </div>
                  <div className="text-center rounded-2xl bg-[#cfdaf5]/40 px-3 py-2">
                    <p className="font-mono text-lg font-medium text-[#2a3a5a]">{overall.totalLearned - overall.totalMastered}</p>
                    <p className="font-mono text-[10px] text-[#797776]">{dict.dashboard.learningShort}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
              <CardContent className="p-5">
                <h2 className="font-mono text-sm font-medium text-[#242424] mb-4">{dict.dashboard.ratingDistribution}</h2>
                {totalReviews === 0 ? (
                  <p className="text-sm text-[#797776] text-center py-4">{dict.dashboard.noRatingData}</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(ratingDistribution).map(([key, count]) => {
                      const ratingKey = key as (typeof RATING_KEYS)[number];
                      const pct = Math.round((count / totalReviews) * 100);
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs text-[#242424]">{ratingLabelForLocale(ratingKey, locale)}</span>
                            <span className="font-mono text-xs text-[#797776]">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-[rgba(36,36,36,0.08)] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: ratingColors[ratingKey] }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-6">
          <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
                  <CardContent className="p-5">
                    <div className="mb-5 flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-[#315b3b]" />
                      <h2 className="font-mono text-sm font-medium text-[#242424]">{dict.dashboard.advTitle}</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Retention by interval */}
                      <div>
                        <h3 className="font-mono text-xs font-medium text-[#242424]">{dict.dashboard.advRetention}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-[#797776]">{dict.dashboard.advRetentionDesc}</p>
                        {retention === null ? (
                          <p className="mt-4 font-mono text-xs text-[#797776]">{dict.common.loading}</p>
                        ) : retention.every((b) => b.total === 0) ? (
                          <p className="mt-4 text-sm text-[#797776]">{dict.dashboard.advNoData}</p>
                        ) : (
                          <div className="mt-4 flex h-[110px] items-end gap-[6px]">
                            {retention.map((b) => (
                              <div key={b.key} className="flex flex-1 flex-col items-center gap-1">
                                <span className="font-mono text-[10px] text-[#315b3b]">
                                  {b.rate === null ? "–" : `${b.rate}%`}
                                </span>
                                <div
                                  className="w-full rounded-t-[4px] bg-[#315b3b] transition-all"
                                  style={{ height: `${b.rate === null ? 2 : Math.max(b.rate * 0.7, 3)}px`, opacity: b.rate === null ? 0.15 : 0.85 }}
                                />
                                <span className="font-mono text-[9px] text-[#797776]">
                                  {(dict.dashboard.advBuckets as Record<string, string>)[b.key]}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Weak grammar */}
                      <div>
                        <h3 className="font-mono text-xs font-medium text-[#242424]">{dict.dashboard.advWeak}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-[#797776]">{dict.dashboard.advWeakDesc}</p>
                        {weakItems === null ? (
                          <p className="mt-4 font-mono text-xs text-[#797776]">{dict.common.loading}</p>
                        ) : weakItems.length === 0 ? (
                          <p className="mt-4 text-sm text-[#797776]">{dict.dashboard.advNoData}</p>
                        ) : (
                          <div className="mt-3 space-y-1.5">
                            {weakItems.map((w) => {
                              const meta = grammarMeta.get(w.grammarId);
                              return (
                                <Link
                                  key={w.grammarId}
                                  href={meta ? `/${locale}/grammar/${meta.slug}` : `/${locale}/grammar`}
                                  className="flex items-center gap-2 rounded-[10px] border border-[#ded8d0] bg-[#f6f3f1] px-3 py-2 transition-colors hover:border-[#242424]"
                                >
                                  {meta && <LevelBadge level={meta.level} />}
                                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#242424]">
                                    {meta?.title ?? w.grammarId}
                                  </span>
                                  <span className="shrink-0 rounded-full bg-[#f4b4a8]/30 px-2 py-0.5 font-mono text-[10px] font-bold text-[#7a3a30]">
                                    {dict.dashboard.advFailRate.replace("{p}", String(w.failRate))}
                                  </span>
                                  <span className="shrink-0 font-mono text-[10px] text-[#797776]">
                                    {dict.dashboard.advReviews.replace("{n}", String(w.total))}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
        </div>

        <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none mb-6">
          <CardContent className="p-5">
            <h2 className="font-mono text-sm font-medium text-[#242424] mb-4">{dict.dashboard.recentReviews}</h2>
            {recentReviews.length === 0 ? (
              <p className="text-sm text-[#797776] py-4">{dict.dashboard.noRecentReviews}</p>
            ) : (
              <div className="space-y-2">
                {recentReviews.map((review, index) => {
                  const grammar = review.grammar ?? {};
                  const title = grammar.title ?? dict.common.emptyField;
                  const level = grammar.jlptLevel ?? grammar.jlpt_level;
                  const rating = review.rating ?? review.last_rating;
                  const reviewedAt = review.reviewedAt ?? review.reviewed_at;
                  const normalizedRating = normalizeRatingKey(rating);
                  const ratingColor = normalizedRating ? ratingColors[normalizedRating] : "#797776";
                  return (
                    <div key={`${review.grammar_id}-${reviewedAt}-${index}`} className="flex items-center gap-3 py-2 border-b border-[rgba(36,36,36,0.06)] last:border-0">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ratingColor }} />
                      {level && <LevelBadge level={level} />}
                      <span className="font-medium text-sm flex-1 truncate">{title}</span>
                      <Badge variant="secondary" className="rounded-full font-mono text-[10px] shrink-0" style={{ backgroundColor: `${ratingColor}20`, color: ratingColor, borderColor: `${ratingColor}40` }}>
                        {ratingLabelForLocale(rating, locale)}
                      </Badge>
                      <span className="hidden font-mono text-[10px] text-[#797776] sm:inline shrink-0">{formatDate(reviewedAt, locale)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Link href={`/${locale}/study`} className={buttonVariants({ className: "rounded-full font-mono text-xs" })}>
            <Zap className="mr-1 h-3 w-3" />{dict.dashboard.continueStudy}
          </Link>
          <Link href={`/${locale}/review`} className={buttonVariants({ variant: "outline", className: "rounded-full font-mono text-xs" })}>
            <RotateCcw className="mr-1 h-3 w-3" />{dict.dashboard.todayReviewBtn}
          </Link>
          <Link href={`/${locale}/favorites`} className={buttonVariants({ variant: "outline", className: "rounded-full font-mono text-xs" })}>
            <Heart className="mr-1 h-3 w-3" />{dict.dashboard.viewFavorites}
          </Link>
          <Link href={`/${locale}/grammar`} className={buttonVariants({ variant: "outline", className: "rounded-full font-mono text-xs" })}>
            <BookOpen className="mr-1 h-3 w-3" />{dict.dashboard.viewGrammar}
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
