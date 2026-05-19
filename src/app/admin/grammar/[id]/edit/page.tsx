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
import { useGrammar } from "@/context/GrammarContext";
import { ArrowLeft } from "lucide-react";
import type { GrammarEntry } from "@/lib/types";

const levels = ["N5", "N4", "N3", "N2", "N1"] as const;
const routes = ["蓝宝书", "TRY", "一册合格", "综合"] as const;
const categories = ["原因・理由", "条件", "逆接・譲歩", "推量・様態", "否定", "敬語", "比較", "目的", "限定", "並列", "例示", "伝聞", "意志・勧誘", "義務・当然", "その他"] as const;

export default function AdminEditGrammarPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { entries, updateGrammar } = useGrammar();
  const grammar = entries.find((g) => g.id === id);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<Partial<GrammarEntry>>({});

  useEffect(() => {
    if (grammar) {
      setForm({ ...grammar });
    }
  }, [grammar]);

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

  const updateField = <K extends keyof GrammarEntry>(
    field: K,
    value: GrammarEntry[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim() || !form.slug?.trim() || !form.meaningCn?.trim()) return;
    updateGrammar(id, form);
    setSaved(true);
    setTimeout(() => {
      router.push("/admin/grammar");
    }, 800);
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
              <Input
                placeholder="语法标题 *"
                required
                value={form.title || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("title", e.target.value)}
                className="rounded-full"
              />
              <Input
                placeholder="slug *"
                required
                value={form.slug || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("slug", e.target.value)}
                className="rounded-full"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Select value={form.jlptLevel || "N5"} onValueChange={(v) => updateField("jlptLevel", v as typeof levels[number])}>
                <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>{levels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.sourceRoute || "蓝宝书"} onValueChange={(v) => updateField("sourceRoute", v as typeof routes[number])}>
                <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>{routes.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.grammarType || "その他"} onValueChange={(v) => updateField("grammarType", v as typeof categories[number])}>
                <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Input
              placeholder="标签（逗号分隔）"
              value={(form.tags || []).join(", ")}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
              className="rounded-full"
            />
          </CardContent>
        </Card>

        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">意思</h3>
            <Input
              placeholder="中文意思 *"
              required
              value={form.meaningCn || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("meaningCn", e.target.value)}
              className="rounded-full"
            />
            <Input
              placeholder="英文意思"
              value={form.meaningEn || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("meaningEn", e.target.value)}
              className="rounded-full"
            />
          </CardContent>
        </Card>

        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">语法详解</h3>
            <Input
              placeholder="接续"
              value={form.structure || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("structure", e.target.value)}
              className="rounded-full"
            />
            <Textarea
              placeholder="详细解释"
              value={form.explanation || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("explanation", e.target.value)}
              className="rounded-2xl min-h-[80px]"
            />
            <Textarea
              placeholder="使用场景"
              value={form.usageNote || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("usageNote", e.target.value)}
              className="rounded-2xl min-h-[60px]"
            />
          </CardContent>
        </Card>

        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">例句</h3>
            <Textarea
              placeholder="日语例句"
              value={form.exampleJp || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("exampleJp", e.target.value)}
              className="rounded-2xl min-h-[60px]"
            />
            <Textarea
              placeholder="中文翻译"
              value={form.exampleCn || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("exampleCn", e.target.value)}
              className="rounded-2xl min-h-[60px]"
            />
            <Input
              placeholder="注音假名"
              value={form.furigana || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("furigana", e.target.value)}
              className="rounded-full"
            />
          </CardContent>
        </Card>

        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">易错点与记忆</h3>
            <Textarea
              placeholder="常见错误"
              value={form.commonMistake || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("commonMistake", e.target.value)}
              className="rounded-2xl min-h-[60px]"
            />
            <Textarea
              placeholder="记忆提示"
              value={form.memoryTip || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("memoryTip", e.target.value)}
              className="rounded-2xl min-h-[60px]"
            />
          </CardContent>
        </Card>

        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">练习题</h3>
            <Input
              placeholder="题目"
              value={form.quizQuestion || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("quizQuestion", e.target.value)}
              className="rounded-full"
            />
            <div className="grid grid-cols-2 gap-2">
              {(form.quizChoices || []).map((choice, idx) => (
                <Input
                  key={choice.key}
                  placeholder={`选项 ${choice.key}`}
                  value={choice.text}
                  onChange={(e) => {
                    const newChoices = [...(form.quizChoices || [])];
                    newChoices[idx] = { ...choice, text: e.target.value };
                    updateField("quizChoices", newChoices);
                  }}
                  className="rounded-full"
                />
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select value={form.quizAnswer || ""} onValueChange={(v) => updateField("quizAnswer", v || "")}>
                <SelectTrigger className="rounded-full"><SelectValue placeholder="正确答案" /></SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D"].map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input
                placeholder="答案解析"
                value={form.quizExplanation || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("quizExplanation", e.target.value)}
                className="rounded-full"
              />
            </div>
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
