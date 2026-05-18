"use client";

import type { ReviewRating } from "@/lib/types";

const ratings: { value: ReviewRating; label: string; bg: string; text: string; border: string; hoverBg: string }[] = [
  {
    value: 1,
    label: "忘记了",
    bg: "bg-[#fff0ec]",
    text: "text-[#c47a6a]",
    border: "border-[#f4b4a8]",
    hoverBg: "hover:bg-[#ffe8e2]",
  },
  {
    value: 2,
    label: "有点模糊",
    bg: "bg-[#fff6df]",
    text: "text-[#a08040]",
    border: "border-[#e8c178]",
    hoverBg: "hover:bg-[#fff2d0]",
  },
  {
    value: 3,
    label: "记住了",
    bg: "bg-[#eef3ff]",
    text: "text-[#5a6fa0]",
    border: "border-[#a0b5eb]",
    hoverBg: "hover:bg-[#e4ecff]",
  },
  {
    value: 4,
    label: "很简单",
    bg: "bg-[#edf9f2]",
    text: "text-[#4a8a6a]",
    border: "border-[#a7dcc3]",
    hoverBg: "hover:bg-[#e0f5ea]",
  },
];

export function ReviewButtons({
  onRate,
  disabled = false,
}: {
  onRate: (rating: ReviewRating) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-2 w-full max-w-lg mx-auto">
      {ratings.map((r) => (
        <button
          key={r.value}
          disabled={disabled}
          className={`flex-1 font-mono text-sm font-medium rounded-full border px-4 py-3 min-h-[48px] transition-all active:scale-[0.98] ${r.bg} ${r.text} ${r.border} ${r.hoverBg} disabled:opacity-50 disabled:pointer-events-none`}
          onClick={() => onRate(r.value)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
