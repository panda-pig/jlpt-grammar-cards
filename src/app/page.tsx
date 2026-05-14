"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/study/ProgressBar";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { Badge } from "@/components/ui/badge";
import { userStats, getLevelProgress } from "@/lib/mock-data";
import {
  BookOpen,
  Brain,
  GitCompare,
  AlertTriangle,
  Heart,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  { icon: BookOpen, title: "JLPT N1～N5 分类整理", desc: "覆盖全部等级，15 个场景分类，系统化学习路径" },
  { icon: Brain, title: "Anki 式间隔复习", desc: "科学安排复习时间，帮你高效巩固记忆" },
  { icon: GitCompare, title: "相近语法对比", desc: "易混语法并排比较，彻底弄清区别" },
  { icon: AlertTriangle, title: "易错点提醒", desc: "标注常见错误用法，帮你避开陷阱" },
  { icon: Heart, title: "收藏与错题本", desc: "收藏重点语法，标记易错语法，随时回顾" },
  { icon: TrendingUp, title: "学习进度追踪", desc: "可视化进度仪表盘，掌握学习全貌" },
];

const flowSteps = ["选择等级", "学习语法", "卡片复习", "标记掌握度", "自动安排下次复习"];

export default function HomePage() {
  const levelProgress = getLevelProgress();

  return (
    <>
      <Header />
      <main className="flex-1 pb-20 md:pb-8">
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                  用 Anki 风格
                  <br />
                  高效记忆 JLPT 语法
                </h1>
                <p className="mt-4 text-muted-foreground md:text-lg max-w-md">
                  系统整理 N1～N5 全部语法，通过卡片、收藏、复习计划和相近语法对比，帮助你真正记住日语语法。
                </p>
                <div className="mt-6 flex gap-3">
                  <Link href="/study" className={buttonVariants({ size: "lg" })}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    开始学习
                  </Link>
                  <Link href="/grammar" className={buttonVariants({ variant: "outline", size: "lg" })}>查看语法库</Link>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <Card className="w-72 shadow-lg">
                  <CardContent className="p-5 space-y-3">
                    <LevelBadge level="N3" />
                    <h3 className="text-xl font-bold">～わけではない</h3>
                    <p className="text-sm text-muted-foreground">并不是……；并非……</p>
                    <p className="text-xs text-muted-foreground border-l-2 border-primary/30 pl-2">
                      普通形 + わけではない
                    </p>
                    <Badge variant="secondary" className="text-xs">学习中</Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-2xl font-bold md:text-3xl">核心功能</h2>
            <p className="mt-2 text-center text-muted-foreground">
              专为 JLPT 学习者打造的一站式语法工具
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <Card key={f.title} className="group transition-all hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-2xl font-bold md:text-3xl">学习流程</h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {flowSteps.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <Card className="px-5 py-3">
                    <span className="font-semibold text-sm">{step}</span>
                  </Card>
                  {i < flowSteps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-2xl font-bold md:text-3xl">学习数据一览</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card><CardContent className="p-4 text-center">
                <p className="text-3xl font-bold tabular-nums">{userStats.todayReviewCards}</p>
                <p className="text-xs text-muted-foreground mt-1">今日复习数量</p>
              </CardContent></Card>
              <Card><CardContent className="p-4 text-center">
                <p className="text-3xl font-bold tabular-nums">{userStats.totalLearned}</p>
                <p className="text-xs text-muted-foreground mt-1">已学习语法</p>
              </CardContent></Card>
              <Card><CardContent className="p-4 text-center">
                <p className="text-3xl font-bold tabular-nums">{userStats.streakDays}</p>
                <p className="text-xs text-muted-foreground mt-1">连续学习天数</p>
              </CardContent></Card>
              <Card><CardContent className="p-4 text-center">
                <p className="text-3xl font-bold tabular-nums">
                  {Math.round((userStats.todayCompleted / userStats.todayTotal) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">今日完成率</p>
              </CardContent></Card>
            </div>
            <div className="mt-8 space-y-4">
              {levelProgress.map((lp) => (
                <ProgressBar key={lp.level} label={lp.level} value={lp.total > 0 ? (lp.mastered / lp.total) * 100 : 0} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary/5 border-t border-border/40">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              从今天开始，用卡片方式真正记住日语语法
            </h2>
            <Link href="/study" className={buttonVariants({ size: "lg", className: "mt-6" })}>立即开始学习</Link>
          </div>
        </section>
      </main>
      <MobileBottomNav />
    </>
  );
}
