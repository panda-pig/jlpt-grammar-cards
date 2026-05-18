"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import type { GrammarEntry } from "@/lib/types";

export function StudyFlashcard({
  grammar,
  flipped,
  onFlip,
}: {
  grammar: GrammarEntry;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <div
      className="w-full max-w-lg mx-auto cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={onFlip}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          minHeight: "320px",
        }}
      >
        {/* Front */}
        <Card
          className="absolute inset-0 flex flex-col items-center justify-center p-8 border-0 shadow-md"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardContent className="flex flex-col items-center gap-4 text-center pt-6">
            <LevelBadge level={grammar.jlptLevel} />
            <h2 className="text-3xl font-bold tracking-tight">{grammar.title}</h2>
            <p className="text-sm text-muted-foreground">
              请回忆意思、接续和例句
            </p>
          </CardContent>
        </Card>

        {/* Back */}
        <Card
          className="absolute inset-0 p-6 overflow-auto border-0 shadow-md"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardContent className="flex flex-col gap-3 pt-6">
            <div className="flex items-center gap-2">
              <LevelBadge level={grammar.jlptLevel} />
              <h3 className="text-xl font-bold">{grammar.title}</h3>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">意思</p>
              <p className="text-lg font-medium">{grammar.meaningCn}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">接续</p>
              <p className="text-sm whitespace-pre-line">{grammar.structure}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">例句</p>
              <p className="text-base">{grammar.exampleJp}</p>
              <p className="text-sm text-muted-foreground">{grammar.exampleCn}</p>
            </div>
            {grammar.commonMistake && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm">
                <p className="font-medium text-amber-800 mb-0.5">⚠️ 易错点</p>
                <p className="text-amber-700">{grammar.commonMistake}</p>
              </div>
            )}
            {grammar.memoryTip && (
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-sm">
                <p className="font-medium text-blue-800 mb-0.5">💡 记忆提示</p>
                <p className="text-blue-700">{grammar.memoryTip}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}