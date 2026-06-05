"use client";

import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/layout/LocaleProvider";
import { grammarCategoryLabel } from "@/lib/grammar-content";
import type { GrammarCategory } from "@/lib/types";

export function GrammarTypeBadge({ category }: { category: GrammarCategory }) {
  const locale = useLocale();
  return (
    <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0.5 border-[#ded8d0] text-[#4e4d4d] font-mono">
      {grammarCategoryLabel(category, locale)}
    </Badge>
  );
}
