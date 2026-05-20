"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { GrammarCard } from "@/components/grammar/GrammarCard";
import { EmptyState } from "@/components/grammar/EmptyState";
import { Badge } from "@/components/ui/badge";
import { grammarService } from "@/services/grammarService";
import { toGrammarEntry } from "@/lib/mappers";
import { useDictionary } from "@/components/layout/LocaleProvider";
import type { GrammarEntry } from "@/lib/types";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const dict = useDictionary();

  const favoriteCollections = [
    { id: "1", name: dict.favorites.collections.all },
    { id: "2", name: dict.favorites.collections.mistakes },
    { id: "3", name: dict.favorites.collections.preExam },
    { id: "4", name: dict.favorites.collections.n2Focus },
    { id: "5", name: dict.favorites.collections.keigo },
  ];
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
          <p className="text-[#797776] font-mono text-sm">{dict.common.loading}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl py-4 sm:py-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-[#c47a6a]" />
          <h1 className="text-2xl font-bold">{dict.favorites.title}</h1>
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
            title={dict.favorites.noFavorites}
            description={dict.favorites.noFavoritesHint}
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
