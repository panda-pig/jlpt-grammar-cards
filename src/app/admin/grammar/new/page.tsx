"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus } from "lucide-react";

const levels = ["N5", "N4", "N3", "N2", "N1"];
const routes = ["蓝宝书", "TRY", "一册合格", "综合"];
const categories = ["原因・理由", "条件", "逆接・譲歩", "推量・様態", "否定", "敬語", "比較", "目的", "限定", "並列", "例示", "伝聞", "意志・勧誘", "義務・当然", "その他"];

export default function AdminNewGrammarPage() {
  const [saved, setSaved] = useState(false);

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
      <h1 className="text-2xl font-bold mb-6">新增语法</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card><CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">基本信息</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="语法标题 *" required />
            <Input placeholder="slug *" required />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Select>
              <SelectTrigger><SelectValue placeholder="JLPT 等级" /></SelectTrigger>
              <SelectContent>{levels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="教材路线" /></SelectTrigger>
              <SelectContent>{routes.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="语法类型" /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Input placeholder="标签（逗号分隔）" />
        </CardContent></Card>

        <Card><CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">意思</h3>
          <Input placeholder="中文意思 *" required />
          <Input placeholder="英文意思" />
        </CardContent></Card>

        <Card><CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">语法详解</h3>
          <Input placeholder="接续" />
          <Input placeholder="详细解释" />
          <Input placeholder="使用场景" />
        </CardContent></Card>

        <Card><CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">例句</h3>
          <Input placeholder="日语例句" />
          <Input placeholder="中文翻译" />
          <Input placeholder="注音假名" />
        </CardContent></Card>

        <Card><CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">易错点与记忆</h3>
          <Input placeholder="常见错误" />
          <Input placeholder="记忆提示" />
        </CardContent></Card>

        <Card><CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">练习题</h3>
          <Input placeholder="题目" />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="选项 A" /><Input placeholder="选项 B" />
            <Input placeholder="选项 C" /><Input placeholder="选项 D" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Select>
              <SelectTrigger><SelectValue placeholder="正确答案" /></SelectTrigger>
              <SelectContent>
                {["A", "B", "C", "D"].map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="答案解析" />
          </div>
        </CardContent></Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saved}>{saved ? "已保存" : "保存"}</Button>
          <Link href="/admin/grammar" className={buttonVariants({ variant: "outline" })}>取消</Link>
        </div>
      </form>
    </div>
  );
}
