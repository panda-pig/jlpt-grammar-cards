"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgressBar } from "@/components/study/ProgressBar";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { grammarService } from "@/services/grammarService";
import { toGrammarEntry } from "@/lib/mappers";
import { buildClozeDeck, BLANK_MARKER, type ClozeQuestion } from "@/lib/cloze";
import { localizedGrammar } from "@/lib/grammar-content";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { cn } from "@/lib/utils";
import type { GrammarEntry, JLPTLevel } from "@/lib/types";
import { Check, Sparkles, Target, X } from "lucide-react";

type Level = JLPTLevel | "all";
type Phase = "setup" | "loading" | "playing" | "empty" | "finished";

const DECK_SIZE = 10;

export default function PracticePage() {
  const { user } = useAuth();
  const dict = useDictionary();
  const locale = useLocale();
  const t = dict.practice;

  const [entries, setEntries] = useState<GrammarEntry[]>([]);
  const [level, setLevel] = useState<Level>("N3");
  const [phase, setPhase] = useState<Phase>("setup");
  const [deck, setDeck] = useState<ClozeQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    grammarService
      .getAll(user?.id)
      .then((rows) => setEntries(rows.map(toGrammarEntry)))
      .catch(() => setEntries([]));
  }, [user?.id]);

  const entryMap = useMemo(() => {
    const m = new Map<string, GrammarEntry>();
    for (const e of entries) m.set(e.id, e);
    return m;
  }, [entries]);

  const levelOptions = useMemo(() => ["all", "N5", "N4", "N3", "N2", "N1"] as Level[], []);

  const start = useCallback(() => {
    setPhase("loading");
    // Generate on next tick so the loading state can paint.
    setTimeout(() => {
      const generated = buildClozeDeck(entries, level, DECK_SIZE);
      if (generated.length === 0) {
        setPhase("empty");
        return;
      }
      setDeck(generated);
      setIndex(0);
      setPicked(null);
      setScore(0);
      setPhase("playing");
    }, 0);
  }, [entries, level]);

  const current = deck[index] ?? null;
  const answered = picked !== null;
  const isLast = index >= deck.length - 1;

  const choose = (option: string) => {
    if (answered || !current) return;
    setPicked(option);
    if (option === current.correctTitle) setScore((s) => s + 1);
  };

  const next = () => {
    if (isLast) {
      setPhase("finished");
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  const currentEntry = current ? entryMap.get(current.id) : undefined;
  const content = currentEntry ? localizedGrammar(currentEntry, locale) : null;

  const questionLabel = current?.mode === "blank" ? t.questionBlank : t.questionIdentify;

  return (
    <MainLayout>
      <div className="mx-auto flex min-h-[calc(100vh-144px)] w-full max-w-3xl flex-col px-4 py-5 sm:px-6 sm:py-7">
        {/* Header */}
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[.06em] text-[#797776]">
            <div className="h-px w-8 bg-[#242424]" />
            {t.eyebrow}
          </div>
          <h1 className="font-serif text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.08] tracking-[-0.022em] text-black text-balance">
            {t.startTitle}
          </h1>
        </div>

        {/* Setup */}
        {phase === "setup" && (
          <Card className="card-soft rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
            <CardContent className="space-y-5 p-6">
              <p className="text-sm leading-relaxed text-[#797776]">{t.startDesc}</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-[#797776]">{t.selectLevel}</span>
                <Select value={level} onValueChange={(val) => setLevel(val as Level)}>
                  <SelectTrigger className="w-32 rounded-full border-[#ded8d0] bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levelOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item === "all" ? t.allLevels : item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="btn-v3-primary" onClick={start} disabled={entries.length === 0}>
                  <Target className="h-4 w-4" /> {t.startButton}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {phase === "loading" && (
          <p className="font-mono text-sm text-[#797776]">{t.loading}</p>
        )}

        {phase === "empty" && (
          <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
            <CardContent className="space-y-4 p-8 text-center">
              <h2 className="font-serif text-xl font-bold">{t.emptyTitle}</h2>
              <p className="text-sm text-[#797776]">{t.emptyDesc}</p>
              <Button variant="outline" className="rounded-full font-mono" onClick={() => setPhase("setup")}>
                {t.selectLevel}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Playing */}
        {phase === "playing" && current && (
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between font-mono text-xs text-[#797776]">
              <span>{t.progress}: {index + 1} / {deck.length}</span>
              <span>{t.score}: {score}</span>
            </div>
            <ProgressBar label={t.progress} value={((index + (answered ? 1 : 0)) / deck.length) * 100} showPercentage={false} />

            <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <LevelBadge level={current.level} />
                  <span className="font-mono text-[11px] uppercase tracking-[.06em] text-[#797776]">{questionLabel}</span>
                </div>
                <p className="font-serif text-[22px] leading-[1.6] text-[#242424]">
                  {current.mode === "blank"
                    ? current.sentence.split(BLANK_MARKER).map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span className="mx-1 rounded-[6px] bg-[#cfdaf5] px-3 py-0.5 align-middle font-mono text-base text-[#2a3a5a]">?</span>
                          )}
                        </span>
                      ))
                    : current.sentence}
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-2 sm:grid-cols-2">
              {current.options.map((opt) => {
                const isCorrect = opt === current.correctTitle;
                const isPicked = opt === picked;
                let cls = "border-[#ded8d0] bg-[#fbfaf8] hover:border-[#242424]";
                if (answered) {
                  if (isCorrect) cls = "border-[#315b3b] bg-[#dcebd8] text-[#315b3b]";
                  else if (isPicked) cls = "border-[#7a3a30] bg-[#f4b4a8]/30 text-[#7a3a30]";
                  else cls = "border-[#ded8d0] bg-[#fbfaf8] opacity-50";
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={answered}
                    onClick={() => choose(opt)}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-[12px] border px-4 py-3 text-left font-mono text-sm transition-all",
                      cls
                    )}
                  >
                    <span className="min-w-0 break-all">{opt}</span>
                    {answered && isCorrect && <Check className="h-4 w-4 shrink-0" />}
                    {answered && isPicked && !isCorrect && <X className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {answered && (
              <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-2 font-mono text-sm font-bold">
                    {picked === current.correctTitle ? (
                      <span className="flex items-center gap-1.5 text-[#315b3b]"><Check className="h-4 w-4" />{t.correct}</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[#7a3a30]"><X className="h-4 w-4" />{t.wrong}</span>
                    )}
                  </div>
                  <div className="rounded-[12px] border border-[#ded8d0] bg-[#f6f3f1] px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[.06em] text-[#797776]">{t.correctAnswer}</p>
                    <p className="mt-1 font-serif text-lg font-bold text-[#242424]">{current.correctTitle}</p>
                    {content?.meaning && <p className="mt-1 text-sm text-[#4e4d4d]">{content.meaning}</p>}
                  </div>
                  {currentEntry && (
                    <Link
                      href={`/${locale}/grammar/${currentEntry.slug}`}
                      className="inline-block font-mono text-xs text-[#797776] underline underline-offset-4 hover:text-[#242424]"
                    >
                      {dict.home.viewDetails}
                    </Link>
                  )}
                  <div>
                    <Button className="btn-v3-primary" onClick={next}>
                      {isLast ? t.finish : t.next}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Finished */}
        {phase === "finished" && (
          <Card className="card-soft rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
            <CardContent className="space-y-4 p-8 text-center">
              <Sparkles className="mx-auto h-10 w-10 text-[#8a6a20]" />
              <h2 className="font-serif text-2xl font-bold">{t.completedTitle}</h2>
              <p className="text-sm text-[#797776]">
                {t.completedDesc.replace("{total}", String(deck.length)).replace("{correct}", String(score))}
              </p>
              <p className="font-serif text-5xl font-bold text-[#242424]">
                {Math.round((score / deck.length) * 100)}%
              </p>
              <p className="font-mono text-xs text-[#797776]">{t.accuracy}</p>
              <div className="flex justify-center gap-2 pt-2">
                <Button className="btn-v3-primary" onClick={start}>{t.restart}</Button>
                <Link href={`/${locale}/study`} className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}>
                  {t.backToStudy}
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
