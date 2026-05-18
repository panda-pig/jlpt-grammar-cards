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
        <h1 className="text-2xl font-serif font-bold">管理语法</h1>
        <Link href="/admin/grammar/new" className={buttonVariants({ size: "sm", className: "rounded-full font-mono" })}><Plus className="mr-1 h-4 w-4" />新增</Link>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#797776]" />
        <Input
          className="pl-9 rounded-full"
          placeholder="搜索语法..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        />
      </div>

      <div className="hidden md:block">
        <div className="grid grid-cols-6 gap-2 font-mono text-xs font-medium text-[#797776] px-4 py-2 border-b border-[rgba(36,36,36,0.16)]">
          <span>语法</span><span>等级</span><span>路线</span><span>分类</span><span>状态</span><span>操作</span>
        </div>
        {paged.map((g) => (
          <div key={g.id} className="grid grid-cols-6 gap-2 px-4 py-3 border-b border-[rgba(36,36,36,0.16)] items-center text-sm">
            <span className="font-medium truncate">{g.title}</span>
            <span><Badge variant="outline" className="rounded-full font-mono text-xs">{g.jlptLevel}</Badge></span>
            <span className="font-mono text-xs text-[#797776]">{g.sourceRoute}</span>
            <span className="font-mono text-xs text-[#797776]">{g.grammarType}</span>
            <span><Badge variant="secondary" className="rounded-full font-mono text-xs">{g.studyStatus}</Badge></span>
            <span className="flex gap-1">
              <Link href={`/admin/grammar/${g.id}/edit`} className={buttonVariants({ variant: "ghost", size: "icon", className: "h-7 w-7 rounded-full" })}><Pencil className="h-3 w-3" /></Link>
              <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full text-[#c47a6a]">
                <Trash2 className="h-3 w-3" />
              </Button>
            </span>
          </div>
        ))}
      </div>

      <div className="md:hidden space-y-2">
        {paged.map((g) => (
          <Card key={g.id} className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{g.title}</span>
                <Badge variant="outline" className="rounded-full font-mono text-xs">{g.jlptLevel}</Badge>
              </div>
              <p className="font-mono text-xs text-[#797776] mt-1">{g.meaningCn}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="rounded-full font-mono text-xs">{g.studyStatus}</Badge>
                <div className="flex-1" />
                <Link href={`/admin/grammar/${g.id}/edit`} className={buttonVariants({ variant: "ghost", size: "sm", className: "rounded-full font-mono" })}>编辑</Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-mono text-sm text-[#797776]">{page + 1} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
