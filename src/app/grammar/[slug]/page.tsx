"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { SourceRouteBadge } from "@/components/grammar/SourceRouteBadge";
import { GrammarTypeBadge } from "@/components/grammar/GrammarTypeBadge";
import { FavoriteButton } from "@/components/grammar/FavoriteButton";
import { ProgressBar } from "@/components/study/ProgressBar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { grammarEntries } from "@/lib/mock-data";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function GrammarDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const grammar = grammarEntries.find((g) => g.slug === slug);
  const [isFav, setIsFav] = useState(grammar?.isFavorite ?? false);

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
      <div className="mx-auto max-w-4xl px-6 py-6">
        <Link href="/grammar" className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-4" })}>
          <ArrowLeft className="mr-1 h-4 w-4" />返回语法库
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <LevelBadge level={grammar.jlptLevel} />
                    <SourceRouteBadge route={grammar.sourceRoute} />
                    <GrammarTypeBadge category={grammar.grammarType} />
                  </div>
                  <div className="flex items-center gap-1">
                    <FavoriteButton isFavorite={isFav} onToggle={() => setIsFav(!isFav)} />
                    <Button size="sm" variant="outline">
                      <BookOpen className="mr-1 h-3 w-3" />加入复习
                    </Button>
                  </div>
                </div>
                <h1 className="text-2xl font-bold mt-3">{grammar.title}</h1>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">意思</h3>
                <p className="text-lg font-medium">{grammar.meaningCn}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{grammar.meaningEn}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">接続</h3>
                <p className="text-sm whitespace-pre-line">{grammar.structure}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">詳細解説</h3>
                <p className="text-sm leading-relaxed">{grammar.explanation}</p>
              </CardContent>
            </Card>

            {grammar.usageNote && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">使用場面</h3>
                  <p className="text-sm">{grammar.usageNote}</p>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">例文</h3>
                <p className="text-base">{grammar.exampleJp}</p>
                <p className="text-sm text-muted-foreground mt-1">{grammar.exampleCn}</p>
              </CardContent>
            </Card>

            {grammar.commonMistake && (
              <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold text-amber-800 mb-1">⚠️ よくある間違い</h3>
                  <p className="text-sm text-amber-700">{grammar.commonMistake}</p>
                </CardContent>
              </Card>
            )}

            {grammar.memoryTip && (
              <Card className="border-sky-200 bg-sky-50/50 shadow-sm">
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold text-sky-800 mb-1">💡 覚え方のヒント</h3>
                  <p className="text-sm text-sky-700">{grammar.memoryTip}</p>
                </CardContent>
              </Card>
            )}

            {grammar.similarGrammar.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">似ている文法</h3>
                  <div className="space-y-3">
                    {grammar.similarGrammar.map((s) => (
                      <div key={s.slug} className="rounded-xl border p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{s.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{s.difference}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">練習問題</h3>
                <p className="text-sm mb-3">{grammar.quizQuestion}</p>
                <div className="grid grid-cols-2 gap-2">
                  {grammar.quizChoices.map((c) => (
                    <Button key={c.key} variant="outline" size="sm" className="justify-start font-normal">
                      {c.key}. {c.text}
                    </Button>
                  ))}
                </div>
                <details className="mt-3">
                  <summary className="text-sm text-primary cursor-pointer">查看答案</summary>
                  <p className="text-sm mt-1">
                    正确答案：<span className="font-bold">{grammar.quizAnswer}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{grammar.quizExplanation}</p>
                </details>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold mb-3">学习状态</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">状态</span>
                    <Badge variant="secondary">{grammar.studyStatus}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">复习次数</span>
                    <span className="font-medium">{grammar.reviewCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">上次复习</span>
                    <span className="font-medium">
                      {grammar.lastReviewedAt ? new Date(grammar.lastReviewedAt).toLocaleDateString("zh-CN") : "从未"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">下次复习</span>
                    <span className="font-medium">
                      {grammar.nextReviewAt ? new Date(grammar.nextReviewAt).toLocaleDateString("zh-CN") : "未安排"}
                    </span>
                  </div>
                  <ProgressBar label="掌握度" value={grammar.masteryLevel} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold mb-2">标签</h3>
                <div className="flex flex-wrap gap-1">
                  {grammar.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}