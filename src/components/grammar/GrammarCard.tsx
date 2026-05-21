"use client";

import Link from "next/link";
import { LevelBadge } from "./LevelBadge";
import { SourceRouteBadge } from "./SourceRouteBadge";
import { GrammarTypeBadge } from "./GrammarTypeBadge";
import { FavoriteButton } from "./FavoriteButton";
import { Badge } from "@/components/ui/badge";
import type { GrammarEntry, StudyStatus } from "@/lib/types";

const statusStyles: Record<string, string> = {
  "未学习": "border-[#4e4d4d] text-[#4e4d4d] bg-transparent",
  "学习中": "bg-[#cfdaf5] text-[#242424] border-none",
  "已掌握": "bg-[#edf9f2] text-[#4a8a6a] border-none",
};

export function GrammarCard({
  grammar,
  locale = "zh",
  isFavorite = false,
  studyStatus = "未学习" as StudyStatus,
  onFavoriteToggle,
}: {
  grammar: GrammarEntry;
  locale?: string;
  isFavorite?: boolean;
  studyStatus?: StudyStatus;
  onFavoriteToggle?: (id: string) => void;
}) {
  return (
    <Link href={`/${locale}/grammar/${grammar.slug}`}>
      <div className="group h-full bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] p-6 md:p-8 transition-all hover:translate-y-[-2px] hover:shadow-[rgba(0,0,0,0.1)_0px_0px_10px_0px]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-3">
              <LevelBadge level={grammar.jlptLevel} />
              <SourceRouteBadge route={grammar.sourceRoute} />
              <GrammarTypeBadge category={grammar.grammarType} />
            </div>
            <h3 className="font-serif text-lg font-medium truncate text-[#000000]">{grammar.title}</h3>
            <p className="text-sm text-[#4e4d4d] mt-1.5 line-clamp-2">
              {grammar.meaningCn}
            </p>
            <p className="text-xs text-[#797776] mt-2 truncate">
              {grammar.structure.split("\n")[0]}
            </p>
          </div>
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={() => onFavoriteToggle?.(grammar.id)}
          />
        </div>
        <div className="flex items-center gap-1.5 mt-4 flex-wrap">
          {grammar.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-full text-[10px] px-2 py-0.5 border-[rgba(36,36,36,0.16)] text-[#797776]">
              {tag}
            </Badge>
          ))}
          <div className="flex-1" />
          <Badge
            variant="outline"
            className={`rounded-full text-[10px] px-2 py-0.5 font-mono ${statusStyles[studyStatus] || ""}`}
          >
            {studyStatus}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
