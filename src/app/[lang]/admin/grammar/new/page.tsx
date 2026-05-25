"use client";

import { useState } from "react";
import Link from "next/link";
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

const emptyForm = {
  title: "",
  slug: "",
  jlpt_level: "N5" as const,
  source_route: "综合" as const,
  grammar_type: "その他" as const,
  tags: [] as string[],
  meaning_cn: "",
  meaning_en: "",
  structure: "",
  explanation: "",
  usage_note: "",
  example_jp: "",
  example_cn: "",
  furigana: "",
  similar_grammar: [],
  common_mistake: "",
  memory_tip: "",
  quiz_question: "",
  quiz_choices: [] as { key: string; text: string }[],
  quiz_answer: "",
  quiz_explanation: "",
};

export default function AdminNewGrammarPage() {
  const router = useRouter();
  const [form, setForm] = useState({ ...emptyForm });
  const [saved, setSaved] = useState(false);

  const updateField = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.meaning_cn.trim()) return;
    await grammarService.create(form);
    setSaved(true);
    setTimeout(() => router.push("/admin/grammar"), 800);
  };

  return (
    <div className="max-w-3xl">
      <Link href="/admin/grammar" className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-4" })}>
        <ArrowLeft className="mr-1 h-4 w-4" />返回
      </Link>
      <h1 className="text-2xl font-bold mb-6">新增语法</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">基本信息</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input placeholder="语法标题 *" required value={form.title} onChange={(e) => updateField("title", e.target.value)} className="rounded-full" />
              <Input placeholder="slug *" required value={form.slug} onChange={(e) => updateField("slug", e.target.value)} className="rounded-full" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select value={form.jlpt_level} onValueChange={(v) => updateField("jlpt_level", v)}>
                <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>{levels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.grammar_type} onValueChange={(v) => updateField("grammar_type", v)}>
                <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Input placeholder="标签（逗号分隔）" value={form.tags.join(", ")} onChange={(e) => updateField("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} className="rounded-full" />
          </CardContent>
        </Card>

        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">意思</h3>
            <Input placeholder="中文意思 *" required value={form.meaning_cn} onChange={(e) => updateField("meaning_cn", e.target.value)} className="rounded-full" />
            <Input placeholder="英文意思" value={form.meaning_en} onChange={(e) => updateField("meaning_en", e.target.value)} className="rounded-full" />
          </CardContent>
        </Card>

        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">语法详解</h3>
            <Input placeholder="接续" value={form.structure} onChange={(e) => updateField("structure", e.target.value)} className="rounded-full" />
            <Textarea placeholder="详细解释" value={form.explanation} onChange={(e) => updateField("explanation", e.target.value)} className="rounded-2xl min-h-[80px]" />
            <Textarea placeholder="使用场景" value={form.usage_note} onChange={(e) => updateField("usage_note", e.target.value)} className="rounded-2xl min-h-[60px]" />
          </CardContent>
        </Card>

        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">例句</h3>
            <Textarea placeholder="日语例句" value={form.example_jp} onChange={(e) => updateField("example_jp", e.target.value)} className="rounded-2xl min-h-[60px]" />
            <Textarea placeholder="中文翻译" value={form.example_cn} onChange={(e) => updateField("example_cn", e.target.value)} className="rounded-2xl min-h-[60px]" />
            <Input placeholder="注音假名" value={form.furigana} onChange={(e) => updateField("furigana", e.target.value)} className="rounded-full" />
          </CardContent>
        </Card>

        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">易错点与记忆</h3>
            <Textarea placeholder="常见错误" value={form.common_mistake} onChange={(e) => updateField("common_mistake", e.target.value)} className="rounded-2xl min-h-[60px]" />
            <Textarea placeholder="记忆提示" value={form.memory_tip} onChange={(e) => updateField("memory_tip", e.target.value)} className="rounded-2xl min-h-[60px]" />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saved} className="rounded-full font-mono">
            {saved ? "已保存 ✓" : "保存"}
          </Button>
          <Link href="/admin/grammar" className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}>取消</Link>
        </div>
      </form>
    </div>
  );
}
