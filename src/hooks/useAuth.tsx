"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { learningService, type LocalProgressSyncResult } from "@/services/learningService";
import type { User } from "@supabase/supabase-js";

type SyncStatus =
  | { status: "idle"; importedRows: 0; importedHistory: 0 }
  | { status: "syncing"; importedRows: 0; importedHistory: 0 }
  | LocalProgressSyncResult;

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  syncStatus: SyncStatus;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    status: "idle",
    importedRows: 0,
    importedHistory: 0,
  });

  const syncLocalProgress = useCallback(async (nextUser: User | null | undefined) => {
    if (!nextUser) {
      setSyncStatus({ status: "idle", importedRows: 0, importedHistory: 0 });
      return;
    }
    setSyncStatus({ status: "syncing", importedRows: 0, importedHistory: 0 });
    const result = await learningService.syncLocalProgressToRemote(nextUser.id);
    setSyncStatus(result.status === "skipped"
      ? { status: "idle", importedRows: 0, importedHistory: 0 }
      : result
    );
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
        syncLocalProgress(session?.user).catch(() => {
          setSyncStatus({ status: "failed", importedRows: 0, importedHistory: 0 });
        });
      }
    );

    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      syncLocalProgress(session?.user).catch(() => {
        setSyncStatus({ status: "failed", importedRows: 0, importedHistory: 0 });
      });
    });

    return () => subscription.unsubscribe();
  }, [syncLocalProgress]);

  useEffect(() => {
    if (syncStatus.status !== "synced" && syncStatus.status !== "failed") return;
    const timer = window.setTimeout(() => {
      setSyncStatus({ status: "idle", importedRows: 0, importedHistory: 0 });
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [syncStatus.status]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabaseBrowser.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabaseBrowser.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, syncStatus, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
