"use client";

import { Progress } from "@/components/ui/progress";

export function ProgressBar({
  value,
  label,
  showPercentage = true,
}: {
  value: number;
  label: string;
  showPercentage?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        {showPercentage && (
          <span className="font-medium tabular-nums">{Math.round(value)}%</span>
        )}
      </div>
      <Progress value={value} />
    </div>
  );
}
