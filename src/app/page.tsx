"use client";

import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLevelProgress, userStats, grammarEntries } from "@/lib/mock-data";
import { Flame, Trophy, Play, CheckCircle, Clock, BrainCircuit, BookOpen, RotateCcw, TrendingUp, Search, Star, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const levelProgress = getLevelProgress();
  const inProgress = grammarEntries.filter((e) => e.studyStatus === "学习中").slice(0, 1);

  const newVocabProgress = (userStats.todayNewCards / 20) * 100;
  const reviewProgress = (userStats.todayReviewCards / 30) * 100;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Hero */}
            <Card className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white border-0 overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <h1 className="text-xl sm:text-2xl font-bold">欢迎回来，学习者！</h1>
                <p className="text-blue-100 mt-1 text-sm sm:text-base">今天状态火热！距离 N2 精通目标还差 85%。</p>
                <div className="flex gap-4 sm:gap-8 mt-4">
                  <div>
                    <p className="text-xs text-blue-200 uppercase tracking-wider">今日经验</p>
                    <p className="text-xl font-bold">1,240 经验</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-200 uppercase tracking-wider">等级</p>
                    <p className="text-xl font-bold">白银 II</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Goals */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold">每日目标</h2>
                  <span className="text-sm text-muted-foreground">{userStats.todayCompleted} / {userStats.todayTotal} 张卡片</span>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">新词汇</span>
                      <span className="text-muted-foreground">{userStats.todayNewCards}/20</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563eb] rounded-full transition-all duration-500"
                        style={{ width: `${newVocabProgress}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">语法复习</span>
                      <span className="text-muted-foreground">{userStats.todayReviewCards}/30</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${reviewProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How It Works - 学习流程 */}
            <Card>
              <CardContent className="p-5">
                <h2 className="text-lg font-bold mb-5">学习流程</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
                      <div className="w-0.5 h-full bg-slate-200 mt-1" />
                    </div>
                    <div className="pb-4">
                      <h3 className="font-semibold text-sm">浏览语法库</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">查看 N1~N5 全部语法，按等级和场景分类筛选</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
                      <div className="w-0.5 h-full bg-slate-200 mt-1" />
                    </div>
                    <div className="pb-4">
                      <h3 className="font-semibold text-sm">收藏重点语法</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">遇到难点或重点语法，点击收藏以便后续重点复习</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
                      <div className="w-0.5 h-full bg-slate-200 mt-1" />
                    </div>
                    <div className="pb-4">
                      <h3 className="font-semibold text-sm">Anki 卡片学习</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">选择等级开始学习，正面显示语法，背面显示意思、接续和例句</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-sm font-bold shrink-0">4</div>
                      <div className="w-0.5 h-full bg-slate-200 mt-1" />
                    </div>
                    <div className="pb-4">
                      <h3 className="font-semibold text-sm">自我评分</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">根据掌握程度评分：忘记了 / 有点模糊 / 记住了 / 很简单</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold shrink-0">5</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">每日复习 + 追踪进度</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">系统根据遗忘曲线安排复习，在进度页查看学习统计</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Learning */}
            <Card>
              <CardContent className="p-4 sm:p-5">
                <h2 className="text-lg font-bold mb-4">继续学习</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl shrink-0 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">文</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">N2 语法</Badge>
                      <span className="text-xs text-muted-foreground">850 张卡片</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">掌握高级助词</h3>
                    <p className="text-sm text-muted-foreground mb-4">深入学习各级别助词的细微差别。重点掌握 は vs が 的语境用法。</p>
                    <div className="flex gap-3">
                      <Link href="/study" className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium hover:bg-[#1d4ed8] transition-colors">
                        <Play className="h-4 w-4" /> 开始学习
                      </Link>
                      <Link href="/grammar" className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#2563eb] hover:underline">
                        卡组详情
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div>
              <h2 className="text-lg font-bold mb-4">快速统计</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-slate-400" />
                      <span className="text-xs text-muted-foreground">已掌握</span>
                    </div>
                    <p className="text-2xl font-bold text-[#2563eb]">1,432</p>
                    <p className="text-xs text-emerald-600 mt-1">本周 +24</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-xs text-muted-foreground">今日时长</span>
                    </div>
                    <p className="text-2xl font-bold text-[#2563eb]">45m</p>
                    <p className="text-xs text-muted-foreground mt-1">目标：60分钟</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BrainCircuit className="h-4 w-4 text-slate-400" />
                      <span className="text-xs text-muted-foreground">记忆保持率</span>
                    </div>
                    <p className="text-2xl font-bold text-[#2563eb]">92%</p>
                    <p className="text-xs text-emerald-600 mt-1">专家级</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Day Streak */}
            <Card>
              <CardContent className="p-5 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <p className="text-3xl font-bold">{userStats.streakDays}</p>
                <p className="text-sm text-muted-foreground">连续天数</p>
                <Badge className="mt-3 bg-orange-100 text-orange-700 hover:bg-orange-100">继续保持！</Badge>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4">快速入口</h3>
                <div className="space-y-2">
                  <Link href="/grammar" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Search className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium group-hover:text-[#2563eb]">浏览语法库</p>
                      <p className="text-xs text-muted-foreground">{grammarEntries.length} 条语法</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link href="/study" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Play className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium group-hover:text-[#2563eb]">开始学习</p>
                      <p className="text-xs text-muted-foreground">Anki 风格卡片</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link href="/review" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <RotateCcw className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium group-hover:text-[#2563eb]">今日复习</p>
                      <p className="text-xs text-muted-foreground">{userStats.todayReviewCards} 条待复习</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link href="/favorites" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                      <Star className="h-4 w-4 text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium group-hover:text-[#2563eb]">收藏夹</p>
                      <p className="text-xs text-muted-foreground">{userStats.totalFavorites} 条收藏</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Global Progress */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4">全局进度</h3>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#2563eb" strokeWidth="8" strokeDasharray={`${2 * Math.PI * 40 * 0.75} ${2 * Math.PI * 40}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold">75%</p>
                    <p className="text-xs text-muted-foreground">N2 备考</p>
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground mb-4">
                  你领先了同批学习者的 82%。考试准备度：高。
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-xs text-muted-foreground">词汇</p>
                    <p className="text-sm font-bold">88%</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-xs text-muted-foreground">汉字</p>
                    <p className="text-sm font-bold">62%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Milestone */}
            <Card className="bg-gradient-to-br from-emerald-400 to-emerald-500 text-white border-0">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Trophy className="h-5 w-5 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">下一个里程碑</h3>
                    <p className="text-sm text-white/90 mt-1">
                      再学习 5 次即可解锁「助词大师」徽章。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
