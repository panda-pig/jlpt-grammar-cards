"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { GrammarCard } from "@/components/grammar/GrammarCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { grammarService } from "@/services/grammarService";
import { progressService } from "@/services/progressService";
import { toGrammarEntry } from "@/lib/mappers";
import { useAuth } from "@/hooks/useAuth";
import type { GrammarEntry, JLPTLevel } from "@/lib/types";
import { Sparkles, BookOpen } from "lucide-react";

export default function StudyPage() {
  const { user } = useAuth();
  const [level, setLevel] = useState<JLPTLevel>("N3");
  const [cards, setCards] = useState<GrammarEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const loadCards = useCallback(async () => {
    setLoading(true);
    try {
      const data = await grammarService.getByLevel(level);
      setCards(data.map(toGrammarEntry));
      setSelectedIds(new Set());
      setAdded(false);
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(cards.map((c) => c.id)));
  };

  const addToLearningQueue = async () => {
    if (!user || selectedIds.size === 0) return;
    setAdding(true);
    try {
      await progressService.startLearningBatch(user.id, Array.from(selectedIds));
      setAdded(true);
    } finally {
      setAdding(false);
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-sm bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]">
            <CardContent className="p-6 text-center space-y-4">
              <h2 className="text-xl font-bold">请先登录</h2>
              <p className="text-sm text-[#797776]">登录后将语法卡片加入学习队列</p>
              <Link href="/login" className={buttonVariants({ className: "w-full rounded-full font-mono" })}>
                登录
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (added) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-sm bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px]">
            <CardContent className="p-6 text-center space-y-4">
              <Sparkles className="h-10 w-10 mx-auto text-[#4a8a6a]" />
              <h2 className="text-xl font-bold">已加入学习队列</h2>
              <p className="text-sm text-[#797776]">
                已将 {selectedIds.size} 个语法加入学习队列
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-full font-mono" onClick={() => { setAdded(false); setSelectedIds(new Set()); }}>
                  继续添加
                </Button>
                <Link href="/review" className={buttonVariants({ className: "flex-1 rounded-full font-mono" })}>
                  去复习
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl py-4 sm:py-6">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">添加学习卡片</h1>
            <p className="text-sm text-[#797776] mt-1">选择一个等级，勾选要学习的语法加入复习队列</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={level} onValueChange={(v) => setLevel(v as JLPTLevel)}>
              <SelectTrigger className="w-24 border-[rgba(36,36,36,0.16)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["N5", "N4", "N3", "N2", "N1"] as JLPTLevel[]).map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="rounded-full font-mono" onClick={selectAll}>
              全选
            </Button>
            <Button size="sm" className="rounded-full font-mono" onClick={addToLearningQueue} disabled={selectedIds.size === 0 || adding}>
              <BookOpen className="mr-1 h-4 w-4" />
              {adding ? "添加中..." : `加入学习 (${selectedIds.size})`}
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-[#797776] font-mono text-sm">加载中...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((g) => (
              <div key={g.id} className="relative" onClick={() => toggleSelect(g.id)}>
                <div className={`cursor-pointer transition-all ${selectedIds.has(g.id) ? "ring-2 ring-[#242424] rounded-[40px]" : ""}`}>
                  <GrammarCard grammar={g} onFavoriteToggle={() => {}} />
                </div>
                {selectedIds.has(g.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#242424] text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
