"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { GrammarCard } from "@/components/grammar/GrammarCard";
import { EmptyState } from "@/components/grammar/EmptyState";
import { Badge } from "@/components/ui/badge";
import { useGrammar } from "@/context/GrammarContext";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { entries, toggleFavorite, favoriteCollections } = useGrammar();
  const favorites = useMemo(() => entries.filter((e) => e.isFavorite), [entries]);

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl py-4 sm:py-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-[#c47a6a]" />
          <h1 className="text-2xl font-serif font-bold">收藏夹</h1>
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
              <GrammarCard
                key={g.id}
                grammar={g}
                onFavoriteToggle={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
