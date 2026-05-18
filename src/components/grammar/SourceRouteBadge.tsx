"use client";

import { Badge } from "@/components/ui/badge";
import type { SourceRoute } from "@/lib/types";

export function SourceRouteBadge({ route }: { route: SourceRoute }) {
  return (
    <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0.5 border-[rgba(36,36,36,0.16)] text-[#797776] font-mono">
      {route}
    </Badge>
  );
}
