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
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import type { ReviewRating } from "@/lib/types";
import { Sparkles } from "lucide-react";

type ReviewState = "loading" | "empty" | "ready" | "reviewing" | "completed";

export default function ReviewPage() {
  const { user } = useAuth();
  const dict = useDictionary();
  const locale = useLocale();
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
              <h2 className="text-xl font-bold">{dict.common.login}</h2>
              <p className="text-sm text-[#797776]">{dict.common.login}</p>
              <Link href={`/${locale}/login`} className={buttonVariants({ className: "w-full rounded-full font-mono" })}>
                {dict.common.login}
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
          <p className="text-[#797776] font-mono text-sm">{dict.common.loading}</p>
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
              <h2 className="text-xl font-bold">{dict.review.noDueCards}</h2>
              <p className="text-sm text-[#797776]">{dict.review.noDueCardsHint}</p>
              <Link href={`/${locale}/study`} className={buttonVariants({ className: "w-full rounded-full font-mono" })}>
                {dict.review.goStudy}
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
          <h1 className="text-2xl font-bold mb-6">{dict.review.title}</h1>

          <div className="grid gap-3 sm:grid-cols-4 mb-8">
            <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#242424]">{total}</p>
              <p className="font-mono text-xs text-[#797776]">{dict.review.dueCards}</p>
            </CardContent></Card>
            <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#242424]">{dailyStats.todayNew}</p>
              <p className="font-mono text-xs text-[#797776]">{dict.review.newCards}</p>
            </CardContent></Card>
            <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#242424]">{done}</p>
              <p className="font-mono text-xs text-[#797776]">{dict.review.completed}</p>
            </CardContent></Card>
            <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]"><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#242424]">{pct}%</p>
              <p className="font-mono text-xs text-[#797776]">{dict.review.completionRate}</p>
            </CardContent></Card>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{dict.review.reviewList}</h2>
            <Button className="rounded-full font-mono" onClick={startReview}>{dict.review.startReview}</Button>
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
              <h2 className="text-xl font-bold">{dict.review.completedTitle}</h2>
              <p className="text-sm text-[#797776]">
                {dict.review.completedMsg.replace("{count}", String(completedCount))}
              </p>
              <p className="text-sm text-[#797776]">
                {dict.review.streakMsg.replace("{days}", String(dailyStats.streakDays))}
              </p>
              <ProgressBar label={dict.review.completionRate} value={100} />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-full font-mono" onClick={handleRestart}>
                  {dict.review.continueReview}
                </Button>
                <Link href={`/${locale}/study`} className={buttonVariants({ className: "flex-1 rounded-full font-mono" })}>
                  {dict.review.goStudy}
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
            <span>{dict.study.progress}：{currentIndex + 1} / {dueCards.length}</span>
            <span>{dict.study.remaining}：{dueCards.length - currentIndex - 1}</span>
          </div>
          <ProgressBar label={dict.study.progress} value={progress} />
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
