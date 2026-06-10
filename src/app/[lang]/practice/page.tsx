"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgressBar } from "@/components/study/ProgressBar";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { grammarService } from "@/services/grammarService";
import { learningService, type UnifiedProgressRow } from "@/services/learningService";
import { toGrammarEntry } from "@/lib/mappers";
import { buildClozeDeck, buildClozeDeckFrom, isClozeEligible, BLANK_MARKER, type ClozeQuestion } from "@/lib/cloze";
import { canonicalGrammarId } from "@/lib/grammar-dedupe";
import { localizedGrammar } from "@/lib/grammar-content";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { cn } from "@/lib/utils";
import type { GrammarEntry, JLPTLevel } from "@/lib/types";
import { Check, Sparkles, Target, X } from "lucide-react";

type Level = JLPTLevel | "all";
type Source = "today" | "studied" | "all";
type Phase = "setup" | "loading" | "playing" | "empty" | "finished";

const ALL_DECK_SIZE = 10;   // random sample for the full-grammar mode
const SCOPED_DECK_SIZE = 20; // cover the (small) studied/today set

function isToday(iso: string | null | undefined): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export default function PracticePage() {
  const { user } = useAuth();
  const dict = useDictionary();
  const locale = useLocale();
  const t = dict.practice;

  const [entries, setEntries] = useState<GrammarEntry[]>([]);
  const [progressMap, setProgressMap] = useState<Map<string, UnifiedProgressRow>>(new Map());
  const [loaded, setLoaded] = useState(false);
  const [source, setSource] = useState<Source>("studied");
  const [level, setLevel] = useState<Level>("all");
  const [phase, setPhase] = useState<Phase>("setup");
  const [deck, setDeck] = useState<ClozeQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    Promise.all([
      grammarService.getAll(user?.id).catch(() => [] as unknown[]),
      learningService.getProgressMap(user?.id).catch(() => new Map<string, UnifiedProgressRow>()),
    ]).then(([rows, map]) => {
      setEntries((rows as Parameters<typeof toGrammarEntry>[0][]).map(toGrammarEntry));
      setProgressMap(map);
      setLoaded(true);
    });
  }, [user?.id]);

  const entryMap = useMemo(() => {
    const m = new Map<string, GrammarEntry>();
    for (const e of entries) m.set(e.id, e);
    return m;
  }, [entries]);

  const levelOptions = useMemo(() => ["all", "N5", "N4", "N3", "N2", "N1"] as Level[], []);

  // Candidate sets per source. Distractors always come from the full pool.
  const studiedEntries = useMemo(
    () =>
      entries.filter((e) => {
        const p = progressMap.get(canonicalGrammarId(e.id));
        return p?.study_status === "学习中" || p?.study_status === "已掌握";
      }),
    [entries, progressMap]
  );
  const todayEntries = useMemo(
    () => studiedEntries.filter((e) => isToday(progressMap.get(canonicalGrammarId(e.id))?.last_reviewed_at)),
    [studiedEntries, progressMap]
  );

  // Eligible (has example sentence) counts shown on each mode chip.
  const counts = useMemo(
    () => ({
      today: todayEntries.filter(isClozeEligible).length,
      studied: studiedEntries.filter(isClozeEligible).length,
      all: entries.filter(isClozeEligible).length,
    }),
    [todayEntries, studiedEntries, entries]
  );

  // Default to the most relevant non-empty scope once data is loaded.
  useEffect(() => {
    if (!loaded) return;
    if (counts.today > 0) setSource("today");
    else if (counts.studied > 0) setSource("studied");
    else setSource("all");
  }, [loaded, counts.today, counts.studied]);

  // Same-frame double-click guard: `answered` comes from the render closure,
  // so two rapid clicks could both pass it and double-count the score.
  const answerLock = useRef(false);

  const start = useCallback(() => {
    setPhase("loading");
    setTimeout(() => {
      const generated =
        source === "all"
          ? buildClozeDeck(entries, level, ALL_DECK_SIZE)
          : buildClozeDeckFrom(source === "today" ? todayEntries : studiedEntries, entries, SCOPED_DECK_SIZE);
      if (generated.length === 0) {
        setPhase("empty");
        return;
      }
      setDeck(generated);
      setIndex(0);
      setPicked(null);
      setScore(0);
      answerLock.current = false;
      setPhase("playing");
    }, 0);
  }, [source, level, entries, todayEntries, studiedEntries]);

  const current = deck[index] ?? null;
  const answered = picked !== null;
  const isLast = index >= deck.length - 1;

  const choose = (option: string) => {
    if (answered || answerLock.current || !current) return;
    answerLock.current = true;
    setPicked(option);
    if (option === current.correctTitle) setScore((s) => s + 1);
  };

  const next = () => {
    answerLock.current = false;
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

              {/* Source scope: today ⊆ studied ⊆ all */}
              <div className="space-y-2">
                <span className="font-mono text-xs text-[#797776]">{t.sourceLabel}</span>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: "today", label: t.sourceToday, count: counts.today },
                    { key: "studied", label: t.sourceStudied, count: counts.studied },
                    { key: "all", label: t.sourceAll, count: counts.all },
                  ] as const).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setSource(opt.key)}
                      className={cn(
                        "rounded-[12px] border px-3 py-2.5 text-left transition-all",
                        source === opt.key
                          ? "border-[#242424] bg-[#cfdaf5]"
                          : "border-[#ded8d0] bg-[#fbfaf8] hover:border-[#242424]"
                      )}
                    >
                      <div className="font-mono text-[13px] font-bold text-[#242424]">{opt.label}</div>
                      <div className="mt-0.5 font-mono text-[11px] text-[#797776]">
                        {t.questionsAvailable.replace("{n}", String(opt.count))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Level only narrows the full-grammar pool. */}
              {source === "all" && (
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
                </div>
              )}

              <Button className="btn-v3-primary" onClick={start} disabled={!loaded || counts[source] === 0}>
                <Target className="h-4 w-4" /> {t.startButton}
              </Button>
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
              <p className="text-sm text-[#797776]">
                {source === "today" ? t.emptyToday : source === "studied" ? t.emptyStudied : t.emptyDesc}
              </p>
              <div className="flex justify-center gap-2">
                {source !== "all" && (
                  <Link href={`/${locale}/study`} className={buttonVariants({ className: "rounded-full font-mono" })}>
                    {t.backToStudy}
                  </Link>
                )}
                <Button variant="outline" className="rounded-full font-mono" onClick={() => setPhase("setup")}>
                  {t.sourceLabel}
                </Button>
              </div>
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
