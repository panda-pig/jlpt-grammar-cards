"use client";

import { Badge } from "@/components/ui/badge";
import type { JLPTLevel } from "@/lib/types";

const levelStyles: Record<JLPTLevel, string> = {
  N5: "bg-emerald-50 text-emerald-700 border-emerald-200",
  N4: "bg-blue-50 text-blue-700 border-blue-200",
  N3: "bg-amber-50 text-amber-700 border-amber-200",
  N2: "bg-rose-50 text-rose-700 border-rose-200",
  N1: "bg-purple-50 text-purple-700 border-purple-200",
};

export function LevelBadge({ level }: { level: JLPTLevel }) {
  return (
    <Badge variant="outline" className={levelStyles[level]}>
      {level}
    </Badge>
  );
}