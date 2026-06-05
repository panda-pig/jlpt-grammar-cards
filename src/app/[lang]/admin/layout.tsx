"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { AdminSidebar, AdminMobileNav } from "@/components/layout/AdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import type { ReactNode } from "react";

function isAllowedByEmail(email?: string | null) {
  const configured = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean) ?? [];
  return !!email && configured.includes(email.toLowerCase());
}

async function checkAdminRole(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc("is_admin");
    if (error) return false;
    return !!data;
  } catch {
    return false;
  }
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const dict = useDictionary();
  const locale = useLocale();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setChecking(false);
      return;
    }

    checkAdminRole().then((roleAdmin) => {
      setIsAdmin(roleAdmin || isAllowedByEmail(user.email));
      setChecking(false);
    });
  }, [user, authLoading]);

  if (authLoading || checking) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-background p-6">
          <p className="font-mono text-sm text-[#797776]">{dict.common.loading}</p>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-background p-6">
          <Card className="card-soft w-full max-w-md rounded-[20px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
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
      <AdminMobileNav />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
