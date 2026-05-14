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
        "inline-flex items-center justify-center rounded-md p-1.5 transition-colors",
        isFavorite
          ? "text-rose-500 hover:text-rose-600"
          : "text-muted-foreground hover:text-rose-400"
      )}
    >
      <Heart
        className={cn("h-4 w-4 transition-all", isFavorite && "fill-current scale-110")}
      />
    </button>
  );
}
