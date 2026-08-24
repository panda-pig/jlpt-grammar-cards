"use client";

import { LevelBadge } from "@/components/grammar/LevelBadge";
import { GrammarTypeBadge } from "@/components/grammar/GrammarTypeBadge";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { localizedGrammar, localizedStructure } from "@/lib/grammar-content";
import { cn } from "@/lib/utils";
import type { GrammarEntry } from "@/lib/types";
import { Heart } from "lucide-react";

export function StudyFlashcard({
  grammar,
  flipped,
  onFlip,
  isFavorite,
  onToggleFavorite,
}: {
  grammar: GrammarEntry;
  flipped: boolean;
  onFlip: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const locale = useLocale();
  const dict = useDictionary();
  const content = localizedGrammar(grammar, locale);
  const structure = localizedStructure(grammar.structure, locale);

  return (
    <div
      className="fc-perspective w-full max-w-lg mx-auto cursor-pointer"
      onClick={onFlip}
    >
      <div
        className={cn("fc-inner relative w-full", flipped && "fc-flipped")}
        style={{ minHeight: "440px" }}
      >
        {/* Front — wash card */}
        {/* backface-visibility only hides a face visually: without inert the hidden
            face keeps its tab stops and screen readers read the answer early. */}
        <div inert={flipped} className="fc-face absolute inset-0 flex flex-col items-center justify-center rounded-[20px] border border-[rgba(100,140,220,.18)] bg-[#cfdaf5] p-10">
          <div className="flex flex-col items-center gap-5 text-center">
            <LevelBadge level={grammar.jlptLevel} />
            <h2 className="font-serif text-[clamp(36px,6vw,60px)] font-bold leading-[1.1] tracking-[-0.02em] text-black">
              {grammar.title}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <GrammarTypeBadge category={grammar.grammarType} />
            </div>
            <p className="mt-4 font-mono text-xs text-[#5a6a8a]">{dict.study.frontPrompt}</p>
            <button
              type="button"
              className="btn-v3-primary mt-2"
              onClick={(event) => {
                event.stopPropagation();
                onFlip();
              }}
            >
              {dict.study.showAnswer}
            </button>
          </div>
        </div>

        {/* Back — cream card */}
        <div inert={!flipped} className="fc-face fc-face-back absolute inset-0 overflow-auto rounded-[20px] border border-[#ded8d0] bg-[#fbfaf8] p-7 md:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <LevelBadge level={grammar.jlptLevel} />
                <h3 className="font-serif text-xl font-bold">{grammar.title}</h3>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-mono text-xs font-bold transition-colors shrink-0 border",
                  isFavorite
                    ? "bg-[#f4b4a8] text-[#7a3a30] border-transparent hover:bg-[#f0a596]"
                    : "bg-[#fbfaf8] text-[#797776] border-[#ded8d0] hover:border-[#242424] hover:text-[#242424]"
                )}
              >
                <Heart className={cn("h-3.5 w-3.5", isFavorite && "fill-current")} />
                {isFavorite ? dict.grammar.favorited : dict.grammar.favorite}
              </button>
            </div>

            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[.06em] text-[#797776]">{dict.grammar.meaning}</p>
              <p className="text-lg font-semibold text-[#242424]">{content.meaning}</p>
            </div>

            <div className="rounded-[12px] bg-[#f6f3f1] border border-[#ded8d0] p-3">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[.06em] text-[#797776]">{dict.grammar.structure}</p>
              <p className="whitespace-pre-line font-mono text-[13px] text-[#242424]">{structure}</p>
            </div>

            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[.06em] text-[#797776]">{dict.grammar.example}</p>
              <p className="text-base leading-relaxed text-[#242424]">{grammar.exampleJp}</p>
              <p className="mt-1 text-sm text-[#4e4d4d]">{content.exampleTranslation}</p>
            </div>

            {content.commonMistake && (
              <div className="rounded-[12px] border border-[#e8c178]/55 bg-[#fff6df] p-3.5">
                <p className="mb-1 font-mono text-[10px] uppercase tracking-[.06em] text-[#8a6a20]">⚠ {dict.grammar.commonMistake}</p>
                <p className="text-sm leading-relaxed text-[#242424]">{content.commonMistake}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
