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
import { toGrammarEntry } from "@/lib/mappers";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { SlidersHorizontal } from "lucide-react";
import type { GrammarEntry } from "@/lib/types";

export default function GrammarLibraryPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const [entries, setEntries] = useState<GrammarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<GrammarFilters>(defaultFilters);

  useEffect(() => {
    grammarService.getAll().then((data) => {
      setEntries(data.map(toGrammarEntry));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

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
    if (filters.route !== "all") result = result.filter((e) => e.sourceRoute === filters.route);
    if (filters.category !== "all") result = result.filter((e) => e.grammarType === filters.category);
    // TODO: status/favorite filters need user progress data from progressService
    // if (filters.status !== "all") result = result.filter(...)
    // if (filters.favorite) result = result.filter(...)
    return result;
  }, [search, filters, entries]);

  const learnedCount = 0; // TODO: from progressService
  const masteredCount = 0; // TODO: from progressService
  const favCount = 0; // TODO: from progressService

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
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif font-bold">{dict.grammar.title}</h1>
            <Sheet>
              <SheetTrigger className="md:hidden inline-flex items-center justify-center gap-1.5 border border-[rgba(36,36,36,0.16)] bg-transparent px-3 py-1.5 text-sm font-mono hover:bg-[#cfdaf5] transition-colors">
                <SlidersHorizontal className="h-4 w-4" />{dict.grammar.filter}
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <h3 className="font-semibold mb-4">{dict.grammar.filterTitle}</h3>
                <GrammarFilterContent filters={filters} onChange={setFilters} />
              </SheetContent>
            </Sheet>
          </div>
          <SearchBar value={search} onChange={setSearch} placeholder={locale === "zh" ? "搜索语法、意思、关键词..." : "Search grammar, meaning, keywords..."} />
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
                  <GrammarCard key={g.id} grammar={g} onFavoriteToggle={() => {}} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
