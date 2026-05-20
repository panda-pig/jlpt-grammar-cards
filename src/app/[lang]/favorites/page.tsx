"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { GrammarCard } from "@/components/grammar/GrammarCard";
import { EmptyState } from "@/components/grammar/EmptyState";
import { Badge } from "@/components/ui/badge";
import { grammarService } from "@/services/grammarService";
import { toGrammarEntry } from "@/lib/mappers";
import type { GrammarEntry } from "@/lib/types";
import { Heart } from "lucide-react";

const favoriteCollections = [
  { id: "1", name: "默认收藏" },
  { id: "2", name: "易错语法" },
  { id: "3", name: "考前复习" },
  { id: "4", name: "N2 重点" },
  { id: "5", name: "敬语专项" },
];

export default function FavoritesPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    grammarService.getAll().then((data) => {
      setEntries(data.map(toGrammarEntry));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const favorites = entries.filter(() => false); // TODO: from progressService

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-6xl py-4 sm:py-6 flex items-center justify-center min-h-[300px]">
          <p className="text-[#797776] font-mono text-sm">加载中...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl py-4 sm:py-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-[#c47a6a]" />
          <h1 className="text-2xl font-bold">收藏夹</h1>
          <Badge variant="secondary" className="rounded-full font-mono text-xs">{favorites.length}</Badge>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {favoriteCollections.map((c) => (
            <Badge key={c.id} variant="outline" className="shrink-0 cursor-pointer rounded-full font-mono text-xs">
              {c.name}
            </Badge>
          ))}
        </div>

        {favorites.length === 0 ? (
          <EmptyState
            title="还没有收藏任何语法"
            description="去语法库浏览并收藏你想重点学习的语法吧"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((g) => (
              <GrammarCard key={g.id} grammar={g} onFavoriteToggle={() => {}} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
