"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const dict = useDictionary();
  const locale = useLocale();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exchangeLoading, setExchangeLoading] = useState(true);

  useEffect(() => {
    const handleHash = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", ""));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error } = await supabaseBrowser.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          setError(error.message);
        }
      }
      setExchangeLoading(false);
    };
    handleHash();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (exchangeLoading) {
    return (
      <MainLayout hideNotification>
        <div className="flex items-center justify-center py-12 sm:py-20 px-4">
          <Card className="card-soft w-full max-w-sm bg-[#fbfaf8] border border-[#ded8d0] rounded-[20px] ring-0 shadow-none">
            <CardContent className="p-7 text-center font-mono text-sm text-[#797776]">
              {dict.login.processing}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideNotification>
      <div className="flex items-center justify-center py-12 sm:py-20 px-4">
        <Card className="card-soft w-full max-w-sm bg-[#fbfaf8] border border-[#ded8d0] rounded-[20px] ring-0 shadow-none">
          <CardContent className="p-7 space-y-5">
            <div className="flex flex-col items-center text-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#242424]"
                style={{ background: "#fff6df", boxShadow: "3px 3px 0 #cfdaf5", fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 700 }}
              >
                文
              </div>
              <h1 className="font-serif text-2xl font-bold tracking-[-0.02em] text-[#242424]">{dict.login.resetPassword}</h1>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-[#c47a6a]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-sm text-[#6a8a5a]">
                <CheckCircle className="h-4 w-4 shrink-0" />
                {dict.login.passwordUpdated}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="password"
                placeholder={dict.login.newPassword}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full"
              />
              <Button type="submit" disabled={loading || success} className="w-full rounded-full font-mono">
                {loading ? dict.login.processing : dict.login.updatePassword}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
