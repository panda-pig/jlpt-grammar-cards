"use client";

import { Badge } from "@/components/ui/badge";
import type { GrammarCategory } from "@/lib/types";

export function GrammarTypeBadge({ category }: { category: GrammarCategory }) {
  return (
    <Badge variant="outline" className="text-xs text-muted-foreground">
      {category}
    </Badge>
  );
}
