"use client";

import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { ProgressBar } from "@/components/study/ProgressBar";
import { StatCard } from "@/components/shared/StatCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { userStats, getLevelProgress, grammarEntries } from "@/lib/mock-data";
import { BookOpen, Flame, RotateCcw, TrendingUp, Heart, ArrowRight } from "lucide-react";

const levelColors: Record<string, string> = {
  N5: "bg-emerald-500", N4: "bg-sky-500", N3: "bg-amber-500", N2: "bg-rose-500", N1: "bg-purple-500",
};

export default function DashboardPage() {
  const levelProgress = getLevelProgress();

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl px-6 py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <h2 className="font-semibold text-sm text-muted-foreground mb-3">今日任务</h2>
        <div className="grid gap-3 sm:grid-cols-4 mb-8">
          <StatCard icon={<BookOpen className="h-5 w-5" />} label="今日新学" value={userStats.todayNewCards} />
          <StatCard icon={<RotateCcw className="h-5 w-5" />} label="今日复习" value={userStats.todayReviewCards} />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="完成率" value={`${Math.round((userStats.todayCompleted / userStats.todayTotal) * 100)}%`} />
          <StatCard icon={<Flame className="h-5 w-5" />} label="连续天数" value={userStats.streakDays} subtitle="天" />
        </div>

        <h2 className="font-semibold text-sm text-muted-foreground mb-3">总体进度</h2>
        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          <Card className="border-0 shadow-sm"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{userStats.totalLearned}</p>
            <p className="text-xs text-muted-foreground">已学习语法</p>
          </CardContent></Card>
          <Card className="border-0 shadow-sm"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{userStats.totalMastered}</p>
            <p className="text-xs text-muted-foreground">已掌握语法</p>
          </CardContent></Card>
          <Card className="border-0 shadow-sm"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{userStats.totalFavorites}</p>
            <p className="text-xs text-muted-foreground">收藏数量</p>
          </CardContent></Card>
        </div>

        <h2 className="font-semibold text-sm text-muted-foreground mb-3">JLPT 等级进度</h2>
        <div className="space-y-4 mb-8">
          {levelProgress.map((lp) => (
            <div key={lp.level} className="flex items-center gap-3">
              <LevelBadge level={lp.level} />
              <div className="flex-1">
                <ProgressBar label="" value={lp.total > 0 ? (lp.mastered / lp.total) * 100 : 0} showPercentage={false} />
              </div>
              <span className="text-xs text-muted-foreground w-20 text-right tabular-nums">
                {lp.mastered}/{lp.total}
              </span>
            </div>
          ))}
        </div>

        <h2 className="font-semibold text-sm text-muted-foreground mb-3">最近学习</h2>
        <div className="space-y-2 mb-8">
          {grammarEntries.filter((e) => e.lastReviewedAt).slice(0, 5).map((g) => (
            <Card key={g.id} className="border-0 shadow-sm">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <LevelBadge level={g.jlptLevel} />
                  <span className="font-medium text-sm truncate">{g.title}</span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {g.lastReviewedAt ? new Date(g.lastReviewedAt).toLocaleDateString("zh-CN") : ""}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="font-semibold text-sm text-muted-foreground mb-3">快捷入口</h2>
        <div className="grid gap-2 sm:grid-cols-4">
          <Link href="/study" className={buttonVariants({})}>继续学习</Link>
          <Link href="/review" className={buttonVariants({ variant: "outline" })}>今日复习</Link>
          <Link href="/favorites" className={buttonVariants({ variant: "outline" })}>查看收藏</Link>
          <Link href="/grammar" className={buttonVariants({ variant: "outline" })}>语法库</Link>
        </div>
      </div>
    </MainLayout>
  );
}