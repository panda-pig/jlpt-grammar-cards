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
      <h1 className="text-2xl font-bold mb-6">管理后台</h1>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-3xl font-bold text-primary">{grammarEntries.length}</p>
            <p className="text-sm text-muted-foreground">语法总数</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-2">
              {Object.entries(levelCounts).map(([level, count]) => (
                <Badge key={level} variant="secondary">{level}: {count}</Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">按等级分布</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 mb-6">
        <Link href="/admin/grammar/new" className={buttonVariants({})}><Plus className="mr-1 h-4 w-4" />新增语法</Link>
        <Link href="/admin/grammar" className={buttonVariants({ variant: "outline" })}><BookOpen className="mr-1 h-4 w-4" />管理语法</Link>
      </div>

      <h2 className="font-semibold mb-3">最近语法条目</h2>
      <div className="space-y-2">
        {grammarEntries.slice(0, 5).map((g) => (
          <Card key={g.id} className="border-0 shadow-sm">
            <CardContent className="p-3 flex items-center gap-3">
              <Badge variant="outline">{g.jlptLevel}</Badge>
              <span className="font-medium flex-1">{g.title}</span>
              <Badge variant="secondary">{g.grammarType}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}