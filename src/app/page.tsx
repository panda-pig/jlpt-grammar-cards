"use client";

import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLevelProgress, userStats, grammarEntries } from "@/lib/mock-data";
import { BookOpen, RotateCcw, Brain, AlertTriangle, Bookmark, BarChart3, ArrowRight, Play } from "lucide-react";

const features = [
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "JLPT N1～N5 文法体系",
    description: "覆盖全部等级语法，按教材路线和语法场景系统整理",
  },
  {
    icon: <RotateCcw className="h-5 w-5" />,
    title: "Anki 风格复习",
    description: "卡片正面展示语法，背面展示意思、接续和例句",
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: "相近语法对比",
    description: "将容易混淆的语法放在一起对比，避免记忆混淆",
  },
  {
    icon: <AlertTriangle className="h-5 w-5" />,
    title: "易错点提醒",
    description: "标注每个语法的常见错误和使用陷阱",
  },
  {
    icon: <Bookmark className="h-5 w-5" />,
    title: "收藏与个人语法库",
    description: "收藏重点语法，建立属于自己的复习清单",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "学习进度追踪",
    description: "Dashboard 实时展示学习数据和复习计划",
  },
];

const flowSteps = [
  { step: "选择等级", desc: "从 N5 到 N1，按自己的水平选择" },
  { step: "学习语法", desc: "浏览语法库，理解意思和接续" },
  { step: "卡片复习", desc: "Anki 风格卡片，正面回忆背面验证" },
  { step: "标记掌握度", desc: "根据记忆程度评分，系统智能调度" },
  { step: "自动安排复习", desc: "根据遗忘曲线，自动提醒下次复习" },
];

export default function HomePage() {
  const levelProgress = getLevelProgress();
  const totalLearned = userStats.totalLearned;
  const totalGrammar = grammarEntries.length;

  return (
    <MainLayout>
      <div className="bg-background">
        {/* Hero Section */}
        <section className="mx-auto max-w-[1432px] px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="font-serif text-[clamp(40px,6vw,72px)] leading-[1.1] tracking-[-0.02em] text-[#000000]">
                用卡片方式，<br />真正记住 JLPT 语法
              </h1>
              <p className="mt-4 text-base md:text-lg text-[#4e4d4d] leading-relaxed max-w-lg mx-auto lg:mx-0">
                一个为 N1～N5 学习者设计的日语语法记忆工具。通过卡片、收藏、复习计划和相近语法对比，把零散文法整理成可以长期复习的知识系统。
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/study"
                  className="inline-flex items-center justify-center gap-2 bg-[#242424] text-[#f6f3f1] rounded-full px-6 py-3.5 font-mono text-sm hover:bg-black transition-colors"
                >
                  <Play className="h-4 w-4" />
                  开始学习
                </Link>
                <Link
                  href="/grammar"
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-[#242424] border border-[#242424] rounded-full px-6 py-3.5 font-mono text-sm hover:bg-[rgba(36,36,36,0.06)] transition-colors"
                >
                  查看语法库
                </Link>
              </div>
            </div>

            {/* Hero Card Preview */}
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
                    并不是……；并非……
                  </p>
                </div>
                <div className="space-y-2 text-sm text-[#4e4d4d]">
                  <p>接续：普通形 + わけではない</p>
                  <p>状态：学习中</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mx-auto max-w-[1432px] px-6 pb-20 md:pb-28">
          <h2 className="font-serif text-2xl md:text-3xl text-center mb-12 tracking-[-0.02em]">
            核心功能
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-[#cfdaf5] rounded-[40px] p-8 hover:translate-y-[-2px] transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-[#242424] text-[#f6f3f1] flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-mono text-base font-medium mb-2">{f.title}</h3>
                <p className="text-sm text-[#4e4d4d] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Flow */}
        <section className="mx-auto max-w-[1432px] px-6 pb-20 md:pb-28">
          <h2 className="font-serif text-2xl md:text-3xl text-center mb-12 tracking-[-0.02em]">
            学习流程
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {flowSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="bg-[#cfdaf5] rounded-[40px] px-6 py-6 text-center min-w-[150px]">
                  <div className="w-7 h-7 rounded-full bg-[#242424] text-[#f6f3f1] flex items-center justify-center mx-auto mb-2 font-mono text-xs font-medium">
                    {i + 1}
                  </div>
                  <p className="font-mono text-sm font-medium text-[#000000]">{step.step}</p>
                  <p className="text-xs text-[#4e4d4d] mt-1 leading-relaxed">{step.desc}</p>
                </div>
                {i < flowSteps.length - 1 && (
                  <ArrowRight className="hidden md:block h-5 w-5 text-[#242424]/40 shrink-0 mx-2" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="mx-auto max-w-[1432px] px-6 pb-20 md:pb-28">
          <h2 className="font-serif text-2xl md:text-3xl text-center mb-12 tracking-[-0.02em]">
            学习数据一览
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <Card className="border border-[rgba(36,36,36,0.16)] rounded-[40px] bg-[#f6f3f1]">
              <CardContent className="p-8 text-center">
                <p className="font-mono text-4xl font-medium text-[#000000]">{userStats.todayReviewCards}</p>
                <p className="text-sm text-[#4e4d4d] mt-2">今日待复习</p>
              </CardContent>
            </Card>
            <Card className="border border-[rgba(36,36,36,0.16)] rounded-[40px] bg-[#f6f3f1]">
              <CardContent className="p-8 text-center">
                <p className="font-mono text-4xl font-medium text-[#000000]">{totalLearned}</p>
                <p className="text-sm text-[#4e4d4d] mt-2">已学习语法</p>
              </CardContent>
            </Card>
            <Card className="border border-[rgba(36,36,36,0.16)] rounded-[40px] bg-[#f6f3f1]">
              <CardContent className="p-8 text-center">
                <p className="font-mono text-4xl font-medium text-[#000000]">{userStats.streakDays}</p>
                <p className="text-sm text-[#4e4d4d] mt-2">连续学习天数</p>
              </CardContent>
            </Card>
            <Card className="border border-[rgba(36,36,36,0.16)] rounded-[40px] bg-[#f6f3f1]">
              <CardContent className="p-8 text-center">
                <p className="font-mono text-4xl font-medium text-[#000000]">{totalGrammar}</p>
                <p className="text-sm text-[#4e4d4d] mt-2">语法总数</p>
              </CardContent>
            </Card>
          </div>

          {/* Level Progress */}
          <div className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] p-8 md:p-10">
            <h3 className="font-mono text-base font-medium mb-6">N1～N5 学习进度</h3>
            <div className="space-y-5">
              {levelProgress.map((lp) => {
                const pct = Math.round((lp.learned / lp.total) * 100);
                return (
                  <div key={lp.level}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm">{lp.level}</span>
                      <span className="font-mono text-sm text-[#797776]">{lp.learned} / {lp.total} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-[rgba(36,36,36,0.08)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#242424] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-[1432px] px-6 pb-20 md:pb-28">
          <div className="bg-[#242424] rounded-[40px] p-8 md:p-12 text-center">
            <h2 className="font-serif text-xl md:text-3xl text-[#f6f3f1] tracking-[-0.02em]">
              从今天开始，用卡片方式真正记住日语语法。
            </h2>
            <div className="mt-6">
              <Link
                href="/study"
                className="inline-flex items-center justify-center gap-2 bg-[#f6f3f1] text-[#242424] rounded-full px-7 py-3.5 font-mono text-sm hover:bg-white transition-colors"
              >
                <Play className="h-4 w-4" />
                立即开始学习
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
