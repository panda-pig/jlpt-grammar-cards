"use client";

import { Badge } from "@/components/ui/badge";
import type { JLPTLevel } from "@/lib/types";

const levelStyles: Record<JLPTLevel, string> = {
  N5: "border-[#a7dcc3] text-[#4a8a6a] bg-transparent rounded-full font-mono text-xs",
  N4: "border-[#a0b5eb] text-[#5a6fa0] bg-transparent rounded-full font-mono text-xs",
  N3: "bg-[#cfdaf5] text-[#242424] border-none rounded-full font-mono text-xs",
  N2: "border-[#d0c4e8] text-[#7a6a9a] bg-transparent rounded-full font-mono text-xs",
  N1: "bg-[#242424] text-[#f6f3f1] border-none rounded-full font-mono text-xs",
};

export function LevelBadge({ level }: { level: JLPTLevel }) {
  return (
    <Badge variant="outline" className={levelStyles[level]}>
      {level}
    </Badge>
  );
}
