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
import { AlertCircle, CheckCircle, User, Lock, RotateCcw, LogOut } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const dict = useDictionary();
  const locale = useLocale();
  const { user, signOut, updatePassword, syncStatus } = useAuth();
  const t = dict.settings;

  const [displayName, setDisplayName] = useState("");
  const [originalDisplayName, setOriginalDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    (supabaseBrowser.from("profiles") as any).select("display_name").eq("id", user.id).single().then(({ data }: any) => {
      const name = data?.display_name ?? "";
      setDisplayName(name);
      setOriginalDisplayName(name);
    });
  }, [user?.id]);

  if (!user) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-lg py-12 px-4 text-center">
          <Card className="rounded-[40px] border border-[rgba(36,36,36,0.16)] bg-[#f6f3f1] shadow-none">
            <CardContent className="p-8 space-y-4">
              <p className="text-sm text-[#797776]">{t.loginRequired}</p>
              <Button className="rounded-full font-mono" onClick={() => router.push(`/${locale}/login`)}>
                {dict.common.login}
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const handleUpdateDisplayName = async () => {
    setError("");
    setSuccess("");
    if (!user?.id) return;
    if (displayName.trim() === originalDisplayName) {
      setError(t.usernameSame);
      return;
    }
    setLoading(true);
    try {
      const { error: updateError } = await (supabaseBrowser.from("profiles") as any).update({ display_name: displayName.trim() }).eq("id", user.id);
      if (updateError) throw updateError;
      setOriginalDisplayName(displayName.trim());
      setSuccess(t.usernameUpdated);
    } catch (err: any) {
      setError(err.message || t.updateFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password.length < 6) {
      setError(t.passwordTooShort);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(t.passwordUpdated);
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || t.updateFailed);
    } finally {
      setLoading(false);
    }
  };

  const syncText =
    syncStatus.status === "syncing"
      ? t.syncing
      : syncStatus.status === "synced"
        ? t.synced.replace("{count}", String(syncStatus.importedRows)).replace("{history}", String(syncStatus.importedHistory))
        : syncStatus.status === "failed"
          ? t.syncFailed
          : t.noSync;

  return (
    <MainLayout>
      <div className="mx-auto max-w-lg px-4 py-8">
        <h1 className="font-serif text-2xl md:text-3xl text-[#242424] mb-6">{t.title}</h1>

        <div className="space-y-4">
          <Card className="rounded-[28px] border border-[rgba(36,36,36,0.12)] bg-[#fbfaf8] shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#242424] text-[#f6f3f1] flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-mono text-sm font-medium text-[#242424]">{t.account}</p>
                  <p className="font-mono text-xs text-[#797776]">{user.email}</p>
                </div>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder={t.usernamePlaceholder}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="rounded-full"
                />
                <Button
                  variant="outline"
                  className="w-full rounded-full font-mono"
                  onClick={handleUpdateDisplayName}
                  disabled={loading}
                >
                  {loading ? t.updating : t.updateUsername}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border border-[rgba(36,36,36,0.12)] bg-[#fbfaf8] shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <RotateCcw className="h-4 w-4 text-[#797776]" />
                <p className="font-mono text-sm font-medium text-[#242424]">{t.syncStatus}</p>
              </div>
              <p className="text-sm text-[#797776]">{syncText}</p>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border border-[rgba(36,36,36,0.12)] bg-[#fbfaf8] shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-4 w-4 text-[#797776]" />
                <p className="font-mono text-sm font-medium text-[#242424]">{t.changePassword}</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-[#c47a6a] mb-3">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-sm text-[#6a8a5a] mb-3">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {success}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-3">
                <Input
                  type="password"
                  placeholder={t.newPassword}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-full"
                  minLength={6}
                />
                <Input
                  type="password"
                  placeholder={t.confirmPassword}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-full"
                />
                <Button type="submit" disabled={loading} className="w-full rounded-full font-mono">
                  {loading ? t.updating : t.updatePassword}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full rounded-full font-mono text-[#c47a6a] border-[#c47a6a]/30 hover:bg-[#f4b4a8]/10"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {dict.common.logout}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
