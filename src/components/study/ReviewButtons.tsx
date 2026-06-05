"use client";

import { useDictionary } from "@/components/layout/LocaleProvider";
import type { ReviewRating } from "@/lib/types";

export function ReviewButtons({
  onRate,
  disabled = false,
}: {
  onRate: (rating: ReviewRating) => void;
  disabled?: boolean;
}) {
  const dict = useDictionary();

  const ratings: { value: ReviewRating; label: string; bg: string; text: string }[] = [
    { value: 1, label: dict.reviewButtons.forgot, bg: "bg-[#f4b4a8]", text: "text-[#7a3a30]" },
    { value: 2, label: dict.reviewButtons.vague, bg: "bg-[#fff6df]", text: "text-[#8a6a20]" },
    { value: 3, label: dict.reviewButtons.remembered, bg: "bg-[#cfdaf5]", text: "text-[#2a3a5a]" },
    { value: 4, label: dict.reviewButtons.easy, bg: "bg-[#dcebd8]", text: "text-[#315b3b]" },
  ];
  return (
    <div className="flex gap-2 w-full max-w-lg mx-auto">
      {ratings.map((r) => (
        <button
          key={r.value}
          disabled={disabled}
          className={`flex-1 font-mono text-sm font-bold rounded-[12px] border border-[#242424] px-4 py-3 min-h-[48px] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#242424] active:translate-y-0 active:shadow-none ${r.bg} ${r.text} disabled:opacity-50 disabled:pointer-events-none`}
          onClick={() => onRate(r.value)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
