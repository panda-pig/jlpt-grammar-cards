"use client";

import { Badge } from "@/components/ui/badge";
import type { JLPTLevel } from "@/lib/types";

const levelStyles: Record<JLPTLevel, string> = {
  N5: "bg-emerald-100 text-emerald-700 border-emerald-200",
  N4: "bg-sky-100 text-sky-700 border-sky-200",
  N3: "bg-amber-100 text-amber-700 border-amber-200",
  N2: "bg-rose-100 text-rose-700 border-rose-200",
  N1: "bg-purple-100 text-purple-700 border-purple-200",
};

export function LevelBadge({ level }: { level: JLPTLevel }) {
  return (
    <Badge variant="outline" className={levelStyles[level]}>
      {level}
    </Badge>
  );
}
