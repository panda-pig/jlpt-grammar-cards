"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { ProgressBar } from "@/components/study/ProgressBar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { progressService } from "@/services/progressService";
import { grammarService } from "@/services/grammarService";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { BookOpen, Flame, RotateCcw, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const dict = useDictionary();
  const locale = useLocale();
  const [stats, setStats] = useState({ todayDue: 0, todayNew: 0, todayCompleted: 0, streakDays: 0 });
  const [levelProgress, setLevelProgress] = useState<{ level: string; total: number; learned: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!user) return;
    try {
      const [dailyStats, lvlProgress] = await Promise.all([
        progressService.getDailyStats(user.id),
        progressService.getLevelProgress(user.id),
      ]);
      setStats(dailyStats);
      setLevelProgress(lvlProgress);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (!user) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-4xl py-4 sm:py-6 flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">{dict.common.login}</h2>
            <p className="text-[#797776] font-mono text-sm mb-4">{dict.common.login}</p>
            <Link href={`/${locale}/login`} className={buttonVariants({ className: "rounded-full font-mono" })}>{dict.common.login}</Link>
          </div>
        </div>
      </MainLayout>
    );
  }

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
                  <ProgressBar label={`${lp.level} 进度`} value={pct} />
                </div>
              );
            })}
          </div>
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
