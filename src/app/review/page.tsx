"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { FavoriteButton } from "@/components/grammar/FavoriteButton";
import { ProgressBar } from "@/components/study/ProgressBar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { grammarService } from "@/services/grammarService";
import { Sparkles } from "lucide-react";

export default function ReviewPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const completed = false;

  useEffect(() => {
    grammarService.getAll().then((data) => {
      setEntries(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const reviewItems = entries.filter((e) => e.study_status === "学习中").slice(0, 10);

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-4xl py-4 sm:py-6 flex items-center justify-center min-h-[300px]">
          <p className="text-[#797776] font-mono text-sm">加载中...</p>
        </div>
      </MainLayout>
    );
  }

  if (completed) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-sm bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
            <CardContent className="p-6 text-center space-y-4">
              <Sparkles className="h-10 w-10 mx-auto text-[#4a8a6a]" />
              <h2 className="text-xl font-bold">今日复习完成！</h2>
              <p className="text-sm text-[#797776]">你今天复习了 8 个语法</p>
              <ProgressBar label="今日完成率" value={100} />
              <Link href="/study" className={buttonVariants({ className: "w-full rounded-full font-mono" })}>继续学习</Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl py-4 sm:py-6">
        <h1 className="text-2xl font-bold mb-6">今日复习</h1>

        <div className="grid gap-3 sm:grid-cols-4 mb-8">
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-[#242424]">{30}</p>
            <p className="font-mono text-xs text-[#797776]">待复习</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-[#242424]">{10}</p>
            <p className="font-mono text-xs text-[#797776]">新学习</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-[#242424]">{8}</p>
            <p className="font-mono text-xs text-[#797776]">已完成</p>
          </CardContent></Card>
          <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none"><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-[#242424]">20%</p>
            <p className="font-mono text-xs text-[#797776]">完成率</p>
          </CardContent></Card>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">今日复习列表</h2>
          <Link href="/study" className={buttonVariants({ size: "sm", className: "rounded-full font-mono" })}>开始复习</Link>
        </div>

        <div className="space-y-2">
          {reviewItems.map((r) => (
            <Card key={r.id} className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none transition-all hover:shadow-[rgba(0,0,0,0.1)_0px_0px_10px_0px]">
              <CardContent className="p-3 flex items-center gap-3">
                <LevelBadge level={r.jlpt_level} />
                <span className="font-medium flex-1">{r.title}</span>
                <Badge variant="secondary" className="rounded-full font-mono text-xs">{r.study_status}</Badge>
                <FavoriteButton isFavorite={favs.has(r.id)} onToggle={() => {
                  setFavs((prev) => {
                    const next = new Set(prev);
                    next.has(r.id) ? next.delete(r.id) : next.add(r.id);
                    return next;
                  });
                }} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
