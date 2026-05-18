"use client";

import { Badge } from "@/components/ui/badge";
import type { GrammarCategory } from "@/lib/types";

export function GrammarTypeBadge({ category }: { category: GrammarCategory }) {
  return (
    <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0.5 border-[rgba(36,36,36,0.16)] text-[#4e4d4d] font-mono">
      {category}
    </Badge>
  );
}
