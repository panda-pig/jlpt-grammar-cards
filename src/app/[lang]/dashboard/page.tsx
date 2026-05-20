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
import { BookOpen, Flame, RotateCcw, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
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
            <h2 className="text-xl font-bold mb-2">请先登录</h2>
            <p className="text-[#797776] font-mono text-sm mb-4">登录后查看学习统计</p>
            <Link href="/login" className={buttonVariants({ className: "rounded-full font-mono" })}>登录</Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-4xl py-4 sm:py-6 flex items-center justify-center min-h-[300px]">
          <p className="text-[#797776] font-mono text-sm">加载中...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl py-4 sm:py-6">
        <h1 className="text-2xl font-bold mb-6">学习统计</h1>

        <h2 className="font-mono text-xs font-medium text-[#797776] mb-3">今日任务</h2>
        <div className="grid gap-3 sm:grid-cols-4 mb-8">
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
            <BookOpen className="h-5 w-5 mx-auto mb-1 text-[#242424]" />
            <p className="text-2xl font-bold font-mono text-[#242424]">{stats.todayNew}</p>
            <p className="font-mono text-xs text-[#797776]">今日新学</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
            <RotateCcw className="h-5 w-5 mx-auto mb-1 text-[#242424]" />
            <p className="text-2xl font-bold font-mono text-[#242424]">{stats.todayDue}</p>
            <p className="font-mono text-xs text-[#797776]">今日复习</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-[#242424]" />
            <p className="text-2xl font-bold font-mono text-[#242424]">{stats.todayCompleted}</p>
            <p className="font-mono text-xs text-[#797776]">已完成</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
            <Flame className="h-5 w-5 mx-auto mb-1 text-[#242424]" />
            <p className="text-2xl font-bold font-mono text-[#242424]">{stats.streakDays}</p>
            <p className="font-mono text-xs text-[#797776]">连续天数</p>
          </CardContent></Card>
        </div>

        <h2 className="font-mono text-xs font-medium text-[#797776] mb-3">JLPT 等级进度</h2>
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

        <h2 className="font-mono text-xs font-medium text-[#797776] mb-3">快捷入口</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/study" className={buttonVariants({ className: "rounded-full font-mono" })}>继续学习</Link>
          <Link href="/review" className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}>今日复习</Link>
          <Link href="/favorites" className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}>查看收藏</Link>
          <Link href="/grammar" className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}>进入语法库</Link>
        </div>
      </div>
    </MainLayout>
  );
}
