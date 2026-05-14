"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { grammarEntries } from "@/lib/mock-data";
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminGrammarListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = grammarEntries.filter(
    (g) => g.title.includes(search) || g.meaningCn.includes(search)
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">管理语法</h1>
        <Link href="/admin/grammar/new" className={buttonVariants({ size: "sm" })}><Plus className="mr-1 h-4 w-4" />新增</Link>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="搜索语法..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        />
      </div>

      <div className="hidden md:block">
        <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground px-4 py-2 border-b">
          <span>语法</span><span>等级</span><span>路线</span><span>分类</span><span>状态</span><span>操作</span>
        </div>
        {paged.map((g) => (
          <div key={g.id} className="grid grid-cols-6 gap-2 px-4 py-3 border-b items-center text-sm">
            <span className="font-medium truncate">{g.title}</span>
            <span><Badge variant="outline" className="text-xs">{g.jlptLevel}</Badge></span>
            <span className="text-xs text-muted-foreground">{g.sourceRoute}</span>
            <span className="text-xs text-muted-foreground">{g.grammarType}</span>
            <span><Badge variant="secondary" className="text-xs">{g.studyStatus}</Badge></span>
            <span className="flex gap-1">
              <Link href={`/admin/grammar/${g.id}/edit`} className={buttonVariants({ variant: "ghost", size: "icon", className: "h-7 w-7" })}><Pencil className="h-3 w-3" /></Link>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </span>
          </div>
        ))}
      </div>

      <div className="md:hidden space-y-2">
        {paged.map((g) => (
          <Card key={g.id}>
            <CardContent className="p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{g.title}</p>
                <div className="flex gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">{g.jlptLevel}</Badge>
                  <Badge variant="secondary" className="text-xs">{g.studyStatus}</Badge>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Link href={`/admin/grammar/${g.id}/edit`} className={buttonVariants({ variant: "ghost", size: "icon", className: "h-7 w-7" })}><Pencil className="h-3 w-3" /></Link>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-muted-foreground">共 {filtered.length} 条</span>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="flex items-center px-2 text-muted-foreground">{page + 1}/{totalPages || 1}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
