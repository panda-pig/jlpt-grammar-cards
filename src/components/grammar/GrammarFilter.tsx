"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS } from "@/lib/types";
import type { JLPTLevel, SourceRoute, GrammarCategory, StudyStatus } from "@/lib/types";

const levels: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];
const routes: SourceRoute[] = ["蓝宝书", "TRY", "一册合格", "综合"];
const categories: GrammarCategory[] = [
  "原因・理由", "条件", "逆接・譲歩", "推量・様態", "否定",
  "敬語", "比較", "目的", "限定", "並列", "例示", "伝聞",
  "意志・勧誘", "義務・当然", "その他",
];
const statuses: StudyStatus[] = ["未学习", "学习中", "已掌握"];

const levelLabels: Record<string, string> = { all: "全部等级", N5: "N5", N4: "N4", N3: "N3", N2: "N2", N1: "N1" };
const routeLabels: Record<string, string> = { all: "全部路线", 蓝宝书: "蓝宝书", TRY: "TRY", 一册合格: "一册合格", 综合: "综合" };
const statusLabels: Record<string, string> = { all: "全部状态", 未学习: "未学习", 学习中: "学习中", 已掌握: "已掌握" };

export interface GrammarFilters {
  level: JLPTLevel | "all";
  route: SourceRoute | "all";
  category: GrammarCategory | "all";
  status: StudyStatus | "all";
  favorite: boolean;
}

export const defaultFilters: GrammarFilters = {
  level: "all",
  route: "all",
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
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-medium mb-1.5 block">JLPT 等级</label>
        <Select
          value={filters.level}
          onValueChange={(v) => onChange({ ...filters, level: v as JLPTLevel | "all" })}
        >
          <SelectTrigger className="w-full border-[rgba(36,36,36,0.16)] bg-transparent data-placeholder:text-[#797776]">
            <SelectValue>{levelLabels[filters.level] || "全部等级"}</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">全部等级</SelectItem>
            {levels.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-medium mb-1.5 block">教材路线</label>
        <Select
          value={filters.route}
          onValueChange={(v) => onChange({ ...filters, route: v as SourceRoute | "all" })}
        >
          <SelectTrigger className="w-full border-[rgba(36,36,36,0.16)] bg-transparent data-placeholder:text-[#797776]">
            <SelectValue>{routeLabels[filters.route] || "全部路线"}</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">全部路线</SelectItem>
            {routes.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-medium mb-1.5 block">语法场景</label>
        <Select
          value={filters.category}
          onValueChange={(v) => onChange({ ...filters, category: v as GrammarCategory | "all" })}
        >
          <SelectTrigger className="w-full border-[rgba(36,36,36,0.16)] bg-transparent data-placeholder:text-[#797776]">
            <SelectValue>{filters.category === "all" ? "全部场景" : CATEGORY_LABELS[filters.category] || filters.category}</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">全部场景</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-medium mb-1.5 block">学习状态</label>
        <Select
          value={filters.status}
          onValueChange={(v) => onChange({ ...filters, status: v as StudyStatus | "all" })}
        >
          <SelectTrigger className="w-full border-[rgba(36,36,36,0.16)] bg-transparent data-placeholder:text-[#797776]">
            <SelectValue>{statusLabels[filters.status] || "全部状态"}</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">全部状态</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
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
          {filters.favorite ? "★ 仅收藏" : "☆ 仅收藏"}
        </Button>
      </div>
    </div>
  );
}
