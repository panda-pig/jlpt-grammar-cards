"use client";

import { useState } from "react";
import Link from "next/link";
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
const statuses = ["未学习", "学习中", "已掌握"] as const;

const emptyForm: Omit<GrammarEntry, "id"> = {
  title: "",
  slug: "",
  jlptLevel: "N5",
  sourceRoute: "蓝宝书",
  grammarType: "その他",
  tags: [],
  meaningCn: "",
  meaningEn: "",
  structure: "",
  explanation: "",
  usageNote: "",
  exampleJp: "",
  exampleCn: "",
  furigana: "",
  similarGrammar: [],
  commonMistake: "",
  memoryTip: "",
  quizQuestion: "",
  quizChoices: [
    { key: "A", text: "" },
    { key: "B", text: "" },
    { key: "C", text: "" },
    { key: "D", text: "" },
  ],
  quizAnswer: "",
  quizExplanation: "",
  isFavorite: false,
  studyStatus: "未学习",
  nextReviewAt: null,
  lastReviewedAt: null,
  reviewCount: 0,
  masteryLevel: 0,
};

export default function AdminNewGrammarPage() {
  const router = useRouter();
  const { addGrammar } = useGrammar();
  const [form, setForm] = useState<Omit<GrammarEntry, "id">>({ ...emptyForm });
  const [saved, setSaved] = useState(false);

  const updateField = <K extends keyof Omit<GrammarEntry, "id">>(
    field: K,
    value: Omit<GrammarEntry, "id">[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.meaningCn.trim()) return;
    addGrammar(form);
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
      <h1 className="text-2xl font-bold mb-6">新增语法</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">基本信息</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="语法标题 *"
                required
                value={form.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("title", e.target.value)}
                className="rounded-full"
              />
              <Input
                placeholder="slug *"
                required
                value={form.slug}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("slug", e.target.value)}
                className="rounded-full"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Select value={form.jlptLevel} onValueChange={(v) => updateField("jlptLevel", v as typeof levels[number])}>
                <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>{levels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.sourceRoute} onValueChange={(v) => updateField("sourceRoute", v as typeof routes[number])}>
                <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>{routes.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.grammarType} onValueChange={(v) => updateField("grammarType", v as typeof categories[number])}>
                <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Input
              placeholder="标签（逗号分隔）"
              value={form.tags.join(", ")}
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
              value={form.meaningCn}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("meaningCn", e.target.value)}
              className="rounded-full"
            />
            <Input
              placeholder="英文意思"
              value={form.meaningEn}
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
              value={form.structure}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("structure", e.target.value)}
              className="rounded-full"
            />
            <Textarea
              placeholder="详细解释"
              value={form.explanation}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("explanation", e.target.value)}
              className="rounded-2xl min-h-[80px]"
            />
            <Textarea
              placeholder="使用场景"
              value={form.usageNote}
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
              value={form.exampleJp}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("exampleJp", e.target.value)}
              className="rounded-2xl min-h-[60px]"
            />
            <Textarea
              placeholder="中文翻译"
              value={form.exampleCn}
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
              value={form.commonMistake}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("commonMistake", e.target.value)}
              className="rounded-2xl min-h-[60px]"
            />
            <Textarea
              placeholder="记忆提示"
              value={form.memoryTip}
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
              value={form.quizQuestion}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("quizQuestion", e.target.value)}
              className="rounded-full"
            />
            <div className="grid grid-cols-2 gap-2">
              {form.quizChoices.map((choice, idx) => (
                <Input
                  key={choice.key}
                  placeholder={`选项 ${choice.key}`}
                  value={choice.text}
                  onChange={(e) => {
                    const newChoices = [...form.quizChoices];
                    newChoices[idx] = { ...choice, text: e.target.value };
                    updateField("quizChoices", newChoices);
                  }}
                  className="rounded-full"
                />
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select value={form.quizAnswer} onValueChange={(v) => updateField("quizAnswer", v || "")}>
                <SelectTrigger className="rounded-full"><SelectValue placeholder="正确答案" /></SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D"].map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input
                placeholder="答案解析"
                value={form.quizExplanation}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField("quizExplanation", e.target.value)}
                className="rounded-full"
              />
            </div>
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
