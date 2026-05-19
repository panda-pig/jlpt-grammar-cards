"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { SourceRouteBadge } from "@/components/grammar/SourceRouteBadge";
import { GrammarTypeBadge } from "@/components/grammar/GrammarTypeBadge";
import { FavoriteButton } from "@/components/grammar/FavoriteButton";
import { ProgressBar } from "@/components/study/ProgressBar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { grammarService } from "@/services/grammarService";
import { ArrowLeft, BookOpen } from "lucide-react";

function toGrammarEntry(row: any) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    jlptLevel: row.jlpt_level,
    sourceRoute: row.source_route,
    grammarType: row.grammar_type,
    tags: row.tags || [],
    meaningCn: row.meaning_cn,
    meaningEn: row.meaning_en,
    structure: row.structure,
    explanation: row.explanation,
    usageNote: row.usage_note,
    exampleJp: row.example_jp,
    exampleCn: row.example_cn,
    furigana: row.furigana,
    similarGrammar: row.similar_grammar || [],
    commonMistake: row.common_mistake,
    memoryTip: row.memory_tip,
    quizQuestion: row.quiz_question,
    quizChoices: row.quiz_choices || [],
    quizAnswer: row.quiz_answer,
    quizExplanation: row.quiz_explanation,
    isFavorite: false,
    studyStatus: "未学习",
    nextReviewAt: null,
    lastReviewedAt: null,
    reviewCount: 0,
    masteryLevel: 0,
  };
}

export default function GrammarDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [grammar, setGrammar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    grammarService.getBySlug(slug).then((data) => {
      setGrammar(toGrammarEntry(data));
      setIsFav(false);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-[#797776] font-mono text-sm">加载中...</p>
        </div>
      </MainLayout>
    );
  }

  if (!grammar) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-xl font-bold">语法未找到</h2>
            <Link href="/grammar" className={buttonVariants({ variant: "outline", className: "mt-4" })}>返回语法库</Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl py-4 sm:py-6">
        <div className="mb-6">
          <Link href="/grammar" className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-2" })}>
            <ArrowLeft className="mr-1 h-4 w-4" />返回语法库
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold">{grammar.title}</h1>
            <LevelBadge level={grammar.jlptLevel} />
            <SourceRouteBadge route={grammar.sourceRoute} />
            <GrammarTypeBadge category={grammar.grammarType as any} />
            <FavoriteButton isFavorite={isFav} onToggle={() => setIsFav(!isFav)} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2">意思</h3>
                <p className="text-lg">{grammar.meaningCn}</p>
                {grammar.meaningEn && <p className="text-sm text-[#797776] mt-1">{grammar.meaningEn}</p>}
              </CardContent>
            </Card>

            {grammar.structure && (
              <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">接续</h3>
                  <p>{grammar.structure}</p>
                </CardContent>
              </Card>
            )}

            {grammar.explanation && (
              <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">详细解释</h3>
                  <p className="text-sm leading-relaxed text-[#4e4d4d]">{grammar.explanation}</p>
                </CardContent>
              </Card>
            )}

            {(grammar.exampleJp || grammar.exampleCn) && (
              <Card className="bg-[#cfdaf5] rounded-[40px] ring-0 shadow-none">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">例句</h3>
                  {grammar.exampleJp && <p className="text-lg font-medium mb-1">{grammar.exampleJp}</p>}
                  {grammar.furigana && <p className="text-sm text-[#797776] mb-1">{grammar.furigana}</p>}
                  {grammar.exampleCn && <p className="text-sm text-[#4e4d4d]">{grammar.exampleCn}</p>}
                </CardContent>
              </Card>
            )}

            {grammar.commonMistake && (
              <Card className="bg-[#f4b4a8]/20 rounded-[40px] ring-0 shadow-none">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">易错点</h3>
                  <p className="text-sm text-[#4e4d4d]">{grammar.commonMistake}</p>
                </CardContent>
              </Card>
            )}

            {grammar.memoryTip && (
              <Card className="bg-[#cfdaf5]/40 rounded-[40px] ring-0 shadow-none">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">记忆提示</h3>
                  <p className="text-sm text-[#4e4d4d]">{grammar.memoryTip}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold">学习状态</h3>
                <Badge variant="secondary" className="rounded-full font-mono text-xs">{grammar.studyStatus}</Badge>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#797776]">复习次数</span><span>{grammar.reviewCount}</span></div>
                  <div className="flex justify-between"><span className="text-[#797776]">掌握度</span><span>{grammar.masteryLevel}%</span></div>
                </div>
                <ProgressBar label="掌握度" value={grammar.masteryLevel} />
                <Link href={`/study?level=${grammar.jlptLevel}`} className={buttonVariants({ className: "w-full rounded-full font-mono", size: "sm" })}>
                  <BookOpen className="mr-1 h-4 w-4" />开始学习
                </Link>
              </CardContent>
            </Card>

            {grammar.similarGrammar?.length > 0 && (
              <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-3">相近语法</h3>
                  <div className="space-y-2">
                    {grammar.similarGrammar.map((sg: any, i: number) => (
                      <div key={i} className="text-sm">
                        <Link href={`/grammar/${sg.slug}`} className="font-medium hover:underline">{sg.title}</Link>
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
