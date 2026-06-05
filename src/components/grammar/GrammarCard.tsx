"use client";

import Link from "next/link";
import { LevelBadge } from "./LevelBadge";
import { GrammarTypeBadge } from "./GrammarTypeBadge";
import { FavoriteButton } from "./FavoriteButton";
import { Badge } from "@/components/ui/badge";
import { localizedGrammar, localizedStructure, localizedTagLabel, studyStatusLabel, type AppLocale } from "@/lib/grammar-content";
import { grammarVariantLabel } from "@/lib/grammar-relations";
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
  relatedUseCount = 0,
  onFavoriteToggle,
}: {
  grammar: GrammarEntry;
  locale?: AppLocale;
  isFavorite?: boolean;
  studyStatus?: StudyStatus;
  relatedUseCount?: number;
  onFavoriteToggle?: (id: string) => void;
}) {
  const content = localizedGrammar(grammar, locale);
  const structure = localizedStructure(grammar.structure, locale);
  const variantLabel = grammarVariantLabel(grammar, locale);
  const tags = grammar.tags
    .map((tag) => ({ raw: tag, label: localizedTagLabel(tag, locale) }))
    .filter((tag) => tag.label)
    .slice(0, 2);

  return (
    <Link href={`/${locale}/grammar/${grammar.slug}`}>
      <div className="group h-full bg-[#fbfaf8] border border-[#ded8d0] rounded-[18px] p-5 md:p-6 transition-all hover:translate-y-[-2px] hover:border-[#242424] hover:shadow-[4px_4px_0_#ded8d0]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-3">
              <LevelBadge level={grammar.jlptLevel} />
              <GrammarTypeBadge category={grammar.grammarType} />
            </div>
            <h3 className="font-serif text-xl font-bold truncate text-[#000000]">{grammar.title}</h3>
            <p className="mt-1 text-[11px] font-mono leading-relaxed text-[#797776] line-clamp-2">
              {variantLabel}
            </p>
            <p className="text-sm text-[#4e4d4d] mt-1.5 line-clamp-2">
              {content.meaning}
            </p>
            <p className="text-xs text-[#797776] mt-2 truncate">
              {structure.split("\n")[0]}
            </p>
          </div>
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={() => onFavoriteToggle?.(grammar.id)}
          />
        </div>
        <div className="flex items-center gap-1.5 mt-4 flex-wrap">
          {tags.map((tag) => (
            <Badge key={tag.raw} variant="outline" className="rounded-full text-[10px] px-2 py-0.5 border-[#ded8d0] text-[#797776]">
              {tag.label}
            </Badge>
          ))}
          {relatedUseCount > 0 && (
            <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0.5 border-[rgba(79,111,180,0.28)] bg-[#eef3ff] text-[#4f6fb4]">
              {locale === "zh" ? `另有 ${relatedUseCount} 个相关用法` : `${relatedUseCount} related use${relatedUseCount > 1 ? "s" : ""}`}
            </Badge>
          )}
          <div className="flex-1" />
          <Badge
            variant="outline"
            className={`rounded-full text-[10px] px-2 py-0.5 font-mono ${statusStyles[studyStatus] || ""}`}
          >
            {studyStatusLabel(studyStatus, locale)}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
