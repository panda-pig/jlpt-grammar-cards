"use client";

import { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { FavoriteButton } from "@/components/grammar/FavoriteButton";
import { ProgressBar } from "@/components/study/ProgressBar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGrammar } from "@/context/GrammarContext";
import { Sparkles } from "lucide-react";

export default function ReviewPage() {
  const { userStats, getReviewRecords, toggleFavorite } = useGrammar();
  const reviewRecords = getReviewRecords();
  const [favs, setFavs] = useState<Set<string>>(new Set(reviewRecords.filter((r) => r.isFavorite).map((r) => r.grammarId)));
  const completed = userStats.todayCompleted >= userStats.todayTotal;

  if (completed) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-sm bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
            <CardContent className="p-6 text-center space-y-4">
              <Sparkles className="h-10 w-10 mx-auto text-[#4a8a6a]" />
              <h2 className="text-xl font-serif font-bold">今日复习完成！</h2>
              <p className="text-sm text-[#797776]">你今天复习了 {userStats.todayCompleted} 个语法</p>
              <ProgressBar label="今日完成率" value={100} />
              <Link href="/study" className={buttonVariants({ className: "w-full rounded-full font-mono" })}>继续学习</Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl py-4 sm:py-6">
        <h1 className="text-2xl font-serif font-bold mb-6">今日复习</h1>

        <div className="grid gap-3 sm:grid-cols-4 mb-8">
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-[#242424]">{userStats.todayReviewCards}</p>
            <p className="font-mono text-xs text-[#797776]">待复习</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-[#242424]">{userStats.todayNewCards}</p>
            <p className="font-mono text-xs text-[#797776]">新学习</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-[#242424]">{userStats.todayCompleted}</p>
            <p className="font-mono text-xs text-[#797776]">已完成</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-[#242424]">{Math.round((userStats.todayCompleted / userStats.todayTotal) * 100)}%</p>
            <p className="font-mono text-xs text-[#797776]">完成率</p>
          </CardContent></Card>
        </div>

        <div className="flex gap-3 mb-6">
          <Link href="/study" className={buttonVariants({ size: "lg", className: "flex-1 rounded-full font-mono" })}>开始今日复习</Link>
          <Link href="/study" className={buttonVariants({ variant: "outline", size: "lg", className: "flex-1 rounded-full font-mono" })}>继续复习</Link>
        </div>

        <h2 className="font-serif font-semibold mb-3">复习列表</h2>
        <div className="space-y-2">
          {reviewRecords.map((r) => (
            <Card key={r.grammarId} className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none transition-all hover:shadow-[rgba(0,0,0,0.1)_0px_0px_10px_0px]">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <LevelBadge level={r.level} />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{r.title}</p>
                    <p className="font-mono text-xs text-[#797776]">上次：{r.lastRating} · 下次：{r.nextReviewDate}</p>
                  </div>
                </div>
                <FavoriteButton
                  isFavorite={favs.has(r.grammarId)}
                  onToggle={() =>
                    setFavs((prev) => {
                      const next = new Set(prev);
                      next.has(r.grammarId) ? next.delete(r.grammarId) : next.add(r.grammarId);
                      return next;
                    })
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
