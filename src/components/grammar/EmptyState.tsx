"use client";

import { FileQuestion } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-[#797776] mb-4">
        {icon || <FileQuestion className="h-12 w-12" />}
      </div>
      <h3 className="text-lg font-medium font-serif">{title}</h3>
      <p className="text-sm text-[#4e4d4d] mt-1 max-w-sm">{description}</p>
    </div>
  );
}
