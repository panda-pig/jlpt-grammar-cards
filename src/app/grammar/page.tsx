"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SearchBar } from "@/components/grammar/SearchBar";
import { GrammarFilterContent, defaultFilters, type GrammarFilters } from "@/components/grammar/GrammarFilter";
import { GrammarCard } from "@/components/grammar/GrammarCard";
import { EmptyState } from "@/components/grammar/EmptyState";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { grammarEntries } from "@/lib/mock-data";
import { Filter, SlidersHorizontal } from "lucide-react";

export default function GrammarLibraryPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<GrammarFilters>(defaultFilters);
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(grammarEntries.filter((e) => e.isFavorite).map((e) => e.id))
  );

  const filtered = useMemo(() => {
    let result = grammarEntries;
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
    if (filters.status !== "all") result = result.filter((e) => e.studyStatus === filters.status);
    if (filters.favorite) result = result.filter((e) => favorites.has(e.id));
    return result;
  }, [search, filters, favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const learnedCount = filtered.filter((e) => e.studyStatus === "学习中" || e.studyStatus === "已掌握").length;
  const masteredCount = filtered.filter((e) => e.studyStatus === "已掌握").length;
  const favCount = filtered.filter((e) => favorites.has(e.id)).length;

  const FilterPanel = () => (
    <GrammarFilterContent filters={filters} onChange={setFilters} />
  );

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-6">
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">语法库</h1>
            <Sheet>
              <SheetTrigger className="md:hidden inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                <SlidersHorizontal className="h-4 w-4" />筛选
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <h3 className="font-semibold mb-4">筛选条件</h3>
                <FilterPanel />
              </SheetContent>
            </Sheet>
          </div>
          <SearchBar value={search} onChange={setSearch} />
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">结果 {filtered.length} 条</Badge>
            <Badge variant="secondary">已学习 {learnedCount}</Badge>
            <Badge variant="secondary">已掌握 {masteredCount}</Badge>
            <Badge variant="secondary">已收藏 {favCount}</Badge>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-20">
              <h3 className="font-semibold text-sm mb-3">筛选条件</h3>
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <EmptyState
                title="没有找到相关语法"
                description="请尝试更换关键词或筛选条件"
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((g) => (
                  <GrammarCard key={g.id} grammar={{ ...g, isFavorite: favorites.has(g.id) }} onFavoriteToggle={toggleFavorite} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}