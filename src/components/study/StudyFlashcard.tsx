"use client";

import { LevelBadge } from "@/components/grammar/LevelBadge";
import { GrammarTypeBadge } from "@/components/grammar/GrammarTypeBadge";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { localizedGrammar, localizedStructure } from "@/lib/grammar-content";
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
  const locale = useLocale();
  const dict = useDictionary();
  const content = localizedGrammar(grammar, locale);
  const structure = localizedStructure(grammar.structure, locale);

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
          minHeight: "420px",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-[#cfdaf5] rounded-[40px]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex flex-col items-center gap-5 text-center">
            <LevelBadge level={grammar.jlptLevel} />
            <h2 className="font-serif text-[clamp(36px,6vw,64px)] leading-[1.1] tracking-[-0.02em] text-[#000000]">
              {grammar.title}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <GrammarTypeBadge category={grammar.grammarType} />
            </div>
            <p className="text-sm text-[#797776] mt-4">
              {dict.study.frontPrompt}
            </p>
            <button
              type="button"
              className="mt-2 rounded-full bg-[#242424] px-5 py-2.5 font-mono text-sm text-[#f6f3f1] transition-colors hover:bg-black"
              onClick={(event) => {
                event.stopPropagation();
                onFlip();
              }}
            >
              {dict.study.showAnswer}
            </button>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 p-8 md:p-10 overflow-auto bg-[#cfdaf5] rounded-[40px]"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <LevelBadge level={grammar.jlptLevel} />
              <h3 className="font-serif text-xl font-medium">{grammar.title}</h3>
            </div>
            <div>
              <p className="font-mono text-xs text-[#797776] mb-1">{dict.grammar.meaning}</p>
              <p className="text-lg font-medium text-[#242424]">
                {content.meaning}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#797776] mb-1">{dict.grammar.structure}</p>
              <p className="text-sm text-[#242424] whitespace-pre-line">{structure}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#797776] mb-1">{dict.grammar.example}</p>
              <p className="text-base text-[#242424] leading-relaxed">{grammar.exampleJp}</p>
              <p className="text-sm text-[#4e4d4d] mt-1">{content.exampleTranslation}</p>
            </div>
            {content.commonMistake && (
              <div className="rounded-[24px] bg-[#fff6df] border border-[rgba(232,193,120,0.6)] p-4 text-sm">
                <p className="font-mono text-xs text-[#a08040] mb-1">{dict.grammar.commonMistake}</p>
                <p className="text-[#242424]">{content.commonMistake}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
