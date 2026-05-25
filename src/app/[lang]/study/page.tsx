"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { StudyFlashcard } from "@/components/study/StudyFlashcard";
import { ReviewButtons } from "@/components/study/ReviewButtons";
import { ProgressBar } from "@/components/study/ProgressBar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { learningService } from "@/services/learningService";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import type { GrammarEntry, JLPTLevel, ReviewRating } from "@/lib/types";
import { BookOpen, Sparkles, WifiOff } from "lucide-react";

type StudyLevel = JLPTLevel | "all";

export default function StudyPage() {
  const { user } = useAuth();
  const dict = useDictionary();
  const locale = useLocale();
  const [level, setLevel] = useState<StudyLevel>("N3");
  const [cards, setCards] = useState<GrammarEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);

  const currentCard = cards[currentIndex] ?? null;
  const progressValue = cards.length > 0 ? ((completedCount) / cards.length) * 100 : 0;
  const remaining = Math.max(cards.length - currentIndex - 1, 0);

  const loadCards = useCallback(async () => {
    setLoading(true);
    try {
      const nextCards = await learningService.getNewStudyCards(level, user?.id);
      setCards(nextCards);
      setCurrentIndex(0);
      setCompletedCount(0);
      setFlipped(false);
    } finally {
      setLoading(false);
    }
  }, [level, user?.id]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const levelOptions = useMemo(() => ["all", "N5", "N4", "N3", "N2", "N1"] as StudyLevel[], []);

  useEffect(() => {
    const levelParam = new URLSearchParams(window.location.search).get("level") as StudyLevel | null;
    if (levelParam && levelOptions.includes(levelParam)) setLevel(levelParam);
  }, [levelOptions]);

  const handleRate = async (rating: ReviewRating) => {
    if (!currentCard) return;
    await learningService.startLearning(currentCard.id, user?.id);
    await learningService.recordReview(currentCard.id, rating, user?.id);
    setFlipped(false);
    setCompletedCount((count) => count + 1);
    if (currentIndex + 1 >= cards.length) {
      setCurrentIndex(cards.length);
    } else {
      setCurrentIndex((index) => index + 1);
    }
  };

  const finished = cards.length > 0 && currentIndex >= cards.length;

  return (
    <MainLayout>
      <div className="mx-auto flex min-h-[calc(100vh-144px)] w-full max-w-5xl flex-col px-4 py-4 sm:px-6 sm:py-6">
        {!user && (
          <div className="mb-4 flex items-start gap-3 rounded-[28px] border border-[rgba(36,36,36,0.16)] bg-[#fff6df] px-4 py-3 text-sm text-[#4e4d4d]">
            <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-[#a08040]" />
            <div>
              <p className="font-mono text-xs font-medium text-[#242424]">{dict.common.localMode}</p>
              <p className="mt-1 leading-relaxed">{dict.common.localModeDesc}</p>
            </div>
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase text-[#797776]">{dict.study.learningMode}</p>
            <h1 className="font-serif text-2xl tracking-[-0.02em] text-[#000000]">{dict.study.startTitle}</h1>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#797776]">{dict.study.startDesc}</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={level} onValueChange={(value) => setLevel(value as StudyLevel)}>
              <SelectTrigger className="w-32 rounded-full border-[rgba(36,36,36,0.16)] bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item === "all" ? dict.study.allLevels : item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-full font-mono" onClick={loadCards}>
              {dict.study.restart}
            </Button>
          </div>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <Card className="rounded-[32px] border border-[rgba(36,36,36,0.16)] bg-[#f6f3f1] shadow-none">
            <CardContent className="p-4">
              <p className="font-mono text-xs text-[#797776]">{dict.study.queueCount}</p>
              <p className="mt-1 font-mono text-2xl font-medium text-[#242424]">{cards.length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-[32px] border border-[rgba(36,36,36,0.16)] bg-[#f6f3f1] shadow-none">
            <CardContent className="p-4">
              <p className="font-mono text-xs text-[#797776]">{dict.study.currentCard}</p>
              <p className="mt-1 font-mono text-2xl font-medium text-[#242424]">
                {cards.length === 0 ? "0 / 0" : `${Math.min(currentIndex + 1, cards.length)} / ${cards.length}`}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-[32px] border border-[rgba(36,36,36,0.16)] bg-[#f6f3f1] shadow-none">
            <CardContent className="p-4">
              <p className="font-mono text-xs text-[#797776]">{dict.study.remaining}</p>
              <p className="mt-1 font-mono text-2xl font-medium text-[#242424]">{finished ? 0 : remaining}</p>
            </CardContent>
          </Card>
        </div>

        <ProgressBar label={dict.study.progress} value={finished ? 100 : progressValue} />

        {loading ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <p className="font-mono text-sm text-[#797776]">{dict.common.loading}</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <Card className="w-full max-w-sm rounded-[40px] border border-[rgba(36,36,36,0.16)] bg-[#f6f3f1] shadow-none">
              <CardContent className="space-y-4 p-6 text-center">
                <BookOpen className="mx-auto h-10 w-10 text-[#5a6fa0]" />
                <h2 className="text-xl font-bold">{dict.study.emptyTitle}</h2>
                <p className="text-sm leading-relaxed text-[#797776]">{dict.study.emptyDesc}</p>
                <Link href={`/${locale}/review`} className={buttonVariants({ className: "w-full rounded-full font-mono" })}>
                  {dict.study.reviewNow}
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : finished ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <Card className="w-full max-w-sm rounded-[40px] border border-[rgba(36,36,36,0.16)] bg-[#f6f3f1] shadow-none">
              <CardContent className="space-y-4 p-6 text-center">
                <Sparkles className="mx-auto h-10 w-10 text-[#4a8a6a]" />
                <h2 className="text-xl font-bold">{dict.study.completedTitle}</h2>
                <p className="text-sm text-[#797776]">
                  {dict.study.completedDesc.replace("{count}", String(completedCount))}
                </p>
                <p className="text-xs leading-relaxed text-[#797776]">{dict.study.scheduleHint}</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-full font-mono" onClick={loadCards}>
                    {dict.study.restart}
                  </Button>
                  <Link href={`/${locale}/review`} className={buttonVariants({ className: "flex-1 rounded-full font-mono" })}>
                    {dict.review.startReview}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-center gap-5 py-5 pb-24 md:pb-8">
            {currentCard && (
              <StudyFlashcard grammar={currentCard} flipped={flipped} onFlip={() => setFlipped((value) => !value)} />
            )}
            <div className="mx-auto w-full max-w-lg">
              {flipped ? (
                <ReviewButtons onRate={handleRate} />
              ) : (
                <Button className="w-full rounded-full font-mono" onClick={() => setFlipped(true)}>
                  {dict.study.showAnswer}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
