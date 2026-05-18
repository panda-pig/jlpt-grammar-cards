"use client";

import { Button } from "@/components/ui/button";
import type { ReviewRating } from "@/lib/types";

const ratings: { value: ReviewRating; label: string; className: string }[] = [
  {
    value: 1,
    label: "忘记了",
    className: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  },
  {
    value: 2,
    label: "有点模糊",
    className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  },
  {
    value: 3,
    label: "记住了",
    className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
  {
    value: 4,
    label: "很简单",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
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
        <Button
          key={r.value}
          variant="outline"
          disabled={disabled}
          className={`flex-1 font-medium ${r.className}`}
          onClick={() => onRate(r.value)}
        >
          {r.label}
        </Button>
      ))}
    </div>
  );
}