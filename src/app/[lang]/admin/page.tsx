"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { grammarService } from "@/services/grammarService";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { useAuth } from "@/hooks/useAuth";
import { Plus, BookOpen, Shield, UserPlus, Check, Trash2 } from "lucide-react";

export default function AdminHomePage() {
  const locale = useLocale();
  const dict = useDictionary();
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRoleAdmin, setIsRoleAdmin] = useState(false);
  const [adminUsers, setAdminUsers] = useState<{ user_id: string; email: string }[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [roleMsg, setRoleMsg] = useState("");

  useEffect(() => {
    Promise.all([
      grammarService.getAll().then(setEntries).catch(() => {}),
      supabase.rpc("is_admin").then(({ data }: any) => setIsRoleAdmin(!!data), () => {}),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isRoleAdmin) return;
    (supabase.from("user_roles") as any).select("user_id").eq("role", "admin").then(({ data }: any) => {
      if (!data?.length) return;
      setAdminUsers(data.map((r: any) => ({ user_id: r.user_id, email: r.user_id })));
    }).catch(() => {});
  }, [isRoleAdmin]);

  const handleGrantSelfAdmin = async () => {
    if (!user) return;
    const { error } = await (supabase.from("user_roles") as any).upsert({ user_id: user.id, role: "admin" });
    if (error) { setRoleMsg("授予失败: " + error.message); return; }
    setIsRoleAdmin(true);
    setRoleMsg("已在数据库中授予管理员角色。");
  };

  const handleRevokeAdmin = async (userId: string) => {
    await (supabase.from("user_roles") as any).delete().eq("user_id", userId);
    setAdminUsers((prev) => prev.filter((u) => u.user_id !== userId));
    setRoleMsg("已撤销管理员权限。");
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) return;
    const trimmed = newAdminEmail.trim().toLowerCase();
    const { data: userData, error: userError } = await (supabase.from("profiles") as any).select("id").eq("email", trimmed).single();
    if (userError || !userData) {
      setRoleMsg("未找到该邮箱对应的用户（请确保对方已登录过至少一次）");
      return;
    }
    const { error } = await (supabase.from("user_roles") as any).upsert({ user_id: userData.id, role: "admin" });
    if (error) { setRoleMsg("添加失败: " + error.message); return; }
    setNewAdminEmail("");
    setAdminUsers((prev) => [...prev, { user_id: userData.id, email: trimmed }]);
    setRoleMsg(`已添加 ${trimmed} 为管理员。`);
  };

  const levelCounts = {
    N5: entries.filter((e) => e.jlpt_level === "N5").length,
    N4: entries.filter((e) => e.jlpt_level === "N4").length,
    N3: entries.filter((e) => e.jlpt_level === "N3").length,
    N2: entries.filter((e) => e.jlpt_level === "N2").length,
    N1: entries.filter((e) => e.jlpt_level === "N1").length,
  };

  if (loading) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">{dict.admin.title}</h1>
        <p className="text-[#797776] font-mono text-sm">{dict.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">{dict.admin.title}</h1>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <Card className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-5">
            <p className="text-3xl font-bold font-mono text-[#242424]">{entries.length}</p>
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

      <div className="flex gap-3 mb-8">
        <Link href={`/${locale}/admin/grammar/new`} className={buttonVariants({ className: "rounded-full font-mono" })}><Plus className="mr-1 h-4 w-4" />新增语法</Link>
        <Link href={`/${locale}/admin/grammar`} className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}><BookOpen className="mr-1 h-4 w-4" />管理语法</Link>
      </div>

      <Card className="mb-8 bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-[#242424]" />
            <h2 className="font-bold text-lg">管理员权限</h2>
          </div>

          <div className="mb-4 flex items-center gap-3 p-3 rounded-2xl bg-[#fbfaf8] border border-[rgba(36,36,36,0.12)]">
            <span className="font-mono text-sm">当前角色:</span>
            <Badge className={`rounded-full font-mono text-xs ${isRoleAdmin ? "bg-[#dcebd8] text-[#315b3b]" : "bg-[#fff6df] text-[#7a5b20]"}`}>
              {isRoleAdmin ? "管理员 (admin)" : "无管理员角色"}
            </Badge>
            {!isRoleAdmin && (
              <Button size="sm" className="ml-auto rounded-full font-mono" onClick={handleGrantSelfAdmin}>
                <UserPlus className="mr-1 h-3.5 w-3.5" />授予管理员
              </Button>
            )}
          </div>

          {isRoleAdmin && (
            <>
              <div className="mb-3 flex items-center gap-2">
                <Input
                  className="rounded-full flex-1"
                  placeholder="输入用户邮箱添加管理员..."
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
                <Button size="sm" className="rounded-full font-mono" onClick={handleAddAdmin}>
                  <UserPlus className="mr-1 h-3.5 w-3.5" />添加
                </Button>
              </div>

              {adminUsers.length > 0 && (
                <div className="space-y-1.5">
                  {adminUsers.map((au) => (
                    <div key={au.user_id} className="flex items-center gap-2 rounded-full bg-[#cfdaf5] px-3 py-1.5">
                      <Check className="h-3.5 w-3.5 text-[#315b3b]" />
                      <span className="font-mono text-xs truncate">{au.email}</span>
                      {au.user_id !== user?.id && (
                        <button className="ml-auto text-[#c47a6a] hover:text-[#a0554a]" onClick={() => handleRevokeAdmin(au.user_id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {roleMsg && (
            <p className="mt-3 text-sm text-[#315b3b] font-mono">{roleMsg}</p>
          )}

          <div className="mt-4 p-3 rounded-2xl bg-[#fff6df] border border-[rgba(36,36,36,0.12)]">
            <p className="text-sm text-[#4e4d4d]">
              管理员角色通过 <code className="bg-[rgba(36,36,36,0.06)] px-1 rounded font-mono text-xs">user_roles</code> 表和 RLS 策略控制。仅管理员可以新增/编辑/删除默认语法库。将此角色授予当前用户后，语法库的写入操作才能成功。
            </p>
          </div>
        </CardContent>
      </Card>

      <h2 className="font-semibold mb-3">最近语法条目</h2>
      <div className="space-y-2">
        {entries.slice(0, 5).map((g) => (
          <Card key={g.id} className="bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none transition-all hover:shadow-[rgba(0,0,0,0.1)_0px_0px_10px_0px]">
            <CardContent className="p-3 flex items-center gap-3">
              <Badge variant="outline" className="rounded-full font-mono text-xs">{g.jlpt_level}</Badge>
              <span className="font-medium flex-1">{g.title}</span>
              <Badge variant="secondary" className="rounded-full font-mono text-xs">{g.grammar_type}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
