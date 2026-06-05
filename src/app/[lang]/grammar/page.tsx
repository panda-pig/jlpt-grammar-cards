"use client";

import { useState, useMemo, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SearchBar } from "@/components/grammar/SearchBar";
import { GrammarFilterContent, defaultFilters, type GrammarFilters } from "@/components/grammar/GrammarFilter";
import { GrammarCard } from "@/components/grammar/GrammarCard";
import { EmptyState } from "@/components/grammar/EmptyState";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { grammarService } from "@/services/grammarService";
import { learningService, type UnifiedProgressRow } from "@/services/learningService";
import { toGrammarEntry } from "@/lib/mappers";
import { buildGrammarRelationMap } from "@/lib/grammar-relations";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { SlidersHorizontal, WifiOff } from "lucide-react";
import type { GrammarEntry, StudyStatus } from "@/lib/types";

export default function GrammarLibraryPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const { user } = useAuth();
  const [entries, setEntries] = useState<GrammarEntry[]>([]);
  const [progressMap, setProgressMap] = useState<Map<string, UnifiedProgressRow>>(new Map());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<GrammarFilters>(defaultFilters);

  useEffect(() => {
    Promise.all([
      grammarService.getAll(user?.id),
      learningService.getProgressMap(user?.id),
    ]).then(([data, progress]) => {
      setEntries(data.map(toGrammarEntry));
      setProgressMap(progress);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user?.id]);

  const filtered = useMemo(() => {
    let result = entries;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.includes(q) ||
          e.meaningCn.includes(q) ||
          e.tags.some((t) => t.includes(q))
      );
    }
    if (filters.level !== "all") result = result.filter((e) => e.jlptLevel === filters.level);
    if (filters.category !== "all") result = result.filter((e) => e.grammarType === filters.category);
    if (filters.status !== "all") {
      result = result.filter((e) => (progressMap.get(e.id)?.study_status ?? "未学习") === filters.status);
    }
    if (filters.favorite) {
      result = result.filter((e) => !!progressMap.get(e.id)?.is_favorite);
    }
    return result;
  }, [search, filters, entries, progressMap]);

  const relationMap = useMemo(() => buildGrammarRelationMap(entries), [entries]);

  const progressRows = Array.from(progressMap.values());
  const learnedCount = progressRows.filter((row) => row.study_status === "学习中" || row.study_status === "已掌握").length;
  const masteredCount = progressRows.filter((row) => row.study_status === "已掌握").length;
  const favCount = progressRows.filter((row) => row.is_favorite).length;

  const handleFavoriteToggle = async (id: string) => {
    const next = await learningService.toggleFavorite(id, user?.id);
    setProgressMap((prev) => new Map(prev).set(id, next));
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
            <div>
              <p className="font-mono text-xs font-medium text-[#242424]">{dict.common.localMode}</p>
              <p className="mt-1 leading-relaxed">{dict.common.localModeDesc}</p>
            </div>
          </div>
        )}
        <div className="mb-6 space-y-4">
          <div>
            <div className="mb-2 flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[.06em] text-[#797776]">
              <div className="h-px w-8 bg-[#242424]" />
              JLPT N1–N5 Grammar Library
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.08] tracking-[-0.022em] text-black text-balance">{dict.grammar.title}</h1>
            <Sheet>
              <SheetTrigger className="md:hidden inline-flex items-center justify-center gap-1.5 rounded-full border border-[#ded8d0] bg-transparent px-3 py-1.5 text-sm font-mono hover:bg-[#cfdaf5] transition-colors">
                <SlidersHorizontal className="h-4 w-4" />{dict.grammar.filter}
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <h3 className="font-semibold mb-4">{dict.grammar.filterTitle}</h3>
                <GrammarFilterContent filters={filters} onChange={setFilters} />
              </SheetContent>
            </Sheet>
          </div>
          <SearchBar value={search} onChange={setSearch} placeholder={dict.grammar.searchPlaceholder} />
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="secondary" className="font-mono text-xs">{dict.grammar.results} {filtered.length}</Badge>
            <Badge variant="secondary" className="font-mono text-xs">{dict.grammar.learned} {learnedCount}</Badge>
            <Badge variant="secondary" className="font-mono text-xs">{dict.grammar.mastered} {masteredCount}</Badge>
            <Badge variant="secondary" className="font-mono text-xs">{dict.grammar.favorited} {favCount}</Badge>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-20">
              <h3 className="font-mono text-xs font-medium text-[#797776] mb-3">{dict.grammar.filterTitle}</h3>
              <GrammarFilterContent filters={filters} onChange={setFilters} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <EmptyState
                title={dict.grammar.noResults}
                description={dict.grammar.noResultsHint}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((g) => (
                  (() => {
                    const relation = relationMap.get(g.id);
                    return (
                      <GrammarCard
                        key={g.id}
                        grammar={g}
                        locale={locale}
                        isFavorite={!!progressMap.get(g.id)?.is_favorite}
                        studyStatus={(progressMap.get(g.id)?.study_status ?? "未学习") as StudyStatus}
                        relatedUseCount={Math.max((relation?.sameTitleCount ?? 1) - 1, 0)}
                        onFavoriteToggle={handleFavoriteToggle}
                      />
                    );
                  })()
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
