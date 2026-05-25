"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { grammarService } from "@/services/grammarService";
import { ArrowLeft } from "lucide-react";

const levels = ["N5", "N4", "N3", "N2", "N1"] as const;
const categories = ["原因・理由", "条件", "逆接・譲歩", "推量・様態", "否定", "敬語", "比較", "目的", "限定", "並列", "例示", "伝聞", "意志・勧誘", "義務・当然", "その他"] as const;

export default function AdminEditGrammarPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [grammar, setGrammar] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    grammarService.getAll().then((data) => {
      const found = data.find((g: any) => g.id === id);
      if (found) {
        setGrammar(found);
        setForm({ ...found });
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="max-w-3xl"><p className="text-[#797776] font-mono text-sm">加载中...</p></div>;
  }

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

  const updateField = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.meaning_cn) return;
    await grammarService.update(id, form);
    setSaved(true);
    setTimeout(() => router.push("/admin/grammar"), 800);
  };

  return (
    <div className="max-w-3xl">
      <Link href="/admin/grammar" className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-4" })}>
        <ArrowLeft className="mr-1 h-4 w-4" />返回
      </Link>
      <h1 className="text-2xl font-bold mb-6">编辑语法 — {grammar.title}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">基本信息</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input placeholder="语法标题 *" required value={(form.title as string) || ""} onChange={(e) => updateField("title", e.target.value)} className="rounded-full" />
              <Input placeholder="slug *" required value={(form.slug as string) || ""} onChange={(e) => updateField("slug", e.target.value)} className="rounded-full" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select value={(form.jlpt_level as string) || "N5"} onValueChange={(v) => updateField("jlpt_level", v)}>
                <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>{levels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={(form.grammar_type as string) || "その他"} onValueChange={(v) => updateField("grammar_type", v)}>
                <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Input placeholder="标签（逗号分隔）" value={((form.tags as string[]) || []).join(", ")} onChange={(e) => updateField("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} className="rounded-full" />
          </CardContent>
        </Card>

        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">意思</h3>
            <Input placeholder="中文意思 *" required value={(form.meaning_cn as string) || ""} onChange={(e) => updateField("meaning_cn", e.target.value)} className="rounded-full" />
            <Input placeholder="英文意思" value={(form.meaning_en as string) || ""} onChange={(e) => updateField("meaning_en", e.target.value)} className="rounded-full" />
          </CardContent>
        </Card>

        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">语法详解</h3>
            <Input placeholder="接续" value={(form.structure as string) || ""} onChange={(e) => updateField("structure", e.target.value)} className="rounded-full" />
            <Textarea placeholder="详细解释" value={(form.explanation as string) || ""} onChange={(e) => updateField("explanation", e.target.value)} className="rounded-2xl min-h-[80px]" />
            <Textarea placeholder="使用场景" value={(form.usage_note as string) || ""} onChange={(e) => updateField("usage_note", e.target.value)} className="rounded-2xl min-h-[60px]" />
          </CardContent>
        </Card>

        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">例句</h3>
            <Textarea placeholder="日语例句" value={(form.example_jp as string) || ""} onChange={(e) => updateField("example_jp", e.target.value)} className="rounded-2xl min-h-[60px]" />
            <Textarea placeholder="中文翻译" value={(form.example_cn as string) || ""} onChange={(e) => updateField("example_cn", e.target.value)} className="rounded-2xl min-h-[60px]" />
            <Input placeholder="注音假名" value={(form.furigana as string) || ""} onChange={(e) => updateField("furigana", e.target.value)} className="rounded-full" />
          </CardContent>
        </Card>

        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">易错点与记忆</h3>
            <Textarea placeholder="常见错误" value={(form.common_mistake as string) || ""} onChange={(e) => updateField("common_mistake", e.target.value)} className="rounded-2xl min-h-[60px]" />
            <Textarea placeholder="记忆提示" value={(form.memory_tip as string) || ""} onChange={(e) => updateField("memory_tip", e.target.value)} className="rounded-2xl min-h-[60px]" />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saved} className="rounded-full font-mono">
            {saved ? "已保存 ✓" : "保存修改"}
          </Button>
          <Link href="/admin/grammar" className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}>取消</Link>
        </div>
      </form>
    </div>
  );
}
