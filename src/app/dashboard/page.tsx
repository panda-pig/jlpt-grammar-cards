"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { ProgressBar } from "@/components/study/ProgressBar";
import { StatCard } from "@/components/shared/StatCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { grammarService } from "@/services/grammarService";
import { BookOpen, Flame, RotateCcw, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    grammarService.getAll().then((data) => {
      setEntries(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const learned = entries.filter((e) => e.study_status === "学习中" || e.study_status === "已掌握").length;
  const mastered = entries.filter((e) => e.study_status === "已掌握").length;
  const favorites = entries.filter((e) => e.is_favorite).length;

  const levelProgress = ["N5", "N4", "N3", "N2", "N1"].map((level) => {
    const items = entries.filter((e) => e.jlpt_level === level);
    return {
      level,
      total: items.length,
      learned: items.filter((e) => e.study_status === "学习中" || e.study_status === "已掌握").length,
      mastered: items.filter((e) => e.study_status === "已掌握").length,
    };
  });

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
          <StatCard icon={<BookOpen className="h-5 w-5" />} label="今日新学" value={10} />
          <StatCard icon={<RotateCcw className="h-5 w-5" />} label="今日复习" value={30} />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="完成率" value="20%" />
          <StatCard icon={<Flame className="h-5 w-5" />} label="连续天数" value={5} subtitle="天" />
        </div>

        <h2 className="font-mono text-xs font-medium text-[#797776] mb-3">总体进度</h2>
        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-[#242424]">{learned}</p>
            <p className="font-mono text-xs text-[#797776]">已学习语法</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-[#242424]">{mastered}</p>
            <p className="font-mono text-xs text-[#797776]">已掌握语法</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-[#242424]">{favorites}</p>
            <p className="font-mono text-xs text-[#797776]">收藏数量</p>
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
