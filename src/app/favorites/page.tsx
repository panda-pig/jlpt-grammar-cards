"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { GrammarCard } from "@/components/grammar/GrammarCard";
import { EmptyState } from "@/components/grammar/EmptyState";
import { Badge } from "@/components/ui/badge";
import { favorites, favoriteCollections } from "@/lib/mock-data";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const [favIds, setFavIds] = useState<Set<string>>(new Set(favorites.map((f) => f.id)));
  const filtered = favorites.filter((f) => favIds.has(f.id));

  const toggleFavorite = (id: string) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl py-4 sm:py-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-[#c47a6a]" />
          <h1 className="text-2xl font-serif font-bold">收藏夹</h1>
          <Badge variant="secondary" className="rounded-full font-mono text-xs">{filtered.length}</Badge>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {favoriteCollections.map((c) => (
            <Badge key={c.id} variant="outline" className="shrink-0 cursor-pointer rounded-full font-mono text-xs">
              {c.name}
            </Badge>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="还没有收藏任何语法"
            description="去语法库浏览并收藏你想重点学习的语法吧"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((g) => (
              <GrammarCard
                key={g.id}
                grammar={{ ...g, isFavorite: favIds.has(g.id) }}
                onFavoriteToggle={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
