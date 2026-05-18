"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

export function StatCard({
  icon,
  label,
  value,
  subtitle,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#cfdaf5] text-[#242424]">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="font-mono text-xs text-[#797776]">{label}</p>
          <p className="text-xl font-bold font-mono tabular-nums text-[#242424]">{value}</p>
          {subtitle && (
            <p className="font-mono text-xs text-[#797776]">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
