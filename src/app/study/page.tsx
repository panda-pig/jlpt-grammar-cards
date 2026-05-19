"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { StudyFlashcard } from "@/components/study/StudyFlashcard";
import { ReviewButtons } from "@/components/study/ReviewButtons";
import { ProgressBar } from "@/components/study/ProgressBar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useGrammar } from "@/context/GrammarContext";
import type { GrammarEntry, JLPTLevel, ReviewRating } from "@/lib/types";
import { Sparkles, RefreshCw } from "lucide-react";

type StudyState = "idle" | "studying" | "completed";

export default function StudyPage() {
  const { entries } = useGrammar();
  const [state, setState] = useState<StudyState>("idle");
  const [level, setLevel] = useState<JLPTLevel>("N3");
  const [cards, setCards] = useState<GrammarEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const startSession = useCallback(() => {
    const levelCards = entries.filter((e) => e.jlptLevel === level);
    if (levelCards.length === 0) return;
    setCards(levelCards);
    setCurrentIndex(0);
    setFlipped(false);
    setCompletedCount(0);
    setState("studying");
  }, [level, entries]);

  const handleRate = useCallback(
    (rating: ReviewRating) => {
      setFlipped(false);
      setCompletedCount((c) => c + 1);
      if (currentIndex + 1 >= cards.length) {
        setState("completed");
      } else {
        setTimeout(() => setCurrentIndex((i) => i + 1), 300);
      }
    },
    [currentIndex, cards.length]
  );

  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  if (state === "idle") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-sm bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
            <CardContent className="p-6 text-center space-y-4">
              <Sparkles className="h-10 w-10 mx-auto text-[#242424]" />
              <h2 className="text-xl font-serif font-bold">开始学习</h2>
              <p className="text-sm text-[#797776]">选择等级，开始 Anki 风格的卡片学习</p>
              <div className="text-left">
                <label className="font-mono text-xs font-medium text-[#797776] mb-1 block">选择等级</label>
                <Select value={level} onValueChange={(v) => setLevel(v as JLPTLevel)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["N5", "N4", "N3", "N2", "N1"] as JLPTLevel[]).map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full rounded-full font-mono" size="lg" onClick={startSession}>
                开始学习
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (state === "completed") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-sm bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
            <CardContent className="p-6 text-center space-y-4">
              <Sparkles className="h-10 w-10 mx-auto text-[#4a8a6a]" />
              <h2 className="text-xl font-serif font-bold">复习完成！</h2>
              <p className="text-sm text-[#797776]">
                你今天复习了 <span className="font-bold text-[#242424]">{completedCount}</span> 个语法
              </p>
              <ProgressBar label="完成率" value={100} />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-full font-mono" onClick={startSession}>
                  <RefreshCw className="mr-1 h-4 w-4" />重新开始
                </Button>
                <Link href="/grammar" className={buttonVariants({ className: "flex-1 rounded-full font-mono" })}>查看语法库</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <MainLayout>
      <div className="flex flex-col">
        <div className="mx-auto w-full max-w-2xl px-6 py-4">
          <div className="flex items-center justify-between mb-4 text-sm font-mono text-[#797776]">
            <span>
              进度：{currentIndex + 1} / {cards.length}
            </span>
            <span>等级：{level}</span>
            <span>剩余：{cards.length - currentIndex - 1}</span>
          </div>
          <ProgressBar label="今日进度" value={progress} />
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <StudyFlashcard grammar={currentCard} flipped={flipped} onFlip={() => setFlipped(!flipped)} />
        </div>

        <div className="mx-auto w-full max-w-2xl px-6 py-4">
          <ReviewButtons onRate={handleRate} disabled={!flipped} />
        </div>
      </div>
    </MainLayout>
  );
}
