"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LevelBadge } from "./LevelBadge";
import { SourceRouteBadge } from "./SourceRouteBadge";
import { GrammarTypeBadge } from "./GrammarTypeBadge";
import { FavoriteButton } from "./FavoriteButton";
import { Badge } from "@/components/ui/badge";
import type { GrammarEntry } from "@/lib/types";

const statusStyles: Record<string, string> = {
  "未学习": "bg-muted text-muted-foreground",
  "学习中": "bg-blue-50 text-blue-700",
  "已掌握": "bg-emerald-50 text-emerald-700",
};

export function GrammarCard({
  grammar,
  onFavoriteToggle,
}: {
  grammar: GrammarEntry;
  onFavoriteToggle: (id: string) => void;
}) {
  return (
    <Link href={`/grammar/${grammar.slug}`}>
      <Card className="group h-full transition-all hover:shadow-md hover:-translate-y-0.5 border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-2">
                <LevelBadge level={grammar.jlptLevel} />
                <SourceRouteBadge route={grammar.sourceRoute} />
                <GrammarTypeBadge category={grammar.grammarType} />
              </div>
              <h3 className="font-semibold text-lg truncate">{grammar.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {grammar.meaningCn}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 truncate">
                {grammar.structure.split("\n")[0]}
              </p>
            </div>
            <FavoriteButton
              isFavorite={grammar.isFavorite}
              onToggle={() => onFavoriteToggle(grammar.id)}
            />
          </div>
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {grammar.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
            <div className="flex-1" />
            <Badge
              variant="secondary"
              className={`text-[10px] px-1.5 py-0 ${statusStyles[grammar.studyStatus] || ""}`}
            >
              {grammar.studyStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}