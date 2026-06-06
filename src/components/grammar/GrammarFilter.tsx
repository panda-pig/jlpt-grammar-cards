"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { grammarCategoryLabel, studyStatusLabel } from "@/lib/grammar-content";
import type { JLPTLevel, GrammarCategory, StudyStatus } from "@/lib/types";

const levels: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];
const categories: GrammarCategory[] = [
  "原因・理由", "条件", "逆接・譲歩", "推量・様態", "否定",
  "敬語", "比較", "目的", "限定", "範囲", "並列", "例示", "伝聞",
  "提示", "意志・勧誘", "願望", "義務・当然", "存在", "結果", "関係", "時点",
  "程度", "変化", "評価", "感情", "確認", "強調", "規則", "その他",
];
const statuses: StudyStatus[] = ["未学习", "学习中", "已掌握"];

export interface GrammarFilters {
  level: JLPTLevel | "all";
  category: GrammarCategory | "all";
  status: StudyStatus | "all";
  favorite: boolean;
}

export const defaultFilters: GrammarFilters = {
  level: "all",
  category: "all",
  status: "all",
  favorite: false,
};

export function GrammarFilterContent({
  filters,
  onChange,
}: {
  filters: GrammarFilters;
  onChange: (f: GrammarFilters) => void;
}) {
  const dict = useDictionary();
  const locale = useLocale();
  const levelLabels: Record<string, string> = { all: dict.filter.allLevels, N5: "N5", N4: "N4", N3: "N3", N2: "N2", N1: "N1" };
  const statusLabels: Record<string, string> = { all: dict.filter.allStatuses, 未学习: studyStatusLabel("未学习", locale), 学习中: studyStatusLabel("学习中", locale), 已掌握: studyStatusLabel("已掌握", locale) };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-medium mb-1.5 block">{dict.filter.jlptLevel}</label>
        <Select
          value={filters.level}
          onValueChange={(v) => onChange({ ...filters, level: v as JLPTLevel | "all" })}
        >
          <SelectTrigger className="w-full border-[#ded8d0] bg-transparent data-placeholder:text-[#797776]">
            <SelectValue>{levelLabels[filters.level] || dict.filter.allLevels}</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">{dict.filter.allLevels}</SelectItem>
            {levels.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-medium mb-1.5 block">{dict.filter.grammarType}</label>
        <Select
          value={filters.category}
          onValueChange={(v) => onChange({ ...filters, category: v as GrammarCategory | "all" })}
        >
          <SelectTrigger className="w-full border-[#ded8d0] bg-transparent data-placeholder:text-[#797776]">
            <SelectValue>{filters.category === "all" ? dict.filter.allTypes : grammarCategoryLabel(filters.category, locale)}</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">{dict.filter.allTypes}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{grammarCategoryLabel(c, locale)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-medium mb-1.5 block">{dict.filter.studyStatus}</label>
        <Select
          value={filters.status}
          onValueChange={(v) => onChange({ ...filters, status: v as StudyStatus | "all" })}
        >
          <SelectTrigger className="w-full border-[#ded8d0] bg-transparent data-placeholder:text-[#797776]">
            <SelectValue>{statusLabels[filters.status] || dict.filter.allStatuses}</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">{dict.filter.allStatuses}</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>{statusLabels[s] || s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Button
          variant={filters.favorite ? "default" : "outline"}
          size="sm"
          className="w-full rounded-full"
          onClick={() => onChange({ ...filters, favorite: !filters.favorite })}
        >
          {filters.favorite ? "★ " : "☆ "}{dict.filter.favoriteOnly}
        </Button>
      </div>
    </div>
  );
}
