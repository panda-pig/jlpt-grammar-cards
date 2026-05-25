"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { ProgressBar } from "@/components/study/ProgressBar";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { learningService } from "@/services/learningService";
import { formatDate } from "@/lib/date";
import { ratingLabelForLocale } from "@/lib/grammar-content";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { BookOpen, Flame, Heart, RotateCcw, Sparkles, TrendingUp, WifiOff } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const dict = useDictionary();
  const locale = useLocale();
  const [stats, setStats] = useState({ todayDue: 0, todayNew: 0, todayCompleted: 0, streakDays: 0 });
  const [overall, setOverall] = useState({ totalLearned: 0, totalMastered: 0, totalFavorites: 0 });
  const [levelProgress, setLevelProgress] = useState<{ level: string; total: number; learned: number; mastered: number }[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const [dailyStats, lvlProgress, overallStats, recent] = await Promise.all([
        learningService.getDailyStats(user?.id),
        learningService.getLevelProgress(user?.id),
        learningService.getOverallStats(user?.id),
        learningService.getRecentReviews(user?.id),
      ]);
      setStats(dailyStats);
      setLevelProgress(lvlProgress);
      setOverall(overallStats);
      setRecentReviews(recent);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-4xl py-4 sm:py-6 flex items-center justify-center min-h-[300px]">
          <p className="text-[#797776] font-mono text-sm">{dict.common.loading}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl py-4 sm:py-6">
        {!user && (
          <div className="mb-4 flex items-start gap-3 rounded-[28px] border border-[rgba(36,36,36,0.16)] bg-[#fff6df] px-4 py-3 text-sm text-[#4e4d4d]">
            <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-[#a08040]" />
            <p>{dict.common.localModeDesc}</p>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-6">{dict.dashboard.title}</h1>

        <h2 className="font-mono text-xs font-medium text-[#797776] mb-3">{dict.dashboard.todayTasks}</h2>
        <div className="grid gap-3 sm:grid-cols-4 mb-8">
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
            <BookOpen className="h-5 w-5 mx-auto mb-1 text-[#242424]" />
            <p className="text-2xl font-bold font-mono text-[#242424]">{stats.todayNew}</p>
            <p className="font-mono text-xs text-[#797776]">{dict.dashboard.todayNew}</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
            <RotateCcw className="h-5 w-5 mx-auto mb-1 text-[#242424]" />
            <p className="text-2xl font-bold font-mono text-[#242424]">{stats.todayDue}</p>
            <p className="font-mono text-xs text-[#797776]">{dict.dashboard.todayReview}</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-[#242424]" />
            <p className="text-2xl font-bold font-mono text-[#242424]">{stats.todayCompleted}</p>
            <p className="font-mono text-xs text-[#797776]">{dict.dashboard.completionRate}</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
            <Flame className="h-5 w-5 mx-auto mb-1 text-[#242424]" />
            <p className="text-2xl font-bold font-mono text-[#242424]">{stats.streakDays}</p>
            <p className="font-mono text-xs text-[#797776]">{dict.dashboard.streak}</p>
          </CardContent></Card>
        </div>

        <h2 className="font-mono text-xs font-medium text-[#797776] mb-3">{dict.dashboard.overallProgress}</h2>
        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
            <BookOpen className="h-5 w-5 mx-auto mb-1 text-[#242424]" />
            <p className="text-2xl font-bold font-mono text-[#242424]">{overall.totalLearned}</p>
            <p className="font-mono text-xs text-[#797776]">{dict.dashboard.learnedGrammar}</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
            <Sparkles className="h-5 w-5 mx-auto mb-1 text-[#242424]" />
            <p className="text-2xl font-bold font-mono text-[#242424]">{overall.totalMastered}</p>
            <p className="font-mono text-xs text-[#797776]">{dict.dashboard.masteredGrammar}</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
            <Heart className="h-5 w-5 mx-auto mb-1 text-[#242424]" />
            <p className="text-2xl font-bold font-mono text-[#242424]">{overall.totalFavorites}</p>
            <p className="font-mono text-xs text-[#797776]">{dict.dashboard.favoritesCount}</p>
          </CardContent></Card>
        </div>

        <h2 className="font-mono text-xs font-medium text-[#797776] mb-3">{dict.dashboard.levelProgress}</h2>
        <div className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] p-6 mb-8">
          <div className="space-y-4">
            {levelProgress.map((lp) => {
              const pct = lp.total > 0 ? Math.round((lp.learned / lp.total) * 100) : 0;
              return (
                <div key={lp.level}>
                  <div className="flex items-center justify-between mb-1">
                    <LevelBadge level={lp.level as any} />
                    <span className="font-mono text-xs text-[#797776]">{lp.learned} / {lp.total} ({pct}%)</span>
                  </div>
                  <ProgressBar label={`${lp.level} ${dict.dashboard.levelProgress}`} value={pct} />
                </div>
              );
            })}
          </div>
        </div>

        <h2 className="font-mono text-xs font-medium text-[#797776] mb-3">{dict.dashboard.recentReviews}</h2>
        <div className="space-y-2 mb-8">
          {recentReviews.length === 0 ? (
            <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]">
              <CardContent className="p-5 text-sm text-[#797776]">{dict.dashboard.noRecentReviews}</CardContent>
            </Card>
          ) : (
            recentReviews.map((review, index) => {
              const grammar = review.grammar ?? {};
              const title = grammar.title ?? grammar?.title ?? dict.common.emptyField;
              const level = grammar.jlptLevel ?? grammar.jlpt_level;
              const rating = review.rating ?? review.last_rating;
              const reviewedAt = review.reviewedAt ?? review.reviewed_at;
              return (
                <Card key={`${review.grammar_id}-${reviewedAt}-${index}`} className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[32px]">
                  <CardContent className="p-3 flex items-center gap-3">
                    {level && <LevelBadge level={level} />}
                    <span className="font-medium flex-1">{title}</span>
                    <Badge variant="secondary" className="rounded-full font-mono text-xs">{ratingLabelForLocale(rating, locale)}</Badge>
                    <span className="hidden font-mono text-xs text-[#797776] sm:inline">{formatDate(reviewedAt, locale)}</span>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <h2 className="font-mono text-xs font-medium text-[#797776] mb-3">{dict.dashboard.shortcuts}</h2>
        <div className="flex flex-wrap gap-3">
          <Link href={`/${locale}/study`} className={buttonVariants({ className: "rounded-full font-mono" })}>{dict.dashboard.continueStudy}</Link>
          <Link href={`/${locale}/review`} className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}>{dict.dashboard.todayReviewBtn}</Link>
          <Link href={`/${locale}/favorites`} className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}>{dict.dashboard.viewFavorites}</Link>
          <Link href={`/${locale}/grammar`} className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}>{dict.dashboard.viewGrammar}</Link>
        </div>
      </div>
    </MainLayout>
  );
}
