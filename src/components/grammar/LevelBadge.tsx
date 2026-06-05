"use client";

import { Badge } from "@/components/ui/badge";
import type { JLPTLevel } from "@/lib/types";

// V3 palette — soft, level-coded, matches homepage badges
const levelStyles: Record<JLPTLevel, string> = {
  N5: "bg-[#dcebd8] text-[#315b3b] border-transparent rounded-full font-mono text-xs font-bold",
  N4: "bg-[#d8e8f0] text-[#2a5a7a] border-transparent rounded-full font-mono text-xs font-bold",
  N3: "bg-[#cfdaf5] text-[#2a3a5a] border-transparent rounded-full font-mono text-xs font-bold",
  N2: "bg-[#e8e0f5] text-[#5a3a8a] border-transparent rounded-full font-mono text-xs font-bold",
  N1: "bg-[#f4b4a8] text-[#7a3a30] border-transparent rounded-full font-mono text-xs font-bold",
};

export function LevelBadge({ level }: { level: JLPTLevel }) {
  return (
    <Badge variant="outline" className={levelStyles[level]}>
      {level}
    </Badge>
  );
}
