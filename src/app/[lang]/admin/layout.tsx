"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import type { ReactNode } from "react";

function isAllowedAdmin(email?: string | null) {
  const configured = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean) ?? [];
  return !!email && configured.includes(email.toLowerCase());
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const dict = useDictionary();
  const locale = useLocale();
  const allowed = isAllowedAdmin(user?.email);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-background p-6">
          <p className="font-mono text-sm text-[#797776]">{dict.common.loading}</p>
        </main>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-background p-6">
          <Card className="w-full max-w-md rounded-[40px] border border-[rgba(36,36,36,0.16)] bg-[#f6f3f1] shadow-none">
            <CardContent className="space-y-4 p-6 text-center">
              <h1 className="font-serif text-2xl">{dict.admin.unavailableTitle}</h1>
              <p className="text-sm leading-relaxed text-[#797776]">{dict.admin.unavailableDesc}</p>
              <Link href={`/${locale}`} className={buttonVariants({ className: "rounded-full font-mono" })}>
                {dict.admin.backHome}
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
