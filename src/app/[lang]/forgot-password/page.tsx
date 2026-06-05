"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dict = useDictionary();
  const locale = useLocale();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

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
                {dict.login.resetLinkSent}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder={dict.login.email}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full"
              />
              <Button type="submit" disabled={loading || success} className="w-full rounded-full font-mono">
                {loading ? dict.login.processing : dict.login.sendResetLink}
              </Button>
            </form>

            <button
              type="button"
              onClick={() => router.push(`/${locale}/login`)}
              className="flex items-center justify-center gap-1 w-full font-mono text-xs text-[#797776] hover:text-[#242424] transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              {dict.login.backToLogin}
            </button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
