"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { GrammarTypeBadge } from "@/components/grammar/GrammarTypeBadge";
import { FavoriteButton } from "@/components/grammar/FavoriteButton";
import { ProgressBar } from "@/components/study/ProgressBar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { grammarService } from "@/services/grammarService";
import { learningService, type UnifiedProgressRow } from "@/services/learningService";
import { toGrammarEntry } from "@/lib/mappers";
import { formatDate, formatRelativeDate } from "@/lib/date";
import { localizedGrammar, localizedStructure, studyStatusLabel } from "@/lib/grammar-content";
import { getSameTitleEntries, grammarVariantLabel } from "@/lib/grammar-relations";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import type { GrammarEntry, StudyStatus } from "@/lib/types";
import { ArrowLeft, BookOpen, WifiOff } from "lucide-react";

function DetailSection({
  title,
  children,
  accent = "plain",
}: {
  title: string;
  children: ReactNode;
  accent?: "plain" | "blue" | "warm" | "rose";
}) {
  const styles = {
    plain: "bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)]",
    blue: "bg-[#cfdaf5]",
    warm: "bg-[#fff6df] border border-[rgba(232,193,120,0.55)]",
    rose: "bg-[#f4b4a8]/18 border border-[rgba(244,180,168,0.45)]",
  };

  return (
    <Card className={`${styles[accent]} rounded-[32px] ring-0 shadow-none`}>
      <CardContent className="p-5">
        <h3 className="mb-2 font-mono text-xs font-medium uppercase text-[#797776]">{title}</h3>
        {children}
      </CardContent>
    </Card>
  );
}

export default function GrammarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params.slug as string;
  const slug = (() => {
    try {
      return decodeURIComponent(rawSlug);
    } catch {
      return rawSlug;
    }
  })();
  const dict = useDictionary();
  const locale = useLocale();
  const { user } = useAuth();
  const [grammar, setGrammar] = useState<GrammarEntry | null>(null);
  const [allEntries, setAllEntries] = useState<GrammarEntry[]>([]);
  const [progress, setProgress] = useState<UnifiedProgressRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setFetchError(false);
    setGrammar(null);

    const fetchGrammar = async () => {
      try {
        const data = await grammarService.getBySlug(slug, user?.id);
        const entry = toGrammarEntry(data);
        setGrammar(entry);
        try {
          const all = await grammarService.getAll(user?.id);
          setAllEntries(all.map(toGrammarEntry));
        } catch {
          setAllEntries([entry]);
        }
        try {
          setProgress(await learningService.getByGrammar(entry.id, user?.id));
        } catch {
          setProgress(null);
        }
      } catch {
        try {
          const all = await grammarService.getAll(user?.id);
          const found = all.find((g: any) => g.slug === slug || g.slug === rawSlug);
          if (found) {
            const entry = toGrammarEntry(found);
            setGrammar(entry);
            setAllEntries(all.map(toGrammarEntry));
            try {
              setProgress(await learningService.getByGrammar(entry.id, user?.id));
            } catch {
              setProgress(null);
            }
          } else {
            setFetchError(true);
          }
        } catch {
          setFetchError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGrammar();
  }, [rawSlug, slug, user?.id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-[#797776] font-mono text-sm">{dict.common.loading}</p>
        </div>
      </MainLayout>
    );
  }

  if (!grammar) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-bold">{dict.grammar.notFound}</h2>
            {fetchError ? (
              <p className="text-sm text-[#797776]">{dict.grammar.loadFailed}</p>
            ) : (
              <p className="text-sm text-[#797776]">{dict.grammar.missingItem}: {slug}</p>
            )}
            <Link href={`/${locale}/grammar`} className={buttonVariants({ variant: "outline", className: "mt-4 inline-flex" })}>{dict.grammar.backToLibrary}</Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const content = localizedGrammar(grammar, locale);
  const structure = localizedStructure(grammar.structure, locale);
  const studyStatus = (progress?.study_status ?? "未学习") as StudyStatus;
  const sameTitleEntries = getSameTitleEntries(allEntries, grammar);

  const handleFavoriteToggle = async () => {
    const next = await learningService.toggleFavorite(grammar.id, user?.id);
    setProgress(next);
  };

  const handleStartLearning = async () => {
    await learningService.startLearning(grammar.id, user?.id);
    router.push(`/${locale}/study?level=${grammar.jlptLevel}`);
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl py-4 sm:py-6">
        {!user && (
          <div className="mb-4 flex items-start gap-3 rounded-[28px] border border-[rgba(36,36,36,0.16)] bg-[#fff6df] px-4 py-3 text-sm text-[#4e4d4d]">
            <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-[#a08040]" />
            <p>{dict.common.localModeDesc}</p>
          </div>
        )}
        <div className="mb-6">
          <Link href={`/${locale}/grammar`} className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-2" })}>
            <ArrowLeft className="mr-1 h-4 w-4" />{dict.grammar.backToLibrary}
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold">{grammar.title}</h1>
            <LevelBadge level={grammar.jlptLevel} />
            <GrammarTypeBadge category={grammar.grammarType as any} />
            <FavoriteButton isFavorite={!!progress?.is_favorite} onToggle={handleFavoriteToggle} />
          </div>
          <p className="mt-2 font-mono text-xs leading-relaxed text-[#797776]">
            {grammarVariantLabel(grammar, locale)}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <DetailSection title={dict.grammar.meaning}>
              <p className="text-lg font-medium leading-relaxed text-[#242424]">{content.meaning}</p>
            </DetailSection>

            <DetailSection title={dict.grammar.structure}>
              <p className="whitespace-pre-line text-sm leading-relaxed text-[#4e4d4d]">{structure}</p>
            </DetailSection>

            <DetailSection title={dict.grammar.explanation}>
              <p className="whitespace-pre-line text-sm leading-relaxed text-[#4e4d4d]">{content.explanation}</p>
            </DetailSection>

            <DetailSection title={dict.grammar.usageNote}>
              <p className="whitespace-pre-line text-sm leading-relaxed text-[#4e4d4d]">{content.usageNote}</p>
            </DetailSection>

            <DetailSection title={dict.grammar.example} accent="blue">
              <p className="text-lg font-medium leading-relaxed text-[#242424]">{grammar.exampleJp}</p>
              {grammar.furigana && <p className="mt-1 text-sm text-[#797776]">{grammar.furigana}</p>}
              <p className="mt-2 text-sm leading-relaxed text-[#4e4d4d]">{content.exampleTranslation}</p>
            </DetailSection>

            <DetailSection title={dict.grammar.commonMistake} accent="rose">
              <p className="whitespace-pre-line text-sm leading-relaxed text-[#4e4d4d]">{content.commonMistake}</p>
            </DetailSection>

            <DetailSection title={dict.grammar.memoryTip} accent="warm">
              <p className="whitespace-pre-line text-sm leading-relaxed text-[#4e4d4d]">{content.memoryTip}</p>
            </DetailSection>
          </div>

          <div className="space-y-4">
            <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold">{dict.grammar.studyStatus}</h3>
                <Badge variant="secondary" className="rounded-full font-mono text-xs">{studyStatusLabel(studyStatus, locale)}</Badge>
                <ProgressBar label={dict.grammar.masteryLevel} value={progress?.mastery_level ?? 0} />
                <div className="space-y-1 text-xs text-[#797776]">
                  <p>{dict.grammar.reviewCount}: {progress?.review_count ?? 0}</p>
                  <p>{dict.grammar.lastReviewed}: {formatDate(progress?.last_reviewed_at ?? null, locale)}</p>
                  <p>{dict.grammar.nextReview}: {formatRelativeDate(progress?.next_review_at ?? null, locale)}</p>
                </div>
                <Button onClick={handleStartLearning} className="w-full rounded-full font-mono" size="sm">
                  <BookOpen className="mr-1 h-4 w-4" />{dict.grammar.addToStudy}
                </Button>
              </CardContent>
            </Card>

            {sameTitleEntries.length > 0 && (
              <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">{dict.grammar.sameTitleUses}</h3>
                  <p className="mb-3 text-xs leading-relaxed text-[#797776]">{dict.grammar.sameTitleUsesHint}</p>
                  <div className="space-y-2">
                    {sameTitleEntries.map((entry) => {
                      const entryContent = localizedGrammar(entry, locale);
                      return (
                        <Link
                          key={entry.id}
                          href={`/${locale}/grammar/${entry.slug}`}
                          className="block rounded-[24px] border border-[rgba(36,36,36,0.12)] px-3 py-2 text-sm transition-colors hover:bg-[#cfdaf5]/45"
                        >
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold">{entry.title}</span>
                            <Badge variant="secondary" className="rounded-full font-mono text-[10px]">{entry.jlptLevel}</Badge>
                          </div>
                          <p className="mt-1 font-mono text-[11px] leading-relaxed text-[#797776]">{grammarVariantLabel(entry, locale)}</p>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#4e4d4d]">{entryContent.meaning}</p>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {grammar.similarGrammar?.length > 0 && (
              <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-3">{dict.grammar.similarGrammar}</h3>
                  <div className="space-y-2">
                    {(grammar.similarGrammar as any).map((sg: any, i: number) => (
                      <div key={i} className="text-sm">
                        <Link href={`/${locale}/grammar/${sg.slug}`} className="font-medium hover:underline">{sg.title}</Link>
                        <p className="text-xs text-[#797776]">{sg.difference}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
