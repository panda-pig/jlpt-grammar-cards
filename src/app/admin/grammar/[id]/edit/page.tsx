"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { grammarEntries } from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";

const levels = ["N5", "N4", "N3", "N2", "N1"];
const routes = ["蓝宝书", "TRY", "一册合格", "综合"];
const categories = ["原因・理由", "条件", "逆接・譲歩", "推量・様態", "否定", "敬語", "比較", "目的", "限定", "並列", "例示", "伝聞", "意志・勧誘", "義務・当然", "その他"];

export default function AdminEditGrammarPage() {
  const params = useParams();
  const id = params.id as string;
  const grammar = grammarEntries.find((g) => g.id === id);
  const [saved, setSaved] = useState(false);

  if (!grammar) {
    return (
      <div className="max-w-3xl">
      <Link href="/admin/grammar" className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-4" })}>
        <ArrowLeft className="mr-1 h-4 w-4" />返回
      </Link>
      <h1 className="text-2xl font-bold mb-2">语法未找到</h1>
        <p className="text-muted-foreground">ID: {id}</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl">
      <Link href="/admin/grammar" className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-4" })}>
        <ArrowLeft className="mr-1 h-4 w-4" />返回
      </Link>
      <h1 className="text-2xl font-bold mb-6">编辑语法 — {grammar.title}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="border-0 shadow-sm"><CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">基本信息</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="语法标题" defaultValue={grammar.title} required />
            <Input placeholder="slug" defaultValue={grammar.slug} required />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Select defaultValue={grammar.jlptLevel}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{levels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
            <Select defaultValue={grammar.sourceRoute}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{routes.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
            <Select defaultValue={grammar.grammarType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Input placeholder="标签" defaultValue={grammar.tags.join(", ")} />
        </CardContent></Card>

        <Card className="border-0 shadow-sm"><CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">意思</h3>
          <Input placeholder="中文意思" defaultValue={grammar.meaningCn} required />
          <Input placeholder="英文意思" defaultValue={grammar.meaningEn} />
        </CardContent></Card>

        <Card className="border-0 shadow-sm"><CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">语法详解</h3>
          <Input placeholder="接续" defaultValue={grammar.structure} />
          <Input placeholder="详细解释" defaultValue={grammar.explanation} />
          <Input placeholder="使用场景" defaultValue={grammar.usageNote} />
        </CardContent></Card>

        <Card className="border-0 shadow-sm"><CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">例句</h3>
          <Input placeholder="日语例句" defaultValue={grammar.exampleJp} />
          <Input placeholder="中文翻译" defaultValue={grammar.exampleCn} />
          <Input placeholder="注音假名" defaultValue={grammar.furigana} />
        </CardContent></Card>

        <Card className="border-0 shadow-sm"><CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">易错点与记忆</h3>
          <Input placeholder="常见错误" defaultValue={grammar.commonMistake} />
          <Input placeholder="记忆提示" defaultValue={grammar.memoryTip} />
        </CardContent></Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saved}>{saved ? "已保存" : "保存修改"}</Button>
          <Link href="/admin/grammar" className={buttonVariants({ variant: "outline" })}>取消</Link>
        </div>
      </form>
    </div>
  );
}