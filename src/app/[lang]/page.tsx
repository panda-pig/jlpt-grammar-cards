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

const featureIcons = [
  <BookOpen key="1" className="h-5 w-5" />,
  <RotateCcw key="2" className="h-5 w-5" />,
  <Brain key="3" className="h-5 w-5" />,
  <AlertTriangle key="4" className="h-5 w-5" />,
  <Bookmark key="5" className="h-5 w-5" />,
  <BarChart3 key="6" className="h-5 w-5" />,
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
        <section className="mx-auto max-w-[1432px] px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="font-serif text-[clamp(40px,6vw,72px)] leading-[1.1] tracking-[-0.02em] text-[#000000]">
                {dict.home.heroTitle1}<br />{dict.home.heroTitle2}
              </h1>
              <p className="mt-4 text-base md:text-lg text-[#4e4d4d] leading-relaxed max-w-lg mx-auto lg:mx-0">
                {dict.home.heroSubtitle}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href={`/${locale}/study`}
                  className="inline-flex items-center justify-center gap-2 bg-[#242424] text-[#f6f3f1] rounded-full px-6 py-3.5 font-mono text-sm hover:bg-black transition-colors"
                >
                  <Play className="h-4 w-4" />
                  {dict.common.startLearning}
                </Link>
                <Link
                  href={`/${locale}/grammar`}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-[#242424] border border-[#242424] rounded-full px-6 py-3.5 font-mono text-sm hover:bg-[rgba(36,36,36,0.06)] transition-colors"
                >
                  {dict.common.viewLibrary}
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm bg-[#cfdaf5] rounded-[40px] p-8 md:p-10 min-h-[360px] flex flex-col justify-between">
                <div>
                  <Badge variant="outline" className="rounded-full border-[#242424]/20 text-[#242424] font-mono text-xs mb-4">
                    N3
                  </Badge>
                  <h2 className="font-serif text-[clamp(28px,4vw,48px)] leading-[1.1] text-[#000000]">
                    ～わけではない
                  </h2>
                  <p className="mt-3 text-[#4e4d4d] text-sm">
                    {dict.home.previewMeaning}
                  </p>
                </div>
                <div className="space-y-2 text-sm text-[#4e4d4d]">
                  <p>{dict.home.previewStructure}</p>
                  <p>{dict.home.previewStatus}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mx-auto max-w-[1432px] px-6 pb-20 md:pb-28">
          <h2 className="font-serif text-2xl md:text-3xl text-center mb-12 tracking-[-0.02em]">
            {dict.home.featuresTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dict.home.features.map((f, i) => (
              <div
                key={i}
                className="bg-[#cfdaf5] rounded-[40px] p-8 hover:translate-y-[-2px] transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-[#242424] text-[#f6f3f1] flex items-center justify-center mb-4">
                  {featureIcons[i]}
                </div>
                <h3 className="font-mono text-base font-medium mb-2">{f.title}</h3>
                <p className="text-sm text-[#4e4d4d] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Flow */}
        <section className="mx-auto max-w-[1432px] px-6 pb-20 md:pb-28">
          <h2 className="font-serif text-2xl md:text-3xl text-center mb-12 tracking-[-0.02em]">
            {dict.home.flowTitle}
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {dict.home.flowSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="bg-[#cfdaf5] rounded-[40px] px-6 py-6 text-center min-w-[150px]">
                  <div className="w-7 h-7 rounded-full bg-[#242424] text-[#f6f3f1] flex items-center justify-center mx-auto mb-2 font-mono text-xs font-medium">
                    {i + 1}
                  </div>
                  <p className="font-mono text-sm font-medium text-[#000000]">{step.step}</p>
                  <p className="text-xs text-[#4e4d4d] mt-1 leading-relaxed">{step.desc}</p>
                </div>
                {i < dict.home.flowSteps.length - 1 && (
                  <ArrowRight className="hidden md:block h-5 w-5 text-[#242424]/40 shrink-0 mx-2" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="mx-auto max-w-[1432px] px-6 pb-20 md:pb-28">
          <h2 className="font-serif text-2xl md:text-3xl text-center mb-12 tracking-[-0.02em]">
            {dict.home.statsTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { value: String(stats.due), label: dict.home.todayReview },
              { value: String(stats.learned), label: dict.home.learnedGrammar },
              { value: String(stats.mastered), label: dict.home.masteredGrammar },
              { value: String(stats.totalGrammar), label: dict.home.totalGrammar },
            ].map((s, i) => (
              <Card key={i} className="border border-[rgba(36,36,36,0.16)] rounded-[40px] bg-[#f6f3f1]">
                <CardContent className="p-8 text-center">
                  <p className="font-mono text-4xl font-medium text-[#000000]">{s.value}</p>
                  <p className="text-sm text-[#4e4d4d] mt-2">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] p-8 md:p-10">
            <h3 className="font-mono text-base font-medium mb-6">{dict.home.levelProgress}</h3>
            <div className="space-y-5">
              {(["N5","N4","N3","N2","N1"] as const).map((level) => (
                <div key={level}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">{level}</span>
                    <span className="font-mono text-sm text-[#797776]">{levelPcts[level]}%</span>
                  </div>
                  <div className="h-2 bg-[rgba(36,36,36,0.08)] rounded-full overflow-hidden">
                    <div className="h-full bg-[#242424] rounded-full transition-all duration-500" style={{ width: `${levelPcts[level]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-[1432px] px-6 pb-12 md:pb-20">
          <div className="bg-[#242424] rounded-3xl p-6 md:p-10 text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-lg md:text-2xl text-[#f6f3f1] tracking-[-0.02em]">
              {dict.home.ctaText}
            </h2>
            <div className="mt-5">
              <Link
                href={`/${locale}/study`}
                className="inline-flex items-center justify-center gap-2 bg-[#f6f3f1] text-[#242424] rounded-full px-6 py-3 font-mono text-sm hover:bg-white transition-colors"
              >
                <Play className="h-4 w-4" />
                {dict.home.ctaButton}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
