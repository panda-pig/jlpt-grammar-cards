"use client";

import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { ProgressBar } from "@/components/study/ProgressBar";
import { StatCard } from "@/components/shared/StatCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGrammar } from "@/context/GrammarContext";
import { BookOpen, Flame, RotateCcw, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { entries, getLevelProgress, userStats } = useGrammar();
  const levelProgress = getLevelProgress();

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl py-4 sm:py-6">
        <h1 className="text-2xl font-serif font-bold mb-6">学习统计</h1>

        <h2 className="font-mono text-xs font-medium text-[#797776] mb-3">今日任务</h2>
        <div className="grid gap-3 sm:grid-cols-4 mb-8">
          <StatCard icon={<BookOpen className="h-5 w-5" />} label="今日新学" value={userStats.todayNewCards} />
          <StatCard icon={<RotateCcw className="h-5 w-5" />} label="今日复习" value={userStats.todayReviewCards} />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="完成率" value={`${Math.round((userStats.todayCompleted / userStats.todayTotal) * 100)}%`} />
          <StatCard icon={<Flame className="h-5 w-5" />} label="连续天数" value={userStats.streakDays} subtitle="天" />
        </div>

        <h2 className="font-mono text-xs font-medium text-[#797776] mb-3">总体进度</h2>
        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-[#242424]">{userStats.totalLearned}</p>
            <p className="font-mono text-xs text-[#797776]">已学习语法</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-[#242424]">{userStats.totalMastered}</p>
            <p className="font-mono text-xs text-[#797776]">已掌握语法</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-[#242424]">{userStats.totalFavorites}</p>
            <p className="font-mono text-xs text-[#797776]">收藏数量</p>
          </CardContent></Card>
        </div>

        <h2 className="font-mono text-xs font-medium text-[#797776] mb-3">JLPT 等级进度</h2>
        <div className="space-y-4 mb-8">
          {levelProgress.map((lp) => (
            <div key={lp.level} className="flex items-center gap-3">
              <LevelBadge level={lp.level} />
              <div className="flex-1">
                <ProgressBar label="" value={lp.total > 0 ? (lp.mastered / lp.total) * 100 : 0} showPercentage={false} />
              </div>
              <span className="font-mono text-xs text-[#797776] w-20 text-right tabular-nums">
                {lp.mastered}/{lp.total}
              </span>
            </div>
          ))}
        </div>

        <h2 className="font-mono text-xs font-medium text-[#797776] mb-3">最近学习</h2>
        <div className="space-y-2 mb-8">
          {entries.filter((e) => e.lastReviewedAt).slice(0, 5).map((g) => (
            <Card key={g.id} className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none transition-all hover:shadow-[rgba(0,0,0,0.1)_0px_0px_10px_0px]">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <LevelBadge level={g.jlptLevel} />
                  <span className="font-medium text-sm truncate">{g.title}</span>
                </div>
                <span className="font-mono text-xs text-[#797776] shrink-0">
                  {g.lastReviewedAt ? new Date(g.lastReviewedAt).toLocaleDateString("zh-CN") : ""}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="font-mono text-xs font-medium text-[#797776] mb-3">快捷入口</h2>
        <div className="grid gap-2 sm:grid-cols-4">
          <Link href="/study" className={buttonVariants({ className: "rounded-full font-mono" })}>继续学习</Link>
          <Link href="/review" className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}>今日复习</Link>
          <Link href="/favorites" className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}>查看收藏</Link>
          <Link href="/grammar" className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}>语法库</Link>
        </div>
      </div>
    </MainLayout>
  );
}
