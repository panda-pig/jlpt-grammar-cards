"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <MainLayout hideNotification>
      <div className="flex items-center justify-center py-12 sm:py-20 px-4">
        <Card className="w-full max-w-sm bg-[#f6f3f1] border border-[rgba(36,36,36,0.16)] rounded-[40px] ring-0 shadow-none">
          <CardContent className="p-6 space-y-4">
            <h1 className="text-xl font-serif font-bold">登录</h1>
            <div className="space-y-3">
              <Input type="email" placeholder="邮箱地址" className="rounded-full" />
              <Input type="password" placeholder="密码" className="rounded-full" />
              <Button className="w-full rounded-full font-mono">登录</Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[rgba(36,36,36,0.16)]" /></div>
              <div className="relative flex justify-center font-mono text-xs uppercase">
                <span className="bg-[#f6f3f1] px-2 text-[#797776]">或</span>
              </div>
            </div>
            <Button variant="outline" className="w-full rounded-full font-mono">使用 Google 登录</Button>
            <p className="font-mono text-xs text-center text-[#797776]">
              还没有账号？<span className="text-[#797776]/50">注册</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
