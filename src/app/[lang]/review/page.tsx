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
import { learningService, type ProgressWithGrammar } from "@/services/learningService";
import { toGrammarEntry } from "@/lib/mappers";
import { formatRelativeDate } from "@/lib/date";
import { ratingLabelForLocale, studyStatusLabel } from "@/lib/grammar-content";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import type { ReviewRating } from "@/lib/types";
import { Sparkles, WifiOff } from "lucide-react";

type ReviewState = "loading" | "empty" | "ready" | "reviewing" | "completed";

export default function ReviewPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const dict = useDictionary();
  const locale = useLocale();
  const [state, setState] = useState<ReviewState>("loading");
  const [dueCards, setDueCards] = useState<ProgressWithGrammar[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [dailyStats, setDailyStats] = useState({ todayDue: 0, todayNew: 0, todayCompleted: 0, streakDays: 0 });

  const loadDueCards = useCallback(async () => {
    setState("loading");
    try {
      const cards = await learningService.getDueForReview(userId);
      const stats = await learningService.getDailyStats(userId);
      setDueCards(cards);
      setDailyStats(stats);
      setState(cards.length === 0 ? "empty" : "ready");
    } catch {
      setState("empty");
    }
  }, [userId]);

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
      const card = dueCards[currentIndex];
      try {
        await learningService.recordReview(card.grammar_id, rating, userId);
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
    [currentIndex, dueCards, userId]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state !== "reviewing" || !dueCards[currentIndex]) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setFlipped((v) => !v);
      }
      if (!flipped) return;
      const ratingMap: Record<string, ReviewRating> = { "1": 1, "2": 2, "3": 3, "4": 4 };
      if (ratingMap[e.key]) {
        e.preventDefault();
        handleRate(ratingMap[e.key]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state, currentIndex, dueCards, flipped, handleRate]);

  const handleRestart = async () => {
    await loadDueCards();
  };

  if (state === "loading") {
    return (
      <MainLayout>
        {!user && (
          <div className="mx-auto mt-4 flex max-w-4xl items-start gap-3 rounded-[14px] border border-[#e8c178]/50 bg-[#fff6df] px-4 py-3 text-sm text-[#4e4d4d]">
            <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-[#a08040]" />
            <div>
              <p className="font-mono text-xs font-medium text-[#242424]">{dict.common.localMode}</p>
              <p className="mt-1 leading-relaxed">{dict.common.localModeDesc}</p>
            </div>
          </div>
        )}
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
          <Card className="w-full max-w-sm bg-[#fbfaf8] border border-[#ded8d0] rounded-[18px] shadow-none">
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
        {!user && (
          <div className="mx-auto mt-4 flex max-w-4xl items-start gap-3 rounded-[14px] border border-[#e8c178]/50 bg-[#fff6df] px-4 py-3 text-sm text-[#4e4d4d]">
            <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-[#a08040]" />
            <div>
              <p className="font-mono text-xs font-medium text-[#242424]">{dict.common.localMode}</p>
              <p className="mt-1 leading-relaxed">{dict.common.localModeDesc}</p>
            </div>
          </div>
        )}
        <div className="mx-auto max-w-4xl py-4 sm:py-6">
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[.06em] text-[#797776]">
              <div className="h-px w-8 bg-[#242424]" />
              SM-2 Spaced Repetition
            </div>
            <h1 className="font-serif text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.08] tracking-[-0.022em] text-black text-balance">{dict.review.title}</h1>
          </div>
          <p className="mb-4 text-sm text-[#797776]">{dict.review.oldReviewOnly}</p>

          <div className="grid gap-3 sm:grid-cols-4 mb-8">
            <Card className="bg-[#fbfaf8] border border-[#ded8d0] rounded-[18px] shadow-none"><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#242424]">{total}</p>
              <p className="font-mono text-xs text-[#797776]">{dict.review.dueCards}</p>
            </CardContent></Card>
            <Card className="bg-[#fbfaf8] border border-[#ded8d0] rounded-[18px] shadow-none"><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#242424]">{dailyStats.todayNew}</p>
              <p className="font-mono text-xs text-[#797776]">{dict.review.newCards}</p>
            </CardContent></Card>
            <Card className="bg-[#fbfaf8] border border-[#ded8d0] rounded-[18px] shadow-none"><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#242424]">{done}</p>
              <p className="font-mono text-xs text-[#797776]">{dict.review.completed}</p>
            </CardContent></Card>
            <Card className="bg-[#fbfaf8] border border-[#ded8d0] rounded-[18px] shadow-none"><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#242424]">{pct}%</p>
              <p className="font-mono text-xs text-[#797776]">{dict.review.completionRate}</p>
            </CardContent></Card>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{dict.review.reviewList}</h2>
            <Button className="rounded-full font-mono" onClick={startReview}>{dict.review.startReview}</Button>
          </div>

          <div className="space-y-2">
            {dueCards.map((r) => {
              const grammar = toGrammarEntry(r.grammar);
              return (
                <Card key={r.grammar_id} className="bg-[#fbfaf8] border border-[#ded8d0] rounded-[14px] shadow-none transition-all hover:border-[#242424]">
                  <CardContent className="p-3 flex items-center gap-3">
                    <LevelBadge level={grammar.jlptLevel} />
                    <span className="font-medium flex-1">{grammar.title}</span>
                    <span className="hidden text-xs text-[#797776] sm:inline">
                      {dict.review.lastRating}: {ratingLabelForLocale(r.last_rating, locale)}
                    </span>
                    <span className="hidden text-xs text-[#797776] sm:inline">
                      {dict.review.nextReview}: {formatRelativeDate(r.next_review_at, locale)}
                    </span>
                    <Badge variant="secondary" className="rounded-full font-mono text-xs">{studyStatusLabel(r.study_status as any, locale)}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (state === "completed") {
    return (
      <MainLayout>
        {!user && (
          <div className="mx-auto mt-4 flex max-w-sm items-start gap-3 rounded-[14px] border border-[#e8c178]/50 bg-[#fff6df] px-4 py-3 text-sm text-[#4e4d4d]">
            <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-[#a08040]" />
            <p>{dict.common.syncHint}</p>
          </div>
        )}
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-sm bg-[#fbfaf8] border border-[#ded8d0] rounded-[18px] shadow-none">
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

  const handleToggleFavorite = async () => {
    if (!grammar) return;
    await learningService.toggleFavorite(grammar.id, userId);
    setDueCards((prev) => {
      const next = [...prev];
      next[currentIndex] = { ...next[currentIndex], is_favorite: !next[currentIndex].is_favorite };
      return next;
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col">
        <div className="mx-auto w-full max-w-2xl px-6 py-4">
          <div className="flex items-center justify-between mb-4 text-sm font-mono text-[#797776]">
            <span>{dict.study.progress}: {currentIndex + 1} / {dueCards.length}</span>
            <span>{dict.study.remaining}: {dueCards.length - currentIndex - 1}</span>
          </div>
          <ProgressBar label={dict.study.progress} value={progress} />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-4">
          {grammar && (
            <StudyFlashcard grammar={grammar} flipped={flipped} onFlip={() => setFlipped(!flipped)} isFavorite={!!currentCard?.is_favorite} onToggleFavorite={handleToggleFavorite} />
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
