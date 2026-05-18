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
import { userStats, reviewRecords } from "@/lib/mock-data";
import { BookOpen, TrendingUp, CheckCircle, Target, Sparkles } from "lucide-react";

export default function ReviewPage() {
  const [favs, setFavs] = useState<Set<string>>(new Set(reviewRecords.filter((r) => r.isFavorite).map((r) => r.grammarId)));
  const completed = userStats.todayCompleted >= userStats.todayTotal;

  if (completed) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-sm mx-4 border-0 shadow-sm">
            <CardContent className="p-6 text-center space-y-4">
              <Sparkles className="h-10 w-10 mx-auto text-emerald-500" />
              <h2 className="text-xl font-bold">今日复习完成！</h2>
              <p className="text-sm text-muted-foreground">你今天复习了 {userStats.todayCompleted} 个语法</p>
              <ProgressBar label="今日完成率" value={100} />
              <Link href="/study" className={buttonVariants({ className: "w-full" })}>继续学习</Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl px-6 py-6">
        <h1 className="text-2xl font-bold mb-6">今日复习</h1>

        <div className="grid gap-3 sm:grid-cols-4 mb-8">
          <Card className="border-0 shadow-sm"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{userStats.todayReviewCards}</p>
            <p className="text-xs text-muted-foreground">待复习</p>
          </CardContent></Card>
          <Card className="border-0 shadow-sm"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{userStats.todayNewCards}</p>
            <p className="text-xs text-muted-foreground">新学习</p>
          </CardContent></Card>
          <Card className="border-0 shadow-sm"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{userStats.todayCompleted}</p>
            <p className="text-xs text-muted-foreground">已完成</p>
          </CardContent></Card>
          <Card className="border-0 shadow-sm"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{Math.round((userStats.todayCompleted / userStats.todayTotal) * 100)}%</p>
            <p className="text-xs text-muted-foreground">完成率</p>
          </CardContent></Card>
        </div>

        <div className="flex gap-3 mb-6">
          <Link href="/study" className={buttonVariants({ size: "lg", className: "flex-1" })}>开始今日复习</Link>
          <Link href="/study" className={buttonVariants({ variant: "outline", size: "lg", className: "flex-1" })}>继续复习</Link>
        </div>

        <h2 className="font-semibold mb-3">复习列表</h2>
        <div className="space-y-2">
          {reviewRecords.map((r) => (
            <Card key={r.grammarId} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <LevelBadge level={r.level} />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground">上次：{r.lastRating} · 下次：{r.nextReviewDate}</p>
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