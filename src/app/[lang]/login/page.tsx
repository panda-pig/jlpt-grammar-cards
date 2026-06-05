"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { AlertCircle } from "lucide-react";

function getAuthErrorMessage(err: any, dict: any): string {
  const code = err?.code || "";
  const msg = err?.message || "";
  if (code === "email_not_confirmed" || msg.includes("Email not confirmed")) {
    return dict.login.emailNotConfirmed;
  }
  if (code === "invalid_credentials" || msg.includes("Invalid login credentials")) {
    return dict.login.invalidCredentials;
  }
  if (code === "user_not_found" || msg.includes("user not found")) {
    return dict.login.userNotFound;
  }
  if (code === "weak_password" || msg.includes("weak")) {
    return dict.login.weakPassword;
  }
  return msg || dict.login.loginFailed;
}

export default function LoginPage() {
  const router = useRouter();
  const dict = useDictionary();
  const locale = useLocale();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        router.push(`/${locale}/dashboard`);
      } else {
        await signUp(email, password);
        setInfo(dict.login.registerSuccess);
        setMode("login");
      }
    } catch (err: any) {
      setError(getAuthErrorMessage(err, dict));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(getAuthErrorMessage(err, dict));
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
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-[-0.02em] text-[#242424]">
                  {mode === "login" ? dict.login.loginBtn : dict.login.registerBtn}
                </h1>
                <p className="mt-1 font-mono text-[11px] text-[#797776]">{dict.common.siteName}</p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-[#c47a6a]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {info && (
              <div className="flex items-center gap-2 text-sm text-[#6a8a5a]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {info}
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
              <Input
                type="password"
                placeholder={dict.login.password}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full"
              />
              {mode === "login" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => router.push(`/${locale}/forgot-password`)}
                    className="font-mono text-xs text-[#797776] hover:text-[#242424] underline transition-colors"
                  >
                    {dict.login.forgotPassword}
                  </button>
                </div>
              )}
              <Button type="submit" disabled={loading} className="w-full rounded-full font-mono">
                {loading
                  ? dict.login.processing
                  : mode === "login"
                    ? dict.login.loginBtn
                    : dict.login.registerBtn}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#ded8d0]" /></div>
              <div className="relative flex justify-center font-mono text-xs uppercase">
                <span className="bg-[#fbfaf8] px-2 text-[#797776]">{dict.login.or}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full rounded-full font-mono" onClick={handleGoogle}>
              {dict.login.googleLogin}
            </Button>

            <p className="font-mono text-xs text-center text-[#797776]">
              {mode === "login" ? (
                <>{dict.login.noAccount}<button type="button" className="underline" onClick={() => setMode("register")}>{dict.login.switchToRegister}</button></>
              ) : (
                <>{dict.login.hasAccount}<button type="button" className="underline" onClick={() => setMode("login")}>{dict.login.switchToLogin}</button></>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
