"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { useAuth } from "@/hooks/useAuth";
import { grammarService } from "@/services/grammarService";
import { learningService } from "@/services/learningService";
import { BookOpen, RotateCcw, Brain, AlertTriangle, Bookmark, BarChart3, ArrowRight, Play } from "lucide-react";

const featureList = [
  { icon: BookOpen, color: "bg-[#cfdaf5] text-[#242424]" },
  { icon: RotateCcw, color: "bg-[#fff6df] text-[#8a6a20]" },
  { icon: Brain, color: "bg-[#dcebd8] text-[#315b3b]" },
  { icon: AlertTriangle, color: "bg-[#f4b4a8]/40 text-[#7a3a30]" },
  { icon: Bookmark, color: "bg-[#e8e0f5] text-[#5a3a8a]" },
  { icon: BarChart3, color: "bg-[#d8e8f0] text-[#2a5a7a]" },
];

export default function HomePage() {
  const dict = useDictionary();
  const locale = useLocale();
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalGrammar: 680, learned: 0, due: 0, mastered: 0 });
  const [levelPcts, setLevelPcts] = useState<Record<string, number>>({ N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 });

  useEffect(() => {
    (async () => {
      const [rows, progressMap] = await Promise.all([
        grammarService.getAll(user?.id ?? undefined).catch(() => [] as any[]),
        learningService.getProgressMap(user?.id ?? undefined).catch(() => new Map()),
      ]);

      const total = rows.length;
      const byLevel: Record<string, { total: number; learned: number }> = { N5: { total: 0, learned: 0 }, N4: { total: 0, learned: 0 }, N3: { total: 0, learned: 0 }, N2: { total: 0, learned: 0 }, N1: { total: 0, learned: 0 } };
      let learned = 0;
      let mastered = 0;

      for (const row of rows) {
        const level = row.jlpt_level ?? row.jlptLevel;
        if (byLevel[level]) byLevel[level].total++;
        const progress = progressMap.get(String(row.source_key ?? row.id));
        if (progress) {
          if (progress.study_status === "学习中" || progress.study_status === "已掌握") {
            learned++;
            if (byLevel[level]) byLevel[level].learned++;
          }
          if (progress.study_status === "已掌握") mastered++;
        }
      }

      const now = Date.now();
      let due = 0;
      for (const [, p] of progressMap) {
        if (p.next_review_at && new Date(p.next_review_at).getTime() <= now && p.study_status === "学习中") {
          due++;
        }
      }

      const pcts: Record<string, number> = {};
      for (const lv of ["N5", "N4", "N3", "N2", "N1"]) {
        pcts[lv] = byLevel[lv].total > 0 ? Math.round((byLevel[lv].learned / byLevel[lv].total) * 100) : 0;
      }

      setStats({ totalGrammar: total, learned, due, mastered });
      setLevelPcts(pcts);
    })();
  }, [user]);

  return (
    <MainLayout>
      <div className="bg-background">
        {/* Hero Section */}
        <section className="mx-auto max-w-[1200px] px-6 pt-12 pb-16 md:pt-16 md:pb-20">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(36,36,36,0.06)] px-4 py-1.5 mb-6">
                <BookOpen className="h-3.5 w-3.5 text-[#242424]" />
                <span className="font-mono text-xs text-[#242424]">{dict.home.totalGrammar} {stats.totalGrammar}</span>
              </div>
              <h1 className="font-serif text-[clamp(32px,5vw,56px)] leading-[1.15] tracking-[-0.02em] text-[#000000]">
                {dict.home.heroTitle1}{dict.home.heroTitle2}
              </h1>
              <p className="mt-4 text-sm md:text-base text-[#797776] leading-relaxed max-w-md mx-auto lg:mx-0">
                {dict.home.heroSubtitle}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href={`/${locale}/study`}
                  className="inline-flex items-center justify-center gap-2 bg-[#242424] text-[#f6f3f1] rounded-full px-6 py-3 font-mono text-sm hover:bg-black transition-colors"
                >
                  <Play className="h-4 w-4" />
                  {dict.common.startLearning}
                </Link>
                <Link
                  href={`/${locale}/grammar`}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-[#242424] border border-[rgba(36,36,36,0.2)] rounded-full px-6 py-3 font-mono text-sm hover:bg-[rgba(36,36,36,0.04)] transition-colors"
                >
                  {dict.common.viewLibrary}
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[340px] bg-[#cfdaf5] rounded-[32px] p-7 md:p-8 flex flex-col gap-6 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="rounded-full border-[#242424]/20 text-[#242424] font-mono text-[10px] px-2.5 py-0.5">
                      N3
                    </Badge>
                    <span className="font-mono text-[10px] text-[#797776]">Noun-phrase + わけではない</span>
                  </div>
                  <h2 className="font-serif text-[clamp(24px,3.5vw,36px)] leading-[1.1] text-[#000000]">
                    ～わけではない
                  </h2>
                  <p className="mt-2.5 text-sm text-[#242424]/80 font-medium">
                    {dict.home.previewMeaning}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="rounded-2xl bg-white/50 px-4 py-3">
                    <p className="font-mono text-[10px] text-[#797776] mb-1">{dict.home.previewStructure}</p>
                    <p className="text-sm text-[#242424]">普通形 + わけではない</p>
                  </div>
                  <div className="rounded-2xl bg-white/50 px-4 py-3">
                    <p className="font-mono text-[10px] text-[#797776] mb-1">{dict.home.previewStatus}</p>
                    <p className="text-sm text-[#242424]">学习中</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mx-auto max-w-[1432px] px-6 py-20 md:py-28">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-2xl md:text-3xl tracking-[-0.02em]">
              {dict.home.featuresTitle}
            </h2>
            <p className="mt-3 text-sm text-[#797776] max-w-lg mx-auto">
              从语法库浏览到智能复习，覆盖完整学习闭环
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {dict.home.features.map((f, i) => {
              const Icon = featureList[i].icon;
              return (
                <div
                  key={i}
                  className="bg-[#fbfaf8] border border-[rgba(36,36,36,0.12)] rounded-[24px] p-6 hover:shadow-sm transition-shadow"
                >
                  <div className={`w-10 h-10 rounded-xl ${featureList[i].color} flex items-center justify-center mb-4`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-mono text-sm font-medium mb-2 text-[#242424]">{f.title}</h3>
                  <p className="text-sm text-[#797776] leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Learning Flow */}
        <section className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl tracking-[-0.02em]">
              {dict.home.flowTitle}
            </h2>
            <p className="mt-3 text-sm text-[#797776] max-w-lg mx-auto leading-relaxed">
              选择等级 → 浏览学习 → 卡片复习 → 评分反馈 → 自动排期
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 items-start">
            {dict.home.flowSteps.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-[#fbfaf8] border border-[rgba(36,36,36,0.12)] rounded-[24px] p-5 text-center h-full">
                  <div className="w-8 h-8 rounded-full bg-[#242424] text-[#f6f3f1] flex items-center justify-center mx-auto mb-3 font-mono text-xs font-medium">
                    {i + 1}
                  </div>
                  <p className="font-mono text-sm font-medium text-[#242424] mb-1">{step.step}</p>
                  <p className="text-xs text-[#797776] leading-relaxed">{step.desc}</p>
                </div>
                {i < dict.home.flowSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-4 w-4 text-[#242424]/30" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href={`/${locale}/study`}
              className="inline-flex items-center gap-2 bg-[#242424] text-[#f6f3f1] rounded-full px-6 py-3 font-mono text-sm hover:bg-black transition-colors"
            >
              <Play className="h-4 w-4" />
              {dict.common.startLearning}
            </Link>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl tracking-[-0.02em]">
              {dict.home.statsTitle}
            </h2>
            <p className="mt-3 text-sm text-[#797776]">
              实时追踪你的学习进度
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { value: String(stats.due), label: dict.home.todayReview, color: "bg-[#cfdaf5]" },
              { value: String(stats.learned), label: dict.home.learnedGrammar, color: "bg-[#dcebd8]" },
              { value: String(stats.mastered), label: dict.home.masteredGrammar, color: "bg-[#fff6df]" },
              { value: String(stats.totalGrammar), label: dict.home.totalGrammar, color: "bg-[#f4b4a8]/40" },
            ].map((s, i) => (
              <Card key={i} className={`border-0 rounded-[28px] ${s.color} shadow-none`}>
                <CardContent className="p-6 text-center">
                  <p className="font-mono text-3xl font-medium text-[#242424]">{s.value}</p>
                  <p className="text-sm text-[#242424]/70 mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border border-[rgba(36,36,36,0.12)] rounded-[28px] bg-[#fbfaf8] shadow-none overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-mono text-sm font-medium text-[#242424]">{dict.home.levelProgress}</h3>
                <Link href={`/${locale}/dashboard`} className="font-mono text-xs text-[#797776] hover:text-[#242424] transition-colors">
                  查看详情 →
                </Link>
              </div>
              <div className="space-y-6">
                {(["N5","N4","N3","N2","N1"] as const).map((level) => (
                  <div key={level}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-[#242424] text-[#f6f3f1] flex items-center justify-center font-mono text-xs font-medium">
                          {level}
                        </span>
                        <span className="font-mono text-xs text-[#797776]">{levelPcts[level]}% 完成</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-[rgba(36,36,36,0.08)] rounded-full overflow-hidden">
                      <div className="h-full bg-[#242424] rounded-full transition-all duration-500" style={{ width: `${levelPcts[level]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-[1200px] px-6 pb-16 md:pb-24">
          <div className="relative bg-[#242424] rounded-[32px] p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#cfdaf5] rounded-full opacity-10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#fff6df] rounded-full opacity-10 translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="font-serif text-xl md:text-3xl text-[#f6f3f1] tracking-[-0.02em] leading-tight">
                {dict.home.ctaText}
              </h2>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/${locale}/study`}
                  className="inline-flex items-center justify-center gap-2 bg-[#f6f3f1] text-[#242424] rounded-full px-8 py-3.5 font-mono text-sm hover:bg-white transition-colors"
                >
                  <Play className="h-4 w-4" />
                  {dict.home.ctaButton}
                </Link>
                <Link
                  href={`/${locale}/grammar`}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-[#f6f3f1] border border-[#f6f3f1]/30 rounded-full px-8 py-3.5 font-mono text-sm hover:bg-[#f6f3f1]/10 transition-colors"
                >
                  {dict.common.viewLibrary}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
