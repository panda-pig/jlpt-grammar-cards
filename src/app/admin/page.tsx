"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { grammarEntries } from "@/lib/mock-data";
import { Plus, BookOpen } from "lucide-react";

const levelCounts = {
  N5: grammarEntries.filter((e) => e.jlptLevel === "N5").length,
  N4: grammarEntries.filter((e) => e.jlptLevel === "N4").length,
  N3: grammarEntries.filter((e) => e.jlptLevel === "N3").length,
  N2: grammarEntries.filter((e) => e.jlptLevel === "N2").length,
  N1: grammarEntries.filter((e) => e.jlptLevel === "N1").length,
};

export default function AdminHomePage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-serif font-bold mb-6">管理后台</h1>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5">
            <p className="text-3xl font-bold font-mono text-[#242424]">{grammarEntries.length}</p>
            <p className="font-mono text-sm text-[#797776]">语法总数</p>
          </CardContent>
        </Card>
        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-2">
              {Object.entries(levelCounts).map(([level, count]) => (
                <Badge key={level} variant="secondary" className="rounded-full font-mono text-xs">{level}: {count}</Badge>
              ))}
            </div>
            <p className="font-mono text-sm text-[#797776] mt-2">按等级分布</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 mb-6">
        <Link href="/admin/grammar/new" className={buttonVariants({ className: "rounded-full font-mono" })}><Plus className="mr-1 h-4 w-4" />新增语法</Link>
        <Link href="/admin/grammar" className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}><BookOpen className="mr-1 h-4 w-4" />管理语法</Link>
      </div>

      <h2 className="font-serif font-semibold mb-3">最近语法条目</h2>
      <div className="space-y-2">
        {grammarEntries.slice(0, 5).map((g) => (
          <Card key={g.id} className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none transition-all hover:shadow-[rgba(0,0,0,0.1)_0px_0px_10px_0px]">
            <CardContent className="p-3 flex items-center gap-3">
              <Badge variant="outline" className="rounded-full font-mono text-xs">{g.jlptLevel}</Badge>
              <span className="font-medium flex-1">{g.title}</span>
              <Badge variant="secondary" className="rounded-full font-mono text-xs">{g.grammarType}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
