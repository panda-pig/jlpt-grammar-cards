"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="grid gap-8 md:grid-cols-2 w-full max-w-3xl">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h1 className="text-xl font-bold">登录</h1>
              <div className="space-y-3">
                <Input type="email" placeholder="邮箱地址" />
                <Input type="password" placeholder="密码" />
                <Button className="w-full">登录</Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">或</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">使用 Google 登录</Button>
              <p className="text-xs text-center text-muted-foreground">
                还没有账号？<span className="text-muted-foreground/50">注册</span>
              </p>
            </CardContent>
          </Card>

          <Card className="hidden md:block">
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
              <LevelBadge level="N3" />
              <h3 className="text-xl font-bold mt-3">～わけではない</h3>
              <p className="text-sm text-muted-foreground mt-1">并不是……；并非……</p>
              <Badge variant="secondary" className="mt-3">学习中</Badge>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
