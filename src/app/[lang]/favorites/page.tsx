"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { GrammarCard } from "@/components/grammar/GrammarCard";
import { EmptyState } from "@/components/grammar/EmptyState";
import { Badge } from "@/components/ui/badge";
import { toGrammarEntry } from "@/lib/mappers";
import { learningService, type ProgressWithGrammar } from "@/services/learningService";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import type { StudyStatus } from "@/lib/types";
import { Heart, WifiOff } from "lucide-react";

export default function FavoritesPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const { user } = useAuth();

  const favoriteCollections = [
    { id: "1", name: dict.favorites.collections.all },
    { id: "2", name: dict.favorites.collections.mistakes },
    { id: "3", name: dict.favorites.collections.preExam },
    { id: "4", name: dict.favorites.collections.n2Focus },
    { id: "5", name: dict.favorites.collections.keigo },
  ];
  const [favorites, setFavorites] = useState<ProgressWithGrammar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    learningService.getFavorites(user?.id).then((data) => {
      setFavorites(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user?.id]);

  const handleFavoriteToggle = async (id: string) => {
    await learningService.toggleFavorite(id, user?.id);
    setFavorites((prev) => prev.filter((row) => row.grammar_id !== id));
  };

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
        {!user && (
          <div className="mb-4 flex items-start gap-3 rounded-[14px] border border-[#e8c178]/50 bg-[#fff6df] px-4 py-3 text-sm text-[#4e4d4d]">
            <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-[#a08040]" />
            <p>{dict.common.localModeDesc}</p>
          </div>
        )}
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[.06em] text-[#797776]">
            <div className="h-px w-8 bg-[#242424]" />
            Personal Collection
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.08] tracking-[-0.022em] text-black text-balance">{dict.favorites.title}</h1>
            <Badge variant="secondary" className="rounded-full font-mono text-xs">{favorites.length}</Badge>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {favoriteCollections.map((c) => (
            <Badge key={c.id} variant="outline" className="shrink-0 cursor-pointer rounded-full border-[#ded8d0] bg-[#fbfaf8] px-3 py-1 font-mono text-xs text-[#4e4d4d] transition-colors hover:border-[#242424] hover:bg-[#cfdaf5]">
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
              <GrammarCard
                key={g.grammar_id}
                grammar={toGrammarEntry(g.grammar)}
                locale={locale}
                isFavorite
                studyStatus={(g.study_status ?? "未学习") as StudyStatus}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
