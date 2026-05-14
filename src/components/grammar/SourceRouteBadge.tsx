"use client";

import { Badge } from "@/components/ui/badge";
import type { SourceRoute } from "@/lib/types";

export function SourceRouteBadge({ route }: { route: SourceRoute }) {
  return (
    <Badge variant="secondary" className="text-xs">
      {route}
    </Badge>
  );
}
