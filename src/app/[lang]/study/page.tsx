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
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import type { GrammarEntry, JLPTLevel } from "@/lib/types";
import { Sparkles, BookOpen } from "lucide-react";

export default function StudyPage() {
  const { user } = useAuth();
  const dict = useDictionary();
  const locale = useLocale();
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
              <h2 className="text-xl font-bold">{dict.common.login}</h2>
              <p className="text-sm text-[#797776]">{dict.common.login}</p>
              <Link href={`/${locale}/login`} className={buttonVariants({ className: "w-full rounded-full font-mono" })}>
                {dict.common.login}
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
              <h2 className="text-xl font-bold">{dict.study.completedTitle}</h2>
              <p className="text-sm text-[#797776]">
                {dict.study.completedDesc.replace("{count}", String(selectedIds.size))}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-full font-mono" onClick={() => { setAdded(false); setSelectedIds(new Set()); }}>
                  {dict.study.restart}
                </Button>
                <Link href={`/${locale}/review`} className={buttonVariants({ className: "flex-1 rounded-full font-mono" })}>
                  {dict.review.goStudy}
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
            <h1 className="text-2xl font-bold">{dict.study.startTitle}</h1>
            <p className="text-sm text-[#797776] mt-1">{dict.study.startDesc}</p>
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
              {dict.study.selectAll}
            </Button>
            <Button size="sm" className="rounded-full font-mono" onClick={addToLearningQueue} disabled={selectedIds.size === 0 || adding}>
              <BookOpen className="mr-1 h-4 w-4" />
              {adding ? dict.common.loading : `${dict.study.startButton} (${selectedIds.size})`}
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
                  <GrammarCard grammar={g} locale={locale} onFavoriteToggle={() => {}} />
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
