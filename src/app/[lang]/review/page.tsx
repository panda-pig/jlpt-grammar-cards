"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { StudyFlashcard } from "@/components/study/StudyFlashcard";
import { ReviewButtons } from "@/components/study/ReviewButtons";
import { ProgressBar } from "@/components/study/ProgressBar";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { progressService, type ProgressRow } from "@/services/progressService";
import { toGrammarEntry } from "@/lib/mappers";
import { useAuth } from "@/hooks/useAuth";
import type { ReviewRating } from "@/lib/types";
import { Sparkles } from "lucide-react";

type ReviewState = "loading" | "empty" | "ready" | "reviewing" | "completed";

export default function ReviewPage() {
  const { user } = useAuth();
  const [state, setState] = useState<ReviewState>("loading");
  const [dueCards, setDueCards] = useState<(ProgressRow & { grammar: any })[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [dailyStats, setDailyStats] = useState({ todayDue: 0, todayNew: 0, todayCompleted: 0, streakDays: 0 });

  const loadDueCards = useCallback(async () => {
    if (!user) return;
    setState("loading");
    try {
      const cards = await progressService.getDueForReview(user.id);
      const stats = await progressService.getDailyStats(user.id);
      setDueCards(cards);
      setDailyStats(stats);
      setState(cards.length === 0 ? "empty" : "ready");
    } catch {
      setState("empty");
    }
  }, [user]);

  useEffect(() => {
    loadDueCards();
  }, [loadDueCards]);

  const startReview = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setCompletedCount(0);
    setState("reviewing");
  };

  const handleRate = useCallback(
    async (rating: ReviewRating) => {
      if (!user) return;
      const card = dueCards[currentIndex];
      try {
        await progressService.recordReview(user.id, card.grammar_id, rating);
      } catch {
        // silently fail, still advance
      }
      setFlipped(false);
      setCompletedCount((c) => c + 1);
      if (currentIndex + 1 >= dueCards.length) {
        setState("completed");
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [currentIndex, dueCards, user]
  );

  const handleRestart = async () => {
    await loadDueCards();
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-sm bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]">
            <CardContent className="p-6 text-center space-y-4">
              <h2 className="text-xl font-bold">请先登录</h2>
              <p className="text-sm text-[#797776]">登录后即可使用复习功能</p>
              <Link href="/login" className={buttonVariants({ className: "w-full rounded-full font-mono" })}>
                登录
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (state === "loading") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-[#797776] font-mono text-sm">加载中...</p>
        </div>
      </MainLayout>
    );
  }

  if (state === "empty") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-sm bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]">
            <CardContent className="p-6 text-center space-y-4">
              <Sparkles className="h-10 w-10 mx-auto text-[#4a8a6a]" />
              <h2 className="text-xl font-bold">今天没有需要复习的卡片</h2>
              <p className="text-sm text-[#797776]">去学习页面添加新卡片吧</p>
              <Link href="/study" className={buttonVariants({ className: "w-full rounded-full font-mono" })}>
                去学习
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (state === "ready") {
    const total = dueCards.length;
    const done = dailyStats.todayCompleted;
    const pct = total > 0 ? Math.round((done / (total + done)) * 100) : 0;

    return (
      <MainLayout>
        <div className="mx-auto max-w-4xl py-4 sm:py-6">
          <h1 className="text-2xl font-bold mb-6">今日复习</h1>

          <div className="grid gap-3 sm:grid-cols-4 mb-8">
            <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#242424]">{total}</p>
              <p className="font-mono text-xs text-[#797776]">待复习</p>
            </CardContent></Card>
            <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#242424]">{dailyStats.todayNew}</p>
              <p className="font-mono text-xs text-[#797776]">新学习</p>
            </CardContent></Card>
            <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#242424]">{done}</p>
              <p className="font-mono text-xs text-[#797776]">已完成</p>
            </CardContent></Card>
            <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#242424]">{pct}%</p>
              <p className="font-mono text-xs text-[#797776]">完成率</p>
            </CardContent></Card>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">今日复习列表</h2>
            <Button className="rounded-full font-mono" onClick={startReview}>开始复习</Button>
          </div>

          <div className="space-y-2">
            {dueCards.map((r) => (
              <Card key={r.grammar_id} className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] transition-all hover:shadow-[rgba(0,0,0,0.1)_0px_0px_10px_0px]">
                <CardContent className="p-3 flex items-center gap-3">
                  <LevelBadge level={r.grammar?.jlpt_level} />
                  <span className="font-medium flex-1">{r.grammar?.title}</span>
                  <Badge variant="secondary" className="rounded-full font-mono text-xs">{r.study_status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (state === "completed") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-sm bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]">
            <CardContent className="p-6 text-center space-y-4">
              <Sparkles className="h-10 w-10 mx-auto text-[#4a8a6a]" />
              <h2 className="text-xl font-bold">今日复习完成！</h2>
              <p className="text-sm text-[#797776]">
                你今天复习了 <span className="font-bold text-[#242424]">{completedCount}</span> 个语法
              </p>
              <p className="text-sm text-[#797776]">
                已连续学习 <span className="font-bold text-[#242424]">{dailyStats.streakDays}</span> 天
              </p>
              <ProgressBar label="今日完成率" value={100} />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-full font-mono" onClick={handleRestart}>
                  返回列表
                </Button>
                <Link href="/study" className={buttonVariants({ className: "flex-1 rounded-full font-mono" })}>
                  继续学习
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const currentCard = dueCards[currentIndex];
  const grammar = currentCard.grammar ? toGrammarEntry(currentCard.grammar) : null;
  const progress = dueCards.length > 0 ? ((currentIndex + 1) / dueCards.length) * 100 : 0;

  return (
    <MainLayout>
      <div className="flex flex-col">
        <div className="mx-auto w-full max-w-2xl px-6 py-4">
          <div className="flex items-center justify-between mb-4 text-sm font-mono text-[#797776]">
            <span>进度：{currentIndex + 1} / {dueCards.length}</span>
            <span>剩余：{dueCards.length - currentIndex - 1}</span>
          </div>
          <ProgressBar label="今日进度" value={progress} />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-4">
          {grammar && (
            <StudyFlashcard grammar={grammar} flipped={flipped} onFlip={() => setFlipped(!flipped)} />
          )}
        </div>

        {flipped && (
          <div className="px-6 pb-6">
            <ReviewButtons onRate={handleRate} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
