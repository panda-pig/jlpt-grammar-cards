"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  isFavorite,
  onToggle,
}: {
  isFavorite: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full p-1.5 transition-colors",
        isFavorite
          ? "text-[#c47a6a] hover:text-[#a06050]"
          : "text-[#797776] hover:text-[#c47a6a]"
      )}
    >
      <Heart
        className={cn("h-4 w-4 transition-all", isFavorite && "fill-current scale-110")}
      />
    </button>
  );
}
